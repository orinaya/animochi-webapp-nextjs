/**
 * Composant MonsterGalleryCard - Carte Instagram pour la galerie
 *
 * @module components/monsters/monster-gallery-card-instagram
 */

'use client'

import type { MonsterWithOwner, MonsterState } from '@/types'
import Link from 'next/link'
import { useMemo } from 'react'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'

/**
 * Props du composant
 */
interface MonsterGalleryCardInstagramProps {
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
 * Composant carte monstre format Instagram
 *
 * Format Instagram post :
 * - Header avec créateur et badge public
 * - Image carrée du monstre
 * - Footer avec nom, niveau, état
 */
export function MonsterGalleryCardInstagram ({
  monster,
  className = ''
}: MonsterGalleryCardInstagramProps): React.ReactElement {
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
    <article
      className={`
        bg-white rounded-xl border border-latte-200
        hover:shadow-lg transition-shadow duration-300
        overflow-hidden
        ${className}
      `}
    >
      {/* Header type Instagram */}
      <div className='flex items-center justify-between p-4 border-b border-latte-100'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-linear-to-r from-blueberry-400 to-strawberry-400 flex items-center justify-center text-white font-bold'>
            {monster.owner?.username?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className='font-semibold text-blueberry-950'>
              {monster.owner?.username ?? 'Anonyme'}
            </p>
            <p className='text-xs text-gray-500'>
              {monster.createdAt != null ? new Date(monster.createdAt).toLocaleDateString('fr-FR') : ''}
            </p>
          </div>
        </div>
        <div className='bg-blueberry-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1'>
          <span>🌍</span>
          <span>Public</span>
        </div>
      </div>

      {/* Zone du monstre - Carrée comme Instagram */}
      <Link
        href={`/monster/${String(monster.id ?? monster._id)}`}
        className='block relative aspect-square bg-latte-25'
      >
        {/* Arrière-plan */}
        {equippedAccessories?.background?.imagePath != null && (
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{
              backgroundImage: `url(${equippedAccessories.background.imagePath})`
            }}
          />
        )}

        {/* Monstre */}
        <div className='relative h-full flex items-center justify-center p-8'>
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
              <div className='absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24'>
                <img
                  src={equippedAccessories.hat.imagePath}
                  alt={equippedAccessories.hat.name}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
            {equippedAccessories.glasses?.imagePath != null && (
              <div className='absolute top-1/3 left-1/2 -translate-x-1/2 w-20 h-20'>
                <img
                  src={equippedAccessories.glasses.imagePath}
                  alt={equippedAccessories.glasses.name}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
            {equippedAccessories.shoes?.imagePath != null && (
              <div className='absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24'>
                <img
                  src={equippedAccessories.shoes.imagePath}
                  alt={equippedAccessories.shoes.name}
                  className='w-full h-full object-contain'
                />
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Footer type Instagram */}
      <div className='p-4'>
        {/* Nom et niveau */}
        <div className='flex items-center justify-between mb-3'>
          <h3 className='font-bold text-xl text-blueberry-950'>
            {monster.name}
          </h3>
          <div className='flex items-center gap-1 px-3 py-1 bg-blueberry-100 text-blueberry-700 rounded-full text-sm font-semibold'>
            <span>⭐</span>
            <span>Niv. {monster.level ?? 1}</span>
          </div>
        </div>

        {/* État */}
        <div className='mb-3'>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${stateConfig.className}`}>
            <span>{stateConfig.emoji}</span>
            <span>{stateConfig.label}</span>
          </div>
        </div>

        {/* Description si elle existe */}
        {monster.description != null && monster.description !== '' && (
          <p className='text-gray-700 text-sm mb-3'>
            <span className='font-semibold'>{monster.name}</span> {monster.description}
          </p>
        )}

        {/* Statistiques type Instagram (futur: likes, commentaires) */}
        <div className='flex items-center gap-4 text-sm text-gray-500 border-t border-latte-100 pt-3'>
          <button className='hover:text-blueberry-600 transition-colors flex items-center gap-1'>
            <span>❤️</span>
            <span>J'aime</span>
          </button>
          <button className='hover:text-blueberry-600 transition-colors flex items-center gap-1'>
            <span>💬</span>
            <span>Commenter</span>
          </button>
          <button className='hover:text-blueberry-600 transition-colors flex items-center gap-1'>
            <span>📤</span>
            <span>Partager</span>
          </button>
        </div>
      </div>
    </article>
  )
}
