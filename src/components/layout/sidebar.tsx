/**
 * Sidebar Component - Navigation principale
 * Sidebar avec profil utilisateur (bannière + photo) inspiré de Facebook
 * Respecte les couleurs principales du thème Animochi
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { FiHome, FiAward, FiUser, FiSettings, FiLogOut, FiEdit, FiChevronLeft, FiChevronRight, FiPackage, FiCreditCard, FiImage, FiDollarSign, FiShoppingBag } from 'react-icons/fi'
import type { authClient } from '@/lib/auth/auth-client'
import { useState, useEffect, type ComponentType } from 'react'
import Button from '@/components/ui/button'
import { ProfileAvatarModal } from '@/components/dashboard/profile/profile-avatar-modal'
import { useUserAvatar } from '@/hooks/use-user-avatar'
import { getAnimalImageUrl, getAnimalAvatarByFilename } from '@/lib/avatar/animal-avatar-utils'
import { FaTrophy, FaCoins } from 'react-icons/fa'
import { GiMonsterGrasp, GiShop } from 'react-icons/gi'
import { IoPawOutline, IoTrophyOutline } from 'react-icons/io5'
import { TbPigMoney } from 'react-icons/tb'
import { LuTrophy } from 'react-icons/lu'

type Session = typeof authClient.$Infer.Session

interface SidebarProps {
  session: Session
  onLogout: () => void
}

interface NavSubItem {
  id: string
  name: string
  href: string
  icon: ComponentType<{ className?: string }>
}

interface NavCategory {
  id: string
  name: string
  items?: NavSubItem[]
  href?: string
  icon?: ComponentType<{ className?: string }>
}

const navCategories: NavCategory[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: FiHome
  },
  // {
  //   id: 'game',
  //   name: 'Jeu',
  //   items: [
  { id: 'monsters', name: 'Monstres', href: '/monstres', icon: IoPawOutline },
  // { id: 'inventory', name: 'Inventaire', href: '/inventaire', icon: FiPackage },
  { id: 'shop', name: 'Boutique', href: '/shop', icon: FiShoppingBag },
  //   ]
  // },
  {
    id: 'economy',
    name: 'Économie',
    items: [
      { id: 'wallet', name: 'Wallet', href: '/wallet', icon: TbPigMoney },
      { id: 'transactions', name: 'Transactions', href: '/transactions', icon: FiCreditCard }
    ]
  },
  {
    id: 'community',
    name: 'Communauté',
    items: [
      { id: 'leaderboard', name: 'Classement', href: '/leaderboard', icon: LuTrophy },
      { id: 'gallery', name: 'Galerie', href: '/galerie', icon: FiImage },
      { id: 'achievements', name: 'Succès', href: '/succes', icon: FiAward }
    ]
  },
  {
    id: 'account',
    name: 'Compte',
    items: [
      { id: 'profile', name: 'Profil', href: '/profile', icon: FiUser },
      { id: 'settings', name: 'Paramètres', href: '/settings', icon: FiSettings }
    ]
  }
]

export function Sidebar({ session, onLogout }: SidebarProps): React.ReactNode {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hook pour la gestion de l'avatar
  const {
    selectedAvatar,
    setSelectedAvatar,
    isModalOpen,
    openModal,
    closeModal
  } = useUserAvatar()

  // Éviter le mismatch d'hydratation
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const toggleSidebar = (): void => {
    setIsExpanded(!isExpanded)
  }

  // Obtenir les informations de l'avatar sélectionné
  const avatarInfo = isHydrated ? getAnimalAvatarByFilename(selectedAvatar) : null
  const avatarSrc = isHydrated ? getAnimalImageUrl(selectedAvatar) : '/assets/images/animochi/animals/blaireau.png' // Avatar par défaut

  return (
    <>
      <aside className={`hidden sm:flex h-screen bg-strawberry-100 flex-col justify-between overflow-y-auto transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
        <div className='flex-1'>
          {/* Header avec logo et bouton toggle */}
          <div className='flex items-center justify-between px-3 py-3'>
            {isExpanded && (
              <Image
                src='/animochi-line.svg'
                alt='Animochi'
                width={120}
                height={32}
                className='h-8 w-auto'
                priority
              />
            )}
            <button
              onClick={toggleSidebar}
              className='p-2 rounded-lg hover:bg-strawberry-200 transition-colors text-strawberry-950'
              aria-label={isExpanded ? 'Réduire la sidebar' : 'Agrandir la sidebar'}
            >
              {isExpanded ? <FiChevronLeft className='w-5 h-5' /> : <FiChevronRight className='w-5 h-5' />}
            </button>
          </div>

          {/* Avatar */}
          <div className='flex justify-center mt-4 px-2 mb-4'>
            <button
              onClick={openModal}
              className='relative group'
              aria-label="Modifier l'avatar"
            >
              <div className={`rounded-full bg-white p-0.5 shadow-md hover:shadow-lg transition-all ${isExpanded ? 'w-16 h-16' : 'w-10 h-10'}`}>
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${avatarInfo?.backgroundColor ?? 'bg-blueberry-400'}`}
                  suppressHydrationWarning
                >
                  <Image
                    src={avatarSrc}
                    alt={avatarInfo?.displayName ?? 'Avatar'}
                    width={isExpanded ? 56 : 40}
                    height={isExpanded ? 56 : 40}
                    className='w-full h-full object-cover rounded-full scale-110'
                    priority={false}
                    key={isHydrated ? selectedAvatar : 'default'}
                    suppressHydrationWarning
                  />
                </div>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 bg-strawberry-400 rounded-full flex items-center justify-center text-white border border-white opacity-0 group-hover:opacity-100 transition-opacity ${isExpanded ? 'w-4 h-4' : 'w-3.5 h-3.5'}`}>
                <FiEdit className={isExpanded ? 'w-2.5 h-2.5' : 'w-2 h-2'} />
              </div>
            </button>
          </div>

          {/* Nom utilisateur */}
          {isExpanded && (
            <div className='px-6 text-center mb-4'>
              <h3 className='text-base font-semibold text-strawberry-950'>
                {session.user.name ?? session.user.email?.split('@')[0] ?? 'Utilisateur'}
              </h3>
            </div>
          )}

          {/* Navigation */}
          <nav className='px-1 [@media(min-width:900px)]:px-4 space-y-1 mt-0'>
            {navCategories.map((category) => {
              // Catégorie simple (Dashboard)
              if (category.href != null && category.icon != null) {
                const isActive = pathname === category.href
                const IconComponent = category.icon
                return (
                  <Link key={category.id} href={category.href}>
                    <div
                      className={`flex items-center gap-3 rounded-lg transition-all duration-200 py-2.5
                      ${isExpanded ? 'justify-start px-4' : 'justify-center px-2'}
                      ${isActive
                          ? 'bg-strawberry-200 text-strawberry-950 shadow-sm'
                          : 'text-strawberry-950 hover:bg-strawberry-200 focus:bg-strawberry-200 active:bg-strawberry-200'}
                        `}
                      title={category.name}
                    >
                      <IconComponent className='w-5 h-5' />
                      {isExpanded && <span className='font-light text-sm'>{category.name}</span>}
                    </div>
                  </Link>
                )
              }

              // Catégorie avec sous-catégories
              return (
                <div key={category.id} className='space-y-1'>
                  {/* En-tête de catégorie (version étendue uniquement) */}
                  {isExpanded && (
                    <div className='px-4 py-1.5 text-xs font-semibold text-strawberry-950 uppercase tracking-wider opacity-60'>
                      {category.name}
                    </div>
                  )}

                  {/* Sous-catégories */}
                  {category.items?.map((item) => {
                    const isActive = pathname === item.href
                    const IconComponent = item.icon
                    return (
                      <Link key={item.id} href={item.href}>
                        <div
                          className={`flex items-center gap-3 rounded-lg transition-all duration-200 py-2
                          ${isExpanded ? 'justify-start px-4 pl-6' : 'justify-center px-2'}
                          ${isActive
                              ? 'bg-strawberry-200 text-strawberry-950 shadow-sm'
                              : 'text-strawberry-950 hover:bg-strawberry-200 focus:bg-strawberry-200 active:bg-strawberry-200'}
                            `}
                          title={item.name}
                        >
                          <IconComponent className='w-5 h-5' />
                          {isExpanded && <span className='font-light text-sm'>{item.name}</span>}
                        </div>
                      </Link>
                    )
                  })}

                  {/* Séparateur entre catégories (version étendue uniquement) */}
                  {isExpanded && (
                    <div className='mx-4 border-t border-strawberry-200 opacity-30 my-1.5' />
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Actions du bas */}
        <div className='px-1 pb-6'>
          {!isExpanded
            ? (
              /* Version compacte - icône uniquement */
              <div className='flex flex-col items-center'>
                <button
                  onClick={onLogout}
                  className='w-full flex items-center justify-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors'
                  title='Se déconnecter'
                >
                  <FiLogOut className='w-5 h-5' />
                </button>
              </div>
            )
            : (
              /* Version complète - avec texte */
              <div className='px-3'>
                <Button
                  onClick={onLogout}
                  size='sm'
                  variant='ghost'
                  color='danger'
                  iconBefore={FiLogOut}
                  className='w-full'
                >
                  Se déconnecter
                </Button>
              </div>
            )}
        </div>
      </aside>

      {/* Modal de sélection d'avatar - Rendu seulement après hydratation */}
      {isHydrated && (
        <ProfileAvatarModal
          isOpen={isModalOpen}
          onClose={closeModal}
          currentAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
        />
      )}
    </>
  )
}
