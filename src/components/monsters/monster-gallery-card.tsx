/**
 * Composant MonsterGalleryCard - Carte d'affichage d'un monstre dans la galerie
 *
 * @module components/monsters/monster-gallery-card
 */

'use client'

import type { MonsterWithOwner, MonsterState } from '@/types'
import Link from 'next/link'
import { useMemo } from 'react'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'

/**
 * Props du composant MonsterGalleryCard
 */
interface MonsterGalleryCardProps {
  /** Monstre avec informations du propriétaire */
  monster: MonsterWithOwner
  /** Classe CSS additionnelle */
  className?: string
}

/**
 * Configuration des badges d'état du monstre
 */
const STATE_CONFIG: Record<MonsterState, { label: string, emoji: string, className: string }> = {
  happy: {
    label: 'Heureux',
    emoji: '😊',
    className: 'bg-green-100 text-green-700 border-green-300'
  },
  sad: {
    label: 'Triste',
    emoji: '😢',
    className: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  angry: {
    label: 'En colère',
    emoji: '😠',
    className: 'bg-red-100 text-red-700 border-red-300'
  },
  hungry: {
    label: 'Affamé',
    emoji: '🍖',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  },
  sleepy: {
    label: 'Endormi',
    emoji: '😴',
    className: 'bg-purple-100 text-purple-700 border-purple-300'
  }
}

/**
 * Composant carte de monstre pour la galerie communautaire
 *
 * Affiche :
 * - Le dessin du monstre avec fond et accessoires
 * - Nom et niveau
 * - État du monstre
 * - Créateur (anonymisé)
 * - Badge public
 *
 * Respecte le principe SRP : Affiche uniquement un monstre de galerie
 *
 * @example
 * ```tsx
 * <MonsterGalleryCard monster={monsterWithOwner} />
 * ```
 */
export function MonsterGalleryCard ({
  monster,
  className = ''
}: MonsterGalleryCardProps): React.ReactElement {
  // Récupérer les accessoires équipés
  const equippedAccessories = useMemo(() => {
    if (monster.equippedAccessories == null) return null

    return {
      hat: monster.equippedAccessories.hat != null
        ? ACCESSORIES_CATALOG.find(a => a.name === monster.equippedAccessories?.hat)
        : null,
      glasses: monster.equippedAccessories.glasses != null
        ? ACCESSORIES_CATALOG.find(a => a.name === monster.equippedAccessories?.glasses)
        : null,
      shoes: monster.equippedAccessories.shoes != null
        ? ACCESSORIES_CATALOG.find(a => a.name === monster.equippedAccessories?.shoes)
        : null,
      background: monster.equippedAccessories.background != null
        ? BACKGROUNDS_CATALOG.find(b => b.name === monster.equippedAccessories?.background)
        : null
    }
  }, [monster.equippedAccessories])

  const stateConfig = monster.state != null
    ? STATE_CONFIG[monster.state as MonsterState]
    : STATE_CONFIG.happy

  return (
    <Link
      href={`/dashboard/monsters/${String(monster.id ?? monster._id)}`}
      className={`
        group block bg-white rounded-2xl border-2 border-latte-200
        hover:border-blueberry-400 hover:shadow-lg
        transition-all duration-300 overflow-hidden
        ${className}
      `}
    >
      {/* Badge Public */}
      <div className='absolute top-3 right-3 z-10'>
        <div className='bg-blueberry-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1'>
          <span>🌍</span>
          <span>Public</span>
        </div>
      </div>

      {/* Zone du monstre avec fond */}
      <div className='relative aspect-square p-6'>
        {/* Arrière-plan */}
        {equippedAccessories?.background != null && equippedAccessories.background.imagePath != null && (
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{
              backgroundImage: `url(${equippedAccessories.background.imagePath})`
            }}
          />
        )}

        {/* Monstre */}
        <div className='relative h-full flex items-center justify-center'>
          {monster.draw != null && (
            <div
              className='w-full h-full'
              dangerouslySetInnerHTML={{ __html: monster.draw }}
            />
          )}
        </div>

        {/* Accessoires par-dessus */}
        {equippedAccessories != null && (
          <div className='absolute inset-0 pointer-events-none'>
            {equippedAccessories.hat?.imagePath != null && (
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20'>
                <img
                  src={equippedAccessories.hat.imagePath}
                  alt={equippedAccessories.hat.name}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
            {equippedAccessories.glasses?.imagePath != null && (
              <div className='absolute top-1/3 left-1/2 -translate-x-1/2 w-16 h-16'>
                <img
                  src={equippedAccessories.glasses.imagePath}
                  alt={equippedAccessories.glasses.name}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
            {equippedAccessories.shoes?.imagePath != null && (
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20'>
                <img
                  src={equippedAccessories.shoes.imagePath}
                  alt={equippedAccessories.shoes.name}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className='p-4 border-t border-latte-200 bg-linear-to-b from-white to-latte-25'>
        {/* Nom et niveau */}
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-bold text-lg text-blueberry-950 truncate flex-1'>
            {monster.name}
          </h3>
          <div className='flex items-center gap-1 px-2 py-1 bg-blueberry-100 text-blueberry-700 rounded-lg text-sm font-semibold'>
            <span>⭐</span>
            <span>Niv. {monster.level ?? 1}</span>
          </div>
        </div>

        {/* État */}
        <div className='mb-3'>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${stateConfig.className}`}>
            <span>{stateConfig.emoji}</span>
            <span>{stateConfig.label}</span>
          </div>
        </div>

        {/* Créateur */}
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span>👤</span>
          <span className='truncate'>
            Par <span className='font-medium text-blueberry-700'>{monster.owner?.username ?? 'Anonyme'}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
