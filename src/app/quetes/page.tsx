/**
 * Page Quêtes - Affiche les quêtes journalières de l'utilisateur
 * Route: /quetes
 */

import { QuestsPageContent } from '@/components/quests/quests-page-content'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Quêtes Journalières | Animochi',
  description: 'Complète tes quêtes quotidiennes pour gagner des Animoneys'
}

export default async function QuestsPage (): Promise<React.ReactNode> {
  // Vérifier l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session == null) {
    redirect('/sign-in')
  }

  return <QuestsPageContent session={session} />
}
