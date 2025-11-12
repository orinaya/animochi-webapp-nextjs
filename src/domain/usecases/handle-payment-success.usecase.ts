/**
 * Use Case: HandlePaymentSuccess
 *
 * Principe SRP: Gère uniquement le traitement d'un paiement réussi
 * Orchestre les actions à effectuer après un paiement validé
 */

import type { PurchaseRepository } from '../repositories/purchase-repository'
import type { PaymentSuccessData } from '../entities/purchase'
import type { Result } from './create-checkout-session.usecase'

/**
 * Interface pour les repositories métier (Wallet, Monster)
 */
export interface WalletRepository {
  addBalance: (userId: string, amount: number, metadata?: Record<string, unknown>) => Promise<void>
}

export interface MonsterRepository {
  addXp: (monsterId: string, amount: number) => Promise<void>
}

/**
 * Use case pour gérer un paiement réussi
 */
export class HandlePaymentSuccessUseCase {
  constructor (
    private readonly purchaseRepository: PurchaseRepository,
    private readonly walletRepository?: WalletRepository,
    private readonly monsterRepository?: MonsterRepository
  ) {}

  /**
   * Exécute le traitement d'un paiement réussi
   */
  async execute (data: PaymentSuccessData): Promise<Result<void, string>> {
    try {
      console.log('[HandlePaymentSuccessUseCase] execute() called with:', {
        sessionId: data.sessionId,
        userId: data.userId,
        purchaseId: data.purchaseId,
        metadata: data.metadata
      })

      // 1. Récupérer l'achat depuis la session Stripe
      console.log(
        '[HandlePaymentSuccessUseCase] Searching for purchase by sessionId:',
        data.sessionId
      )
      const purchase = await this.purchaseRepository.findByStripeSessionId(data.sessionId)

      if (purchase === null || purchase === undefined) {
        console.error(
          '[HandlePaymentSuccessUseCase] Purchase not found for session:',
          data.sessionId
        )
        return {
          ok: false,
          error: `Purchase not found for session ${data.sessionId}`
        }
      }

      console.log('[HandlePaymentSuccessUseCase] Purchase found:', {
        id: purchase.id,
        type: purchase.type,
        userId: purchase.userId,
        metadata: purchase.metadata
      })

      // 2. Vérifier que l'utilisateur correspond
      if (purchase.userId !== data.userId) {
        console.error('[HandlePaymentSuccessUseCase] User mismatch:', {
          expected: data.userId,
          actual: purchase.userId
        })
        return {
          ok: false,
          error: 'User mismatch for purchase'
        }
      }

      // 3. Mettre à jour le statut de l'achat
      console.log('[HandlePaymentSuccessUseCase] Updating purchase status to succeeded')
      await this.purchaseRepository.updatePaymentStatus(purchase.id, 'succeeded')

      // 4. Appliquer les effets selon le type d'achat
      console.log('[HandlePaymentSuccessUseCase] Applying purchase effects...')
      await this.applyPurchaseEffects(purchase, data.sessionId)

      console.log('[HandlePaymentSuccessUseCase] Payment success handled successfully ✅')
      return { ok: true, value: undefined }
    } catch (error) {
      console.error('[HandlePaymentSuccessUseCase] Error in execute():', error)
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to handle payment success'
      }
    }
  }

  /**
   * Applique les effets d'un achat selon son type
   */
  private async applyPurchaseEffects (
    purchase: {
      id: string
      type: string
      userId: string
      targetMonsterId?: string
      metadata?: Record<string, unknown>
    },
    sessionId: string
  ): Promise<void> {
    console.log('[HandlePaymentSuccessUseCase] Applying purchase effects:', {
      type: purchase.type,
      userId: purchase.userId,
      metadata: purchase.metadata
    })

    switch (purchase.type) {
      case 'animoneys-package': {
        // Créditer le wallet avec les Animoneys achetés
        if (this.walletRepository !== undefined) {
          const animoneysAmount = Number(purchase.metadata?.animoneysAmount ?? 0)
          console.log(
            '[HandlePaymentSuccessUseCase] Crediting wallet with',
            animoneysAmount,
            'animoneys (Ⱥ) for user',
            purchase.userId
          )

          // Passer les métadonnées Stripe pour enrichir la transaction
          await this.walletRepository.addBalance(purchase.userId, animoneysAmount, {
            purchaseId: purchase.id,
            stripeSessionId: sessionId,
            packageType: purchase.metadata?.packageType,
            priceInEuros: purchase.metadata?.priceInEuros,
            source: 'stripe_payment'
          })

          console.log('[HandlePaymentSuccessUseCase] Wallet credited successfully')
        } else {
          console.warn('[HandlePaymentSuccessUseCase] walletRepository is undefined!')
        }
        break
      }

      case 'xp-boost': {
        // Ajouter l'XP au monstre
        if (this.monsterRepository !== undefined && purchase.targetMonsterId !== undefined) {
          const xpAmount = Number(purchase.metadata?.xpAmount ?? 0)
          await this.monsterRepository.addXp(purchase.targetMonsterId, xpAmount)
        }
        break
      }

      // Autres types d'achats à implémenter
      default:
        console.warn('Purchase type not handled:', purchase.type)
    }
  }
}
