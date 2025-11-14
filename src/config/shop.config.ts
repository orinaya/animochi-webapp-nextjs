/**
 * Configuration de la boutique Animochi
 *
 * Principe SRP: Ce fichier gère uniquement la configuration des articles de la boutique
 * Les boosts XP sont définis ici pour être utilisés par les use cases et l'UI
 */

import type { XPBoost } from '@/types/shop/shop'

/**
 * Liste des boosts d'XP disponibles à l'achat
 *
 * Chaque boost correspond à un produit Stripe avec:
 * - price: Prix en Koins (monnaie virtuelle)
 * - stripeProductId: ID du produit dans Stripe (optionnel si payé en Koins)
 * - stripePriceId: ID du prix dans Stripe (optionnel si payé en Koins)
 */
export const xpBoosts: XPBoost[] = [
  {
    id: 'xp-boost-small',
    name: 'Petit Boost',
    xpAmount: 50,
    price: 10,
    emoji: '⚡',
    color: 'from-yellow-400 to-orange-500',
    badge: 'Débutant',
    popular: false,
    description: 'Un petit coup de pouce pour progresser'
  },
  {
    id: 'xp-boost-medium',
    name: 'Boost Moyen',
    xpAmount: 150,
    price: 25,
    emoji: '💫',
    color: 'from-blue-400 to-purple-500',
    badge: 'Populaire',
    popular: true,
    description: 'Le choix idéal pour avancer rapidement'
  },
  {
    id: 'xp-boost-large',
    name: 'Grand Boost',
    xpAmount: 300,
    price: 45,
    emoji: '🌟',
    color: 'from-purple-500 to-pink-500',
    badge: 'Recommandé',
    popular: false,
    description: 'Pour les joueurs ambitieux'
  },
  {
    id: 'xp-boost-mega',
    name: 'Méga Boost',
    xpAmount: 500,
    price: 70,
    emoji: '✨',
    color: 'from-pink-500 to-red-500',
    badge: 'Premium',
    popular: false,
    description: 'Le boost ultime pour les champions'
  }
]

/**
 * Récupère un boost par son ID
 */
export function getBoostById (boostId: string): XPBoost | undefined {
  return xpBoosts.find((boost) => boost.id === boostId)
}

/**
 * Liste des IDs de boosts disponibles
 */
export const AVAILABLE_BOOST_IDS = xpBoosts.map((boost) => boost.id)
