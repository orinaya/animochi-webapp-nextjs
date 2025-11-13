/**
 * ResetDailyQuests Use Case - Réinitialise les quêtes journalières
 *
 * Responsabilité unique : Réinitialiser les quêtes expirées
 * Principe SRP : Uniquement la logique de réinitialisation
 * Principe DIP : Dépend de l'abstraction QuestRepository
 */

import type { QuestRepository } from '@/domain/repositories/quest.repository'

/**
 * Use case pour réinitialiser les quêtes journalières
 */
export class ResetDailyQuestsUseCase {
  constructor (private readonly questRepository: QuestRepository) {}

  /**
   * Réinitialise les quêtes pour un utilisateur spécifique
   */
  async executeForUser (userId: string): Promise<void> {
    await this.questRepository.resetDailyQuests(userId)
  }

  /**
   * Réinitialise les quêtes pour tous les utilisateurs
   * Utilisé par le cron job de minuit
   */
  async executeForAll (): Promise<void> {
    await this.questRepository.resetAllDailyQuests()
  }
}
