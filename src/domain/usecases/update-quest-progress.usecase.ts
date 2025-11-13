/**
 * UpdateQuestProgress Use Case - Met à jour la progression d'une quête
 *
 * Responsabilité unique : Incrémenter la progression d'une quête et gérer la complétion
 * Principe SRP : Uniquement la logique de mise à jour de progression
 * Principe DIP : Dépend de l'abstraction QuestRepository
 */

import type { QuestRepository } from '@/domain/repositories/quest.repository'
import type { QuestProgress } from '@/domain/entities/quest-progress.entity'
import { QuestProgressFactory, QuestStatus } from '@/domain/entities/quest-progress.entity'

/**
 * Résultat de la mise à jour de progression
 */
export interface UpdateProgressResult {
  progress: QuestProgress
  justCompleted: boolean
  reward: number
}

/**
 * Use case pour mettre à jour la progression d'une quête
 */
export class UpdateQuestProgressUseCase {
  constructor (private readonly questRepository: QuestRepository) {}

  /**
   * Exécute le use case
   * Incrémente la progression et vérifie si la quête est complétée
   */
  async execute (
    userId: string,
    questId: string,
    incrementAmount: number = 1
  ): Promise<UpdateProgressResult> {
    // Récupérer la progression actuelle
    const currentProgress = await this.questRepository.getQuestProgress(userId, questId)

    if (currentProgress == null) {
      throw new Error('Quest progress not found')
    }

    // Vérifier que la quête n'est pas déjà complétée ou expirée
    if (currentProgress.status === QuestStatus.COMPLETED) {
      return {
        progress: currentProgress,
        justCompleted: false,
        reward: 0
      }
    }

    if (currentProgress.status === QuestStatus.EXPIRED) {
      throw new Error('Cannot update expired quest')
    }

    // Incrémenter la progression
    const updatedProgress = QuestProgressFactory.incrementProgress(currentProgress, incrementAmount)
    const isNowCompleted = updatedProgress.status === QuestStatus.COMPLETED

    // Sauvegarder la progression mise à jour
    const savedProgress = await this.questRepository.updateQuestProgress(updatedProgress)

    // Calculer la récompense si la quête vient d'être complétée
    const reward = isNowCompleted ? savedProgress.reward : 0

    return {
      progress: savedProgress,
      justCompleted: isNowCompleted,
      reward
    }
  }
}
