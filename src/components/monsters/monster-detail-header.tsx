/**
 * MonsterDetailHeader - Header de la page de détail du monstre
 *
 * Affiche le nom du monstre et les boutons de navigation (Inventaire, Boutique)
 *
 * Respecte le principe SRP : Gère uniquement l'affichage du header
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-detail-header
 */

'use client'

import Button from '@/components/ui/button'
import type { Monster } from '@/types/monster'

interface MonsterDetailHeaderProps {
  /** Données du monstre */
  monster: Monster
}

/**
 * Header de la page de détail du monstre
 *
 * @param {MonsterDetailHeaderProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le header avec nom et navigation
 */
export default function MonsterDetailHeader({
  monster
}: MonsterDetailHeaderProps): React.ReactNode {
  return (
    <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
      {/* Nom du monstre */}
      <div>
        <h1 className='text-3xl sm:text-4xl font-bold text-blueberry-950'>
          {monster.name}
        </h1>
        <p className='text-latte-600 mt-1'>
          Niveau {monster.level ?? 1}
        </p>
      </div>

      {/* Boutons de navigation */}
      <div className='flex gap-3'>
        <Button
          variant='outline'
          color='latte'
          size='md'
          disabled
        >
          🎒 Inventaire
        </Button>
        <Button
          variant='outline'
          color='latte'
          size='md'
          disabled
        >
          🛍️ Boutique
        </Button>
      </div>
    </header>
  )
}
