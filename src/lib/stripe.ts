import Stripe from 'stripe'

// Vérification de la présence de la clé Stripe
if (
  process.env.STRIPE_SECRET_KEY === undefined ||
  process.env.STRIPE_SECRET_KEY === null ||
  process.env.STRIPE_SECRET_KEY === ''
) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

// Stripe configuration (côté serveur uniquement)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
  apiVersion: '2025-10-29.clover'
})

// Export de la table de prix depuis le fichier de config
export { pricingTable } from '@/config/pricing'
