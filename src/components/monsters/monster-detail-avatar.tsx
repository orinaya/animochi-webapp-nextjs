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
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'
import ActionAnimation from './action-animation'

interface MonsterDetailAvatarProps {
  /** Données du monstre */
  monster: Monster
  /** Animation d'action en cours */
  currentAnimation?: MonsterAction | null
  /** Callback quand l'animation est terminée */
  onAnimationComplete?: () => void
  /** Callback pour ouvrir la modal d'inventaire sur la catégorie background */
  onEditBackground?: () => void
}

/**
 * Retourne l'emoji correspondant à l'état du monstre
 *
 * @param {string | null} state - État du monstre
 * @returns {string} Emoji représentant l'état
 */
function getStateEmoji(state: string | null): string {
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
export default function MonsterDetailAvatar({
  monster,
  currentAnimation = null,
  onAnimationComplete,
  onEditBackground
}: MonsterDetailAvatarProps): React.ReactNode {
  const stateEmoji = getStateEmoji(monster.state ?? null)

  /**
   * Récupère le background équipé depuis le catalogue
   */
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

  /**
   * Récupère les accessoires équipés depuis le catalogue
   */
  const equippedAccessoriesData = useMemo(() => {
    const equipped = monster.equippedAccessories ?? {}
    const accessories: Array<{ svg: string, category: string }> = []

    console.log('🎨 MonsterDetailAvatar - Accessoires équipés:', {
      equipped,
      monsterName: monster.name
    })

    // Récupérer chaque accessoire équipé depuis le catalogue
    if (equipped.hat != null) {
      const hatData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.hat)
      console.log('🎩 Chapeau:', { name: equipped.hat, found: hatData != null })
      if (hatData?.svg != null) {
        accessories.push({ svg: hatData.svg, category: 'hat' })
      }
    }

    if (equipped.glasses != null) {
      const glassesData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.glasses)
      console.log('👓 Lunettes:', { name: equipped.glasses, found: glassesData != null })
      if (glassesData?.svg != null) {
        accessories.push({ svg: glassesData.svg, category: 'glasses' })
      }
    }

    if (equipped.shoes != null) {
      const shoesData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.shoes)
      console.log('👟 Chaussures:', { name: equipped.shoes, found: shoesData != null })
      if (shoesData?.svg != null) {
        accessories.push({ svg: shoesData.svg, category: 'shoes' })
      }
    }

    console.log('📦 Total accessoires à afficher:', accessories.length)

    return accessories
  }, [monster.equippedAccessories, monster.name])

  /**
   * Retourne les styles de positionnement et taille pour chaque catégorie d'accessoire
   */
  const getAccessoryStyles = (category: string): { position: string, size: string, animation: string } => {
    switch (category) {
      case 'hat':
        // Chapeau au-dessus de la tête du chat - animation flottante douce
        return {
          position: 'top-[-10%] left-[46%] -translate-x-1/2',
          size: 'w-[50%] h-auto',
          animation: 'animate-float-gentle'
        }
      case 'glasses':
        // Lunettes devant les yeux du chat - pas d'animation
        return {
          position: 'top-[2%] left-[46%] -translate-x-1/2',
          size: 'w-[38%] h-auto',
          animation: ''
        }
      case 'shoes':
        // Chaussures au bas du chat - rebond vertical comme les pattes
        return {
          position: 'bottom-[1%] left-[46%] -translate-x-1/2',
          size: 'w-[28%] h-auto',
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

  return (
    <div
      className='relative rounded-3xl p-4 shadow-lg overflow-hidden w-full'
      style={equippedBackground?.imagePath != null
        ? { backgroundImage: `url(${equippedBackground.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}}
    >
      {/* Background SVG (gradient) si c'est un gradient */}
      {equippedBackground?.svg != null && (
        <div className='absolute inset-0 -z-10'>
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
        <div className='absolute inset-0 bg-linear-to-br from-blueberry-50 to-peach-50 -z-20' />
      )}

      {/* Animation d'action - couvre toute la carte */}
      {currentAnimation !== null && (
        <ActionAnimation
          action={currentAnimation}
          onComplete={onAnimationComplete}
        />
      )}

      {/* Badge d'état */}
      <div className='absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 shadow-md z-10'>
        <span className='text-xl'>{stateEmoji}</span>
      </div>

      {/* Bouton d'édition du background */}
      {onEditBackground != null && (
        <button
          onClick={onEditBackground}
          className='absolute bottom-3 right-3 bg-white hover:bg-blueberry-50 rounded-full p-2 shadow-md z-10 transition-all hover:scale-110'
          title='Modifier l&#39;arrière-plan'
        >
          <span className='text-xl'>🖼️</span>
        </button>
      )}

      {/* Image SVG du monstre avec accessoires - Hauteur réduite */}
      <div className='relative flex items-center justify-center min-h-[200px] sm:min-h-[280px] z-0'>
        {monster.draw != null && monster.draw !== ''
          ? (
            <div className='relative w-full max-w-sm mx-auto'>
              {/* SVG du monstre */}
              <div
                className='w-full flex items-center justify-center'
                dangerouslySetInnerHTML={{ __html: monster.draw }}
              />

              {/* Overlay des accessoires équipés avec positionnement précis */}
              {equippedAccessoriesData.map((accessory, index) => {
                const styles = getAccessoryStyles(accessory.category)
                return (
                  <div
                    key={`${accessory.category}-${index}`}
                    className={`absolute pointer-events-none ${styles.position} ${styles.size} ${styles.animation}`}
                  >
                    <svg viewBox='0 0 80 80' className='w-full h-full'>
                      <g dangerouslySetInnerHTML={{ __html: accessory.svg }} />
                    </svg>
                  </div>
                )
              })}
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
