'use client'

import { FiSearch } from 'react-icons/fi'
import DropdownProfileParticle from '../ui/dropdown-profile-particle'
import type { authClient } from '@/lib/auth/auth-client'
import { FaRegBell } from 'react-icons/fa6'

type Session = typeof authClient.$Infer.Session

interface TopNavBarProps {
  session: Session
  onLogout?: () => void
}

/**
 * Composant TopNavBar - Barre de navigation fixe en haut du dashboard
 *
 * Affiche la barre de recherche, les notifications et le profil utilisateur
 * Respecte le principe SRP : Gère uniquement l'affichage de la navigation supérieure
 * Respecte le principe OCP : Extensible via props sans modification du code
 *
 * @param {TopNavBarProps} props - Les propriétés de la barre de navigation
 * @returns {React.ReactNode} La barre de navigation supérieure
 */
function TopNavBar ({ session, onLogout }: TopNavBarProps): React.ReactNode {
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

  return (
    <div className='bg-white flex items-center justify-between gap-6 z-40 px-9 py-3'>
      {/* Barre de recherche */}
      <div className='flex-1 max-w-md relative'>
        <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
        <input
          type='text'
          placeholder='Rechercher...'
          className='w-full pl-10 pr-4 py-2 bg-[#F6F5F4] rounded-full focus:outline-none focus:ring-1 focus:ring-strawberry-400 focus:border-transparent'
        />
      </div>

      {/* Section droite : Notifications + Profil */}
      <div className='flex items-center gap-4'>
        {/* Cloche de notifications */}
        <button className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
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
