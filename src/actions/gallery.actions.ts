'use server'

import { connectMongooseToDatabase } from '@/db'
import monsterModel from '@/db/models/monster.model'
import userModel from '@/db/models/user.model'
import { auth } from '@/lib/auth/auth'
import type { GalleryFilters, GalleryResult, MonsterWithOwner } from '@/types/gallery'
import { Types } from 'mongoose'
import { headers } from 'next/headers'
import { trackQuestProgress } from '@/actions/quests.actions'
import { QuestType } from '@/domain/entities/quest.entity'

/**
 * Récupère tous les monstres publics pour la galerie communautaire
 *
 * Server Action qui :
 * - Ne nécessite pas d'authentification (galerie publique)
 * - Récupère uniquement les monstres avec isPublic: true
 * - Applique les filtres (niveau, état, tri)
 * - Retourne les résultats paginés avec informations du propriétaire
 *
 * Respecte le principe SRP : Gère uniquement la récupération des monstres publics
 * Respecte le principe OCP : Extensible via les filtres sans modifier la fonction
 *
 * @param {GalleryFilters} filters - Filtres à appliquer
 * @returns {Promise<GalleryResult>} Résultat paginé avec monstres publics
 *
 * @example
 * ```tsx
 * const result = await getPublicMonsters({
 *   minLevel: 5,
 *   state: 'happy',
 *   sortBy: 'newest',
 *   page: 1,
 *   limit: 12
 * })
 * ```
 */
export async function getPublicMonsters (filters: GalleryFilters = {}): Promise<GalleryResult> {
  try {
    await connectMongooseToDatabase()

    const { minLevel, maxLevel, state, sortBy = 'newest', limit = 12, page = 1 } = filters

    // Construction de la requête MongoDB
    const query: any = { isPublic: true }

    // Filtres de niveau
    if (minLevel !== undefined || maxLevel !== undefined) {
      query.level = {}
      if (minLevel !== undefined) query.level.$gte = minLevel
      if (maxLevel !== undefined) query.level.$lte = maxLevel
    }

    // Filtre d'état
    if (state !== undefined && state !== 'all') {
      query.state = state
    }

    // Définir le tri
    let sort: any = {}
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 }
        break
      case 'oldest':
        sort = { createdAt: 1 }
        break
      case 'level-asc':
        sort = { level: 1 }
        break
      case 'level-desc':
        sort = { level: -1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit

    // Requête avec pagination
    const [monstersData, total] = await Promise.all([
      monsterModel.find(query).sort(sort).skip(skip).limit(limit).lean().exec(),
      monsterModel.countDocuments(query)
    ])

    // Récupérer les informations des propriétaires
    const ownerIds = monstersData.map((m: any) => m.ownerId)
    const owners = await userModel
      .find({ _id: { $in: ownerIds } })
      .lean()
      .exec()

    // Créer un map pour accès rapide aux propriétaires
    const ownersMap = new Map(owners.map((owner: any) => [owner._id.toString(), owner]))

    // Mapper les monstres avec les informations du propriétaire
    const monsters: MonsterWithOwner[] = monstersData.map((monster: any) => {
      const owner = ownersMap.get(monster.ownerId.toString())

      return {
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
                background: monster.equippedAccessories.background?.toString() ?? null
              }
            : undefined,
        createdAt: monster.createdAt?.toISOString(),
        updatedAt: monster.updatedAt?.toISOString(),
        owner:
          owner != null
            ? {
                _id: owner._id.toString(),
                name: owner.pseudo ?? owner.username ?? owner.name ?? 'Animochi',
                avatarUrl: owner.avatarUrl ?? undefined
              }
            : undefined
      }
    })

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(total / limit)

    return {
      monsters,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  } catch (error) {
    console.error('Error fetching public monsters:', error)
    return {
      monsters: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false
    }
  }
}

/**
 * Active ou désactive le mode public d'un monstre
 *
 * Server Action qui :
 * - Vérifie l'authentification
 * - Vérifie que le monstre appartient à l'utilisateur
 * - Met à jour le champ isPublic
 * - Respecte la vie privée de l'utilisateur
 *
 * Respecte le principe SRP : Gère uniquement la modification de visibilité
 *
 * @param {string} monsterId - ID du monstre à modifier
 * @param {boolean} isPublic - Nouvelle valeur de visibilité
 * @returns {Promise<{ success: boolean; message: string }>}
 *
 * @example
 * ```tsx
 * await toggleMonsterVisibility('507f1f77bcf86cd799439011', true)
 * ```
 */
export async function toggleMonsterVisibility (
  monsterId: string,
  isPublic: boolean
): Promise<{ success: boolean, message: string }> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        message: 'Vous devez être authentifié pour modifier la visibilité'
      }
    }

    const { user } = session

    // Validation du format ObjectId
    if (!Types.ObjectId.isValid(monsterId)) {
      return {
        success: false,
        message: 'ID de monstre invalide'
      }
    }

    // Vérifier que le monstre appartient à l'utilisateur
    const monster = await monsterModel.findOne({
      _id: monsterId,
      ownerId: user.id
    })

    if (monster == null) {
      return {
        success: false,
        message: "Monstre non trouvé ou vous n'êtes pas le propriétaire"
      }
    }

    // Mettre à jour la visibilité
    monster.isPublic = isPublic
    await monster.save()

    // Tracker la quête si le monstre devient public
    if (isPublic) {
      await trackQuestProgress(QuestType.MAKE_MONSTER_PUBLIC, 1)
    }

    return {
      success: true,
      message: isPublic ? 'Monstre rendu public !' : 'Monstre rendu privé !'
    }
  } catch (error) {
    console.error('Error toggling monster visibility:', error)
    return {
      success: false,
      message: 'Erreur lors de la modification de la visibilité'
    }
  }
}
