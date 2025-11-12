import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { StripePaymentRepository } from '@/infrastructure/repositories/stripe-payment.repository'
import { MongoPurchaseRepository } from '@/infrastructure/repositories/mongo-purchase.repository'
import { MongoWalletRepository } from '@/infrastructure/repositories/mongo-wallet.repository'
import { MongoMonsterRepository } from '@/infrastructure/repositories/mongo-monster.repository'
import { HandlePaymentSuccessUseCase } from '@/domain/usecases/handle-payment-success.usecase'

export const runtime = 'nodejs'

/**
 * Webhook Stripe pour gérer les événements de paiement
 *
 * Principe SRP: Ce endpoint gère uniquement la réception et validation des webhooks
 * La logique métier est déléguée aux use cases
 */
export async function POST (req: Request): Promise<Response> {
  try {
    console.log('[WEBHOOK] POST /api/webhook/stripe called')

    // 1. Récupérer la signature et le payload
    const sig = (await headers()).get('stripe-signature')
    const payload = await req.text()

    console.log('[WEBHOOK] Signature present:', sig !== null && sig !== undefined)

    if (sig === null || sig === undefined) {
      console.error('[WEBHOOK] Missing stripe-signature header')
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    // 2. Initialiser le repository Stripe
    const stripeRepo = new StripePaymentRepository()

    // 3. Construire et vérifier l'événement
    console.log('[WEBHOOK] Verifying webhook signature...')
    const event = await stripeRepo.constructWebhookEvent(payload, sig)

    if (event === null) {
      console.error('[WEBHOOK] Invalid webhook signature')
      return new Response('Invalid webhook signature', { status: 400 })
    }

    console.log('[WEBHOOK] Event type:', event.type)

    // 4. Traiter l'événement selon son type
    await handleWebhookEvent(event)

    return new Response('ok', { status: 200 })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('[WEBHOOK] Error:', errorMessage)
    return new Response(`Webhook Error: ${errorMessage}`, { status: 500 })
  }
}

/**
 * Traite un événement webhook selon son type
 */
async function handleWebhookEvent (event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      await handleCheckoutSessionCompleted(event)
      break
    }

    case 'payment_intent.succeeded': {
      console.log('[WEBHOOK] Payment intent succeeded:', event.data.object.id)
      break
    }

    case 'payment_intent.payment_failed': {
      await handlePaymentFailed(event)
      break
    }

    case 'charge.refunded': {
      await handleChargeRefunded(event)
      break
    }

    default:
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
  }
}

/**
 * Gère un checkout complété avec succès
 */
async function handleCheckoutSessionCompleted (event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session

  console.log('[WEBHOOK] Checkout session completed:', session.id)
  console.log('[WEBHOOK] Metadata:', session.metadata)

  // Extraire les données du paiement
  const userId = session.metadata?.userId
  const purchaseId = session.metadata?.purchaseId

  console.log('[WEBHOOK] Extracted data:', { userId, purchaseId })

  if (userId === undefined || userId === null) {
    console.error('[WEBHOOK] Missing userId in session metadata')
    return
  }

  // Mettre à jour la session Stripe dans l'achat
  if (purchaseId !== undefined && purchaseId !== null) {
    const purchaseRepo = new MongoPurchaseRepository()
    console.log('[WEBHOOK] Updating purchase with sessionId')
    await purchaseRepo.updateStripeSession(purchaseId, session.id, session.amount_total ?? 0)
  }

  // Initialiser les repositories
  const purchaseRepo = new MongoPurchaseRepository()
  const walletRepo = new MongoWalletRepository()
  const monsterRepo = new MongoMonsterRepository()

  console.log('[WEBHOOK] Repositories initialized, executing use case')

  // Créer et exécuter le use case
  const useCase = new HandlePaymentSuccessUseCase(purchaseRepo, walletRepo, monsterRepo)

  const result = await useCase.execute({
    sessionId: session.id,
    userId,
    purchaseId,
    metadata: session.metadata ?? {}
  })

  if (!result.ok) {
    console.error('[WEBHOOK] Error handling payment success:', result.error)
    throw new Error(result.error)
  }

  console.log('[WEBHOOK] Payment processed successfully ✅')
}

/**
 * Gère un paiement échoué
 */
async function handlePaymentFailed (event: Stripe.Event): Promise<void> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  console.log('[WEBHOOK] Payment failed:', paymentIntent.id)

  const purchaseRepo = new MongoPurchaseRepository()
  const purchase = await purchaseRepo.findByStripeSessionId(paymentIntent.id)

  if (purchase !== null && purchase !== undefined) {
    await purchaseRepo.updatePaymentStatus(purchase.id, 'failed')
    console.log('[WEBHOOK] Purchase marked as failed:', purchase.id)
  }
}

/**
 * Gère un remboursement
 */
async function handleChargeRefunded (event: Stripe.Event): Promise<void> {
  const charge = event.data.object as Stripe.Charge

  console.log('[WEBHOOK] Charge refunded:', charge.id)
  console.warn('[WEBHOOK] Refund handling not fully implemented')

  // TODO: Implémenter la logique de remboursement
  // - Retirer les Animoneys du wallet
  // - Retirer l'XP du monstre
  // - Marquer l'achat comme remboursé
}
