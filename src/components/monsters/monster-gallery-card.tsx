/**
 * Composant MonsterGalleryCard - Carte d'affichage d'un monstre dans la galerie
 *
 * @module components/monsters/monster-gallery-card
 */

'use client'

import type { MonsterWithOwner, MonsterState } from '@/types'
import Link from 'next/link'
import { useMemo } from 'react'
import { FiGlobe } from 'react-icons/fi'
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
  },
  bored: {
    label: 'Ennuyé',
    emoji: '🥱',
    className: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  sick: {
    label: 'Malade',
    emoji: '🤒',
    className: 'bg-latte-100 text-latte-700 border-latte-300'
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
  // Récupérer le background équipé
  const equippedBackground = useMemo(() => {
    const equipped = (monster.equippedAccessories ?? { hat: null, glasses: null, shoes: null, background: null })
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
    const equipped = (monster.equippedAccessories ?? { hat: null, glasses: null, shoes: null, background: null })
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
          position: 'top-[4%] left-[46%] -translate-x-1/2',
          size: 'w-[60%] h-auto',
          animation: 'animate-float-gentle'
        }
      case 'glasses':
        return {
          position: 'top-[12%] left-[46%] -translate-x-1/2',
          size: 'w-[50%] h-auto',
          animation: ''
        }
      case 'shoes':
        return {
          position: 'bottom-[8%] left-[46%] -translate-x-1/2',
          size: 'w-[40%] h-auto',
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
    <Link
      href={`/dashboard/monsters/${String(monster.id ?? monster._id)}`}
      className={`
        group block bg-white rounded-2xl border-2 border-latte-200
        hover:border-blueberry-400 hover:shadow-lg
        transition-all duration-300 overflow-hidden
        ${className}
      `}
    >
      {/* Zone du monstre avec fond */}
      <div className='relative aspect-square p-6 overflow-hidden'>
        {/* Badge Public */}
        <div className='absolute top-3 right-3 z-30'>
          <div className='flex items-center gap-1 text-xs text-blueberry-600 bg-blueberry-50 px-2 py-1 rounded-full'>
            <FiGlobe size={14} />
            <span>Public</span>
          </div>
        </div>

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

        {/* Conteneur pour le monstre - centré */}
        <div className='relative w-full h-full flex items-center justify-center z-10'>
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
            Par <span className='font-medium text-blueberry-700'>{monster.owner?.name ?? 'Anonyme'}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
