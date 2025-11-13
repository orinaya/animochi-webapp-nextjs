/**
 * Profile Page - Page de profil utilisateur
 *
 * @module app/profile/page
 */

import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/actions/user.actions'
import ProfileContent from '@/app/profile/profile-content'

/**
 * Page Profile - Point d'entrée de la page de profil
 *
 * Cette page Server Component :
 * - Vérifie l'authentification
 * - Charge les données utilisateur
 * - Redirige vers /sign-in si non authentifié
 *
 * @returns {Promise<React.ReactNode>}
 */
async function ProfilePage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  // Récupérer les données complètes de l'utilisateur
  const profileResult = await getUserProfile()

  return (
    <ProfileContent
      session={session}
      userProfile={profileResult.success ? profileResult.user : undefined}
    />
  )
}

export default ProfilePage
