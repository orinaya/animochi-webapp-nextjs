/**
 * MonsterAvatarWithEquipment - Avatar du monstre avec slots d'accessoires compacts
 *
 * Affiche l'avatar du monstre à gauche et les 3 slots d'accessoires compacts à droite
 * Optimisé pour économiser l'espace vertical
 *
 * Respecte le principe SRP : Gère uniquement l'affichage avatar + équipement compact
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-avatar-with-equipment
 */

'use client'

import type { Monster } from '@/types/monster'
import type { MonsterAction } from '@/types/monster-actions'
import type { AccessoryCategory } from '@/types/monster-accessories'
import MonsterDetailAvatar from './monster-detail-avatar'
import { getAccessoryByName } from '@/data/accessories-catalog'

interface MonsterAvatarWithEquipmentProps {
  /** Données du monstre */
  monster: Monster
  /** Animation en cours */
  currentAnimation: MonsterAction | null
  /** Callback quand l'animation se termine */
  onAnimationComplete: () => void
  /** Callback pour ouvrir l'inventaire avec une catégorie spécifique */
  onOpenInventory?: (category?: AccessoryCategory) => void
}

/**
 * Avatar avec slots d'équipement compacts
 */
export default function MonsterAvatarWithEquipment ({
  monster,
  currentAnimation,
  onAnimationComplete,
  onOpenInventory
}: MonsterAvatarWithEquipmentProps): React.ReactNode {
  // Configuration des slots d'équipement
  const equipmentSlots: Array<{ id: AccessoryCategory, icon: string, label: string }> = [
    { id: 'hat', icon: '🎩', label: 'Chapeau' },
    { id: 'glasses', icon: '👓', label: 'Lunettes' },
    { id: 'shoes', icon: '👟', label: 'Chaussures' },
    { id: 'background', icon: '🖼️', label: 'Arrière-plan' }
  ]

  /**
   * Récupère l'accessoire équipé pour une catégorie donnée
   */
  const getEquippedAccessory = (category: AccessoryCategory): string | null => {
    return monster.equippedAccessories?.[category] ?? null
  }

  return (
    <div className='bg-white rounded-3xl p-4 shadow-lg border border-latte-100 h-full w-full flex flex-col'>
      {/* Avatar */}
      <div className='flex-1 flex items-center justify-center mb-4 w-full'>
        <MonsterDetailAvatar
          monster={monster}
          currentAnimation={currentAnimation}
          onAnimationComplete={onAnimationComplete}
          onEditBackground={() => {
            if (onOpenInventory != null) {
              onOpenInventory('background')
            }
          }}
        />
      </div>

      {/* Titre Équipement */}
      <h3 className='text-sm font-bold text-blueberry-950 mb-3'>
        Équipement
      </h3>

      {/* Slots d'accessoires en ligne */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {equipmentSlots.map((slot) => {
          const equippedName = getEquippedAccessory(slot.id)
          const equippedAccessory = equippedName != null ? getAccessoryByName(equippedName) : null

          return (
            <button
              key={slot.id}
              onClick={() => {
                if (onOpenInventory != null) {
                  onOpenInventory(slot.id)
                }
              }}
              className={`flex flex-col items-center gap-2 rounded-xl p-3 border-2 transition-all cursor-pointer ${equippedAccessory != null
                ? 'bg-blueberry-50 border-blueberry-300 hover:border-blueberry-400 hover:bg-blueberry-100'
                : 'bg-latte-25 border-dashed border-latte-200 hover:border-latte-300 hover:bg-latte-50'
                }`}
            >
              {/* Icône/SVG de l'accessoire */}
              <div className='w-12 h-12 flex items-center justify-center overflow-hidden rounded'>
                {equippedAccessory != null
                  ? (
                      slot.id === 'background'
                        ? (
                            equippedAccessory.imagePath != null
                              ? (
                                <div
                                  className='w-full h-full bg-cover bg-center'
                                  style={{ backgroundImage: `url(${equippedAccessory.imagePath})` }}
                                />
                                )
                              : equippedAccessory.svg != null
                                ? (
                                  <svg
                                    viewBox='0 0 100 100'
                                    className='w-full h-full'
                                    dangerouslySetInnerHTML={{ __html: equippedAccessory.svg }}
                                  />
                                  )
                                : null
                          )
                        : (
                          <svg
                            viewBox='0 0 80 80'
                            className='w-10 h-10'
                            dangerouslySetInnerHTML={{ __html: equippedAccessory.svg ?? '' }}
                          />
                          )
                    )
                  : (
                    <span className='text-2xl opacity-30'>{slot.icon}</span>
                    )}
              </div>

              {/* Infos textuelles */}
              <div className='text-center w-full'>
                <p className='text-xs font-semibold text-blueberry-900 truncate'>
                  {slot.label}
                </p>
                <p className='text-xs text-blueberry-700 truncate'>
                  {equippedAccessory != null ? equippedAccessory.name : 'Non équipé'}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Message si rien n'est équipé */}
      {(monster.equippedAccessories?.hat == null &&
        monster.equippedAccessories?.glasses == null &&
        monster.equippedAccessories?.shoes == null) && (
          <p className='text-xs text-latte-500 text-center mt-3'>
            Aucun accessoire équipé
          </p>
      )}
    </div>
  )
}
