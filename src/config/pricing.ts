/**
 * Table de tarification pour les packages d'Animoney
 *
 * Principe SRP: Configuration centralisée des packages de paiement
 * Cette configuration est partagée entre le client et le serveur.
 * Elle définit les différents packages disponibles à l'achat via Stripe.
 *
 * @remarks
 * - amount: Montant d'Animoney à créditer
 * - price: Prix en euros (sera converti en centimes pour Stripe)
 */

export interface PricingPackage {
  price: number
  amount: number
}

export const pricingTable: Record<number, PricingPackage> = {
  10: {
    price: 0.5,
    amount: 10
  },
  50: {
    price: 1,
    amount: 50
  },
  500: {
    price: 2,
    amount: 500
  },
  1000: {
    price: 3,
    amount: 1000
  },
  5000: {
    price: 10,
    amount: 5000
  }
}

/**
 * Liste des montants disponibles à l'achat
 * Utilisé pour la validation côté client
 */
export const AVAILABLE_AMOUNTS = Object.keys(pricingTable).map(Number)
