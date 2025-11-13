/**
 * ProfileContent - Contenu client de la page de profil
 *
 * @module app/profile/profile-content
 */

'use client'

import { useAuth } from '@/hooks/use-auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { UsernameEditor } from '@/components/profile/username-editor'
import type { authClient } from '@/lib/auth/auth-client'
import { useState } from 'react'
import { FiMail, FiUser } from 'react-icons/fi'

type Session = typeof authClient.$Infer.Session

interface ProfileContentProps {
  session: Session
  userProfile?: {
    id: string
    email: string
    username?: string
    pseudo?: string
    name?: string
    avatarUrl?: string
  }
}

/**
 * Contenu de la page de profil
 *
 * Permet à l'utilisateur de :
 * - Voir ses informations de profil
 * - Modifier son pseudo (username)
 * - Voir son email et nom
 *
 * @param {ProfileContentProps} props
 * @returns {React.ReactElement}
 */
export default function ProfileContent ({ session, userProfile }: ProfileContentProps): React.ReactElement {
  const { logout } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Tableau de bord', href: '/dashboard' },
    { label: 'Profil' }
  ]

  const handleUsernameUpdate = (): void => {
    // Force un re-render pour afficher le nouveau username
    setRefreshKey(prev => prev + 1)
    // Recharger la page pour mettre à jour la session
    window.location.reload()
  }

  return (
    <DashboardLayout session={session} onLogout={logout} breadcrumbItems={breadcrumbItems}>
      <div className='w-full max-w-4xl mx-auto px-4 py-8'>
        <div className='space-y-8'>
          {/* En-tête */}
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-blueberry-950 mb-2'>
              Mon Profil
            </h1>
            <p className='text-gray-600'>
              Gérez vos informations personnelles
            </p>
          </div>

          {/* Carte de profil */}
          <div className='bg-white rounded-2xl shadow-md p-6 space-y-6'>
            {/* Section Username */}
            <div className='border-b border-gray-200 pb-6'>
              <h2 className='text-xl font-semibold text-blueberry-950 mb-4'>
                Pseudo
              </h2>
              <UsernameEditor
                key={refreshKey}
                currentUsername={userProfile?.pseudo ?? userProfile?.username}
                onUpdate={handleUsernameUpdate}
              />
            </div>

            {/* Section Informations */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-blueberry-950'>
                Informations
              </h2>

              {/* Email */}
              <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                <FiMail className='w-5 h-5 text-gray-500' />
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email
                  </label>
                  <div className='text-base text-gray-900'>
                    {userProfile?.email ?? session.user.email}
                  </div>
                </div>
              </div>

              {/* Nom */}
              {(userProfile?.name ?? session.user.name) != null && (
                <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                  <FiUser className='w-5 h-5 text-gray-500' />
                  <div className='flex-1'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Nom
                    </label>
                    <div className='text-base text-gray-900'>
                      {userProfile?.name ?? session.user.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className='bg-blueberry-50 border border-blueberry-200 rounded-lg p-4'>
              <p className='text-sm text-blueberry-800'>
                💡 <strong>Astuce :</strong> Votre pseudo sera affiché publiquement dans la galerie communautaire à la place de votre email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
