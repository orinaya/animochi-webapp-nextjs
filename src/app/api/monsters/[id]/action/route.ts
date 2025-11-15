// src/app/api/monsters/[id]/action/route.ts
// Route API POST pour effectuer une action sur un monstre (feed, play, heal)

import { NextResponse } from 'next/server'
import { connectMongooseToDatabase } from '@/db'
import MonsterModel from '@/db/models/monster.model'
import MonsterActionModel from '@/db/models/monster-action.model'
import { WalletMongooseRepository } from '@/infrastructure/repositories/wallet-mongoose-repository'
import { REWARD_AMOUNTS, PENALTY_AMOUNTS, MonsterAction, MonsterState } from '@/config/rewards.config'
import { getActionXpReward } from '@/services/experience-calculator.service'

// Mapping état -> actions valides (doit matcher le front)
const STATE_TO_ACTIONS: Record<MonsterState, MonsterAction[]> = {
  hungry: ['feed'],
  bored: ['walk', 'train'],
  sick: ['comfort', 'hug'],
  happy: ['hug', 'walk', 'train'],
  sad: ['comfort', 'hug'],
  angry: ['hug', 'walk'],
  sleepy: ['wake', 'hug']
}

export async function POST (
  request: Request,
  { params }: { params: Promise<{ id: string | string[] | undefined }> }
): Promise<ReturnType<typeof NextResponse.json>> {
  const { id } = await params
  await connectMongooseToDatabase()
  const { action, userId } = (await request.json()) as { action: MonsterAction, userId: string }
  const monster = await MonsterModel.findById(id)
  if (monster == null) {
    return NextResponse.json({ ok: false, error: 'Monster not found' }, { status: 404 })
  }

  // Enregistrer l'action utilisateur
  await MonsterActionModel.create({ monsterId: monster._id, userId, action })

  // Vérifier si l'action fait partie des actions valides pour l'état du monstre
  const expectedActions = STATE_TO_ACTIONS[monster.state as MonsterState] ?? ['hug']

  let reward = 0
  let penalty = 0
  let xpGained = 0
  let newLevel = monster.level ?? 1
  const leveledUp = false
  const walletRepo = new WalletMongooseRepository()
  const { MongoMonsterRepository } = await import(
    '@/infrastructure/repositories/mongo-monster.repository'
  )

  if (expectedActions.includes(action)) {
    // Créditer le gain animoney
    await walletRepo.addToBalance(monster.ownerId.toString(), REWARD_AMOUNTS[action])
    reward = REWARD_AMOUNTS[action]

    // Gérer l’XP et la montée de niveau via le repository
    type XpAction = 'feed' | 'comfort' | 'hug' | 'wake' | 'walk' | 'train'
    const xpAction: XpAction = ['feed', 'comfort', 'hug', 'wake', 'walk', 'train'].includes(action)
      ? (action as XpAction)
      : 'hug'
    xpGained = getActionXpReward(xpAction)
    const monsterRepo = new MongoMonsterRepository()
    await monsterRepo.addXp(monster._id.toString(), xpGained)

    // Recharger le monstre pour obtenir les valeurs à jour
    const updatedMonster = await MonsterModel.findById(monster._id)
    if (updatedMonster !== null && updatedMonster !== undefined) {
      newLevel = updatedMonster.level ?? newLevel
      // Remettre l'état à happy et nextStateAt à dans 5 min
      updatedMonster.state = 'happy'
      const now = new Date()
      updatedMonster.stateUpdatedAt = now
      updatedMonster.nextStateAt = new Date(now.getTime() + 5 * 60 * 1000)
      await updatedMonster.save()
    }
  } else {
    // Appliquer la pénalité animoney
    penalty = PENALTY_AMOUNTS[monster.state as MonsterState] ?? 0
    if (penalty > 0) {
      await walletRepo.subtractFromBalance(monster.ownerId.toString(), penalty)
    }
  }

  return NextResponse.json({
    ok: true,
    reward,
    penalty,
    matched: expectedActions.includes(action),
    expectedAction: expectedActions[0],
    xpGained,
    newLevel,
    leveledUp
  })
}
