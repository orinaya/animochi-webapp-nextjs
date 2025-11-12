/**
 * Value Object: PaymentStatus
 *
 * Principe OCP: Enum fermé pour les statuts de paiement
 * Nouvelle catégorie = extension, pas modification
 */

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'canceled'

/**
 * Vérifie si un statut représente un paiement réussi
 */
export function isSuccessfulPayment (status: PaymentStatus): boolean {
  return status === 'succeeded'
}

/**
 * Vérifie si un statut représente un paiement terminal (finalisé)
 */
export function isTerminalPayment (status: PaymentStatus): boolean {
  return ['succeeded', 'failed', 'refunded', 'canceled'].includes(status)
}

/**
 * Vérifie si un statut permet un remboursement
 */
export function isRefundable (status: PaymentStatus): boolean {
  return status === 'succeeded'
}
