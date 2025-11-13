/**
 * GetDailyQuests Use Case - Récupère les quêtes journalières
 *
 * Responsabilité unique : Récupérer ou initialiser les quêtes du jour pour un utilisateur
 * Principe SRP : Uniquement la logique de récupération des quêtes
 * Principe DIP : Dépend de l'abstraction QuestRepository
 */

import type { QuestRepository } from '@/domain/repositories/quest.repository'
import type { QuestProgress } from '@/domain/entities/quest-progress.entity'
import {
  selectRandomQuests,
  templateToQuest,
  getQuestExpirationDate,
  QUEST_CONFIG
} from '@/config/quests.config'
import { randomUUID } from 'crypto'

/**
 * Use case pour récupérer les quêtes journalières d'un utilisateur
 */
export class GetDailyQuestsUseCase {
  constructor (private readonly questRepository: QuestRepository) {}

  /**
   * Exécute le use case
   * Si l'utilisateur n'a pas de quêtes actives, en génère de nouvelles
   */
  async execute (userId: string): Promise<QuestProgress[]> {
    // Vérifier si l'utilisateur a déjà des quêtes actives pour aujourd'hui
    const hasActiveQuests = await this.questRepository.hasActiveQuestsForToday(userId)

    if (hasActiveQuests) {
      // Retourner les quêtes existantes
      return await this.questRepository.getDailyQuestsForUser(userId)
    }

    // Générer de nouvelles quêtes
    const questTemplates = selectRandomQuests(QUEST_CONFIG.DAILY_QUESTS_COUNT)
    const expiresAt = getQuestExpirationDate()

    const quests = questTemplates.map((template) =>
      templateToQuest(template, `quest-${userId}-${randomUUID()}`)
    )

    // Assigner les nouvelles quêtes
    return await this.questRepository.assignDailyQuests(userId, quests, expiresAt)
  }
}
