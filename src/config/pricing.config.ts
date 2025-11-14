/**
 * Table de tarification pour les packages d'Animochi
 *
 * Principe SRP: Configuration centralisée des packages de paiement
 * Cette configuration est partagée entre le client et le serveur.
 * Elle définit les différents packages disponibles à l'achat via Stripe.
 *
 * @remarks
 * - amount: Montant d'Animochi (Ⱥ) à créditer
 * - price: Prix en euros (sera converti en centimes pour Stripe)
 * - productId: ID du produit dans Stripe (optionnel, pour tracking)
 * - priceId: ID du prix dans Stripe (optionnel, pour Checkout prédéfini)
 */

export interface PricingPackage {
  price: number
  amount: number
  productId?: string
  priceId?: string
}

export const pricingTable: Record<number, PricingPackage> = {
  10: {
    price: 0.99,
    amount: 10
    // productId: 'prod_xxx', // À remplir depuis Stripe Dashboard
    // priceId: 'price_xxx'
  },
  50: {
    price: 4.49,
    amount: 50
    // productId: 'prod_yyy',
    // priceId: 'price_yyy'
  },
  100: {
    price: 8.99,
    amount: 100
    // productId: 'prod_zzz',
    // priceId: 'price_zzz'
  },
  500: {
    price: 39.99,
    amount: 500
  },
  1000: {
    price: 74.99,
    amount: 1000
  },
  5000: {
    price: 349.99,
    amount: 5000
  }
}

/**
 * Liste des montants disponibles à l'achat
 * Utilisé pour la validation côté client
 */
export const AVAILABLE_AMOUNTS = Object.keys(pricingTable).map(Number)

/**
 * Récupère un package par son montant
 */
export function getPackageByAmount (amount: number): PricingPackage | undefined {
  return pricingTable[amount]
}

/**
 * Vérifie si un montant est valide
 */
export function isValidAmount (amount: number): boolean {
  return AVAILABLE_AMOUNTS.includes(amount)
}
