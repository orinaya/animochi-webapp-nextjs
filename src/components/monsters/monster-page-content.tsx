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

import type { Monster } from '@/types/monster'
import { DashboardLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import MonsterDetailHeader from './monster-detail-header'
import MonsterDetailAvatar from './monster-detail-avatar'
import MonsterExperienceSection from './monster-experience-section'
import MonsterEquipmentSection from './monster-equipment-section'
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
export default function MonstrePageContent({
  monster,
  monsterId,
  session
}: MonstrePageContentProps): React.ReactNode {
  const { logout } = useAuth()

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

  return (
    <DashboardLayout session={session} onLogout={handleLogout} breadcrumbItems={breadcrumbItems}>
      {/* Header avec nom et navigation */}
      <MonsterDetailHeader monster={monster} />

      {/* Layout principal en grille */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Colonne gauche : Avatar et Expérience */}
        <div className='space-y-8'>
          <MonsterDetailAvatar monster={monster} />
          <MonsterExperienceSection monster={monster} />
        </div>

        {/* Colonne droite : Équipement, Stats et Actions */}
        <div className='space-y-8'>
          <MonsterEquipmentSection monster={monster} />
          <MonsterStatsSection monster={monster} />
          <MonsterActionsSection
            monster={monster}
            monsterId={monsterId}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
