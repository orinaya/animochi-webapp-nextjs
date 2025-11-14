/**
 * Types pour le système d'accessoires
 * Respecte le principe SRP : Types uniquement pour les accessoires
 */

/**
 * Catégories d'accessoires disponibles
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes' | 'background'

/**
 * Niveaux de rareté des accessoires
 */
export type AccessoryRarity = 'common' | 'rare' | 'epic' | 'legendary'

/**
 * Données de base d'un accessoire
 */
export interface AccessoryData {
  /** Nom de l'accessoire */
  name: string
  /** Catégorie de l'accessoire */
  category: AccessoryCategory
  /** Emoji ou icône représentant l'accessoire */
  emoji: string
  /** Description de l'accessoire */
  description: string
  /** Prix en AnimoCoins */
  price: number
  /** Niveau de rareté */
  rarity: AccessoryRarity
  /** Chemin vers l'image de l'accessoire */
  imagePath?: string
  /** SVG inline de l'accessoire (alternatif à imagePath) */
  svg?: string
}

/**
 * Accessoire complet avec métadonnées
 */
export interface Accessory extends AccessoryData {
  /** ID unique de l'accessoire */
  id: string
  /** Date de création */
  createdAt?: string
  /** Date de mise à jour */
  updatedAt?: string
}

/**
 * Accessoire possédé par un utilisateur
 */
export interface OwnedAccessory {
  /** ID unique de l'accessoire possédé */
  id?: string
  /** ID MongoDB */
  _id?: string
  /** Nom de l'accessoire (référence vers le catalogue) */
  accessoryName: string
  /** ID du propriétaire */
  ownerId: string
  /** ID du monstre auquel il est attaché (si équipé) */
  equippedOnMonsterId?: string | null
  /** Date d'achat */
  purchasedAt: string
  /** Est-il actuellement équipé */
  isEquipped: boolean
  /** Dates de création/modification */
  createdAt?: string
  updatedAt?: string
}

/**
 * Accessoires équipés sur un monstre
 */
export interface EquippedAccessories {
  /** Chapeau équipé (ID de l'accessoire) */
  hat?: string | null
  /** Lunettes équipées (ID de l'accessoire) */
  glasses?: string | null
  /** Chaussures équipées (ID de l'accessoire) */
  shoes?: string | null
  /** Arrière-plan équipé (ID de l'accessoire) */
  background?: string | null
}
