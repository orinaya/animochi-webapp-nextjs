/**
 * Transaction Model - Infrastructure Layer
 * Modèle Mongoose pour les transactions d'Animoney
 * Permet de tracer tous les mouvements de monnaie (audit trail)
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

const transactionSchema = new Schema(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
      index: true // Optimisation pour récupérer l'historique
    },
    type: {
      type: String,
      required: true,
      enum: ['CREDIT', 'DEBIT'],
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Le montant minimum est 1 Animoney'],
      max: [10000, 'Le montant maximum est 10,000 Animoney'],
      validate: {
        validator: Number.isInteger,
        message: 'Le montant doit être un nombre entier'
      }
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'DAILY_REWARD',
        'FEED_CREATURE',
        'MANUAL_ADD',
        'MANUAL_SUBTRACT',
        'QUEST_REWARD',
        'LEVEL_UP',
        'PURCHASE',
        'BOOST_XP',
        'INITIAL_BALANCE'
      ],
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
      default: {}
    }
  },
  {
    bufferCommands: false,
    timestamps: { createdAt: true, updatedAt: false } // Transactions immuables
  }
)

// Index composés pour optimiser les requêtes
transactionSchema.index({ walletId: 1, createdAt: -1 }) // Historique chronologique
transactionSchema.index({ walletId: 1, type: 1, createdAt: -1 }) // Filtrer par type

// Méthode pour formatter la transaction pour l'API
transactionSchema.methods.toJSON = function () {
  const transaction = this.toObject()
  return {
    id: transaction._id.toString(),
    walletId: transaction.walletId.toString(),
    type: transaction.type,
    amount: transaction.amount,
    reason: transaction.reason,
    metadata: transaction.metadata,
    createdAt: transaction.createdAt
  }
}

export default mongoose.models.Transaction ?? mongoose.model('Transaction', transactionSchema)
