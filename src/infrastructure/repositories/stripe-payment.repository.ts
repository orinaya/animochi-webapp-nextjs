/**
 * Infrastructure: StripePaymentRepository
 *
 * Implémentation concrète du PaymentRepository utilisant Stripe
 * Principe DIP: Implémente l'interface du domaine
 */

import Stripe from 'stripe'
import type {
  PaymentRepository,
  CreateCheckoutSessionOptions
} from '@/domain/repositories/payment-repository'
import type { CheckoutSessionResult, PaymentSuccessData } from '@/domain/entities/purchase'

/**
 * Vérifie que Stripe est correctement configuré
 */
function getStripeInstance (): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (secretKey === undefined || secretKey === null || secretKey === '') {
    throw new Error(
      'STRIPE_SECRET_KEY is not configured. Please add it to your .env.local file. ' +
        'Get your key from https://dashboard.stripe.com/apikeys'
    )
  }

  return new Stripe(secretKey, {
    typescript: true,
    apiVersion: '2025-10-29.clover'
  })
}

/**
 * Implémentation Stripe du repository de paiement
 */
export class StripePaymentRepository implements PaymentRepository {
  private readonly webhookSecret: string
  private readonly stripe: Stripe

  constructor (webhookSecret?: string) {
    this.webhookSecret = webhookSecret ?? process.env.STRIPE_WEBHOOK_SECRET ?? ''
    this.stripe = getStripeInstance()
  }

  /**
   * Crée une session de checkout Stripe
   */
  async createCheckoutSession (
    options: CreateCheckoutSessionOptions
  ): Promise<CheckoutSessionResult> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: options.currency,
            unit_amount: options.amount,
            product_data: {
              name: options.productDescription,
              description: options.productDescription
            }
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      customer_email: options.customerEmail,
      metadata: options.metadata,
      payment_intent_data: {
        description: 'Merci pour votre achat sur Animochi !'
      }
    })

    if (session.url === null || session.url === undefined) {
      throw new Error('Stripe session URL is null')
    }

    return {
      sessionId: session.id,
      url: session.url,
      purchaseId: options.metadata.purchaseId
    }
  }

  /**
   * Récupère les détails d'une session de paiement
   */
  async getSessionDetails (sessionId: string): Promise<PaymentSuccessData | null> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId)

      if (session.payment_status !== 'paid') {
        return null
      }

      return {
        sessionId: session.id,
        userId: session.metadata?.userId ?? '',
        purchaseId: session.metadata?.purchaseId,
        metadata: session.metadata ?? {}
      }
    } catch (error) {
      console.error('Error retrieving session:', error)
      return null
    }
  }

  /**
   * Vérifie la signature d'un webhook Stripe
   */
  async verifyWebhookSignature (payload: string, signature: string): Promise<boolean> {
    try {
      this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret)
      return true
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  /**
   * Construit et vérifie un événement webhook
   */
  async constructWebhookEvent (payload: string, signature: string): Promise<Stripe.Event | null> {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret)
    } catch (error) {
      console.error('Error constructing webhook event:', error)
      return null
    }
  }
}
