// src/domain/usecases/monster-auto-state-change.usecase.ts
// Use case : changement automatique d'état du monstre à intervalle régulier

import type {MonsterRepository} from "@/domain/repositories/monster-repository"
import type {WalletRepository} from "@/domain/repositories/wallet-repository"
import type {MonsterActionRepository} from "@/domain/repositories/monster-action-repository"
import {Monster} from "@/domain/entities/monster"
import type {MonsterState} from "@/config/rewards.config"
import {MonsterAnimoneyPenaltyUseCase} from "./monster-animoney-penalty.usecase"
import {getNextMonsterMood} from "@/shared/monster-mood-rules"

export class MonsterAutoStateChangeUseCase {
  constructor(
    private readonly monsterRepository: MonsterRepository,
    private readonly walletRepository: WalletRepository,
    private readonly monsterActionRepository: MonsterActionRepository
  ) {}

  // Change l'état de tous les monstres dont le nextStateAt est passé
  async execute(now: Date): Promise<void> {
    const monsters = await this.monsterRepository.findAllWithNextStateDue(now)
    const penaltyUseCase = new MonsterAnimoneyPenaltyUseCase(
      this.monsterRepository,
      this.walletRepository,
      this.monsterActionRepository
    )
    for (const monster of monsters) {
      await penaltyUseCase.execute(monster, monster.stateUpdatedAt)
      // Si le monstre est happy, on force un état aléatoire (hors happy)
      if (monster.state === "happy") {
        const possibleStates = ["sad", "angry", "hungry", "sleepy", "bored", "sick"]
        const newState = possibleStates[
          Math.floor(Math.random() * possibleStates.length)
        ] as MonsterState
        const nextStateAt = Monster.getNextStateAt(now)
        monster.changeState(newState, now, nextStateAt)
        await this.monsterRepository.save(monster)
        continue
      }
      // Sinon, logique normale
      const [lastFedAt, lastPlayedAt, lastSleptAt, lastActionAt] = await Promise.all([
        this.monsterActionRepository.getLastActionAt(monster.id, "feed"),
        this.monsterActionRepository.getLastActionAt(monster.id, "play"),
        this.monsterActionRepository.getLastActionAt(monster.id, "wake"),
        this.monsterActionRepository.getLastActionAt(monster.id, undefined),
      ])
      const ctx = {
        lastFedAt: lastFedAt ?? monster.stateUpdatedAt,
        lastPlayedAt: lastPlayedAt ?? monster.stateUpdatedAt,
        lastSleptAt: lastSleptAt ?? monster.stateUpdatedAt,
        lastActionAt: lastActionAt ?? monster.stateUpdatedAt,
        now,
      }
      const newState = getNextMonsterMood(monster.state, ctx)
      const nextStateAt = Monster.getNextStateAt(now)
      monster.changeState(newState, now, nextStateAt)
      await this.monsterRepository.save(monster)
    }
  }

  // La logique de choix d'état est maintenant externalisée dans getNextMonsterMood
}
