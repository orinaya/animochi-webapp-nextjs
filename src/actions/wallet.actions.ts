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
import type {Wallet, WalletOperationResult} from "@/types/wallet"

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
        balance: 100, // Welcome bonus
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
 * @param description - Description de la transaction
 */
export async function addFunds(
  amount: number,
  description: string = "Ajout manuel de fonds"
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
      status: "COMPLETED",
      description,
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
 * @param description - Description de la transaction
 */
export async function deductFunds(
  amount: number,
  description: string = "Retrait manuel de fonds"
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
      status: "COMPLETED",
      description,
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
