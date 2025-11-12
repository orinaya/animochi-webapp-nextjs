/**
 * MonsterEquipmentSection - Section des équipements du monstre
 *
 * Affiche les équipements du monstre (chapeau, lunettes, chaussures)
 * avec possibilité de les gérer
 *
 * Respecte le principe SRP : Gère uniquement l'affichage des équipements
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-equipment-section
 */

'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Monster } from '@/types/monster'
import type { AccessoryCategory } from '@/types/monster-accessories'
import { getAccessoryByName } from '@/data/accessories-catalog'

interface MonsterEquipmentSectionProps {
  /** Données du monstre */
  monster: Monster
  /** ID du monstre */
  monsterId?: string
  /** Callback pour ouvrir l'inventaire avec une catégorie spécifique */
  onOpenInventory?: (category?: AccessoryCategory) => void
}

/**
 * Section des équipements du monstre
 *
 * @param {MonsterEquipmentSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section des équipements
 */
export default function MonsterEquipmentSection ({
  monster,
  monsterId,
  onOpenInventory
}: MonsterEquipmentSectionProps): React.ReactNode {
  const router = useRouter()

  // Configuration des slots d'équipement
  const equipmentSlots: Array<{ id: AccessoryCategory, icon: string, label: string }> = [
    { id: 'hat', icon: '🎩', label: 'Chapeau' },
    { id: 'glasses', icon: '👓', label: 'Lunettes' },
    { id: 'shoes', icon: '👟', label: 'Chaussures' }
  ]

  /**
   * Retire un accessoire équipé
   */
  const handleUnequip = async (category: AccessoryCategory): Promise<void> => {
    if (monsterId == null) return

    try {
      const response = await fetch('/api/accessories/unequip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monsterId, category })
      })

      if (response.ok) {
        toast.success('Accessoire retiré !')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error ?? 'Erreur lors du retrait')
      }
    } catch (error) {
      console.error('Erreur lors du retrait:', error)
      toast.error('Impossible de retirer cet accessoire')
    }
  }

  /**
   * Récupère l'accessoire équipé pour une catégorie donnée
   */
  const getEquippedAccessory = (category: AccessoryCategory): string | null => {
    const equippedName = monster.equippedAccessories?.[category] ?? null
    console.log(`🔍 Équipement ${category}:`, {
      equippedName,
      allEquipped: monster.equippedAccessories
    })
    return equippedName
  }

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg border border-latte-100'>
      <h2 className='text-xl font-bold text-blueberry-950 mb-4'>
        Équipement
      </h2>

      <div className='grid grid-cols-3 gap-4'>
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
              className={`flex flex-col items-center justify-center rounded-2xl p-4 border-2 transition-all cursor-pointer ${equippedAccessory != null
                ? 'bg-blueberry-50 border-blueberry-300 hover:border-blueberry-400 hover:bg-blueberry-100'
                : 'bg-latte-25 border-dashed border-latte-200 hover:border-latte-300 hover:bg-latte-50'
                }`}
            >
              {equippedAccessory != null
                ? (
                  <>
                    <span className='text-3xl mb-2'>{equippedAccessory.emoji}</span>
                    <span className='text-xs text-blueberry-900 font-medium text-center mb-2'>
                      {equippedAccessory.name}
                    </span>
                    <span className='text-xs text-blueberry-600 font-semibold'>
                      Changer
                    </span>
                    {monsterId != null && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          void handleUnequip(slot.id)
                        }}
                        className='text-xs text-strawberry-600 hover:text-strawberry-700 font-semibold mt-1 cursor-pointer'
                      >
                        Retirer
                      </span>
                    )}
                  </>
                  )
                : (
                  <>
                    <span className='text-3xl mb-2 opacity-30'>{slot.icon}</span>
                    <span className='text-xs text-latte-500 font-medium'>
                      {slot.label}
                    </span>
                    <span className='text-xs text-blueberry-600 font-semibold mt-1'>
                      Équiper
                    </span>
                  </>
                  )}
            </button>
          )
        })}
      </div>

      {(monster.equippedAccessories?.hat == null &&
        monster.equippedAccessories?.glasses == null &&
        monster.equippedAccessories?.shoes == null) && (
          <p className='text-sm text-latte-500 text-center mt-4'>
            Aucun accessoire équipé. Visitez la boutique pour en acheter !
          </p>
      )}
    </div>
  )
}
