'use server'

import { getBoostById } from '@/config/shop.config'
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { CreateCheckoutSessionUseCase } from '@/domain/usecases/create-checkout-session.usecase'
import { StripePaymentRepository } from '@/infrastructure/repositories/stripe-payment.repository'
import { MongoPurchaseRepository } from '@/infrastructure/repositories/mongo-purchase.repository'
import { MongoWalletRepository } from '@/infrastructure/repositories/mongo-wallet.repository'
import { MongoMonsterRepository } from '@/infrastructure/repositories/mongo-monster.repository'
import { trackQuestProgress } from './quests.actions'
import { QuestType } from '@/domain/entities/quest.entity'

/**
 * Achète un boost XP avec des Animoneys (monnaie virtuelle)
 * Flow: Animoneys → XP direct
 */
export async function buyXpBoost (creatureId: string, boostId: string): Promise<void> {
  console.log(`Achat du boost ${boostId} pour la créature ${creatureId}`)
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }
  const { user } = session

  await connectMongooseToDatabase()

  const monster = await Monster.findOne({ _id: creatureId, ownerId: user.id })

  if (monster === null || monster === undefined) {
    throw new Error('Monster not found')
  }

  const boost = getBoostById(boostId)

  if (boost === undefined || boost === null) {
    throw new Error('Boost not found')
  }

  // Utiliser le repository pour déduire les Animoneys
  const walletRepo = new MongoWalletRepository()
  await walletRepo.deductBalance(user.id, boost.price)

  // Utiliser le repository pour ajouter l'XP
  const monsterRepo = new MongoMonsterRepository()
  await monsterRepo.addXp(creatureId, boost.xpAmount)

  // Tracker la progression de quête
  await trackQuestProgress(QuestType.BUY_ACCESSORY, 1)

  revalidatePath(`/monster/${creatureId}`)
  revalidatePath('/wallet')
}

/**
 * Crée une session de checkout Stripe pour acheter des Animoneys
 * Flow: Argent réel → Animoneys → XP plus tard
 */
export async function createAnimoneysCheckoutSession (
  amount: number
): Promise<{ url: string, sessionId: string } | { error: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return { error: 'User not authenticated' }
    }

    const { user } = session

    // Récupérer la configuration du package depuis pricing.ts
    const { pricingTable } = await import('@/config/pricing.config')
    const packageConfig = pricingTable[amount]

    if (packageConfig === undefined) {
      return { error: 'Invalid package amount' }
    }

    // Initialiser les repositories
    const paymentRepo = new StripePaymentRepository()
    const purchaseRepo = new MongoPurchaseRepository()

    // Créer le use case
    const useCase = new CreateCheckoutSessionUseCase(paymentRepo, purchaseRepo)

    // Construire l'URL de base
    const headersList = await headers()
    const host = headersList.get('host') ?? 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`

    // Exécuter le use case
    const result = await useCase.execute({
      userId: user.id,
      userEmail: user.email,
      purchaseType: 'animoneys-package',
      itemId: `animoneys-${amount}`,
      amount: Math.round(packageConfig.price * 100), // Convertir en centimes
      currency: 'eur',
      productDescription: `${amount} Animoneys (Ⱥ)`,
      baseUrl,
      metadata: {
        animoneysAmount: amount,
        packagePrice: packageConfig.price
      }
    })

    if (!result.ok) {
      console.error('Error from use case:', result.error)
      return { error: result.error }
    }

    return {
      url: result.value.url,
      sessionId: result.value.sessionId
    }
  } catch (error) {
    console.error('Error in createAnimoneysCheckoutSession:', error)
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Crée une session de checkout Stripe pour acheter un boost XP directement
 * Flow alternatif: Argent réel → XP direct (sans passer par Animoneys)
 */
export async function createXpBoostCheckoutSession (
  creatureId: string,
  boostId: string
): Promise<{ url: string, sessionId: string } | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    return { error: 'User not authenticated' }
  }

  const { user } = session

  // Vérifier que le monstre appartient à l'utilisateur
  const monsterRepo = new MongoMonsterRepository()
  const isOwner = await monsterRepo.isOwnedBy(creatureId, user.id)

  if (!isOwner) {
    return { error: 'Monster not found or not owned by user' }
  }

  // Récupérer le boost
  const boost = getBoostById(boostId)

  if (boost === undefined) {
    return { error: 'Boost not found' }
  }

  // Initialiser les repositories
  const paymentRepo = new StripePaymentRepository()
  const purchaseRepo = new MongoPurchaseRepository()

  // Créer le use case
  const useCase = new CreateCheckoutSessionUseCase(paymentRepo, purchaseRepo)

  // Construire l'URL de base
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  // Prix en euros pour le boost (exemple: 10 Koins = 1€)
  const priceInEuros = boost.price * 0.1 // 1 Koin = 0.10€

  // Exécuter le use case
  const result = await useCase.execute({
    userId: user.id,
    userEmail: user.email,
    purchaseType: 'xp-boost',
    itemId: boostId,
    amount: Math.round(priceInEuros * 100), // Convertir en centimes
    currency: 'eur',
    productDescription: `${boost.name} - ${boost.xpAmount} XP`,
    targetMonsterId: creatureId,
    baseUrl,
    metadata: {
      xpAmount: boost.xpAmount,
      boostName: boost.name
    }
  })

  if (!result.ok) {
    return { error: result.error }
  }

  return {
    url: result.value.url,
    sessionId: result.value.sessionId
  }
}
