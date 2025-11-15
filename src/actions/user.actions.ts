/**
 * User Actions - Server Actions pour la gestion utilisateur
 *
 * @module actions/user.actions
 */

'use server'

import { connectMongooseToDatabase } from '@/db'
import UserModel from '@/db/models/user.model'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'

/**
 * Met à jour le username d'un utilisateur
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Valide le nouveau username (longueur, unicité)
 * - Met à jour le champ username dans la base de données
 *
 * Respecte le principe SRP : Gère uniquement la modification du username
 *
 * @param {string} newUsername - Le nouveau pseudo à définir
 * @returns {Promise<{ success: boolean; message: string }>}
 *
 * @example
 * ```tsx
 * const result = await updateUsername('SuperDragon42')
 * if (result.success) {
 *   toast.success(result.message)
 * }
 * ```
 */
export async function updateUsername (
  newUsername: string
): Promise<{ success: boolean, message: string }> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: 'Vous devez être authentifié pour modifier votre pseudo'
      }
    }

    const { user } = session

    // Validation du username
    const trimmedUsername = newUsername.trim()

    if (trimmedUsername.length < 3) {
      return {
        success: false,
        message: 'Le pseudo doit contenir au moins 3 caractères'
      }
    }

    if (trimmedUsername.length > 30) {
      return {
        success: false,
        message: 'Le pseudo ne peut pas dépasser 30 caractères'
      }
    }

    // Vérifier que le username n'est pas déjà utilisé
    const existingUser = await UserModel.findOne({
      $or: [{ username: trimmedUsername }, { pseudo: trimmedUsername }],
      _id: { $ne: user.id } // Exclure l'utilisateur actuel
    })

    if (existingUser != null) {
      return {
        success: false,
        message: 'Ce pseudo est déjà utilisé par un autre utilisateur'
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.id,
      { $set: { pseudo: trimmedUsername, username: trimmedUsername } },
      { new: true, runValidators: true }
    ).lean()

    if (updatedUser == null) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      }
    }

    return {
      success: true,
      message: 'Pseudo mis à jour avec succès !'
    }
  } catch (error) {
    console.error('Erreur mise à jour pseudo:', error)
    return {
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour'
    }
  }
}

/**
 * Récupère les informations de profil de l'utilisateur connecté
 *
 * @returns {Promise<{ success: boolean; user?: any; message?: string }>}
 */
export async function getUserProfile (): Promise<{
  success: boolean
  user?: {
    id: string
    email: string
    username?: string
    pseudo?: string
    name?: string
    avatarUrl?: string
  }
  message?: string
}> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: 'Vous devez être authentifié'
      }
    }

    const { user: sessionUser } = session

    const user = await UserModel.findById(sessionUser.id)
      .select('email username pseudo name avatarUrl')
      .lean<{
      _id: unknown
      email: string
      username?: string
      pseudo?: string
      name?: string
      avatarUrl?: string
    } | null>()

    if (user == null) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      }
    }

    return {
      success: true,
      user: {
        id: (user._id as { toString: () => string }).toString(),
        email: user.email,
        username: user.username,
        pseudo: user.pseudo,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    }
  } catch (error) {
    console.error('Erreur récupération profil:', error)
    return {
      success: false,
      message: 'Une erreur est survenue'
    }
  }
}
