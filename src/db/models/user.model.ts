/**
 * User Model - Infrastructure Layer
 * Modèle Mongoose pour les utilisateurs Animochi
 * Respecte le principe SRP : Gère uniquement la persistance des utilisateurs
 *
 * Point de vérité unique pour tous les utilisateurs (GitHub OAuth + email/password)
 * Better Auth synchronisera les données OAuth ici via les callbacks
 */

import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Évite les doublons d'email
      lowercase: true, // Normalise l'email
      trim: true
    },
    username: {
      type: String,
      required: false,
      unique: true, // Chaque username doit être unique
      sparse: true, // Permet les valeurs null multiples
      trim: true,
      minlength: [3, 'Le pseudo doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le pseudo ne peut pas dépasser 30 caractères']
    },
    pseudo: {
      type: String,
      required: false,
      unique: true, // Chaque pseudo doit être unique
      sparse: true, // Permet les valeurs null multiples
      trim: true,
      minlength: [3, 'Le pseudo doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le pseudo ne peut pas dépasser 30 caractères']
    },
    name: {
      type: String,
      required: false,
      trim: true
    },
    avatarUrl: {
      type: String,
      required: false,
      default: null
    },
    // Champs spécifiques à Animochi
    displayName: {
      type: String,
      required: false,
      trim: true
    },
    bio: {
      type: String,
      required: false,
      default: '',
      maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
    },
    // Statistiques de jeu
    totalExperience: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "L'expérience ne peut pas être négative"]
    },
    level: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Le niveau minimum est 1']
    },
    // Préférences utilisateur
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        },
        dailyReminder: {
          type: Boolean,
          default: true
        }
      },
      privacy: {
        profilePublic: {
          type: Boolean,
          default: true
        },
        showStats: {
          type: Boolean,
          default: true
        }
      }
    },
    // Métadonnées
    lastLoginAt: {
      type: Date,
      required: false,
      default: null
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    bufferCommands: false,
    timestamps: true // createdAt, updatedAt automatiques
  }
)

// Index composés pour optimiser les requêtes
userSchema.index({ level: -1, totalExperience: -1 }) // Leaderboard
userSchema.index({ createdAt: -1 }) // Nouveaux utilisateurs

// Méthode virtuelle pour obtenir l'initiale du nom
userSchema.virtual('initial').get(function () {
  const name = this.displayName ?? this.name ?? this.email
  return name != null && name.length > 0 ? name.charAt(0).toUpperCase() : 'U'
})

// Méthode pour formatter l'utilisateur pour l'API
userSchema.methods.toJSON = function () {
  const user = this.toObject({ virtuals: true })
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    totalExperience: user.totalExperience,
    level: user.level,
    preferences: user.preferences,
    lastLoginAt: user.lastLoginAt,
    isEmailVerified: user.isEmailVerified,
    initial: user.initial,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export interface UserDocument {
  _id: string
  email: string
  username?: string
  pseudo?: string
  name?: string
  avatarUrl?: string
  displayName?: string
  bio: string
  totalExperience: number
  level: number
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      email: boolean
      push: boolean
      dailyReminder: boolean
    }
    privacy: {
      profilePublic: boolean
      showStats: boolean
    }
  }
  lastLoginAt?: Date
  isEmailVerified: boolean
  initial: string
  createdAt: Date
  updatedAt: Date
}

// Utiliser la collection 'users' (avec un s) - celle créée par Better Auth
export default mongoose.models.users ?? mongoose.model<UserDocument>('users', userSchema)
