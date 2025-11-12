/**
 * Infrastructure: MongoWalletRepository
 *
 * Implémentation MongoDB pour les opérations sur le Wallet
 */

import { connectMongooseToDatabase } from '@/db'
import Wallet from '@/db/models/wallet.model'
import Transaction from '@/db/models/transaction.model'
import type { WalletRepository } from '@/domain/usecases/handle-payment-success.usecase'
import mongoose from 'mongoose'

/**
 * Repository pour gérer le wallet des utilisateurs
 */
export class MongoWalletRepository implements WalletRepository {
  /**
   * Ajoute un montant au solde d'un wallet
   */
  async addBalance (
    userId: string,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await connectMongooseToDatabase()

    console.log('[MongoWalletRepository] addBalance called with:', { userId, amount, metadata })

    // Convertir userId en ObjectId si nécessaire
    const ownerIdQuery = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId

    console.log('[MongoWalletRepository] Searching wallet with ownerId:', ownerIdQuery)

    const wallet = await Wallet.findOne({ ownerId: ownerIdQuery })

    if (wallet === null || wallet === undefined) {
      console.error('[MongoWalletRepository] Wallet not found for user:', userId)
      throw new Error(`Wallet not found for user ${userId}`)
    }

    console.log('[MongoWalletRepository] Wallet found, current balance:', wallet.balance)

    const oldBalance = Number(wallet.balance)
    wallet.balance = oldBalance + Number(amount)
    wallet.markModified('balance')

    await wallet.save()

    console.log('[MongoWalletRepository] Balance updated from', oldBalance, 'to', wallet.balance)

    // Créer une transaction pour tracer l'opération
    await Transaction.create({
      walletId: wallet._id,
      type: 'CREDIT',
      amount: Number(amount),
      reason: 'PURCHASE', // Achat via Stripe
      metadata: {
        oldBalance,
        newBalance: wallet.balance,
        ...metadata // Fusionner les métadonnées passées (purchaseId, sessionId, etc.)
      }
    })

    console.log('[MongoWalletRepository] Transaction created for credit with metadata:', metadata)
  }

  /**
   * Retire un montant du solde d'un wallet
   */
  async deductBalance (userId: string, amount: number): Promise<void> {
    await connectMongooseToDatabase()

    console.log('[MongoWalletRepository] deductBalance called with:', { userId, amount })

    // Convertir userId en ObjectId si nécessaire
    const ownerIdQuery = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId

    const wallet = await Wallet.findOne({ ownerId: ownerIdQuery })

    if (wallet === null || wallet === undefined) {
      console.error('[MongoWalletRepository] Wallet not found for user:', userId)
      throw new Error(`Wallet not found for user ${userId}`)
    }

    const oldBalance = Number(wallet.balance)
    const newBalance = oldBalance - Number(amount)

    if (newBalance < 0) {
      throw new Error('Insufficient balance')
    }

    wallet.balance = newBalance
    wallet.markModified('balance')
    await wallet.save()

    console.log('[MongoWalletRepository] Balance deducted, new balance:', wallet.balance)

    // Créer une transaction pour tracer l'opération
    await Transaction.create({
      walletId: wallet._id,
      type: 'DEBIT',
      amount: Number(amount),
      reason: 'PURCHASE', // Par défaut, considéré comme un achat
      metadata: {
        oldBalance,
        newBalance: wallet.balance,
        source: 'wallet_deduction'
      }
    })

    console.log('[MongoWalletRepository] Transaction created for debit')
  }

  /**
   * Récupère le solde d'un wallet
   */
  async getBalance (userId: string): Promise<number> {
    await connectMongooseToDatabase()

    // Convertir userId en ObjectId si nécessaire
    const ownerIdQuery = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId

    const wallet = await Wallet.findOne({ ownerId: ownerIdQuery })

    if (wallet === null || wallet === undefined) {
      throw new Error(`Wallet not found for user ${userId}`)
    }

    return Number(wallet.balance)
  }
}
