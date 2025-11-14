/**
 * MongooseQuestRepository - Implémentation du repository avec Mongoose
 *
 * Responsabilité unique : Persistance des quêtes via Mongoose/MongoDB
 * Principe DIP : Implémente l'interface QuestRepository du domaine
 * Principe SRP : Uniquement la logique de persistance, aucune logique métier
 */

import type { QuestRepository } from '@/domain/repositories/quest.repository'
import type { Quest } from '@/domain/entities/quest.entity'
import type { QuestProgress, QuestStatus } from '@/domain/entities/quest-progress.entity'
import QuestProgressModel from '@/db/models/quest-progress.model'
import mongoose from 'mongoose'
import { QuestProgressFactory } from '@/domain/entities/quest-progress.entity'

/**
 * Implémentation Mongoose du QuestRepository
 */
export class MongooseQuestRepository implements QuestRepository {
  /**
   * Récupère les quêtes journalières actives d'un utilisateur
   */
  async getDailyQuestsForUser (userId: string): Promise<QuestProgress[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const now = new Date()

    const progressDocs = await QuestProgressModel.find({
      userId: userObjectId,
      expiresAt: { $gt: now }
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    return progressDocs.map(this.mapToQuestProgress)
  }

  /**
   * Récupère une quête par son ID (ici c'est un template, on le reconstruit)
   */
  async getQuestById (questId: string): Promise<Quest | null> {
    // Pour ce système, les quêtes sont des templates configurés
    // On ne les stocke pas en DB, mais dans la config
    // Cette méthode pourrait retourner null ou chercher dans la config
    return null
  }

  /**
   * Récupère la progression d'une quête spécifique pour un utilisateur
   */
  async getQuestProgress (userId: string, questId: string): Promise<QuestProgress | null> {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    const progressDoc = await QuestProgressModel.findOne({
      userId: userObjectId,
      questId
    })
      .lean()
      .exec()

    if (progressDoc == null) {
      return null
    }

    return this.mapToQuestProgress(progressDoc)
  }

  /**
   * Crée une nouvelle progression de quête pour un utilisateur
   */
  async createQuestProgress (progress: QuestProgress): Promise<QuestProgress> {
    const userObjectId = new mongoose.Types.ObjectId(progress.userId)

    const progressDoc = await QuestProgressModel.create({
      userId: userObjectId,
      questId: progress.questId,
      questType: progress.questType,
      questTitle: '', // Sera rempli par les données de la quête
      questDescription: '',
      questIcon: '',
      currentCount: progress.currentCount,
      targetCount: progress.targetCount,
      reward: 0, // Sera rempli par les données de la quête
      status: progress.status,
      completedAt: progress.completedAt,
      expiresAt: progress.expiresAt
    })

    return this.mapToQuestProgress(progressDoc.toObject())
  }

  /**
   * Met à jour la progression d'une quête
   */
  async updateQuestProgress (progress: QuestProgress): Promise<QuestProgress> {
    const userObjectId = new mongoose.Types.ObjectId(progress.userId)

    const updated = await QuestProgressModel.findOneAndUpdate(
      {
        userId: userObjectId,
        questId: progress.questId
      },
      {
        currentCount: progress.currentCount,
        status: progress.status,
        completedAt: progress.completedAt,
        updatedAt: new Date()
      },
      { new: true }
    )
      .lean()
      .exec()

    if (updated == null) {
      throw new Error('Quest progress not found')
    }

    return this.mapToQuestProgress(updated)
  }

  /**
   * Réinitialise les quêtes journalières d'un utilisateur
   */
  async resetDailyQuests (userId: string): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const now = new Date()

    // Marque comme expirées toutes les quêtes non complétées qui expirent avant maintenant
    await QuestProgressModel.updateMany(
      {
        userId: userObjectId,
        status: { $ne: 'COMPLETED' },
        expiresAt: { $lte: now }
      },
      {
        status: 'EXPIRED',
        updatedAt: now
      }
    ).exec()
  }

  /**
   * Supprime toutes les quêtes d'un utilisateur (pour dev/test)
   */
  async deleteAllUserQuests (userId: string): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId)
    await QuestProgressModel.deleteMany({ userId: userObjectId }).exec()
  }

  /**
   * Réinitialise toutes les quêtes journalières de tous les utilisateurs
   */
  async resetAllDailyQuests (): Promise<void> {
    const now = new Date()

    await QuestProgressModel.updateMany(
      {
        status: { $ne: 'COMPLETED' },
        expiresAt: { $lte: now }
      },
      {
        status: 'EXPIRED',
        updatedAt: now
      }
    ).exec()
  }

  /**
   * Assigne de nouvelles quêtes journalières à un utilisateur
   */
  async assignDailyQuests (
    userId: string,
    quests: Quest[],
    expiresAt: Date
  ): Promise<QuestProgress[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    const progressDocs = await QuestProgressModel.insertMany(
      quests.map((quest) => ({
        userId: userObjectId,
        questId: quest.id,
        questType: quest.type,
        questTitle: quest.title,
        questDescription: quest.description,
        questIcon: quest.icon,
        currentCount: 0,
        targetCount: quest.targetCount,
        reward: quest.reward,
        status: 'NOT_STARTED',
        expiresAt
      }))
    )

    return progressDocs.map((doc) => this.mapToQuestProgress(doc.toObject()))
  }

  /**
   * Vérifie si un utilisateur a déjà des quêtes actives pour aujourd'hui
   */
  async hasActiveQuestsForToday (userId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const now = new Date()

    const count = await QuestProgressModel.countDocuments({
      userId: userObjectId,
      expiresAt: { $gt: now }
    }).exec()

    return count > 0
  }

  /**
   * Récupère toutes les quêtes complétées d'un utilisateur
   */
  async getCompletedQuests (userId: string, limit?: number): Promise<QuestProgress[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    let query = QuestProgressModel.find({
      userId: userObjectId,
      status: 'COMPLETED'
    })
      .sort({ completedAt: -1 })
      .lean()

    if (limit !== undefined) {
      query = query.limit(limit)
    }

    const progressDocs = await query.exec()

    return progressDocs.map(this.mapToQuestProgress)
  }

  /**
   * Compte le nombre de quêtes avec un statut donné pour un utilisateur
   */
  async countQuestsByStatus (userId: string, status: QuestStatus): Promise<number> {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    return await QuestProgressModel.countDocuments({
      userId: userObjectId,
      status
    }).exec()
  }

  /**
   * Marque une quête comme réclamée (CLAIMED)
   */
  async markQuestAsClaimed (userId: string, questId: string): Promise<QuestProgress | null> {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    const updated = await QuestProgressModel.findOneAndUpdate(
      {
        userId: userObjectId,
        questId,
        status: 'COMPLETED' // On ne peut réclamer que les quêtes complétées
      },
      {
        status: 'CLAIMED',
        claimedAt: new Date()
      },
      { new: true }
    ).lean()

    if (updated == null) {
      return null
    }

    return this.mapToQuestProgress(updated)
  }

  /**
   * Mappe un document Mongoose vers une entité QuestProgress du domaine
   * Inclut les métadonnées de la quête (titre, description, icône)
   */
  private mapToQuestProgress (doc: any): QuestProgress & {
    questTitle?: string
    questDescription?: string
    questIcon?: string
  } {
    const baseProgress = QuestProgressFactory.create({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      questId: doc.questId,
      questType: doc.questType,
      targetCount: doc.targetCount,
      reward: doc.reward ?? 0,
      expiresAt: doc.expiresAt,
      currentCount: doc.currentCount,
      status: doc.status,
      completedAt: doc.completedAt
    })

    // Ajouter les métadonnées de la quête
    return {
      ...baseProgress,
      questTitle: doc.questTitle,
      questDescription: doc.questDescription,
      questIcon: doc.questIcon
    }
  }
}

/**
 * Instance singleton du repository
 */
export const questRepository = new MongooseQuestRepository()
