// src/domain/usecases/monster-auto-state-change.usecase.ts
// Use case : changement automatique d'état du monstre à intervalle régulier

import type { MonsterRepository } from '@/domain/repositories/monster-repository'
import type { WalletRepository } from '@/domain/repositories/wallet-repository'
import type { MonsterActionRepository } from '@/domain/repositories/monster-action-repository'
import { Monster } from '@/domain/entities/monster'
import type { MonsterState } from '@/config/rewards'
import { MonsterAnimoneyPenaltyUseCase } from './monster-animoney-penalty.usecase'

const STATES: MonsterState[] = ['happy', 'sad', 'angry', 'hungry', 'sleepy', 'bored', 'sick']

export class MonsterAutoStateChangeUseCase {
  constructor (
    private readonly monsterRepository: MonsterRepository,
    private readonly walletRepository: WalletRepository,
    private readonly monsterActionRepository: MonsterActionRepository
  ) {}

  // Change l'état de tous les monstres dont le nextStateAt est passé
  async execute (now: Date): Promise<void> {
    const monsters = await this.monsterRepository.findAllWithNextStateDue(now)
    const penaltyUseCase = new MonsterAnimoneyPenaltyUseCase(
      this.monsterRepository,
      this.walletRepository,
      this.monsterActionRepository
    )
    for (const monster of monsters) {
      // Appliquer la pénalité si l'action attendue n'a pas été faite depuis le dernier changement d'état
      await penaltyUseCase.execute(monster, monster.stateUpdatedAt)
      const newState = this.pickRandomState(monster.state)
      const nextStateAt = Monster.getNextStateAt(now)
      monster.changeState(newState, now, nextStateAt)
      await this.monsterRepository.save(monster)
    }
  }

  // Tire un nouvel état différent de l'actuel
  private pickRandomState (current: MonsterState): MonsterState {
    const possible = STATES.filter(s => s !== current)
    return possible[Math.floor(Math.random() * possible.length)]
  }
}
