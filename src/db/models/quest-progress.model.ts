/**
 * QuestProgress Model - Infrastructure Layer
 * Modèle Mongoose pour la progression des quêtes journalières
 * Relation avec User via userId
 */

import mongoose from 'mongoose'
import { QuestStatus } from '@/domain/entities/quest-progress.entity'
import { QuestType } from '@/domain/entities/quest.entity'

const { Schema } = mongoose

const questProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true
    },
    questId: {
      type: String,
      required: true,
      index: true
    },
    questType: {
      type: String,
      enum: Object.values(QuestType),
      required: true
    },
    questTitle: {
      type: String,
      required: true
    },
    questDescription: {
      type: String,
      required: true
    },
    questIcon: {
      type: String,
      required: true
    },
    currentCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'La progression ne peut pas être négative']
    },
    targetCount: {
      type: Number,
      required: true,
      min: [1, "L'objectif doit être au moins 1"]
    },
    reward: {
      type: Number,
      required: true,
      min: [1, 'La récompense doit être au moins 1']
    },
    status: {
      type: String,
      enum: Object.values(QuestStatus),
      required: true,
      default: QuestStatus.NOT_STARTED
    },
    completedAt: {
      type: Date,
      default: null
    },
    claimedAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
  },
  {
    bufferCommands: false,
    timestamps: true // createdAt, updatedAt automatiques
  }
)

// Index composé pour optimiser les requêtes
questProgressSchema.index({ userId: 1, expiresAt: -1 })
questProgressSchema.index({ userId: 1, status: 1 })
questProgressSchema.index({ userId: 1, questId: 1 }, { unique: true })

// Méthode pour calculer le pourcentage de progression
questProgressSchema.methods.getPercentage = function (): number {
  return Math.min(100, (this.currentCount / this.targetCount) * 100)
}

// Méthode pour vérifier si la quête est complète
questProgressSchema.methods.isCompleted = function (): boolean {
  return this.currentCount >= this.targetCount
}

// Méthode pour formatter pour l'API
questProgressSchema.methods.toJSON = function () {
  const progress = this.toObject()
  return {
    id: progress._id.toString(),
    userId: progress.userId.toString(),
    questId: progress.questId,
    questType: progress.questType,
    questTitle: progress.questTitle,
    questDescription: progress.questDescription,
    questIcon: progress.questIcon,
    currentCount: progress.currentCount,
    targetCount: progress.targetCount,
    reward: progress.reward,
    status: progress.status,
    percentage: this.getPercentage(),
    isCompleted: this.isCompleted(),
    completedAt: progress.completedAt,
    expiresAt: progress.expiresAt,
    createdAt: progress.createdAt,
    updatedAt: progress.updatedAt
  }
}

// Type TypeScript pour le document
export interface QuestProgressDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  questId: string
  questType: string
  questTitle: string
  questDescription: string
  questIcon: string
  currentCount: number
  targetCount: number
  reward: number
  status: QuestStatus
  completedAt?: Date
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  getPercentage: () => number
  isCompleted: () => boolean
}

export default mongoose.models.QuestProgress ??
  mongoose.model<QuestProgressDocument>('QuestProgress', questProgressSchema)
