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

import { useState, useEffect } from 'react'
import { useWallet } from '@/hooks/use-wallet'
import type { Monster } from '@/types/monster/monster'
import type { MonsterAction } from '@/types/monster/monster-actions'
import type { AccessoryCategory } from '@/types/monster/monster-accessories'
import { DashboardLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import MonsterDetailHeader from './monster-detail-header'
import MonsterAvatarWithEquipment from './monster-avatar-with-equipment'
import MonsterExperienceSection from './monster-experience-section'
import MonsterActionsSection from './monster-actions-section'
import MonsterStatsSection from './monster-stats-section'

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
  monster: initialMonster,
  monsterId,
  session
}: MonstrePageContentProps): React.ReactNode {
  const { logout } = useAuth()
  const [currentAnimation, setCurrentAnimation] = useState<MonsterAction | null>(null)
  const [inventoryCategory, setInventoryCategory] = useState<AccessoryCategory | null>(null)
  const { refetch: refetchWallet } = useWallet()

  // État local pour le monstre (XP/niveau réactif)
  const [monster, setMonster] = useState<Monster | null>(initialMonster)

  // Gestion du cas où le monstre est null ou incomplet (checks explicites)
  const isMonsterInvalid =
    monster == null ||
    typeof monster.name !== 'string' || monster.name.trim() === '' ||
    typeof monster.level !== 'number' || Number.isNaN(monster.level) ||
    typeof monster.experience !== 'number' || Number.isNaN(monster.experience)

  if (isMonsterInvalid) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-strawberry-700'>
        <div className='text-2xl font-bold mb-2'>Monstre introuvable ou données incomplètes</div>
        <div className='text-base'>Vérifie l&#39;URL ou réessaie plus tard.</div>
      </div>
    )
  }

  // Polling automatique toutes les 5 min pour rafraîchir l'état du monstre
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/monsters/${monsterId}`)
        .then(async (res) => res.ok ? await res.json() : null)
        .then((data: any) => {
          if (data?.monster != null) {
            setMonster((prev) => ({ ...prev, ...data.monster }))
          }
        })
        .catch(() => { /* ignore */ })
    }, 5 * 60 * 1000) // 5 minutes
    return () => clearInterval(interval)
  }, [monsterId])

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
          onMonsterUpdate={setMonster}
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

          {/* Colonne droite : XP et Actions encadrées - Pleine hauteur */}
          <div className='flex flex-col h-full gap-6'>
            <div className='shrink-0'>
              <MonsterExperienceSection monster={monster} />
            </div>
            <div className='flex-1 min-h-0'>
              <MonsterStatsSection
                monster={monster}
                actionsComponent={
                  <MonsterActionsSection
                    monster={monster}
                    monsterId={monsterId}
                    setMonster={setMonster}
                    onActionStart={(action: MonsterAction) => { setCurrentAnimation(action) }}
                    onActionDone={() => { void refetchWallet() }}
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
