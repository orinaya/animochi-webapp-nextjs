/**
 * Purchase Model - Infrastructure Layer
 * Modèle Mongoose pour les achats effectués via Stripe
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

const purchaseSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['xp-boost', 'animoneys-package', 'food', 'accessory', 'customization']
    },
    itemId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'eur',
      lowercase: true
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'canceled'],
      default: 'pending'
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true // Permet null/undefined
    },
    stripePaymentIntentId: {
      type: String
    },
    targetMonsterId: {
      type: Schema.Types.ObjectId,
      ref: 'Monster'
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
  }
)

// Index composé pour rechercher les achats réussis d'un utilisateur
purchaseSchema.index({ userId: 1, paymentStatus: 1, createdAt: -1 })

// Index pour rechercher par session Stripe
purchaseSchema.index({ stripeSessionId: 1 })

const Purchase = mongoose.models.Purchase ?? mongoose.model('Purchase', purchaseSchema)

export default Purchase
