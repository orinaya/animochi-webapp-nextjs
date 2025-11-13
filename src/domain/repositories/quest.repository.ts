/**
 * QuestRepository Interface - Contrat pour la persistance des quêtes
 *
 * Responsabilité unique : Définir les opérations de persistance pour les quêtes
 * Principe DIP : Les use cases dépendent de cette abstraction, pas de l'implémentation
 * Principe ISP : Interface ciblée uniquement sur les opérations de quêtes
 */

import type { Quest } from '../entities/quest.entity'
import type { QuestProgress, QuestStatus } from '../entities/quest-progress.entity'

/**
 * Repository pour la gestion des quêtes
 */
export interface QuestRepository {
  /**
   * Récupère les quêtes journalières actives d'un utilisateur
   */
  getDailyQuestsForUser: (userId: string) => Promise<QuestProgress[]>

  /**
   * Récupère une quête par son ID
   */
  getQuestById: (questId: string) => Promise<Quest | null>

  /**
   * Récupère la progression d'une quête spécifique pour un utilisateur
   */
  getQuestProgress: (userId: string, questId: string) => Promise<QuestProgress | null>

  /**
   * Crée une nouvelle progression de quête pour un utilisateur
   */
  createQuestProgress: (progress: QuestProgress) => Promise<QuestProgress>

  /**
   * Met à jour la progression d'une quête
   */
  updateQuestProgress: (progress: QuestProgress) => Promise<QuestProgress>

  /**
   * Réinitialise les quêtes journalières d'un utilisateur
   * (marque comme expirées les non complétées)
   */
  resetDailyQuests: (userId: string) => Promise<void>

  /**
   * Supprime toutes les quêtes d'un utilisateur (pour dev/test)
   */
  deleteAllUserQuests: (userId: string) => Promise<void>

  /**
   * Réinitialise toutes les quêtes journalières de tous les utilisateurs
   */
  resetAllDailyQuests: () => Promise<void>

  /**
   * Assigne de nouvelles quêtes journalières à un utilisateur
   */
  assignDailyQuests: (userId: string, quests: Quest[], expiresAt: Date) => Promise<QuestProgress[]>

  /**
   * Vérifie si un utilisateur a déjà des quêtes actives pour aujourd'hui
   */
  hasActiveQuestsForToday: (userId: string) => Promise<boolean>

  /**
   * Récupère toutes les quêtes complétées d'un utilisateur
   */
  getCompletedQuests: (userId: string, limit?: number) => Promise<QuestProgress[]>

  /**
   * Compte le nombre de quêtes avec un statut donné pour un utilisateur
   */
  countQuestsByStatus: (userId: string, status: QuestStatus) => Promise<number>

  /**
   * Marque une quête comme réclamée (CLAIMED)
   */
  markQuestAsClaimed: (userId: string, questId: string) => Promise<QuestProgress | null>
}

/**
 * Type Result pour gérer les succès/échecs
 */
export type QuestResult<T> = { success: true, data: T } | { success: false, error: string }
