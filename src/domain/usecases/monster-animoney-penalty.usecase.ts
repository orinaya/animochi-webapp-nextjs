// src/domain/usecases/monster-animoney-penalty.usecase.ts
// Use case : appliquer une pénalité animoney si l'action attendue n'a pas été faite

import type { MonsterRepository } from '@/domain/repositories/monster-repository'
import type { WalletRepository } from '@/domain/repositories/wallet-repository'
import type { MonsterActionRepository } from '@/domain/repositories/monster-action-repository'
import { PENALTY_AMOUNTS } from '@/config/rewards.config'
import type { Monster } from '@/domain/entities/monster'
import type { MonsterState, MonsterAction } from '@/config/rewards.config'

// Map état -> action attendue
const STATE_TO_ACTION: Record<MonsterState, MonsterAction> = {
  hungry: 'feed',
  bored: 'play',
  sick: 'heal',
  happy: 'hug',
  sad: 'comfort',
  angry: 'hug',
  sleepy: 'wake'
}

export class MonsterAnimoneyPenaltyUseCase {
  constructor (
    private readonly monsterRepository: MonsterRepository,
    private readonly walletRepository: WalletRepository,
    private readonly monsterActionRepository: MonsterActionRepository
  ) {}

  async execute (monster: Monster, since: Date): Promise<void> {
    const action = STATE_TO_ACTION[monster.state]
    const done = await this.monsterActionRepository.hasActionBeenDone(monster.id, action, since)
    if (!done) {
      const penalty = PENALTY_AMOUNTS[monster.state]
      await this.walletRepository.subtractFromBalance(monster.ownerId, penalty)
    }
  }
}
