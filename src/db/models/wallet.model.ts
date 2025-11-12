/**
 * Wallet Model - Infrastructure Layer
 * Modèle Mongoose pour le Wallet (portefeuille Animoney)
 * Relation One-to-One avec User via ownerId
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

const walletSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // Un utilisateur = un wallet
    },
    balance: {
      type: Number,
      required: true,
      default: 3000, // Welcome bonus : 3000 Animoney
      min: [0, 'Le solde ne peut pas être négatif'],
      validate: {
        validator: Number.isInteger,
        message: 'Le solde doit être un nombre entier'
      }
    }
  },
  {
    bufferCommands: false,
    timestamps: true // createdAt, updatedAt automatiques
  }
)

// Index pour optimiser les recherches
walletSchema.index({ ownerId: 1 })

// Méthode pour formatter le wallet pour l'API
walletSchema.methods.toJSON = function () {
  const wallet = this.toObject()
  return {
    id: wallet._id.toString(),
    ownerId: wallet.ownerId.toString(),
    balance: wallet.balance,
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt
  }
}

export default mongoose.models.Wallet ?? mongoose.model('Wallet', walletSchema)
