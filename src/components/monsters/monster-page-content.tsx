/**
 * MonstrePageContent - Contenu de la page de détail d'un monstre
 *
 * Composant client qui orchestre l'affichage complet de la page de détail
 * avec toutes les sections (header, avatar, expérience, équipement, stats, actions)
 *
 * Respecte le principe SRP : Orchestre uniquement la composition des sections
 * Respecte le principe OCP : Extensible via l'ajout de nouvelles sections
 * Respecte le principe DIP : Dépend des abstractions (Monster type)
 *
 * @module components/monsters/monster-page-content
 */

'use client'

import { useState } from 'react'
import type { Monster } from '@/types/monster'
import type { MonsterAction } from '@/types/monster-actions'
import type { AccessoryCategory } from '@/types/monster-accessories'
import { DashboardLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import MonsterDetailHeader from './monster-detail-header'
import MonsterAvatarWithEquipment from './monster-avatar-with-equipment'
import MonsterExperienceSection from './monster-experience-section'
import MonsterStatsSection from './monster-stats-section'
import MonsterActionsSection from './monster-actions-section'

interface MonstrePageContentProps {
  /** Données du monstre */
  monster: Monster
  /** ID du monstre */
  monsterId: string
  /** Session utilisateur */
  session: any
}

/**
 * Composant principal de la page de détail du monstre
 *
 * @param {MonstrePageContentProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La page de détail complète
 *
 * @example
 * ```tsx
 * <MonstrePageContent
 *   monster={monster}
 *   monsterId={id}
 *   session={session}
 * />
 * ```
 */
export default function MonstrePageContent ({
  monster,
  monsterId,
  session
}: MonstrePageContentProps): React.ReactNode {
  const { logout } = useAuth()
  const [currentAnimation, setCurrentAnimation] = useState<MonsterAction | null>(null)
  const [inventoryCategory, setInventoryCategory] = useState<AccessoryCategory | null>(null)

  // Données du fil d'Ariane
  const breadcrumbItems = [
    { label: 'Tableau de bord', href: '/dashboard' },
    { label: 'Mes Monstres', href: '/monstres' },
    { label: monster.name }
  ]

  const handleLogout = (): void => {
    try {
      logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  /**
   * Ouvre l'inventaire avec un filtre de catégorie
   */
  const handleOpenInventory = (category?: AccessoryCategory): void => {
    setInventoryCategory(category ?? null)
  }

  return (
    <DashboardLayout session={session} onLogout={handleLogout} breadcrumbItems={breadcrumbItems}>
      <div className='max-w-7xl mx-auto'>
        {/* Header avec nom et navigation */}
        <MonsterDetailHeader
          monster={monster}
          monsterId={monsterId}
          initialInventoryCategory={inventoryCategory}
          onInventoryCategoryReset={() => { setInventoryCategory(null) }}
        />

        {/* Layout principal en grille - optimisé pour remplir l'écran sans scroll */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6' style={{ height: 'calc(100vh - 280px)' }}>
          {/* Colonne gauche : Avatar + Équipement compact */}
          <div className='h-full'>
            <MonsterAvatarWithEquipment
              monster={monster}
              currentAnimation={currentAnimation}
              onAnimationComplete={() => { setCurrentAnimation(null) }}
              onOpenInventory={handleOpenInventory}
            />
          </div>

          {/* Colonne droite : XP, Stats avec Actions intégrées - Pleine hauteur */}
          <div className='space-y-4 flex flex-col h-full'>
            <MonsterExperienceSection monster={monster} />
            <div className='flex-1 min-h-0'>
              <MonsterStatsSection
                monster={monster}
                actionsComponent={
                  <MonsterActionsSection
                    monster={monster}
                    monsterId={monsterId}
                    onActionStart={(action: MonsterAction) => { setCurrentAnimation(action) }}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
