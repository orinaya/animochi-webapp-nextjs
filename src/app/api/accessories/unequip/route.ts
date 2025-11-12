/**
 * Route API pour retirer un accessoire d'un monstre
 *
 * POST /api/accessories/unequip
 * Body: { monsterId: string, category: 'hat' | 'glasses' | 'shoes' }
 *
 * Respecte le principe SRP : Gère uniquement le retrait d'accessoires
 * Respecte le principe DIP : Utilise les abstractions Mongoose
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'

/**
 * POST - Retire un accessoire d'un monstre
 */
export async function POST (request: Request): Promise<NextResponse> {
  try {
    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupération des données
    const body = await request.json()
    const { monsterId, category } = body

    // Validation des données
    if (monsterId == null || category == null) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Validation de la catégorie
    const validCategories = ['hat', 'glasses', 'shoes'] as const
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }

    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérifier que le monstre appartient à l'utilisateur
    const monster = await Monster.findById(monsterId)
    if (monster == null) {
      return NextResponse.json({ error: 'Monstre non trouvé' }, { status: 404 })
    }

    if (monster.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Retirer l'accessoire
    const updateField =
      category === 'hat'
        ? 'equippedAccessories.hat'
        : category === 'glasses'
          ? 'equippedAccessories.glasses'
          : 'equippedAccessories.shoes'

    await Monster.findByIdAndUpdate(monsterId, { $set: { [updateField]: null } }, { new: true })

    return NextResponse.json({
      success: true,
      message: 'Accessoire retiré avec succès'
    })
  } catch (error) {
    console.error("Erreur lors du retrait de l'accessoire:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
