/**
 * Point d'entrée pour le domaine
 *
 * Facilite l'import des entités, use cases et repositories
 */

// Entities
export type {
  Purchase,
  CreatePurchaseCommand,
  CheckoutSessionResult,
  PaymentSuccessData
} from './entities/purchase'

// Value Objects
export type { PaymentStatus } from './value-objects/payment-status'
export { isSuccessfulPayment, isTerminalPayment, isRefundable } from './value-objects/payment-status'
export type { PurchaseType } from './value-objects/purchase-type'
export { requiresMonster, creditsWallet } from './value-objects/purchase-type'

// Repositories (interfaces)
export type {
  PaymentRepository,
  CreateCheckoutSessionOptions
} from './repositories/payment-repository'
export type { PurchaseRepository } from './repositories/purchase-repository'

// Use Cases
export { CreateCheckoutSessionUseCase } from './usecases/create-checkout-session.usecase'
export type { CreateCheckoutSessionCommand, Result } from './usecases/create-checkout-session.usecase'
export { HandlePaymentSuccessUseCase } from './usecases/handle-payment-success.usecase'
export type { WalletRepository, MonsterRepository } from './usecases/handle-payment-success.usecase'
