'use client'

import { FiSearch, FiArrowLeft, FiHome } from 'react-icons/fi'
import DropdownProfileParticle from '../ui/dropdown-profile-particle'
import type { authClient } from '@/lib/auth/auth-client'
import { FaRegBell } from 'react-icons/fa6'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

type Session = typeof authClient.$Infer.Session

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopNavBarProps {
  session: Session
  onLogout?: () => void
  breadcrumbItems?: BreadcrumbItem[]
}

/**
 * Composant TopNavBar - Barre de navigation fixe en haut du dashboard
 *
 * Affiche les boutons de navigation, le breadcrumb, la barre de recherche, les notifications et le profil utilisateur
 * Respecte le principe SRP : Gère uniquement l'affichage de la navigation supérieure
 * Respecte le principe OCP : Extensible via props sans modification du code
 *
 * @param {TopNavBarProps} props - Les propriétés de la barre de navigation
 * @returns {React.ReactNode} La barre de navigation supérieure
 */
function TopNavBar({ session, onLogout, breadcrumbItems }: TopNavBarProps): React.ReactNode {
  const router = useRouter()
  const pathname = usePathname()

  // Vérifie si on est sur la page d'accueil/dashboard
  const isHomePage = pathname === '/dashboard' || pathname === '/'

  // Génération des initiales depuis le nom ou l'email
  const getInitials = (): string => {
    if (session.user.name !== null && session.user.name !== undefined) {
      return session.user.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    if (session.user.email !== null && session.user.email !== undefined) {
      return session.user.email.charAt(0).toUpperCase()
    }

    return '?'
  }

  // Format du nom complet
  const getFullName = (): string => {
    return session.user.name ?? session.user.email?.split('@')[0] ?? 'Utilisateur'
  }

  const handleGoBack = (): void => {
    router.back()
  }

  const handleGoHome = (): void => {
    router.push('/dashboard')
  }

  return (
    <div className='bg-white flex items-center justify-between gap-6 z-40 px-8 py-2'>
      {/* Section gauche : Navigation et Breadcrumb */}
      <div className='flex items-center gap-4 flex-1'>
        {/* Boutons de navigation - seulement si pas sur l'accueil */}
        {!isHomePage && (
          <div className='flex items-center gap-2'>
            <button
              onClick={handleGoBack}
              className='p-2 text-latte-600 hover:text-blueberry-600 hover:bg-blueberry-50 rounded-lg transition-all duration-200'
              title='Retour'
            >
              <FiArrowLeft className='w-5 h-5' />
            </button>
            <button
              onClick={handleGoHome}
              className='p-2 text-latte-600 hover:text-blueberry-600 hover:bg-blueberry-50 rounded-lg transition-all duration-200'
              title='Accueil'
            >
              <FiHome className='w-5 h-5' />
            </button>
          </div>
        )}

        {/* Breadcrumb - seulement si pas sur l'accueil et s'il y a des éléments */}
        {!isHomePage && breadcrumbItems !== undefined && breadcrumbItems !== null && breadcrumbItems.length > 0 && (
          <nav className='flex items-center gap-2 text-sm'>
            {breadcrumbItems.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                {index > 0 && (
                  <span className='text-latte-200'>/</span>
                )}
                {item.href !== undefined && item.href !== null
                  ? (
                    <Link
                      href={item.href}
                      className='text-blueberry-950 hover:text-blueberry-800 transition-colors font-medium'
                    >
                      {item.label}
                    </Link>
                  )
                  : (
                    <span className='text-strawberry-600 font-medium'>{item.label}</span>
                  )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Section droite : Recherche + Notifications + Profil */}
      <div className='flex items-center gap-4'>
        {/* Barre de recherche */}
        <div className='max-w-sm relative'>
          <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-strawberry-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Rechercher...'
            className='w-full pl-10 pr-4 py-2 bg-[#F6F5F4] rounded-full focus:outline-none focus:ring-1 focus:ring-strawberry-400 focus:border-transparent text-sm'
          />
        </div>

        {/* Cloche de notifications */}
        <button className='relative p-2 text-strawberry-400 hover:text-blueberry-600 hover:bg-blueberry-50 rounded-lg transition-all duration-200'>
          <FaRegBell className='w-5 h-5' />
          {/* Badge de notification (optionnel) */}
          <span className='absolute -top-1 -right-1 bg-strawberry-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
            3
          </span>
        </button>

        {/* Section profil cliquable avec dropdown intégré */}
        <DropdownProfileParticle
          fullname={getFullName()}
          email={session.user.email ?? ''}
          initials={getInitials()}
          onLogout={onLogout}
          showUserInfo
          userImage={session.user.image}
        />
      </div>
    </div>
  )
}

export default TopNavBar
