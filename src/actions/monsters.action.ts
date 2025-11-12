'use server'

import { connectMongooseToDatabase } from '@/db'
import MonsterModel from '@/db/models/monster.model'
import { auth } from '@/lib/auth/auth'
import { Monster } from '@/types'
import { Types } from 'mongoose'
import { headers } from 'next/headers'

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
export async function createMonster (monsterData: Monster): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) throw new Error('User not authenticated')

  console.log('Session utilisateur:', session)
  console.log('Données du monstre:', monsterData)

  // Créer le monstre avec les valeurs par défaut nécessaires
  const monster = new MonsterModel({
    name: monsterData.name,
    description: monsterData.description,
    color: monsterData.color,
    emoji: monsterData.emoji,
    rarity: monsterData.rarity,
    draw: monsterData.draw ?? 'placeholder',
    state: monsterData.state ?? 'happy',
    level: monsterData.level ?? 1,
    experience: monsterData.experience ?? 0,
    experienceToNextLevel: monsterData.experienceToNextLevel ?? 150,
    ownerId: new Types.ObjectId(session.user.id),
    equippedAccessories: monsterData.equippedAccessories ?? {
      hat: null,
      glasses: null,
      shoes: null
    },
    equippedBackground: monsterData.equippedBackground ?? null
  })

  console.log('Monstre avant sauvegarde:', monster)
  const savedMonster = await monster.save()
  console.log('Monstre sauvegardé:', savedMonster)
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
export async function getMonsters (): Promise<Monster[]> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')

    const { user } = session

    // Utiliser .lean() pour obtenir des objets JavaScript simples au lieu de documents Mongoose
    const monstersData = await MonsterModel.find({ ownerId: user.id }).lean().exec()

    // Convertir les _id MongoDB en strings et structurer les données pour le client
    return monstersData.map((monster: any) => ({
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
      equippedAccessories:
        monster.equippedAccessories != null
          ? {
              hat: monster.equippedAccessories.hat?.toString() ?? null,
              glasses: monster.equippedAccessories.glasses?.toString() ?? null,
              shoes: monster.equippedAccessories.shoes?.toString() ?? null
            }
          : null,
      equippedBackground: monster.equippedBackground?.toString() ?? null,
      createdAt: monster.createdAt?.toISOString(),
      updatedAt: monster.updatedAt?.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching monsters:', error)
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
export async function getMonsterById (id: string): Promise<Monster | null> {
  try {
    await connectMongooseToDatabase()
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')
    const { user } = session

    // Extraction de l'ID (peut être un tableau depuis les routes dynamiques Next.js)
    const _id = Array.isArray(id) ? id[0] : id

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format:', _id)
      return null
    }

    console.log('🔍 getMonsterById - Recherche du monstre:', { _id, fullId: id, ownerId: user.id })

    const monster = await MonsterModel.findOne({ _id, ownerId: user.id }).exec()

    if (monster == null) {
      return null
    }

    // Initialiser les champs XP s'ils n'existent pas (pour les monstres créés avant le système d'XP)
    if (monster.experience === undefined || monster.experienceToNextLevel === undefined) {
      console.log('⚠️ Initialisation des champs XP manquants')
      monster.experience = monster.experience ?? 0
      monster.experienceToNextLevel = monster.experienceToNextLevel ?? 150
      await monster.save()
    }

    console.log('🔍 getMonsterById - Monstre trouvé:', {
      id: monster._id,
      name: monster.name,
      experience: monster.experience,
      level: monster.level,
      experienceToNextLevel: monster.experienceToNextLevel
    })

    // Convertir le document Mongoose en objet JavaScript simple
    const monsterObj = monster.toObject()
    return {
      _id: monster._id.toString(),
      id: monster._id.toString(),
      name: monsterObj.name,
      description: monsterObj.description,
      color: monsterObj.color,
      emoji: monsterObj.emoji,
      rarity: monsterObj.rarity,
      draw: monsterObj.draw,
      state: monsterObj.state,
      level: monsterObj.level,
      experience: monsterObj.experience,
      experienceToNextLevel: monsterObj.experienceToNextLevel,
      ownerId: monster.ownerId.toString(),
      equippedAccessories:
        monster.equippedAccessories != null
          ? {
              hat: monster.equippedAccessories.hat?.toString() ?? null,
              glasses: monster.equippedAccessories.glasses?.toString() ?? null,
              shoes: monster.equippedAccessories.shoes?.toString() ?? null
            }
          : null,
      equippedBackground: monster.equippedBackground?.toString() ?? null,
      createdAt: monsterObj.createdAt?.toISOString(),
      updatedAt: monsterObj.updatedAt?.toISOString()
    }
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return null
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
// export async function applyMonsterAction (
//   monsterId: string,
//   action: MonsterAction
// ): Promise<MonsterActionResult> {
//   console.log('🔧 applyMonsterAction appelée:', { monsterId, action })

//   try {
//     // Connexion à la base de données Mongoose
//     await connectMongooseToDatabase()
//     console.log('✅ Base de données connectée')

//     // Vérification de l'authentification
//     const session = await auth.api.getSession({
//       headers: await headers()
//     })
//     if (session === null || session === undefined) {
//       console.error('❌ Utilisateur non authentifié')
//       throw new Error('User not authenticated')
//     }

//     const { user } = session
//     console.log('✅ Utilisateur authentifié:', user.id)

//     // Extraction de l'ID (peut être un tableau depuis les routes dynamiques)
//     const _id = Array.isArray(monsterId) ? monsterId[0] : monsterId
//     console.log('🔑 ID extrait:', { monsterId, _id })

//     // Validation du format ObjectId MongoDB
//     if (!Types.ObjectId.isValid(_id)) {
//       console.error('❌ Invalid monster ID format:', _id)
//       return {
//         success: false,
//         xpGained: 0,
//         newLevel: 1,
//         leveledUp: false,
//         levelsGained: 0,
//         message: 'ID de monstre invalide',
//       }
//     }

//     // Récupération du monstre
//     const monster = await MonsterModel.findOne({
//       _id,
//       ownerId: user.id
//     }).exec()

//     if (monster === null) {
//       console.error('❌ Monstre non trouvé:', { monsterId, ownerId: user.id })
//       return {
//         success: false,
//         xpGained: 0,
//         newLevel: 1,
//         leveledUp: false,
//         levelsGained: 0,
//         message: 'Monstre non trouvé',
//       }
//     }

//     console.log('✅ Monstre trouvé:', {
//       id: monster._id,
//       name: monster.name,
//       currentXP: monster.experience,
//       currentLevel: monster.level
//     })

//     // Initialiser les champs XP s'ils n'existent pas (pour les monstres créés avant le système d'XP)
//     if (monster.experience === undefined) {
//       console.log('⚠️ Initialisation de experience à 0')
//       monster.experience = 0
//     }
//     if (monster.experienceToNextLevel === undefined) {
//       console.log('⚠️ Initialisation de experienceToNextLevel à 150')
//       monster.experienceToNextLevel = 150
//     }

//     // Récupération des valeurs actuelles
//     const currentExperience = monster.experience ?? 0
//     const currentLevel = monster.level ?? 1

//     console.log('📊 Valeurs actuelles:', { currentExperience, currentLevel, action })

//     // Calcul du gain d'XP avec le service métier
//     // const experienceResult = applyExperienceGain(
//     //   currentExperience,
//     //   currentLevel,
//     //   action as ExperienceMonsterAction
//     // )

//     console.log('🎲 Résultat du calcul XP:', experienceResult)

//     // Mise à jour du monstre en base de données
//     monster.experience = experienceResult.newExperience
//     monster.level = experienceResult.newLevel
//     monster.experienceToNextLevel = experienceResult.experienceToNextLevel

//     console.log('💾 Sauvegarde du monstre avec nouvelles valeurs:', {
//       experience: monster.experience,
//       level: monster.level,
//       experienceToNextLevel: monster.experienceToNextLevel
//     })

//     await monster.save()
//     console.log('✅ Monstre sauvegardé avec succès')

//     // Construction du message de feedback
//     let message = `+${String(experienceResult.xpGained)} XP !`
//     if (experienceResult.leveledUp === true) {
//       if (experienceResult.levelsGained > 1) {
//         message = `🎉 Niveau ${String(experienceResult.newLevel)} atteint ! (+${String(
//           experienceResult.levelsGained
//         )} niveaux)`
//       } else {
//         message = `🎉 Niveau ${String(experienceResult.newLevel)} atteint !`
//       }
//     }

//     return {
//       success: true,
//       xpGained: experienceResult.xpGained,
//       newLevel: experienceResult.newLevel,
//       leveledUp: experienceResult.leveledUp,
//       levelsGained: experienceResult.levelsGained,
//       message
//     }
//   } catch (error) {
//     console.error('Error applying monster action:', error)
//     return {
//       success: false,
//       xpGained: 0,
//       newLevel: 1,
//       leveledUp: false,
//       levelsGained: 0,
//       message: "Erreur lors de l'application de l'action"
//     }
//   }
// }
