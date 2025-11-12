/**
 * API Route - POST /api/accessories/purchase
 * Permet d'acheter un accessoire avec des Animoneys
 * Principe SRP : Gère uniquement l'achat d'accessoires
 * Clean Architecture : Couche présentation qui délègue au domaine
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { connectMongooseToDatabase } from '@/db'
import AccessoryInventory from '@/db/models/accessory-inventory.model'
import WalletModel from '@/db/models/wallet.model'
import TransactionModel from '@/db/models/transaction.model'
import { getAccessoryByName } from '@/data/accessories-catalog'

interface PurchaseRequest {
  accessoryName: string
}

export async function POST (request: Request): Promise<NextResponse> {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id == null) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const userId = session.user.id

    // Parser le body
    const body = (await request.json()) as PurchaseRequest
    const { accessoryName } = body

    if (accessoryName == null || accessoryName === '') {
      return NextResponse.json({ error: "Nom de l'accessoire requis" }, { status: 400 })
    }

    // Récupérer l'accessoire depuis le catalogue
    const accessoryData = getAccessoryByName(accessoryName)

    if (accessoryData == null) {
      return NextResponse.json({ error: 'Accessoire introuvable' }, { status: 404 })
    }

    await connectMongooseToDatabase()

    // Vérifier si l'utilisateur possède déjà cet accessoire
    const existingAccessory = await AccessoryInventory.findOne({
      ownerId: userId,
      accessoryName
    })

    if (existingAccessory != null) {
      return NextResponse.json({ error: 'Vous possédez déjà cet accessoire' }, { status: 409 })
    }

    // Récupérer le wallet de l'utilisateur
    const wallet = await WalletModel.findOne({ ownerId: userId })

    if (wallet == null) {
      return NextResponse.json({ error: 'Wallet introuvable' }, { status: 404 })
    }

    const currentBalance = Number(wallet.balance)

    // Vérifier que l'utilisateur a assez d'Animoneys
    if (currentBalance < accessoryData.price) {
      return NextResponse.json(
        {
          error: 'Solde insuffisant',
          required: accessoryData.price,
          current: currentBalance
        },
        { status: 400 }
      )
    }

    // Débiter le wallet
    const newBalance = currentBalance - accessoryData.price
    wallet.balance = newBalance
    await wallet.save()

    // Créer une transaction
    await TransactionModel.create({
      walletId: wallet._id,
      amount: accessoryData.price,
      type: 'DEBIT',
      reason: 'PURCHASE',
      metadata: {
        accessoryName,
        accessoryCategory: accessoryData.category,
        accessoryRarity: accessoryData.rarity
      }
    })

    // Ajouter l'accessoire à l'inventaire
    const ownedAccessory = await AccessoryInventory.create({
      accessoryName,
      ownerId: userId,
      purchasedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: `${accessoryData.emoji} ${accessoryName} acheté avec succès !`,
      newBalance,
      ownedAccessory: ownedAccessory.toJSON(),
      accessoryDetails: accessoryData
    })
  } catch (error) {
    console.error("Erreur lors de l'achat de l'accessoire:", error)
    return NextResponse.json({ error: "Erreur serveur lors de l'achat" }, { status: 500 })
  }
}
