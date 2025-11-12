import { pricingTable } from './pricing'
import type { WalletPackage, InfoCardData } from '@/types/wallet'

/**
 * Packages d'achat d'Animochi (Ⱥ) disponibles
 */
export const WALLET_PACKAGES: WalletPackage[] = [
  {
    amount: 10,
    price: pricingTable[10].price,
    emoji: '🪙',
    color: 'from-yellow-400 to-orange-500',
    badge: 'Débutant',
    popular: false
  },
  {
    amount: 50,
    price: pricingTable[50].price,
    emoji: '💰',
    color: 'from-orange-400 to-red-500',
    badge: 'Populaire',
    popular: true
  },
  {
    amount: 100,
    price: pricingTable[100].price,
    emoji: '💵',
    color: 'from-green-400 to-emerald-500',
    badge: 'Pratique',
    popular: false
  },
  {
    amount: 500,
    price: pricingTable[500].price,
    emoji: '💎',
    color: 'from-blue-400 to-cyan-500',
    badge: 'Pro',
    popular: false
  },
  {
    amount: 1000,
    price: pricingTable[1000].price,
    emoji: '👑',
    color: 'from-purple-400 to-pink-500',
    badge: 'Royal',
    popular: false
  },
  {
    amount: 5000,
    price: pricingTable[5000].price,
    emoji: '🌟',
    color: 'from-pink-400 to-rose-500',
    badge: 'Légendaire',
    popular: false
  }
]

/**
 * Informations supplémentaires affichées en bas de page
 */
export const WALLET_INFO_CARDS: InfoCardData[] = [
  {
    icon: '🔒',
    title: 'Paiement Sécurisé',
    text: 'Crypté SSL via Stripe'
  },
  {
    icon: '⚡',
    title: 'Instantané',
    text: 'Animochi ajoutés immédiatement'
  },
  {
    icon: '💳',
    title: 'Tous moyens',
    text: 'CB, PayPal, Apple Pay...'
  }
]

/**
 * Symbole de la monnaie Animochi
 */
export const CURRENCY_SYMBOL = 'Ⱥ'

/**
 * Nom de la monnaie
 */
export const CURRENCY_NAME = 'Animochi'

/**
 * Bonus de bienvenue en Animochi
 */
export const WELCOME_BONUS = 100
