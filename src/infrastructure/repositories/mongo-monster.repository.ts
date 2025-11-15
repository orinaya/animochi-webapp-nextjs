/**
 * Infrastructure: MongoMonsterRepository
 *
 * Implémentation MongoDB pour les opérations sur les monstres
 */

import { connectMongooseToDatabase } from '@/db'
import MonsterModel from '@/db/models/monster.model'
// import { Monster } from '@/domain/entities/monster'
import type { MonsterRepository } from '@/domain/usecases/handle-payment-success.usecase'
import type { Monster } from '@/types'

/**
 * Repository pour gérer les monstres
 */
export class MongoMonsterRepository implements MonsterRepository {
  /**
   * Ajoute de l'XP à un monstre et gère le level up
   */
  async addXp (monsterId: string, amount: number): Promise<void> {
    await connectMongooseToDatabase()

    const monster = await MonsterModel.findById(monsterId)

    if (monster === null || monster === undefined) {
      throw new Error(`Monster not found: ${monsterId}`)
    }

    // Ajouter l'XP
    let xp = Number(monster.experience ?? 0) + Number(amount)
    let level = Number(monster.level ?? 1)
    let xpToNext = Number(monster.experienceToNextLevel ?? 150)
    const BASE_XP = 100
    const GROWTH_FACTOR = 1.5

    // Boucle de level-up : tant que l'XP suffit, on passe de niveau
    while (xp >= xpToNext) {
      xp -= xpToNext
      level += 1
      xpToNext = Math.floor(BASE_XP * level * GROWTH_FACTOR)
    }
    // Correction : ne jamais dépasser le seuil du niveau courant
    if (xp >= xpToNext) {
      xp = xpToNext - 1
    }

    monster.experience = xp
    monster.level = level
    monster.experienceToNextLevel = xpToNext
    monster.markModified('experience')
    monster.markModified('level')
    monster.markModified('experienceToNextLevel')

    await monster.save()
  }

  /**
   * Récupère un monstre par son ID
   */
  async findById (monsterId: string): Promise<Monster | null> {
    await connectMongooseToDatabase()

    return await MonsterModel.findById(monsterId)
  }

  /**
   * Vérifie qu'un monstre appartient à un utilisateur
   */
  async isOwnedBy (monsterId: string, userId: string): Promise<boolean> {
    await connectMongooseToDatabase()

    const monster = await MonsterModel.findOne({ _id: monsterId, ownerId: userId })
    return monster !== null && monster !== undefined
  }
}
