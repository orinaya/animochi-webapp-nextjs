/**
 * Infrastructure: MongoMonsterRepository
 *
 * Implémentation MongoDB pour les opérations sur les monstres
 */

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import type { MonsterRepository } from '@/domain/usecases/handle-payment-success.usecase'

/**
 * Repository pour gérer les monstres
 */
export class MongoMonsterRepository implements MonsterRepository {
  /**
   * Ajoute de l'XP à un monstre et gère le level up
   */
  async addXp (monsterId: string, amount: number): Promise<void> {
    await connectMongooseToDatabase()

    const monster = await Monster.findById(monsterId)

    if (monster === null || monster === undefined) {
      throw new Error(`Monster not found: ${monsterId}`)
    }

    // Ajouter l'XP
    const currentXp = Number(monster.experience ?? 0)
    const newXp = currentXp + Number(amount)

    monster.experience = newXp
    monster.markModified('experience')

    // Vérifier si level up
    const xpNeeded = Number(monster.experienceToNextLevel ?? 150)

    if (newXp >= xpNeeded) {
      // Level up!
      const currentLevel = Number(monster.level ?? 1)
      monster.level = currentLevel + 1
      monster.markModified('level')

      // Recalculer l'XP pour le prochain niveau
      // Formule: BASE_XP * level * GROWTH_FACTOR
      const BASE_XP = 100
      const GROWTH_FACTOR = 1.5
      monster.experienceToNextLevel = Math.floor(BASE_XP * monster.level * GROWTH_FACTOR)
      monster.markModified('experienceToNextLevel')

      // Réinitialiser l'XP (ou garder le surplus)
      monster.experience = Math.max(0, newXp - xpNeeded)
      monster.markModified('experience')
    }

    await monster.save()
  }

  /**
   * Récupère un monstre par son ID
   */
  async findById (monsterId: string): Promise<any | null> {
    await connectMongooseToDatabase()

    return await Monster.findById(monsterId)
  }

  /**
   * Vérifie qu'un monstre appartient à un utilisateur
   */
  async isOwnedBy (monsterId: string, userId: string): Promise<boolean> {
    await connectMongooseToDatabase()

    const monster = await Monster.findOne({ _id: monsterId, ownerId: userId })
    return monster !== null && monster !== undefined
  }
}
