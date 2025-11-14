// src/db/models/monster-action.model.ts
// Modèle Mongoose pour enregistrer les actions utilisateur sur un monstre

import mongoose from 'mongoose'
import type { MonsterAction } from '@/config/rewards.config'

const { Schema } = mongoose

const monsterActionSchema = new Schema(
  {
    monsterId: {
      type: Schema.Types.ObjectId,
      ref: 'Monster',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['feed', 'play', 'heal'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    bufferCommands: false,
    timestamps: false
  }
)

export default mongoose.models.MonsterAction ?? mongoose.model('MonsterAction', monsterActionSchema)
