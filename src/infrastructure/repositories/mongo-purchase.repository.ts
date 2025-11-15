/**
 * Infrastructure: MongoPurchaseRepository
 *
 * Implémentation MongoDB du PurchaseRepository
 * Principe DIP: Implémente l'interface du domaine
 */

import { connectMongooseToDatabase } from '@/db'
import Purchase from '@/db/models/purchase.model'
import type { PurchaseRepository } from '@/domain/repositories/purchase-repository'
import type { Purchase as PurchaseEntity, CreatePurchaseCommand } from '@/domain/entities/purchase'
import type { PaymentStatus } from '@/domain/value-objects/payment-status'

/**
 * Implémentation MongoDB du repository de purchases
 */
export class MongoPurchaseRepository implements PurchaseRepository {
  /**
   * Assure la connexion à la base de données
   */
  private async ensureConnection (): Promise<void> {
    await connectMongooseToDatabase()
  }

  /**
   * Convertit un document Mongoose en entité Purchase
   */
  private toDomainEntity (doc: Record<string, any>): PurchaseEntity {
    return {
      id: doc._id?.toString() ?? '',
      userId: doc.userId,
      type: doc.type,
      itemId: doc.itemId,
      quantity: doc.quantity,
      totalAmount: doc.totalAmount,
      currency: doc.currency,
      paymentStatus: doc.paymentStatus,
      stripeSessionId: doc.stripeSessionId,
      stripePaymentIntentId: doc.stripePaymentIntentId,
      targetMonsterId:
        typeof doc.targetMonsterId !== 'undefined' && doc.targetMonsterId !== null
          ? doc.targetMonsterId.toString()
          : undefined,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      completedAt: doc.completedAt
    }
  }

  /**
   * Crée un nouvel achat
   */
  async create (command: CreatePurchaseCommand): Promise<PurchaseEntity> {
    await this.ensureConnection()

    const purchase = await Purchase.create({
      userId: command.userId,
      type: command.type,
      itemId: command.itemId,
      quantity: command.quantity,
      totalAmount: 0, // Sera mis à jour lors de la création de la session
      currency: 'eur',
      paymentStatus: 'pending',
      targetMonsterId: command.targetMonsterId,
      metadata: command.metadata
    })

    return this.toDomainEntity(purchase)
  }

  /**
   * Trouve un achat par son ID
   */
  async findById (id: string): Promise<PurchaseEntity | null> {
    await this.ensureConnection()

    const purchase = await Purchase.findById(id)
    if (purchase === null || purchase === undefined) {
      return null
    }

    return this.toDomainEntity(purchase)
  }

  /**
   * Trouve un achat par l'ID de session Stripe
   */
  async findByStripeSessionId (sessionId: string): Promise<PurchaseEntity | null> {
    await this.ensureConnection()

    const purchase = await Purchase.findOne({ stripeSessionId: sessionId })
    if (purchase === null || purchase === undefined) {
      return null
    }

    return this.toDomainEntity(purchase)
  }

  /**
   * Met à jour le statut de paiement d'un achat
   */
  async updatePaymentStatus (
    id: string,
    status: PaymentStatus,
    paymentIntentId?: string
  ): Promise<PurchaseEntity> {
    await this.ensureConnection()

    const updateData: Record<string, unknown> = {
      paymentStatus: status,
      updatedAt: new Date()
    }

    if (paymentIntentId !== undefined) {
      updateData.stripePaymentIntentId = paymentIntentId
    }

    if (status === 'succeeded') {
      updateData.completedAt = new Date()
    }

    const purchase = await Purchase.findByIdAndUpdate(id, updateData, { new: true })
    if (purchase === null || purchase === undefined) {
      throw new Error(`Purchase ${id} not found`)
    }

    return this.toDomainEntity(purchase)
  }

  /**
   * Liste les achats d'un utilisateur
   */
  findByUserId = async (userId: string, limit: number = 50): Promise<PurchaseEntity[]> => {
    await this.ensureConnection()
    const purchases = await Purchase.find({ userId }).sort({ createdAt: -1 }).limit(limit)
    return purchases.map((p: Record<string, any>) => this.toDomainEntity(p))
  }

  /**
   * Met à jour la session Stripe d'un achat
   */
  async updateStripeSession (id: string, sessionId: string, amount: number): Promise<void> {
    await this.ensureConnection()

    await Purchase.findByIdAndUpdate(id, {
      stripeSessionId: sessionId,
      totalAmount: amount,
      paymentStatus: 'processing'
    })
  }
}
