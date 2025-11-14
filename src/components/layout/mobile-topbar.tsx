/**
 * MobileTopBar - Barre de navigation supérieure pour mobile
 *
 * Affiche le logo Animochi à gauche et un menu profil à droite
 * Menu contenant : Profil, Paramètres, Déconnexion
 * Visible uniquement sur mobile (< 768px)
 *
 * Respecte le principe SRP : Gère uniquement la navigation mobile supérieure
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/layout/mobile-topbar
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi'
import type { authClient } from '@/lib/auth/auth-client'
import { useUserAvatar } from '@/hooks/use-user-avatar'
import { getAnimalImageUrl, getAnimalAvatarByFilename } from '@/utils/animal-avatar-utils'
import AnimochiLogo from '../../../public/animochi-line.svg'

type Session = typeof authClient.$Infer.Session

interface MobileTopBarProps {
  /** Session utilisateur */
  session: Session
  /** Callback de déconnexion */
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  action?: () => void
  color?: string
}

/**
 * Composant MobileTopBar
 * Barre supérieure pour mobile uniquement
 */
export function MobileTopBar ({ session, onLogout }: MobileTopBarProps): React.ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { selectedAvatar } = useUserAvatar()

  // Éviter le mismatch d'hydratation
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Fermer le menu si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current != null && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleLogout = (): void => {
    setIsMenuOpen(false)
    onLogout()
  }

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'Mon Profil',
      icon: FiUser,
      href: '/profile',
      color: 'blueberry'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: FiSettings,
      href: '/settings',
      color: 'latte'
    },
    {
      id: 'logout',
      label: 'Déconnexion',
      icon: FiLogOut,
      action: handleLogout,
      color: 'strawberry'
    }
  ]

  // Obtenir les informations de l'avatar
  const avatarInfo = isHydrated ? getAnimalAvatarByFilename(selectedAvatar) : null
  const avatarSrc = isHydrated ? getAnimalImageUrl(selectedAvatar) : '/assets/images/animochi/animals/blaireau.png'

  return (
    <header className='md:hidden sticky top-0 left-0 right-0 bg-white border-b border-latte-200 shadow-sm z-40'>
      <div className='flex items-center justify-between px-4 py-3'>
        {/* Logo Animochi */}
        <Link href='/dashboard' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
          <Image
            src={AnimochiLogo}
            alt='Animochi'
            width={60}
            height={60}
            className='w-auto h-12'
            priority
          />
        </Link>

        {/* Menu Profil */}
        <div className='relative' ref={menuRef}>
          <button
            onClick={() => { setIsMenuOpen(!isMenuOpen) }}
            className='flex items-center gap-2 p-1.5 rounded-full hover:bg-latte-50 transition-colors'
            aria-label='Menu profil'
          >
            {/* Avatar utilisateur */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${avatarInfo?.backgroundColor ?? 'bg-blueberry-400'}`}
              suppressHydrationWarning
            >
              <Image
                src={avatarSrc}
                alt={avatarInfo?.displayName ?? 'Avatar'}
                width={40}
                height={40}
                className='w-full h-full object-cover scale-110'
                priority={false}
                key={isHydrated ? selectedAvatar : 'default'}
                suppressHydrationWarning
              />
            </div>
            <FiChevronDown
              className={`text-latte-600 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
              size={18}
            />
          </button>

          {/* Menu déroulant */}
          {isMenuOpen && (
            <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-latte-200 py-2 animate-fade-in'>
              {/* Info utilisateur */}
              <div className='px-4 py-3 border-b border-latte-100'>
                <p className='text-sm font-semibold text-blueberry-950 truncate'>
                  {session.user.name ?? session.user.email?.split('@')[0] ?? 'Utilisateur'}
                </p>
                <p className='text-xs text-latte-500 truncate'>
                  {session.user.email ?? ''}
                </p>
              </div>

              {/* Items du menu */}
              <div className='py-2'>
                {menuItems.map((item) => {
                  const IconComponent = item.icon
                  const isDanger = item.id === 'logout'

                  if (item.href != null) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => { setIsMenuOpen(false) }}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${isDanger
                          ? 'text-strawberry-600 hover:bg-strawberry-50'
                          : 'text-blueberry-900 hover:bg-latte-50'
                          }`}
                      >
                        <IconComponent className='w-4 h-4' />
                        <span className='text-sm font-medium'>{item.label}</span>
                      </Link>
                    )
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action != null) {
                          item.action()
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${isDanger
                        ? 'text-strawberry-600 hover:bg-strawberry-50'
                        : 'text-blueberry-900 hover:bg-latte-50'
                        }`}
                    >
                      <IconComponent className='w-4 h-4' />
                      <span className='text-sm font-medium'>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
