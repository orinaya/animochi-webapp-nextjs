import mongoose from 'mongoose'

const { Schema } = mongoose

const monsterSchema = new Schema(
  {
    name: {
      type: String, // = 'string'
      required: true
    },
    level: {
      type: Number,
      required: false,
      default: 1
    },
    draw: {
      type: String,
      required: true
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
    equippedAccessories: {
      hat: {
        type: Schema.Types.ObjectId,
        ref: 'Accessory',
        required: false,
        default: null
      },
      glasses: {
        type: Schema.Types.ObjectId,
        ref: 'Accessory',
        required: false,
        default: null
      },
      shoes: {
        type: Schema.Types.ObjectId,
        ref: 'Accessory',
        required: false,
        default: null
      }
    },
    equippedBackground: {
      type: Schema.Types.ObjectId,
      ref: 'Background',
      required: false,
      default: null
    }
  },
  {
    bufferCommands: false,
    timestamps: true
  }
)

export default mongoose.models.Monster ?? mongoose.model('Monster', monsterSchema)
