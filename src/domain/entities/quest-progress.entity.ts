/**
 * QuestProgress Entity - Entité de domaine pour la progression d'une quête
 *
 * Responsabilité unique : Gérer l'état et la progression d'une quête pour un utilisateur
 * Principe SRP : Uniquement la logique de progression et de complétion
 * Principe OCP : Extensible via de nouveaux états sans modifier l'entité
 */

import type { QuestType } from './quest.entity'

/**
 * Statuts possibles d'une quête
 */
export enum QuestStatus {
  /** Quête disponible mais non commencée */
  NOT_STARTED = 'NOT_STARTED',
  /** Quête en cours */
  IN_PROGRESS = 'IN_PROGRESS',
  /** Quête terminée */
  COMPLETED = 'COMPLETED',
  /** Quête terminée et récompense réclamée */
  CLAIMED = 'CLAIMED',
  /** Quête expirée (pas complétée avant minuit) */
  EXPIRED = 'EXPIRED',
}

/**
 * Interface représentant la progression d'une quête pour un utilisateur
 */
export interface QuestProgress {
  /** Identifiant unique de la progression */
  readonly id: string
  /** ID de l'utilisateur */
  readonly userId: string
  /** ID de la quête */
  readonly questId: string
  /** Type de quête */
  readonly questType: QuestType
  /** Progression actuelle */
  readonly currentCount: number
  /** Objectif à atteindre */
  readonly targetCount: number
  /** Récompense en animoneys */
  readonly reward: number
  /** Statut de la quête */
  readonly status: QuestStatus
  /** Date de création */
  readonly createdAt: Date
  /** Date de dernière mise à jour */
  readonly updatedAt: Date
  /** Date de complétion (si complétée) */
  readonly completedAt?: Date
  /** Date à laquelle la quête expire */
  readonly expiresAt: Date
}

/**
 * Value Object représentant l'état de progression
 */
export class ProgressState {
  constructor (public readonly currentCount: number, public readonly targetCount: number) {
    if (currentCount < 0) {
      throw new Error('La progression ne peut pas être négative')
    }
    if (targetCount <= 0) {
      throw new Error("L'objectif doit être supérieur à 0")
    }
  }

  /**
   * Vérifie si la quête est complétée
   */
  get isCompleted (): boolean {
    return this.currentCount >= this.targetCount
  }

  /**
   * Calcule le pourcentage de progression
   */
  get percentage (): number {
    return Math.min(100, (this.currentCount / this.targetCount) * 100)
  }

  /**
   * Incrémente la progression
   */
  increment (amount: number = 1): ProgressState {
    return new ProgressState(this.currentCount + amount, this.targetCount)
  }
}

/**
 * Factory pour créer des progressions de quêtes valides
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class QuestProgressFactory {
  /**
   * Crée une nouvelle progression de quête
   */
  static create (params: {
    id: string
    userId: string
    questId: string
    questType: QuestType
    targetCount: number
    reward: number
    expiresAt: Date
    currentCount?: number
    status?: QuestStatus
    completedAt?: Date
  }): QuestProgress {
    const currentCount = params.currentCount ?? 0
    const status = params.status ?? QuestStatus.NOT_STARTED

    return {
      id: params.id,
      userId: params.userId,
      questId: params.questId,
      questType: params.questType,
      currentCount,
      targetCount: params.targetCount,
      reward: params.reward,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: params.completedAt,
      expiresAt: params.expiresAt
    }
  }

  /**
   * Marque une progression comme complétée
   */
  static markAsCompleted (progress: QuestProgress): QuestProgress {
    if (progress.status === QuestStatus.COMPLETED) {
      return progress
    }

    const progressState = new ProgressState(progress.currentCount, progress.targetCount)
    if (!progressState.isCompleted) {
      throw new Error("La quête n'est pas encore complétée")
    }

    return {
      ...progress,
      status: QuestStatus.COMPLETED,
      completedAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Incrémente la progression d'une quête
   */
  static incrementProgress (progress: QuestProgress, amount: number = 1): QuestProgress {
    if (progress.status === QuestStatus.COMPLETED) {
      return progress
    }

    if (progress.status === QuestStatus.EXPIRED) {
      throw new Error('Impossible de progresser sur une quête expirée')
    }

    const newCount = Math.min(progress.currentCount + amount, progress.targetCount)
    const newStatus =
      newCount >= progress.targetCount ? QuestStatus.COMPLETED : QuestStatus.IN_PROGRESS

    return {
      ...progress,
      currentCount: newCount,
      status: newStatus,
      completedAt: newStatus === QuestStatus.COMPLETED ? new Date() : undefined,
      updatedAt: new Date()
    }
  }

  /**
   * Marque une progression comme expirée
   */
  static markAsExpired (progress: QuestProgress): QuestProgress {
    if (progress.status === QuestStatus.COMPLETED) {
      return progress
    }

    return {
      ...progress,
      status: QuestStatus.EXPIRED,
      updatedAt: new Date()
    }
  }
}
