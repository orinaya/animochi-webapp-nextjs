/**
 * Composant MonsterGalleryCard - Carte Instagram pour la galerie
 *
 * @module components/monsters/monster-gallery-card-instagram
 */

'use client'

import type { MonsterWithOwner, MonsterState } from '@/types'
import Link from 'next/link'
import { useMemo } from 'react'
import { FiGlobe } from 'react-icons/fi'
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
  // Récupérer le background équipé
  const equippedBackground = useMemo(() => {
    const equipped = monster.equippedAccessories ?? {}
    if (equipped.background != null) {
      const bgData = [...ACCESSORIES_CATALOG, ...BACKGROUNDS_CATALOG].find(
        acc => acc.name === equipped.background
      )
      return bgData
    }
    return null
  }, [monster.equippedAccessories])

  // Récupérer les accessoires équipés (SVG)
  const equippedAccessoriesData = useMemo(() => {
    const equipped = monster.equippedAccessories ?? {}
    const accessories: Array<{ svg: string, category: string }> = []

    if (equipped.hat != null) {
      const hatData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.hat)
      if (hatData?.svg != null) {
        accessories.push({ svg: hatData.svg, category: 'hat' })
      }
    }

    if (equipped.glasses != null) {
      const glassesData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.glasses)
      if (glassesData?.svg != null) {
        accessories.push({ svg: glassesData.svg, category: 'glasses' })
      }
    }

    if (equipped.shoes != null) {
      const shoesData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.shoes)
      if (shoesData?.svg != null) {
        accessories.push({ svg: shoesData.svg, category: 'shoes' })
      }
    }

    return accessories
  }, [monster.equippedAccessories])

  /**
   * Retourne les styles de positionnement et animations pour chaque catégorie d'accessoire
   */
  const getAccessoryStyles = (category: string): { position: string, size: string, animation: string } => {
    switch (category) {
      case 'hat':
        return {
          position: 'top-[18%] left-[46%] -translate-x-1/2',
          size: 'w-[46%] h-auto',
          animation: 'animate-float-gentle'
        }
      case 'glasses':
        return {
          position: 'top-[20%] left-[46%] -translate-x-1/2',
          size: 'w-[48%] h-auto',
          animation: ''
        }
      case 'shoes':
        return {
          position: 'bottom-[23%] left-[46%] -translate-x-1/2',
          size: 'w-[29%] h-auto',
          animation: 'animate-bounce-vertical'
        }
      default:
        return {
          position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          size: 'w-[50%] h-auto',
          animation: ''
        }
    }
  }

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
        <div className='flex items-center gap-1 text-xs text-blueberry-600 bg-blueberry-50 px-2 py-1 rounded-full'>
          <FiGlobe size={14} />
          <span>Public</span>
        </div>
      </div>

      {/* Zone du monstre - Carrée comme Instagram */}
      <Link
        href={`/monster/${String(monster.id ?? monster._id)}`}
        className='block relative aspect-square overflow-hidden'
      >
        {/* Arrière-plan image */}
        {equippedBackground?.imagePath != null && (
          <div
            className='absolute inset-0 bg-cover bg-center z-0'
            style={{
              backgroundImage: `url(${equippedBackground.imagePath})`
            }}
          />
        )}

        {/* Background SVG (gradient) si c'est un gradient */}
        {equippedBackground?.svg != null && (
          <div className='absolute inset-0 z-0'>
            <svg
              viewBox='0 0 100 100'
              className='w-full h-full'
              preserveAspectRatio='none'
              dangerouslySetInnerHTML={{ __html: equippedBackground.svg }}
            />
          </div>
        )}

        {/* Fond par défaut si pas de background équipé */}
        {equippedBackground == null && (
          <div className='absolute inset-0 bg-linear-to-br from-blueberry-50 to-peach-50 z-0' />
        )}

        {/* Conteneur pour le monstre - centré avec padding */}
        <div className='relative w-full h-full flex items-center justify-center p-8 z-10'>
          {/* Monstre SVG */}
          {monster.draw != null && (
            <div
              className='w-full h-full flex items-center justify-center'
              dangerouslySetInnerHTML={{ __html: monster.draw }}
            />
          )}

          {/* Accessoires par-dessus avec SVG */}
          {equippedAccessoriesData.map((accessory, index) => {
            const styles = getAccessoryStyles(accessory.category)
            return (
              <div
                key={`${accessory.category}-${index}`}
                className={`absolute pointer-events-none z-20 ${styles.position} ${styles.size} ${styles.animation}`}
              >
                <svg viewBox='0 0 80 80' className='w-full h-full'>
                  <g dangerouslySetInnerHTML={{ __html: accessory.svg }} />
                </svg>
              </div>
            )
          })}
        </div>
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
