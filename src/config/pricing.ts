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
 */

export interface PricingPackage {
  price: number
  amount: number
}

export const pricingTable: Record<number, PricingPackage> = {
  10: {
    price: 0.99,
    amount: 10,
  },
  50: {
    price: 4.49,
    amount: 50,
  },
  100: {
    price: 8.99,
    amount: 100,
  },
  500: {
    price: 39.99,
    amount: 500,
  },
  1000: {
    price: 74.99,
    amount: 1000,
  },
  5000: {
    price: 349.99,
    amount: 5000,
  },
}

/**
 * Liste des montants disponibles à l'achat
 * Utilisé pour la validation côté client
 */
export const AVAILABLE_AMOUNTS = Object.keys(pricingTable).map(Number)
