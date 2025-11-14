// src/app/api/monsters/[id]/action/route.ts
// Route API POST pour effectuer une action sur un monstre (feed, play, heal)

import {NextResponse} from "next/server"
import {connectMongooseToDatabase} from "@/db"
import MonsterModel from "@/db/models/monster.model"
import MonsterActionModel from "@/db/models/monster-action.model"
import {WalletMongooseRepository} from "@/infrastructure/repositories/wallet-mongoose-repository"
import {REWARD_AMOUNTS, PENALTY_AMOUNTS, MonsterAction, MonsterState} from "@/config/rewards"
import {getActionXpReward, getNextLevelXp} from "@/services/experience"

// Mapping état -> action attendue (doit matcher le front)
const STATE_TO_ACTION: Record<MonsterState, MonsterAction> = {
  hungry: "feed",
  bored: "play",
  sick: "heal",
  happy: "hug",
  sad: "comfort",
  angry: "hug",
  sleepy: "wake",
}

export async function POST(request: Request, {params}: {params: {id: string}}) {
  await connectMongooseToDatabase()
  const {action, userId} = (await request.json()) as {action: MonsterAction; userId: string}
  const monster = await MonsterModel.findById(params.id)
  if (!monster) return NextResponse.json({ok: false, error: "Monster not found"}, {status: 404})

  // Enregistrer l'action utilisateur
  await MonsterActionModel.create({monsterId: monster._id, userId, action})

  // Vérifier si l'action correspond à l'état du monstre
  const expectedAction = STATE_TO_ACTION[monster.state as MonsterState]

  let reward = 0
  let penalty = 0
  let xpGained = 0
  let newLevel = monster.level || 1
  let leveledUp = false
  const walletRepo = new WalletMongooseRepository()

  if (action === expectedAction) {
    // Créditer le gain animoney
    await walletRepo.addToBalance(monster.ownerId.toString(), REWARD_AMOUNTS[action])
    reward = REWARD_AMOUNTS[action]

    // Gérer l’XP et la montée de niveau
    xpGained = getActionXpReward(action)
    let xp = (monster.experience || 0) + xpGained
    let level = monster.level || 1
    let xpToNext = monster.experienceToNextLevel || getNextLevelXp(level)
    while (xp >= xpToNext) {
      xp -= xpToNext
      level += 1
      xpToNext = getNextLevelXp(level)
      leveledUp = true
    }
    // Mise à jour du monstre
    monster.experience = xp
    monster.level = level
    monster.experienceToNextLevel = xpToNext
    newLevel = level
    await monster.save()
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
    matched: action === expectedAction,
    expectedAction,
    xpGained,
    newLevel,
    leveledUp,
  })
}
