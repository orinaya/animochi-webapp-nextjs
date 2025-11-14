// Types pour la galerie communautaire

export interface GalleryFilters {
  minLevel?: number
  maxLevel?: number
  state?: string
  sortBy?: "newest" | "oldest" | "level-asc" | "level-desc"
  page?: number
  limit?: number
}

export interface MonsterWithOwner {
  _id: string
  id: string
  name: string
  description?: string
  color?: string
  emoji?: string
  rarity?: string
  draw?: string
  state?: string
  level?: number
  experience?: number
  experienceToNextLevel?: number
  ownerId: string
  isPublic: boolean
  equippedAccessories?: {
    hat: string | null
    glasses: string | null
    shoes: string | null
    background: string | null
  }
  owner?: {
    _id: string
    name?: string
    avatarUrl?: string
  }
}

export interface GalleryResult {
  monsters: MonsterWithOwner[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
