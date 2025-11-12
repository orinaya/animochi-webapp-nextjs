'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSettings, FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Button from './button'
import Link from 'next/link'

interface DropdownProfileParticleProps {
  fullname: string
  email: string
  initials: string
  onLogout?: () => void
  showUserInfo?: boolean
  userImage?: string | null
}

/**
 * Composant DropdownProfileParticle - Menu déroulant du profil utilisateur
 *
 * Affiche un avatar cliquable qui ouvre un menu avec les options de profil.
 * Respecte le principe SRP : Gère uniquement l'interface du dropdown profil
 * Respecte le principe OCP : Extensible via props sans modification du code
 *
 * @param {DropdownProfileParticleProps} props - Les propriétés du dropdown
 * @returns {React.ReactNode} Le dropdown du profil
 */
function DropdownProfileParticle ({
  fullname,
  email,
  initials,
  onLogout,
  showUserInfo = false,
  userImage
}: DropdownProfileParticleProps): React.ReactNode {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside (event: MouseEvent): void {
      if (menuRef.current !== null && !(menuRef.current).contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = (): void => {
    if (onLogout !== null && onLogout !== undefined) {
      onLogout()
    }
  }

  return (
    <div className='relative' ref={menuRef}>
      <button
        className={`flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 ${showUserInfo ? 'px-3 py-2' : 'w-8 h-8 justify-center'
          }`}
        onClick={() => setOpen(!open)}
      >
        {/* Avatar */}
        {userImage !== null && userImage !== undefined
          ? (
            <img
              src={userImage}
              alt='Photo de profil'
              className='w-8 h-8 rounded-full object-cover'
            />
            )
          : (
            <div className='w-8 h-8 rounded-full bg-blueberry-200 flex items-center justify-center'>
              <span className='text-blueberry-700 font-bold text-sm'>{initials}</span>
            </div>
            )}

        {/* Informations utilisateur (si showUserInfo est true) */}
        {showUserInfo && (
          <div className='hidden md:flex flex-col text-left'>
            <span className='text-sm font-medium text-gray-900'>{fullname}</span>
            <span className='text-xs text-gray-500 truncate max-w-32'>
              {email !== '' ? email : 'Email non disponible'}
            </span>
          </div>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100'>
          <div className='px-4 py-2 font-semibold border-b border-gray-200'>
            <p className='text-gray-900 font-bold text-sm truncate'>{fullname}</p>
            <p className='text-gray-600 font-normal text-xs truncate'>{email}</p>
          </div>
          <div className='py-1'>
            {/* <Button
              title='Profil'
              variant='ghost'
              color='neutral'
              onClick={() => router.push('/account/personal-info')}
              className='w-full'
              iconBefore={FiUser}
              justify='justify-start'
            /> */}
            <Button
              variant='ghost'
              color='latte'
              onClick={() => router.push('/account')}
              className='w-full'
              iconBefore={FiSettings}
            >
              <Link href='/settings'>Paramètres</Link>
            </Button>
            <Button
              variant='ghost'
              color='danger'
              onClick={handleLogout}
              className='w-full text-red-600 hover:bg-red-50'
              iconBefore={FiLogOut}
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownProfileParticle
