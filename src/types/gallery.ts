import type { Monster, MonsterState } from './monster'

/**
 * Monstre avec informations du propriétaire pour la galerie publique
 */
export interface MonsterWithOwner extends Monster {
  /** Indique si le monstre est public */
  isPublic: boolean
  /** Informations du propriétaire */
  owner?: {
    /** ID de l'utilisateur */
    id: string
    /** Nom d'utilisateur (peut être anonymisé) */
    username?: string
    /** Email (anonymisé) */
    email?: string
  }
}

/**
 * Filtres pour la galerie de monstres publics
 */
export interface GalleryFilters {
  /** Filtrer par niveau minimum */
  minLevel?: number
  /** Filtrer par niveau maximum */
  maxLevel?: number
  /** Filtrer par état/humeur */
  state?: MonsterState | 'all'
  /** Tri par date de création */
  sortBy?: 'newest' | 'oldest' | 'level-asc' | 'level-desc'
  /** Nombre de résultats par page */
  limit?: number
  /** Page actuelle (pour pagination) */
  page?: number
}

/**
 * Résultat paginé de la galerie
 */
export interface GalleryResult {
  /** Liste des monstres */
  monsters: MonsterWithOwner[]
  /** Nombre total de monstres */
  total: number
  /** Page actuelle */
  page: number
  /** Nombre de pages totales */
  totalPages: number
  /** Indique s'il y a une page suivante */
  hasNext: boolean
  /** Indique s'il y a une page précédente */
  hasPrevious: boolean
}

/**
 * Options pour le toggle de visibilité
 */
export interface ToggleVisibilityOptions {
  /** ID du monstre */
  monsterId: string
  /** Nouvelle valeur de visibilité */
  isPublic: boolean
}
