import { MonsterRarity, ThemeColor } from '..'
import type { EquippedAccessories } from './monster-accessories'

/**
 * États possibles d'un monstre
 */
export type MonsterState = 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy' | 'bored' | 'sick'

/**
 * Type sérialisé pour passer les données de Mongoose aux composants clients
 * Identique à MonsterDocument mais explicitement marqué comme sérialisable
 */
// export type SerializedMonster = Omit<Monster '_id'> & {
//   _id?: string
//   id?: string
// }

/**
 * Interface représentant un monstre dans l'interface utilisateur
 *
 * Version du monstre adaptée pour l'affichage :
 * - Propriétés optionnelles pour gérer les états de chargement
 * - Types plus permissifs (string | null) pour compatibilité
 */
export interface Monster {
  /** Date de dernière mise à jour de l'état d'humeur (format string ISO) */
  stateUpdatedAt?: string
  /** Date de la prochaine évolution d'état d'humeur (format string ISO) */
  nextStateAt?: string
  /** ID standard (optionnel) */
  id?: string
  /** ID MongoDB (optionnel) */
  _id?: string
  /** Nom du monstre */
  name: string
  /** Description du monstre */
  description?: string
  /** Couleur du monstre */
  color?: ThemeColor
  /** Emoji représentant le monstre */
  emoji?: string
  /** Représentation visuelle */
  draw?: string
  /** Rareté du monstre */
  rarity?: MonsterRarity
  /** Niveau du monstre (optionnel pour états de chargement) */
  level?: number | null
  /** État du monstre (optionnel, peut être string pour compatibilité) */
  state?: MonsterState | string | null
  /** ID du propriétaire */
  ownerId?: string
  /** Expérience actuelle (optionnel pour compatibilité) */
  experience?: number | null
  /** XP nécessaire pour niveau suivant (optionnel pour compatibilité) */
  experienceToNextLevel?: number | null
  /** Accessoires équipés (optionnel) */
  equippedAccessories?: EquippedAccessories | null
  /** Indique si le monstre est public */
  isPublic?: boolean
  /** Date de création (format string ISO) */
  createdAt?: string
  /** Date de dernière modification (format string ISO) */
  updatedAt?: string
}
