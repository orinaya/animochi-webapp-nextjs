/**
 * MonsterEquipmentSection - Section des équipements du monstre
 *
 * Affiche les équipements du monstre (casquette, chaussures, lunettes)
 * Structure vide pour l'instant, sera implémentée plus tard
 *
 * Respecte le principe SRP : Gère uniquement l'affichage des équipements
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-equipment-section
 */

'use client'

import type { Monster } from '@/types/monster'

interface MonsterEquipmentSectionProps {
  /** Données du monstre */
  monster: Monster
}

/**
 * Section des équipements du monstre
 *
 * @param {MonsterEquipmentSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section des équipements
 */
export default function MonsterEquipmentSection({
  monster
}: MonsterEquipmentSectionProps): React.ReactNode {
  // Liste des types d'équipements disponibles
  const equipmentSlots = [
    { id: 'hat', icon: '🎩', label: 'Casquette' },
    { id: 'glasses', icon: '👓', label: 'Lunettes' },
    { id: 'shoes', icon: '👟', label: 'Chaussures' }
  ]

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg border border-latte-100'>
      <h2 className='text-xl font-bold text-blueberry-950 mb-4'>
        Équipement
      </h2>

      <div className='grid grid-cols-3 gap-4'>
        {equipmentSlots.map((slot) => (
          <div
            key={slot.id}
            className='flex flex-col items-center justify-center bg-latte-25 rounded-2xl p-6 border-2 border-dashed border-latte-200 hover:border-latte-300 transition-colors cursor-not-allowed'
          >
            <span className='text-4xl mb-2 opacity-30'>{slot.icon}</span>
            <span className='text-xs text-latte-500 font-medium'>
              {slot.label}
            </span>
            <span className='text-xs text-latte-400 mt-1'>
              Bientôt
            </span>
          </div>
        ))}
      </div>

      <p className='text-sm text-latte-500 text-center mt-4'>
        Les équipements seront disponibles prochainement
      </p>
    </div>
  )
}
