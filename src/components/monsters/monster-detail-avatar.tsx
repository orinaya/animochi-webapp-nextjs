/**
 * MonsterDetailAvatar - Avatar du monstre en grand format
 *
 * Affiche l'image SVG du monstre de manière centrée et responsive
 * avec les accessoires équipés superposés
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de l'avatar
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-detail-avatar
 */

'use client'

import { useMemo } from 'react'
import type { Monster } from '@/types/monster'
import type { MonsterAction } from '@/types/monster-actions'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import ActionAnimation from './action-animation'

interface MonsterDetailAvatarProps {
  /** Données du monstre */
  monster: Monster
  /** Animation d'action en cours */
  currentAnimation?: MonsterAction | null
  /** Callback quand l'animation est terminée */
  onAnimationComplete?: () => void
}

/**
 * Retourne l'emoji correspondant à l'état du monstre
 *
 * @param {string | null} state - État du monstre
 * @returns {string} Emoji représentant l'état
 */
function getStateEmoji (state: string | null): string {
  const stateEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    hungry: '🍎',
    sleepy: '😴'
  }

  return stateEmojis[state ?? 'happy'] ?? '😊'
}

/**
 * Avatar du monstre en détail avec accessoires
 *
 * @param {MonsterDetailAvatarProps} props - Les propriétés du composant
 * @returns {React.ReactNode} L'avatar du monstre
 */
export default function MonsterDetailAvatar ({
  monster,
  currentAnimation = null,
  onAnimationComplete
}: MonsterDetailAvatarProps): React.ReactNode {
  const stateEmoji = getStateEmoji(monster.state ?? null)

  /**
   * Récupère les accessoires équipés depuis le catalogue
   */
  const equippedAccessoriesData = useMemo(() => {
    const equipped = monster.equippedAccessories ?? {}
    const accessories: Array<{ svg: string, category: string }> = []

    // Récupérer chaque accessoire équipé depuis le catalogue
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

  return (
    <div className='relative bg-linear-to-br from-blueberry-50 to-peach-50 rounded-3xl p-8 shadow-lg overflow-hidden'>
      {/* Animation d'action - couvre toute la carte */}
      {currentAnimation !== null && (
        <ActionAnimation
          action={currentAnimation}
          onComplete={onAnimationComplete}
        />
      )}

      {/* Badge d'état */}
      <div className='absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-md z-10'>
        <span className='text-2xl'>{stateEmoji}</span>
      </div>

      {/* Image SVG du monstre avec accessoires */}
      <div className='relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] z-0'>
        {monster.draw != null && monster.draw !== ''
          ? (
            <div className='relative w-full max-w-md mx-auto'>
              {/* SVG du monstre */}
              <div
                className='w-full flex items-center justify-center'
                dangerouslySetInnerHTML={{ __html: monster.draw }}
              />

              {/* Overlay des accessoires équipés */}
              {equippedAccessoriesData.length > 0 && (
                <div className='absolute inset-0 pointer-events-none'>
                  <svg viewBox='0 0 80 80' className='w-full h-full'>
                    {equippedAccessoriesData.map((accessory, index) => (
                      <g
                        key={`${accessory.category}-${index}`}
                        dangerouslySetInnerHTML={{ __html: accessory.svg }}
                      />
                    ))}
                  </svg>
                </div>
              )}
            </div>
            )
          : (
            <div className='text-center text-latte-600'>
              <span className='text-6xl mb-4 block'>🐾</span>
              <p>Aucune apparence définie</p>
            </div>
            )}
      </div>
    </div>
  )
}
