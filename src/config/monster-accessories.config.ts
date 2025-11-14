// Configurations et constantes liées aux accessoires de monstres
import type { AccessoryRarity, AccessoryCategory } from '../types/monster/monster-accessories'

export const RARITY_MULTIPLIERS: Record<AccessoryRarity, number> = {
  common: 1,
  rare: 2,
  epic: 4,
  legendary: 10
}

export const RARITY_COLORS: Record<AccessoryRarity, string> = {
  common: 'bg-latte-200 text-latte-800',
  rare: 'bg-blueberry-200 text-blueberry-800',
  epic: 'bg-peach-200 text-peach-800',
  legendary: 'bg-strawberry-200 text-strawberry-800'
}

export const RARITY_LABELS: Record<AccessoryRarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
}

export const CATEGORY_LABELS: Record<AccessoryCategory, string> = {
  hat: 'Chapeau',
  glasses: 'Lunettes',
  shoes: 'Chaussures',
  background: 'Arrière-plan'
}
