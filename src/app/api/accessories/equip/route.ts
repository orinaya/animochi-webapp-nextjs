/**
 * Route API pour équiper un accessoire sur un monstre
 *
 * POST /api/accessories/equip
 * Body: { monsterId: string, accessoryId: string, category: 'hat' | 'glasses' | 'shoes' }
 *
 * Respecte le principe SRP : Gère uniquement l'équipement d'accessoires
 * Respecte le principe DIP : Utilise les abstractions Mongoose
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import AccessoryInventory from '@/db/models/accessory-inventory.model'

/**
 * POST - Équipe un accessoire sur un monstre
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
    const { monsterId, accessoryName, category } = body

    // Validation des données
    if (monsterId == null || accessoryName == null || category == null) {
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

    // Vérifier que l'utilisateur possède l'accessoire
    const ownedAccessory = await AccessoryInventory.findOne({
      ownerId: session.user.id,
      accessoryName
    })

    if (ownedAccessory == null) {
      return NextResponse.json({ error: 'Accessoire non possédé' }, { status: 403 })
    }

    // Équiper l'accessoire
    const updateField =
      category === 'hat'
        ? 'equippedAccessories.hat'
        : category === 'glasses'
          ? 'equippedAccessories.glasses'
          : 'equippedAccessories.shoes'

    console.log('🎩 Équipement accessoire:', {
      monsterId,
      accessoryName,
      category,
      updateField,
      userId: session.user.id
    })

    const updatedMonster = await Monster.findByIdAndUpdate(
      monsterId,
      { $set: { [updateField]: accessoryName } },
      { new: true }
    )

    console.log('✅ Monstre mis à jour:', {
      monsterId,
      equippedAccessories: updatedMonster?.equippedAccessories
    })

    return NextResponse.json({
      success: true,
      message: 'Accessoire équipé avec succès',
      equippedAccessories: updatedMonster?.equippedAccessories
    })
  } catch (error) {
    console.error("Erreur lors de l'équipement de l'accessoire:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
