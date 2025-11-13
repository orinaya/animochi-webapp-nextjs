/**
 * QuestsPageContent - Contenu de la page Quêtes avec sidebar
 * Principe SRP : Gère uniquement l'affichage de la page quêtes
 */

'use client'

import { DashboardLayout } from '@/components/layout'
import { authClient } from '@/lib/auth/auth-client'
import { QuestList } from './quest-list'

type Session = typeof authClient.$Infer.Session

interface QuestsPageContentProps {
  session: Session
}

export function QuestsPageContent ({ session }: QuestsPageContentProps): React.ReactNode {
  const handleLogout = (): void => {
    // Logout logic - could be handled via authClient
  }

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Tableau de bord', href: '/dashboard' },
    { label: 'Quêtes' }
  ]

  return (
    <DashboardLayout session={session} onLogout={handleLogout} breadcrumbItems={breadcrumbItems}>
      <div className='max-w-7xl mx-auto'>
        {/* En-tête de la page */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-3'>
            <span className='text-5xl'>🎯</span>
            <div>
              <h1 className='text-4xl font-bold text-strawberry-950'>
                Quêtes Journalières
              </h1>
              <p className='text-strawberry-600'>
                Accomplis tes quêtes pour gagner des récompenses !
              </p>
            </div>
          </div>
        </div>

        {/* Section des quêtes */}
        <QuestList />

        {/* Section d'aide */}
        <div className='mt-8 p-6 bg-white rounded-2xl shadow-sm border-2 border-blueberry-200'>
          <h3 className='text-lg font-bold text-strawberry-950 mb-3 flex items-center gap-2'>
            <span>💡</span>
            Comment ça marche ?
          </h3>
          <ul className='space-y-2 text-sm text-strawberry-700'>
            <li className='flex items-start gap-2'>
              <span className='text-blueberry-500 font-bold'>•</span>
              <span>Tu reçois <strong>3 nouvelles quêtes</strong> chaque jour à minuit</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-blueberry-500 font-bold'>•</span>
              <span>Complète les quêtes pour gagner des <strong>Animoneys</strong></span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-blueberry-500 font-bold'>•</span>
              <span>Les quêtes non terminées <strong>expirent à minuit</strong></span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-blueberry-500 font-bold'>•</span>
              <span>Plus tu joues, plus tu gagnes de récompenses !</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
