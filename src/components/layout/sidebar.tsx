/**
 * Sidebar Component - Navigation principale
 * Sidebar avec profil utilisateur (bannière + photo) inspiré de Facebook
 * Respecte les couleurs principales du thème Animochi
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { FiHome, FiUsers, FiDollarSign, FiAward, FiUser, FiSettings, FiLogOut, FiCamera, FiEdit } from 'react-icons/fi'
import type { authClient } from '@/lib/auth/auth-client'
import { useState, useRef, type ComponentType } from 'react'
import Button from '@/components/ui/button'
import { ProfileAvatarModal } from '@/components/dashboard/profile/profile-avatar-modal'
import { useUserAvatar } from '@/hooks/use-user-avatar'
import { getAnimalImageUrl, getAnimalAvatarByFilename } from '@/lib/avatar/animal-avatar-utils'

type Session = typeof authClient.$Infer.Session

interface SidebarProps {
  session: Session
  onLogout: () => void
}

interface NavItem {
  id: string
  name: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { id: 'dashboard', name: 'Tableau de bord', href: '/dashboard', icon: FiHome },
  { id: 'creatures', name: 'Mes Créatures', href: '/creature', icon: FiUsers },
  { id: 'wallet', name: 'Mon Wallet', href: '/wallet', icon: FiDollarSign },
  { id: 'leaderboard', name: 'Classement', href: '/leaderboard', icon: FiAward },
  { id: 'profile', name: 'Profil', href: '/profile', icon: FiUser }
]

export function Sidebar ({ session, onLogout }: SidebarProps): React.ReactNode {
  const pathname = usePathname()
  // const { wallet } = useWallet()
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Hook pour la gestion de l'avatar
  const {
    selectedAvatar,
    setSelectedAvatar,
    isModalOpen,
    openModal,
    closeModal
  } = useUserAvatar()

  const handleBannerClick = (): void => {
    bannerInputRef.current?.click()
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file != null) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Obtenir les informations de l'avatar sélectionné
  const avatarInfo = getAnimalAvatarByFilename(selectedAvatar)

  return (
    <>
      <aside className='h-screen bg-strawberry-100 flex flex-col justify-between overflow-y-auto flex-1'>
        {/* Profil utilisateur avec bannière */}
        <div className='flex-1'>
          <div className='relative mb-8'>
            {/* Bannière de profil */}
            <div
              className='h-24 bg-linear-to-br from-strawberry-400 to-peach-300 relative overflow-hidden cursor-pointer group'
              onClick={handleBannerClick}
            >
              {(bannerImage != null && bannerImage.length > 0)
                ? (
                  <Image
                    src={bannerImage}
                    alt='Bannière de profil'
                    fill
                    className='object-cover'
                  />
                  )
                : (
                  <>
                    {/* Pattern décoratif */}
                    <div className='absolute inset-0 opacity-20'>
                      <div className='absolute top-2 right-2 text-4xl'>🌸</div>
                      <div className='absolute bottom-2 left-2 text-3xl'>✨</div>
                    </div>
                  </>
                  )}
              {/* Overlay pour changer la bannière */}
              <div className='absolute inset-0 bg-strawberry-400 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center'>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2'>
                  <FiCamera className='w-5 h-5 text-strawberry-950' />
                </div>
              </div>
              <input
                ref={bannerInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleBannerChange}
              />
            </div>

            {/* Photo de profil */}
            <div className='absolute left-1/2 -translate-x-1/2 -bottom-12'>
              <div className='relative group'>
                {/* Cercle de la photo */}
                <div className='w-24 h-24 rounded-full bg-white p-1 shadow-lg'>
                  <div className={`w-full h-full rounded-full p-1 flex items-center justify-center overflow-hidden ${avatarInfo?.backgroundColor ?? 'bg-blueberry-400'}`}>
                    <Image
                      src={getAnimalImageUrl(selectedAvatar)}
                      alt={avatarInfo?.displayName ?? 'Avatar'}
                      width={80}
                      height={80}
                      className='w-full h-full object-cover rounded-full scale-110'
                    />
                  </div>
                </div>
                {/* Bouton d'édition de l'avatar */}
                <button
                  onClick={openModal}
                  className='absolute -bottom-1 -right-1 bg-strawberry-400 rounded-full w-7 h-7 flex items-center justify-center text-white border-2 border-white shadow-md hover:bg-strawberry-500 transition-colors group'
                  aria-label="Modifier l'avatar"
                >
                  <FiEdit className='w-3 h-3' />
                </button>
              </div>
            </div>
          </div>

          {/* Nom et statut utilisateur */}
          <div className='mt-16 px-6 text-center mb-6'>
            <h3 className='text-lg font-semibold text-strawberry-950 mb-1'>
              {session.user.name ?? session.user.email?.split('@')[0] ?? 'Utilisateur'}
            </h3>
            <p className='text-sm text-strawberry-950 opacity-70 mb-2'>Dresseur Novice</p>

            {/* Badge du wallet */}
            {/* {(wallet != null) && (
              <div className='inline-flex items-center gap-1.5 bg-blueberry-950 text-white px-3 py-1 rounded-full text-sm font-medium'>
                <span>{wallet.balance.toLocaleString('fr-FR')}</span>
                <span className='text-xs opacity-90'>Ⱥ</span>
              </div>
            )} */}
          </div>

          {/* Navigation */}
          <nav className='px-4 space-y-2'>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              return (
                <Link key={item.id} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 
                    ${isActive
                        ? 'bg-strawberry-200 text-strawberry-950 shadow-sm'
                        : 'text-strawberry-950 hover:bg-strawberry-200 focus:bg-strawberry-200 active:bg-strawberry-200'}
                      `}
                  >
                    <IconComponent className='w-5 h-5' />
                    <span className='font-light text-sm'>{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Actions du bas */}
        <div className='px-4 pb-6 space-y-3'>
          <Button
            size='sm'
            variant='ghost'
            color='strawberry'
            iconBefore={FiSettings}
            className='w-full'
          >
            <Link href='/settings'>Paramètres</Link>
          </Button>

          <Button
            onClick={onLogout}
            size='sm'
            variant='primary'
            color='blueberry'
            iconBefore={FiLogOut}
            className='w-full'
          >
            Se déconnecter
          </Button>
        </div>
      </aside>

      {/* Modal de sélection d'avatar */}
      <ProfileAvatarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentAvatar={selectedAvatar}
        onSelectAvatar={setSelectedAvatar}
      />
    </>
  )
}
