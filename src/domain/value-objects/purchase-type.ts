/**
 * Value Object: PurchaseType
 *
 * Défini les types d'achats possibles dans l'application
 */

export type PurchaseType = 'xp-boost' | 'animoneys-package' | 'food' | 'accessory' | 'customization'

/**
 * Vérifie si un type d'achat nécessite un monstre cible
 */
export function requiresMonster (type: PurchaseType): boolean {
  return ['xp-boost', 'food', 'accessory', 'customization'].includes(type)
}

/**
 * Vérifie si un type d'achat crédite le wallet
 */
export function creditsWallet (type: PurchaseType): boolean {
  return type === 'animoneys-package'
}
