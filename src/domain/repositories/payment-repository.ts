/**
 * Repository Interface: PaymentRepository
 *
 * Principe DIP: Interface abstraite pour les opérations de paiement
 * L'implémentation concrète (Stripe) sera dans infrastructure/
 */

import type { CheckoutSessionResult, PaymentSuccessData } from '../entities/purchase'

/**
 * Options pour créer une session de checkout
 */
export interface CreateCheckoutSessionOptions {
  /** Montant en centimes */
  amount: number

  /** Devise (EUR, USD, etc.) */
  currency: string

  /** Description du produit */
  productDescription: string

  /** URL de succès après paiement */
  successUrl: string

  /** URL d'annulation */
  cancelUrl: string

  /** Métadonnées à associer à la session */
  metadata: Record<string, string>

  /** Email du client (optionnel) */
  customerEmail?: string
}

/**
 * Repository pour gérer les paiements
 *
 * Cette interface permet d'abstraire le système de paiement (Stripe)
 * et de faciliter les tests et le changement de provider
 */
export interface PaymentRepository {
  /**
   * Crée une session de checkout pour un paiement
   *
   * @param options - Options de la session
   * @returns Les données de la session créée
   */
  createCheckoutSession: (options: CreateCheckoutSessionOptions) => Promise<CheckoutSessionResult>

  /**
   * Récupère les détails d'une session de paiement
   *
   * @param sessionId - ID de la session Stripe
   * @returns Les données du paiement ou null si non trouvée
   */
  getSessionDetails: (sessionId: string) => Promise<PaymentSuccessData | null>

  /**
   * Vérifie qu'une signature de webhook est valide
   *
   * @param payload - Corps de la requête
   * @param signature - Signature du webhook
   * @returns true si la signature est valide
   */
  verifyWebhookSignature: (payload: string, signature: string) => Promise<boolean>
}
