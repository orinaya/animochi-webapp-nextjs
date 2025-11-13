'use client'

import type { GalleryFilters as GalleryFiltersType, MonsterState } from '@/types'
import { useState } from 'react'

interface GalleryFiltersProps {
  /** Callback lors de la modification des filtres */
  onFiltersChange: (filters: GalleryFiltersType) => void
  /** Filtres initiaux */
  initialFilters?: GalleryFiltersType
}

/**
 * Composant de filtrage pour la galerie
 *
 * Composant client qui :
 * - Affiche les options de filtrage (niveau, état, tri)
 * - Permet de réinitialiser les filtres
 * - Émet les changements vers le parent
 *
 * Respecte le principe SRP : Gère uniquement l'interface des filtres
 * Respecte le principe OCP : Extensible via les options de filtre
 *
 * @example
 * ```tsx
 * <GalleryFilters onFiltersChange={(filters) => setFilters(filters)} />
 * ```
 */
export function GalleryFilters ({
  onFiltersChange,
  initialFilters = {}
}: GalleryFiltersProps): React.ReactElement {
  const [filters, setFilters] = useState<GalleryFiltersType>(initialFilters)

  const handleFilterChange = (key: keyof GalleryFiltersType, value: any): void => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = (): void => {
    const emptyFilters: GalleryFiltersType = {
      minLevel: undefined,
      maxLevel: undefined,
      state: 'all',
      sortBy: 'newest'
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const states: Array<{ value: MonsterState | 'all', label: string, emoji: string }> = [
    { value: 'all', label: 'Tous', emoji: '🎭' },
    { value: 'happy', label: 'Joyeux', emoji: '😊' },
    { value: 'sad', label: 'Triste', emoji: '😢' },
    { value: 'angry', label: 'En colère', emoji: '😠' },
    { value: 'hungry', label: 'Affamé', emoji: '😋' },
    { value: 'sleepy', label: 'Endormi', emoji: '😴' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'level-desc', label: 'Niveau décroissant' },
    { value: 'level-asc', label: 'Niveau croissant' }
  ]

  return (
    <div className='bg-white rounded-2xl p-6 border border-latte-200 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-bold text-blueberry-950'>
          🔍 Filtres
        </h2>
        <button
          onClick={resetFilters}
          className='text-sm text-blueberry-600 hover:text-blueberry-700 font-medium'
        >
          Réinitialiser
        </button>
      </div>

      <div className='space-y-6'>
        {/* Filtre par état */}
        <div>
          <label className='block text-sm font-semibold text-blueberry-950 mb-2'>
            État du monstre
          </label>
          <div className='grid grid-cols-3 gap-2'>
            {states.map((state) => (
              <button
                key={state.value}
                onClick={() => { handleFilterChange('state', state.value) }}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${(filters.state ?? 'all') === state.value
                    ? 'bg-blueberry-100 text-blueberry-700 ring-2 ring-blueberry-500'
                    : 'bg-latte-25 text-gray-700 hover:bg-latte-50'
                  }
                `}
              >
                <span>{state.emoji}</span>
                <span className='hidden sm:inline'>{state.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtre par niveau */}
        <div>
          <label className='block text-sm font-semibold text-blueberry-950 mb-2'>
            Niveau
          </label>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs text-gray-600 mb-1'>
                Minimum
              </label>
              <input
                type='number'
                min='1'
                max='100'
                value={filters.minLevel ?? ''}
                onChange={(e) => {
                  handleFilterChange(
                    'minLevel',
                    e.target.value !== '' ? parseInt(e.target.value) : undefined
                  )
                }}
                className='w-full px-3 py-2 rounded-lg border border-latte-200 focus:ring-2 focus:ring-blueberry-500 focus:outline-none'
                placeholder='1'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-600 mb-1'>
                Maximum
              </label>
              <input
                type='number'
                min='1'
                max='100'
                value={filters.maxLevel ?? ''}
                onChange={(e) => {
                  handleFilterChange(
                    'maxLevel',
                    e.target.value !== '' ? parseInt(e.target.value) : undefined
                  )
                }}
                className='w-full px-3 py-2 rounded-lg border border-latte-200 focus:ring-2 focus:ring-blueberry-500 focus:outline-none'
                placeholder='100'
              />
            </div>
          </div>
        </div>

        {/* Tri */}
        <div>
          <label className='block text-sm font-semibold text-blueberry-950 mb-2'>
            Trier par
          </label>
          <select
            value={filters.sortBy ?? 'newest'}
            onChange={(e) => {
              handleFilterChange('sortBy', e.target.value)
            }}
            className='w-full px-3 py-2 rounded-lg border border-latte-200 focus:ring-2 focus:ring-blueberry-500 focus:outline-none bg-white'
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
