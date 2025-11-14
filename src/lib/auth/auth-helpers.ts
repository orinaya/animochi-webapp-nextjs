/**
 * Auth Helpers - Services Layer
 * Fonctions utilitaires pour la synchronisation des données d'authentification
 * Respecte les principes SOLID : responsabilité unique de synchronisation
 */

import { connectMongooseToDatabase } from '@/db'
import UserModel from '@/db/models/user.model'
import WalletModel from '@/db/models/wallet.model'
import type { UserDocument } from '@/db/models/user.model'
import { generateUniqueUsername } from '@/utils/username-generator.utils'

interface AuthUserData {
  email: string
  name?: string | null
  image?: string | null
}

interface OAuthProfile {
  name?: string
  email?: string
  image?: string
  login?: string // GitHub username
  avatar_url?: string // GitHub avatar
}

/**
 * Crée ou met à jour un utilisateur depuis les données OAuth (GitHub)
 * Principe SRP : Se contente de synchroniser les données utilisateur
 *
 * @param authUser - Données utilisateur from Better Auth
 * @param profile - Profile OAuth du provider
 * @returns Promise<UserDocument | null>
 */
export async function createOrUpdateUserFromOAuth (
  authUser: AuthUserData,
  profile?: OAuthProfile
): Promise<UserDocument | null> {
  try {
    // Assurer la connexion à la base de données
    await connectMongooseToDatabase()

    if (authUser.email == null || authUser.email.trim().length === 0) {
      console.error('Email manquant dans les données OAuth')
      return null
    }

    const email = authUser.email.trim().toLowerCase()

    // Chercher un utilisateur existant par email
    const user = await UserModel.findOne({ email })

    if (user != null) {
      // Utilisateur existant : mettre à jour les informations si nécessaire
      let hasChanges = false

      // Mettre à jour le nom si disponible et pas déjà défini
      const newName = authUser.name ?? profile?.name
      if (newName != null && newName.trim().length > 0 && user.name !== newName.trim()) {
        user.name = newName.trim()
        hasChanges = true
      }

      // Mettre à jour l'avatar si disponible
      const newAvatarUrl = authUser.image ?? profile?.avatar_url ?? profile?.image
      if (
        newAvatarUrl != null &&
        newAvatarUrl.trim().length > 0 &&
        user.avatarUrl !== newAvatarUrl
      ) {
        user.avatarUrl = newAvatarUrl
        hasChanges = true
      }

      // Mettre à jour la date de dernière connexion
      user.lastLoginAt = new Date()
      hasChanges = true

      // Marquer l'email comme vérifié pour les connexions OAuth
      if (user.isEmailVerified === false) {
        user.isEmailVerified = true
        hasChanges = true
      }

      if (hasChanges) {
        await user.save()
      }

      return user
    } else {
      // Nouvel utilisateur : créer un compte
      // Générer un pseudo unique
      const pseudo = await generateUniqueUsername(async (name) => {
        const existingUser = await UserModel.findOne({
          $or: [{ username: name }, { pseudo: name }]
        })
        return existingUser !== null
      })

      const newUser = new UserModel({
        email,
        username: pseudo, // Pour compatibilité
        pseudo, // Pseudo généré automatiquement
        name: authUser.name ?? profile?.name ?? '',
        avatarUrl: authUser.image ?? profile?.avatar_url ?? profile?.image,
        displayName: profile?.login ?? authUser.name ?? '',
        isEmailVerified: true, // Les connexions OAuth sont considérées comme vérifiées
        lastLoginAt: new Date()
      })

      await newUser.save()

      // Créer un wallet initial pour le nouvel utilisateur
      await createInitialWallet(newUser._id.toString())

      return newUser
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation utilisateur OAuth:', error)
    return null
  }
}

/**
 * Crée un wallet initial pour un nouvel utilisateur
 * Principe SRP : Responsable uniquement de la création du wallet
 *
 * @param userId - ID de l'utilisateur
 */
async function createInitialWallet (userId: string): Promise<void> {
  try {
    // Vérifier qu'un wallet n'existe pas déjà
    const existingWallet = await WalletModel.findOne({ ownerId: userId })
    if (existingWallet != null) {
      return
    }

    // Créer le wallet avec le bonus de bienvenue
    const wallet = new WalletModel({
      ownerId: userId,
      balance: 100 // Bonus de bienvenue
    })

    await wallet.save()
  } catch (error) {
    console.error('Erreur lors de la création du wallet initial:', error)
  }
}

/**
 * Trouve un utilisateur par email
 * Utilitaire pour les callbacks de session
 *
 * @param email - Email de l'utilisateur
 * @returns Promise<UserDocument | null>
 */
export async function findUserByEmail (email: string): Promise<UserDocument | null> {
  try {
    await connectMongooseToDatabase()

    if (email == null || email.trim().length === 0) {
      return null
    }

    const normalizedEmail = email.trim().toLowerCase()
    return await UserModel.findOne({ email: normalizedEmail })
  } catch (error) {
    console.error('Erreur lors de la recherche utilisateur par email:', error)
    return null
  }
}
