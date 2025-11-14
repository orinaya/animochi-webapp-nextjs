/**
 * Wallet Actions - Server Actions pour gérer le wallet
 * Infrastructure Layer : Interagit avec MongoDB via Mongoose
 */

"use server"

import {auth} from "@/lib/auth/auth"
import {headers} from "next/headers"
import {connectMongooseToDatabase} from "@/db"
import WalletModel from "@/db/models/wallet.model"
import TransactionModel from "@/db/models/transaction.model"
import type {Wallet, WalletOperationResult} from "@/types/wallet/wallet"

/**
 * Récupère le wallet de l'utilisateur connecté
 * Crée un wallet si aucun n'existe
 */
export async function getWallet(): Promise<Wallet | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return null
    }

    await connectMongooseToDatabase()

    let wallet = await WalletModel.findOne({ownerId: session.user.id})

    // Créer un wallet si aucun n'existe
    if (wallet == null) {
      wallet = await WalletModel.create({
        ownerId: session.user.id,
        balance: 3000, // Welcome bonus
      })
    }

    return wallet.toJSON()
  } catch (error) {
    console.error("Error fetching wallet:", error)
    return null
  }
}

/**
 * Ajoute des Animochi au wallet
 * @param amount - Montant à ajouter (doit être positif)
 * @param reason - Raison de l'ajout (enum prédéfini)
 */
export async function addFunds(
  amount: number,
  reason:
    | "DAILY_REWARD"
    | "MANUAL_ADD"
    | "QUEST_REWARD"
    | "LEVEL_UP"
    | "PURCHASE"
    | "BOOST_XP"
    | "INITIAL_BALANCE" = "MANUAL_ADD"
): Promise<WalletOperationResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return {success: false, error: "Non authentifié"}
    }

    if (amount <= 0) {
      return {success: false, error: "Le montant doit être positif"}
    }

    if (!Number.isInteger(amount)) {
      return {success: false, error: "Le montant doit être un nombre entier"}
    }

    await connectMongooseToDatabase()

    // Récupérer le wallet
    const wallet = await WalletModel.findOne({ownerId: session.user.id})

    if (wallet == null) {
      return {success: false, error: "Wallet non trouvé"}
    }

    // Créer la transaction
    await TransactionModel.create({
      walletId: wallet._id,
      amount,
      type: "CREDIT",
      reason,
    })

    // Mettre à jour le solde
    wallet.balance = (wallet.balance as number) + amount
    await wallet.save()

    return {
      success: true,
      balance: wallet.balance as number,
    }
  } catch (error) {
    console.error("Error adding funds:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'ajout de fonds",
    }
  }
}

/**
 * Retire des Animochi du wallet
 * @param amount - Montant à retirer (doit être positif)
 * @param reason - Raison du retrait (enum prédéfini)
 */
export async function deductFunds(
  amount: number,
  reason: "FEED_CREATURE" | "MANUAL_SUBTRACT" | "PURCHASE" | "BOOST_XP" = "MANUAL_SUBTRACT"
): Promise<WalletOperationResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return {success: false, error: "Non authentifié"}
    }

    if (amount <= 0) {
      return {success: false, error: "Le montant doit être positif"}
    }

    if (!Number.isInteger(amount)) {
      return {success: false, error: "Le montant doit être un nombre entier"}
    }

    await connectMongooseToDatabase()

    // Récupérer le wallet
    const wallet = await WalletModel.findOne({ownerId: session.user.id})

    if (wallet == null) {
      return {success: false, error: "Wallet non trouvé"}
    }

    // Vérifier le solde
    if ((wallet.balance as number) < amount) {
      return {success: false, error: "Solde insuffisant"}
    }

    // Créer la transaction
    await TransactionModel.create({
      walletId: wallet._id,
      amount: -amount, // Négatif pour un débit
      type: "DEBIT",
      reason,
    })

    // Mettre à jour le solde
    wallet.balance = (wallet.balance as number) - amount
    await wallet.save()

    return {
      success: true,
      balance: wallet.balance as number,
    }
  } catch (error) {
    console.error("Error deducting funds:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors du retrait de fonds",
    }
  }
}

/**
 * Récupère l'historique des transactions du wallet de l'utilisateur
 * @param limit - Nombre maximum de transactions à retourner (par défaut 50)
 * @param skip - Nombre de transactions à sauter (pour la pagination)
 */
export async function getTransactions(
  limit: number = 50,
  skip: number = 0
): Promise<{
  success: boolean
  transactions?: Array<{
    id: string
    walletId: string
    type: string
    amount: number
    reason: string
    metadata?: Record<string, unknown>
    createdAt: Date
  }>
  error?: string
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return {success: false, error: "Non authentifié"}
    }

    await connectMongooseToDatabase()

    // Récupérer le wallet
    const wallet = await WalletModel.findOne({ownerId: session.user.id})

    if (wallet == null) {
      return {success: false, error: "Wallet non trouvé"}
    }

    // Récupérer les transactions, triées par date décroissante
    const transactions = await TransactionModel.find({walletId: wallet._id})
      .sort({createdAt: -1})
      .limit(limit)
      .skip(skip)
      .lean<
        Array<{
          _id: string
          walletId: string
          type: string
          amount: number
          reason: string
          metadata?: Record<string, unknown>
          createdAt: Date
        }>
      >()

    // Formater les transactions pour le retour
    const formattedTransactions = transactions.map((t) => ({
      id: t._id.toString(),
      walletId: t.walletId.toString(),
      type: t.type,
      amount: t.amount,
      reason: t.reason,
      metadata: t.metadata,
      createdAt: t.createdAt,
    }))

    return {
      success: true,
      transactions: formattedTransactions,
    }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur lors de la récupération des transactions",
    }
  }
}
