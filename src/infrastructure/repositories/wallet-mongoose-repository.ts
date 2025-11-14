// src/infrastructure/repositories/wallet-mongoose-repository.ts
// Implémentation WalletRepository avec Mongoose

import type {WalletRepository} from "@/domain/repositories/wallet-repository"
import WalletModel from "@/db/models/wallet.model"

export class WalletMongooseRepository implements WalletRepository {
  addToBalance = async (ownerId: string, amount: number): Promise<void> => {
    await WalletModel.updateOne({ownerId}, {$inc: {balance: amount}})
  }

  subtractFromBalance = async (ownerId: string, amount: number): Promise<void> => {
    await WalletModel.updateOne({ownerId}, {$inc: {balance: -amount}})
  }
}
