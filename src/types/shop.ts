/**
 * Types et interfaces pour le système de boutique
 */

/**
 * Boost d'XP disponible à l'achat
 */
export interface XPBoost {
  /** Identifiant unique du boost */
  id: string
  /** Nom du boost */
  name: string
  /** Montant d'XP gagné */
  xpAmount: number
  /** Prix en Koins */
  price: number
  /** Emoji représentant le boost */
  emoji: string
  /** Couleurs du gradient */
  color: string
  /** Badge descriptif */
  badge: string
  /** Est-ce le boost le plus populaire ? */
  popular: boolean
  /** Description du boost */
  description: string
}

/**
 * Catégories d'articles disponibles dans la boutique
 */
export type ShopCategory = 'xp-boosts' | 'food' | 'accessories' | 'customization'
