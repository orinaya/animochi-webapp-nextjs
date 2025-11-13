import mongoose from 'mongoose'

const { Schema } = mongoose

const monsterSchema = new Schema(
  {
    name: {
      type: String, // = 'string'
      required: true
    },
    description: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: false,
      enum: ['blueberry', 'strawberry', 'peach', 'latte']
    },
    emoji: {
      type: String,
      required: false
    },
    rarity: {
      type: String,
      required: false,
      enum: ['Commun', 'Rare', 'Épique', 'Légendaire']
    },
    level: {
      type: Number,
      required: false,
      default: 1
    },
    draw: {
      type: String,
      required: true,
      default: 'placeholder' // SVG par défaut si non fourni
    },
    state: {
      type: String,
      required: true,
      enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy'],
      default: 'happy'
    },
    experience: {
      type: Number,
      required: false,
      default: 0
    },
    experienceToNextLevel: {
      type: Number,
      required: false,
      default: 150 // XP nécessaire pour le niveau 2 (BASE_XP * 1 * GROWTH_FACTOR = 100 * 1 * 1.5)
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    isPublic: {
      type: Boolean,
      required: false,
      default: false
    },
    equippedAccessories: {
      hat: {
        type: String,
        required: false,
        default: null
      },
      glasses: {
        type: String,
        required: false,
        default: null
      },
      shoes: {
        type: String,
        required: false,
        default: null
      },
      background: {
        type: String,
        required: false,
        default: null
      }
    }
  },
  {
    bufferCommands: false,
    timestamps: true
  }
)

// Supprimer le modèle existant du cache pour forcer le rechargement
if (mongoose.models.Monster != null) {
  delete mongoose.models.Monster
}

const Monster = mongoose.model('Monster', monsterSchema)

export default Monster
