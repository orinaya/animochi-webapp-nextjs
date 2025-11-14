"use server"

import {connectMongooseToDatabase} from "@/db"
import monsterModel from "@/db/models/monster.model"
import {auth} from "@/lib/auth/auth"
import type {Monster} from "@/types"
import type {MonsterAction, MonsterActionResult} from "@/types/monster/monster-actions"
import {Types} from "mongoose"
import {headers} from "next/headers"
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"
import {applyExperienceGain} from "@/services/experience-calculator.service"

/**
 * Crée un nouveau monstre pour l'utilisateur authentifié
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Crée un nouveau monstre dans la base de données
 * - Associe automatiquement l'utilisateur comme propriétaire
 *
 * Respecte le principe SRP : Gère uniquement la création de monstre
 * Respecte le principe DIP : Utilise l'abstraction auth et le modèle Monster
 *
 * @param {CreateMonsterFormValues} monsterData - Données du monstre à créer
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * ```tsx
 * await createMonster({
 *   name: 'Mochi',
 *   draw: '<svg>...</svg>',
 *   level: 1,
 *   state: 'happy',
 *   ownerId: 'user-id'
 * })
 * ```
 */
export async function createMonster(monsterData: Monster): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session === null || session === undefined) throw new Error("User not authenticated")

  console.log("Session utilisateur:", session)
  console.log("Données du monstre:", monsterData)

  // Créer le monstre avec les valeurs par défaut nécessaires
  // eslint-disable-next-line new-cap
  const monster = new monsterModel({
    name: monsterData.name,
    description: monsterData.description,
    color: monsterData.color,
    emoji: monsterData.emoji,
    rarity: monsterData.rarity,
    draw: monsterData.draw ?? "placeholder",
    state: monsterData.state ?? "happy",
    level: monsterData.level ?? 1,
    experience: monsterData.experience ?? 0,
    experienceToNextLevel: monsterData.experienceToNextLevel ?? 150,
    ownerId: new Types.ObjectId(session.user.id),
    isPublic: false,
    equippedAccessories: monsterData.equippedAccessories ?? {
      hat: null,
      glasses: null,
      shoes: null,
      background: null,
    },
  })

  console.log("Monstre avant sauvegarde:", monster)
  const savedMonster = await monster.save()
  console.log("Monstre sauvegardé:", savedMonster)
}

/**
 * Récupère tous les monstres de l'utilisateur authentifié
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Récupère tous les monstres appartenant à l'utilisateur
 * - Retourne un tableau vide en cas d'erreur
 *
 * Respecte le principe SRP : Gère uniquement la récupération des monstres
 *
 * @returns {Promise<MonsterDocument[]>} Liste des monstres ou tableau vide
 * @throws Ne propage pas les erreurs, retourne un tableau vide
 *
 * @example
 * ```tsx
 * const monsters = await getMonsters()
 * console.log(`${monsters.length} monstres trouvés`)
 * ```
 */
export async function getMonsters(): Promise<Monster[]> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (session === null || session === undefined) throw new Error("User not authenticated")

    const {user} = session

    // Utiliser .lean() pour obtenir des objets JavaScript simples au lieu de documents Mongoose
    const monstersData = await monsterModel.find({ownerId: user.id}).lean().exec()

    // Convertir les _id MongoDB en strings et structurer les données pour le client
    return monstersData.map((monster: Record<string, unknown>) => ({
      _id: monster._id.toString(),
      id: monster._id.toString(),
      name: monster.name,
      description: monster.description,
      color: monster.color,
      emoji: monster.emoji,
      rarity: monster.rarity,
      draw: monster.draw,
      state: monster.state,
      level: monster.level,
      experience: monster.experience,
      experienceToNextLevel: monster.experienceToNextLevel,
      ownerId: monster.ownerId.toString(),
      isPublic: monster.isPublic ?? false,
      equippedAccessories:
        monster.equippedAccessories != null
          ? {
              hat: monster.equippedAccessories.hat?.toString() ?? null,
              glasses: monster.equippedAccessories.glasses?.toString() ?? null,
              shoes: monster.equippedAccessories.shoes?.toString() ?? null,
              background: monster.equippedAccessories.background?.toString() ?? null,
            }
          : null,
      createdAt: monster.createdAt?.toISOString(),
      updatedAt: monster.updatedAt?.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching monsters:", error)
    return []
  }
}

/**
 * Récupère un monstre spécifique par son ID
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Vérifie que l'ID est un ObjectId MongoDB valide
 * - Récupère le monstre uniquement s'il appartient à l'utilisateur
 * - Retourne null en cas d'erreur ou si non trouvé
 *
 * Respecte le principe SRP : Gère uniquement la récupération d'un monstre
 *
 * @param {string} id - ID du monstre à récupérer (tableau pour Next.js dynamic routes)
 * @returns {Promise<MonsterDocument | null>} Le monstre trouvé ou null
 *
 * @example
 * ```tsx
 * const monster = await getMonsterById('507f1f77bcf86cd799439011')
 * if (monster) {
 *   console.log(`Monstre ${monster.name} trouvé`)
 * }
 * ```
 */
export async function getMonsterById(id: string): Promise<Monster | null> {
  try {
    await connectMongooseToDatabase()
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (session === null || session === undefined) throw new Error("User not authenticated")
    const {user} = session

    // Extraction de l'ID (peut être un tableau depuis les routes dynamiques Next.js)
    const _id = Array.isArray(id) ? id[0] : id

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error("Invalid monster ID format:", _id)
      return null
    }

    console.log("🔍 getMonsterById - Recherche du monstre:", {_id, fullId: id, ownerId: user.id})

    const monster = await monsterModel.findOne({_id, ownerId: user.id}).exec()

    if (monster == null) {
      return null
    }

    // Initialiser les champs XP s'ils n'existent pas (pour les monstres créés avant le système d'XP)
    if (monster.experience === undefined || monster.experienceToNextLevel === undefined) {
      console.log("⚠️ Initialisation des champs XP manquants")
      monster.experience = monster.experience ?? 0
      monster.experienceToNextLevel = monster.experienceToNextLevel ?? 150
      await monster.save()
    }

    console.log("🔍 getMonsterById - Monstre trouvé:", {
      id: monster._id,
      name: monster.name,
      experience: monster.experience,
      level: monster.level,
      experienceToNextLevel: monster.experienceToNextLevel,
    })

    // Convertir le document Mongoose en objet JavaScript simple
    const monsterObj = monster.toObject()
    return {
      _id: monster._id.toString(),
      id: monster._id.toString(),
      name: monsterObj.name,
      description: monsterObj.description ?? undefined,
      color: monsterObj.color ?? undefined,
      emoji: monsterObj.emoji ?? undefined,
      rarity: monsterObj.rarity ?? undefined,
      draw: monsterObj.draw ?? undefined,
      state: monsterObj.state ?? undefined,
      level: monsterObj.level ?? undefined,
      experience: monsterObj.experience ?? undefined,
      experienceToNextLevel: monsterObj.experienceToNextLevel ?? undefined,
      ownerId: monster.ownerId.toString(),
      isPublic: monsterObj.isPublic ?? false,
      equippedAccessories:
        monster.equippedAccessories != null
          ? {
              hat: monster.equippedAccessories.hat ?? null,
              glasses: monster.equippedAccessories.glasses ?? null,
              shoes: monster.equippedAccessories.shoes ?? null,
              background: monster.equippedAccessories.background ?? null,
            }
          : null,
      createdAt: monsterObj.createdAt?.toISOString(),
      updatedAt: monsterObj.updatedAt?.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching monsters:", error)
    return null
  }
}

/**
 * Supprime un monstre de la base de données
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Vérifie que l'ID est un ObjectId MongoDB valide
 * - Supprime le monstre uniquement s'il appartient à l'utilisateur
 * - Retourne un résultat avec succès/erreur
 *
 * Respecte le principe SRP : Gère uniquement la suppression d'un monstre
 * Respecte le principe DIP : Utilise l'abstraction auth et le modèle Monster
 *
 * @param {string} id - ID du monstre à supprimer
 * @returns {Promise<{ success: boolean; message: string }>} Résultat de la suppression
 *
 * @example
 * ```tsx
 * const result = await deleteMonster('507f1f77bcf86cd799439011')
 * if (result.success) {
 *   toast.success('Monstre supprimé avec succès')
 * }
 * ```
 */
export async function deleteMonster(id: string): Promise<{success: boolean; message: string}> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: "Utilisateur non authentifié",
      }
    }

    const {user} = session

    // Extraction de l'ID (peut être un tableau depuis les routes dynamiques Next.js)
    const _id = Array.isArray(id) ? id[0] : id

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error("Invalid monster ID format:", _id)
      return {
        success: false,
        message: "Format d'ID invalide",
      }
    }

    console.log("🗑️ deleteMonster - Suppression du monstre:", {_id, ownerId: user.id})

    // Supprimer le monstre uniquement s'il appartient à l'utilisateur
    const result = await monsterModel
      .deleteOne({
        _id,
        ownerId: user.id,
      })
      .exec()

    if (result.deletedCount === 0) {
      console.error("❌ Monstre non trouvé ou n'appartient pas à l'utilisateur")
      return {
        success: false,
        message: "Monstre non trouvé ou accès refusé",
      }
    }

    console.log("✅ Monstre supprimé avec succès")
    return {
      success: true,
      message: "Monstre supprimé avec succès",
    }
  } catch (error) {
    console.error("Error deleting monster:", error)
    return {
      success: false,
      message: "Erreur lors de la suppression du monstre",
    }
  }
}

/**
 * Met à jour le nom d'un monstre
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Vérifie que l'ID est un ObjectId MongoDB valide
 * - Met à jour le nom uniquement si le monstre appartient à l'utilisateur
 * - Retourne un résultat avec succès/erreur
 *
 * Respecte le principe SRP : Gère uniquement la mise à jour du nom d'un monstre
 * Respecte le principe DIP : Utilise l'abstraction auth et le modèle Monster
 *
 * @param {string} id - ID du monstre à modifier
 * @param {string} newName - Nouveau nom du monstre
 * @returns {Promise<{ success: boolean; message: string }>} Résultat de la mise à jour
 *
 * @example
 * ```tsx
 * const result = await updateMonsterName('507f1f77bcf86cd799439011', 'Nouveau nom')
 * if (result.success) {
 *   toast.success('Nom mis à jour avec succès')
 * }
 * ```
 */
export async function updateMonsterName(
  id: string,
  newName: string
): Promise<{success: boolean; message: string}> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: "Utilisateur non authentifié",
      }
    }

    const {user} = session

    // Validation du nom
    if (newName.trim() === "") {
      return {
        success: false,
        message: "Le nom ne peut pas être vide",
      }
    }

    if (newName.length > 50) {
      return {
        success: false,
        message: "Le nom ne peut pas dépasser 50 caractères",
      }
    }

    // Extraction de l'ID (peut être un tableau depuis les routes dynamiques Next.js)
    const _id = Array.isArray(id) ? id[0] : id

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error("Invalid monster ID format:", _id)
      return {
        success: false,
        message: "Format d'ID invalide",
      }
    }

    console.log("✏️ updateMonsterName - Mise à jour du nom:", {
      _id,
      ownerId: user.id,
      newName: newName.trim(),
    })

    // Mettre à jour le nom uniquement si le monstre appartient à l'utilisateur
    const result = await monsterModel
      .updateOne(
        {
          _id,
          ownerId: user.id,
        },
        {
          $set: {name: newName.trim()},
        }
      )
      .exec()

    if (result.matchedCount === 0) {
      console.error("❌ Monstre non trouvé ou n'appartient pas à l'utilisateur")
      return {
        success: false,
        message: "Monstre non trouvé ou accès refusé",
      }
    }

    if (result.modifiedCount === 0) {
      console.warn("⚠️ Aucune modification effectuée (nom identique ?)")
      return {
        success: true,
        message: "Aucune modification nécessaire",
      }
    }

    console.log("✅ Nom du monstre mis à jour avec succès")
    return {
      success: true,
      message: "Nom mis à jour avec succès",
    }
  } catch (error) {
    console.error("Error updating monster name:", error)
    return {
      success: false,
      message: "Erreur lors de la mise à jour du nom",
    }
  }
}

/**
 * Applique une action sur un monstre et calcule le gain d'XP
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Applique l'action au monstre
 * - Calcule le gain d'XP avec le service experience-calculator
 * - Met à jour le monstre en base de données
 * - Retourne le résultat avec feedback
 *
 * Respecte le principe SRP : Gère uniquement l'application d'action avec XP
 * Respecte le principe DIP : Utilise le service experience-calculator abstrait
 *
 * @param {string} monsterId - ID du monstre
 * @param {MonsterAction} action - Action à appliquer
 * @returns {Promise<MonsterActionResult>} Résultat de l'action avec XP
 *
 * @example
 * ```tsx
 * const result = await applyMonsterAction('507f1f77bcf86cd799439011', 'feed')
 * if (result.leveledUp) {
 *   toast.success(`Niveau ${result.newLevel} atteint !`)
 * }
 * ```
 */
export async function applyMonsterAction(
  monsterId: string,
  action: MonsterAction
): Promise<MonsterActionResult> {
  console.log("🔧 applyMonsterAction appelée:", {monsterId, action})

  try {
    // Connexion à la base de données Mongoose
    await connectMongooseToDatabase()
    console.log("✅ Base de données connectée")

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (session === null || session === undefined) {
      console.error("❌ Utilisateur non authentifié")
      throw new Error("User not authenticated")
    }

    const {user} = session
    console.log("✅ Utilisateur authentifié:", user.id)

    // Extraction de l'ID (peut être un tableau depuis les routes dynamiques)
    const _id = Array.isArray(monsterId) ? monsterId[0] : monsterId
    console.log("🔑 ID extrait:", {monsterId, _id})

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error("❌ Invalid monster ID format:", _id)
      return {
        success: false,
        xpGained: 0,
        newLevel: 1,
        leveledUp: false,
        levelsGained: 0,
        message: "ID de monstre invalide",
      }
    }

    // Récupération du monstre
    const monster = await monsterModel
      .findOne({
        _id,
        ownerId: user.id,
      })
      .exec()

    if (monster === null) {
      console.error("❌ Monstre non trouvé:", {monsterId, ownerId: user.id})
      return {
        success: false,
        xpGained: 0,
        newLevel: 1,
        leveledUp: false,
        levelsGained: 0,
        message: "Monstre non trouvé",
      }
    }

    console.log("✅ Monstre trouvé:", {
      id: monster._id,
      name: monster.name,
      currentXP: monster.experience,
      currentLevel: monster.level,
    })

    // Initialiser les champs XP s'ils n'existent pas (pour les monstres créés avant le système d'XP)
    if (monster.experience === undefined) {
      console.log("⚠️ Initialisation de experience à 0")
      monster.experience = 0
    }
    if (monster.experienceToNextLevel === undefined) {
      console.log("⚠️ Initialisation de experienceToNextLevel à 150")
      monster.experienceToNextLevel = 150
    }

    // Récupération des valeurs actuelles
    const currentExperience = monster.experience ?? 0
    const currentLevel = monster.level ?? 1

    console.log("📊 Valeurs actuelles:", {currentExperience, currentLevel, action})

    // Calcul du gain d'XP avec le service métier
    const experienceResult = applyExperienceGain(currentExperience, currentLevel, action)

    console.log("🎲 Résultat du calcul XP:", experienceResult)

    // Mise à jour du monstre en base de données
    monster.experience = experienceResult.newExperience
    monster.level = experienceResult.newLevel
    monster.experienceToNextLevel = experienceResult.experienceToNextLevel

    console.log("💾 Sauvegarde du monstre avec nouvelles valeurs:", {
      experience: monster.experience,
      level: monster.level,
      experienceToNextLevel: monster.experienceToNextLevel,
    })

    await monster.save()
    console.log("✅ Monstre sauvegardé avec succès")

    // Tracker les quêtes selon l'action
    if (action === "feed") {
      await trackQuestProgress(QuestType.FEED_MONSTER, 1)
    } else {
      await trackQuestProgress(QuestType.INTERACT_WITH_MONSTERS, 1)
    }

    // Tracker l'évolution si niveau gagné
    if (experienceResult.leveledUp) {
      await trackQuestProgress(QuestType.EVOLVE_MONSTER, experienceResult.levelsGained)
    }

    // Construction du message de feedback
    let message = `+${experienceResult.xpGained} XP !`
    if (experienceResult.leveledUp) {
      if (experienceResult.levelsGained > 1) {
        message = `🎉 Niveau ${experienceResult.newLevel} atteint ! (+${experienceResult.levelsGained} niveaux)`
      } else {
        message = `🎉 Niveau ${experienceResult.newLevel} atteint !`
      }
    }

    return {
      success: true,
      xpGained: experienceResult.xpGained,
      newLevel: experienceResult.newLevel,
      leveledUp: experienceResult.leveledUp,
      levelsGained: experienceResult.levelsGained,
      message,
    }
  } catch (error) {
    console.error("Error applying monster action:", error)
    return {
      success: false,
      xpGained: 0,
      newLevel: 1,
      leveledUp: false,
      levelsGained: 0,
      message: "Erreur lors de l'application de l'action",
    }
  }
}
