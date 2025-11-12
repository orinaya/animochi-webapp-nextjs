/**
 * Entity: Purchase
 *
 * Principe SRP: Entité représentant un achat
 * Gère uniquement les données et la logique métier d'un achat
 */

import type { PaymentStatus } from '../value-objects/payment-status'
import type { PurchaseType } from '../value-objects/purchase-type'

/**
 * Entité représentant un achat effectué par un utilisateur
 */
export interface Purchase {
  /** ID unique de l'achat */
  id: string

  /** ID de l'utilisateur qui effectue l'achat */
  userId: string

  /** Type d'achat */
  type: PurchaseType

  /** ID de l'article acheté */
  itemId: string

  /** Quantité achetée */
  quantity: number

  /** Prix total en centimes */
  totalAmount: number

  /** Devise (EUR, USD, etc.) */
  currency: string

  /** Statut du paiement */
  paymentStatus: PaymentStatus

  /** ID de la session Stripe (si paiement Stripe) */
  stripeSessionId?: string

  /** ID du paiement Stripe (si paiement Stripe) */
  stripePaymentIntentId?: string

  /** ID du monstre cible (pour XP boost, nourriture, etc.) */
  targetMonsterId?: string

  /** Métadonnées additionnelles */
  metadata?: Record<string, unknown>

  /** Date de création */
  createdAt: Date

  /** Date de mise à jour */
  updatedAt: Date

  /** Date de finalisation du paiement */
  completedAt?: Date
}

/**
 * Commande pour créer un nouvel achat
 */
export interface CreatePurchaseCommand {
  userId: string
  type: PurchaseType
  itemId: string
  quantity: number
  targetMonsterId?: string
  metadata?: Record<string, unknown>
}

/**
 * DTO pour la réponse de création de session de paiement
 */
export interface CheckoutSessionResult {
  /** ID de la session Stripe */
  sessionId: string

  /** URL de redirection vers le checkout Stripe */
  url: string

  /** ID de l'achat créé */
  purchaseId: string
}

/**
 * DTO pour les données de paiement réussi
 */
export interface PaymentSuccessData {
  /** ID de la session Stripe */
  sessionId: string

  /** ID de l'utilisateur */
  userId: string

  /** ID de l'achat */
  purchaseId?: string

  /** Métadonnées du paiement */
  metadata: Record<string, unknown>
}
