/**
 * Use Case: CreateCheckoutSession
 *
 * Principe SRP: Gère uniquement la création de session de paiement
 * Principe DIP: Dépend d'abstractions (repositories)
 */

import type { CheckoutSessionResult } from '../entities/purchase'
import type { PaymentRepository } from '../repositories/payment-repository'
import type { PurchaseRepository } from '../repositories/purchase-repository'
import type { PurchaseType } from '../value-objects/purchase-type'

/**
 * Commande pour créer une session de checkout
 */
export interface CreateCheckoutSessionCommand {
  /** ID de l'utilisateur */
  userId: string

  /** Email de l'utilisateur */
  userEmail?: string

  /** Type d'achat */
  purchaseType: PurchaseType

  /** ID de l'article acheté */
  itemId: string

  /** Montant en centimes */
  amount: number

  /** Devise */
  currency: string

  /** Description du produit */
  productDescription: string

  /** ID du monstre cible (optionnel) */
  targetMonsterId?: string

  /** URL de base de l'application */
  baseUrl: string

  /** Métadonnées additionnelles */
  metadata?: Record<string, unknown>
}

/**
 * Type de résultat pour les opérations
 */
export type Result<T, E = Error> = { ok: true, value: T } | { ok: false, error: E }

/**
 * Use case pour créer une session de checkout Stripe
 */
export class CreateCheckoutSessionUseCase {
  constructor (
    private readonly paymentRepository: PaymentRepository,
    private readonly purchaseRepository: PurchaseRepository
  ) {}

  /**
   * Exécute la création de session de checkout
   */
  async execute (
    command: CreateCheckoutSessionCommand
  ): Promise<Result<CheckoutSessionResult, string>> {
    try {
      // 1. Créer l'achat en base de données avec statut "pending"
      const purchase = await this.purchaseRepository.create({
        userId: command.userId,
        type: command.purchaseType,
        itemId: command.itemId,
        quantity: 1,
        targetMonsterId: command.targetMonsterId,
        metadata: command.metadata
      })

      // 2. Préparer les URLs de redirection
      const successUrl = `${command.baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${command.baseUrl}/payment/canceled`

      // 3. Créer la session Stripe avec métadonnées
      const session = await this.paymentRepository.createCheckoutSession({
        amount: command.amount,
        currency: command.currency,
        productDescription: command.productDescription,
        successUrl,
        cancelUrl,
        customerEmail: command.userEmail,
        metadata: {
          userId: command.userId,
          purchaseId: purchase.id,
          itemId: command.itemId,
          purchaseType: command.purchaseType,
          ...(command.targetMonsterId !== undefined && { targetMonsterId: command.targetMonsterId }),
          ...(command.metadata !== undefined &&
            Object.fromEntries(Object.entries(command.metadata).map(([k, v]) => [k, String(v)])))
        }
      })

      // 4. Mettre à jour le purchase avec le sessionId et le montant
      if ('updateStripeSession' in this.purchaseRepository) {
        await (
          this.purchaseRepository as PurchaseRepository & {
            updateStripeSession?: (id: string, sessionId: string, amount: number) => Promise<void>
          }
        ).updateStripeSession?.(purchase.id, session.sessionId, command.amount)
      }

      return {
        ok: true,
        value: {
          sessionId: session.sessionId,
          url: session.url,
          purchaseId: purchase.id
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session'
      }
    }
  }
}
