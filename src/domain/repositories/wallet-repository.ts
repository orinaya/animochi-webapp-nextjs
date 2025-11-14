// src/domain/repositories/wallet-repository.ts
// Interface d'accès au wallet pour le domaine

export interface WalletRepository {
  addToBalance: (ownerId: string, amount: number) => Promise<void>
  subtractFromBalance: (ownerId: string, amount: number) => Promise<void>
}
