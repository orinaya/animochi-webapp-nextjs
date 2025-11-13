/**
 * BottomTabBar - Barre de navigation inférieure pour mobile
 *
 * Affiche 5 boutons : Accueil, Monstres, Créer (monstre), Classement, Boutique
 * Visible uniquement sur mobile (< 768px)
 *
 * Respecte le principe SRP : Gère uniquement la navigation mobile inférieure
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/layout/bottom-tabbar
 */

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiHome, FiShoppingBag, FiAward, FiPlus } from 'react-icons/fi'
import { IoPawOutline } from 'react-icons/io5'
import { useState } from 'react'
import { CreateMonsterModal } from '@/components/monsters/create-monster-modal'
import { createMonster } from '@/actions/monsters.action'
import { toast } from 'react-toastify'
import type { ComponentType } from 'react'
import type { Monster } from '@/types/monster'

interface TabItem {
  id: string
  name: string
  href?: string
  icon: ComponentType<{ className?: string, size?: number }>
  action?: 'create-monster'
  color?: string
}

const tabItems: TabItem[] = [
  {
    id: 'home',
    name: 'Accueil',
    href: '/dashboard',
    icon: FiHome,
    color: 'blueberry'
  },
  {
    id: 'monsters',
    name: 'Monstres',
    href: '/monstres',
    icon: IoPawOutline,
    color: 'strawberry'
  },
  {
    id: 'create',
    name: 'Créer',
    icon: FiPlus,
    action: 'create-monster',
    color: 'peach'
  },
  {
    id: 'leaderboard',
    name: 'Classement',
    href: '/leaderboard',
    icon: FiAward,
    color: 'blueberry'
  },
  {
    id: 'shop',
    name: 'Boutique',
    href: '/shop',
    icon: FiShoppingBag,
    color: 'strawberry'
  }
]

/**
 * Composant BottomTabBar
 * Navigation inférieure pour mobile uniquement
 */
export function BottomTabBar(): React.ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)

  /**
   * Gère le clic sur un bouton de tab
   */
  const handleTabClick = (item: TabItem): void => {
    if (item.action === 'create-monster') {
      setShowCreateModal(true)
    }
  }

  /**
   * Gère la création d'un nouveau monstre
   */
  const handleCreateMonster = async (monsterData: Partial<Monster>): Promise<void> => {
    try {
      await createMonster(monsterData as Monster)
      toast.success(`${monsterData.name ?? 'Monstre'} a été créé avec succès !`)
      setShowCreateModal(false)
      router.refresh()
    } catch (error) {
      console.error('Erreur création monstre:', error)
      toast.error('Une erreur est survenue lors de la création')
    }
  }

  return (
    <>
      {/* Barre de navigation fixe en bas - visible uniquement sur mobile */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-latte-200 shadow-lg z-50'>
        <div className='flex items-center justify-around px-2 py-2 safe-area-bottom'>
          {tabItems.map((item) => {
            const isActive = item.href != null && pathname === item.href
            const IconComponent = item.icon
            const isCreateButton = item.id === 'create'

            // Bouton spécial pour créer (plus grand, arrondi)
            if (isCreateButton) {
              return (
                <button
                  key={item.id}
                  onClick={() => { handleTabClick(item) }}
                  className='flex flex-col items-center justify-center relative -mt-6'
                  aria-label={item.name}
                >
                  <div className='bg-peach-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-peach-500 transition-all duration-200 active:scale-95'>
                    <IconComponent className='w-7 h-7' />
                  </div>
                  <span className='text-xs text-peach-600 font-medium mt-1'>
                    {item.name}
                  </span>
                </button>
              )
            }

            // Boutons normaux avec ou sans lien
            if (item.href != null) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className='flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors duration-200'
                >
                  <div className={`flex flex-col items-center ${isActive ? 'text-blueberry-600' : 'text-latte-500'}`}>
                    <IconComponent size={24} />
                    <span className='text-xs font-medium mt-1 text-center'>
                      {item.name}
                    </span>
                  </div>
                </Link>
              )
            }

            // Bouton action sans lien
            return (
              <button
                key={item.id}
                onClick={() => { handleTabClick(item) }}
                className='flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors duration-200'
                aria-label={item.name}
              >
                <div className='flex flex-col items-center text-latte-500'>
                  <IconComponent size={24} />
                  <span className='text-xs font-medium mt-1 text-center'>
                    {item.name}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Modal de création de monstre */}
      <CreateMonsterModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false) }}
        onCreate={handleCreateMonster}
      />
    </>
  )
}
