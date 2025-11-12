/**
 * Repository Interface: PurchaseRepository
 *
 * Principe DIP: Interface pour la persistance des achats
 */

import type { Purchase, CreatePurchaseCommand } from '../entities/purchase'
import type { PaymentStatus } from '../value-objects/payment-status'

/**
 * Repository pour gérer la persistance des achats
 */
export interface PurchaseRepository {
  /**
   * Crée un nouvel achat
   *
   * @param command - Données de création
   * @returns L'achat créé
   */
  create: (command: CreatePurchaseCommand) => Promise<Purchase>

  /**
   * Trouve un achat par son ID
   *
   * @param id - ID de l'achat
   * @returns L'achat ou null si non trouvé
   */
  findById: (id: string) => Promise<Purchase | null>

  /**
   * Trouve un achat par l'ID de session Stripe
   *
   * @param sessionId - ID de la session Stripe
   * @returns L'achat ou null si non trouvé
   */
  findByStripeSessionId: (sessionId: string) => Promise<Purchase | null>

  /**
   * Met à jour le statut de paiement d'un achat
   *
   * @param id - ID de l'achat
   * @param status - Nouveau statut
   * @param paymentIntentId - ID du PaymentIntent Stripe (optionnel)
   * @returns L'achat mis à jour
   */
  updatePaymentStatus: (
    id: string,
    status: PaymentStatus,
    paymentIntentId?: string
  ) => Promise<Purchase>

  /**
   * Liste les achats d'un utilisateur
   *
   * @param userId - ID de l'utilisateur
   * @param limit - Nombre maximum de résultats
   * @returns Liste des achats
   */
  findByUserId: (userId: string, limit?: number) => Promise<Purchase[]>
}
