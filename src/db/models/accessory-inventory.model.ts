/**
 * AccessoryInventory Model - Infrastructure Layer
 * Modèle Mongoose pour l'inventaire des accessoires possédés par les utilisateurs
 * Principe SRP : Gère uniquement la persistance des accessoires possédés
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

const accessoryInventorySchema = new Schema(
  {
    accessoryName: {
      type: String,
      required: true,
      index: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    equippedOnMonsterId: {
      type: Schema.Types.ObjectId,
      ref: 'Monster',
      default: null
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    },
    isEquipped: {
      type: Boolean,
      default: false
    }
  },
  {
    bufferCommands: false,
    timestamps: true // createdAt, updatedAt automatiques
  }
)

// Index composé pour rechercher rapidement les accessoires d'un utilisateur
accessoryInventorySchema.index({ ownerId: 1, accessoryName: 1 })

// Index pour rechercher les accessoires équipés sur un monstre
accessoryInventorySchema.index({ equippedOnMonsterId: 1 })

// Méthode pour formatter l'accessoire pour l'API
accessoryInventorySchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id.toString()
  delete obj._id
  delete obj.__v
  return obj
}

const AccessoryInventory =
  mongoose.models.AccessoryInventory ??
  mongoose.model('AccessoryInventory', accessoryInventorySchema)

export default AccessoryInventory
