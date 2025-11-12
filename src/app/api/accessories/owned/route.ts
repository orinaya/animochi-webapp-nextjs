/**
 * API Route - GET /api/accessories/owned
 * Récupère les accessoires possédés par l'utilisateur
 * Principe SRP : Gère uniquement la récupération de l'inventaire
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { connectMongooseToDatabase } from '@/db'
import AccessoryInventory from '@/db/models/accessory-inventory.model'
import { getAccessoryByName } from '@/data/accessories-catalog'

export async function GET (): Promise<NextResponse> {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const userId = session.user.id

    await connectMongooseToDatabase()

    // Récupérer tous les accessoires possédés par l'utilisateur
    const ownedAccessories = await AccessoryInventory.find({
      ownerId: userId
    }).sort({ purchasedAt: -1 })

    // Enrichir avec les détails du catalogue
    const accessoriesWithDetails = ownedAccessories.map((owned) => {
      const details = getAccessoryByName(owned.accessoryName)
      return {
        ...owned.toJSON(),
        details
      }
    })

    return NextResponse.json({
      success: true,
      accessories: accessoriesWithDetails,
      count: accessoriesWithDetails.length
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des accessoires:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
