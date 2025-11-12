import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'
import { MonstresPageContent } from '@/components/monsters'

/**
 * Page Mes Monstres - Point d'entrée pour la gestion des monstres utilisateur
 *
 * Cette page Server Component :
 * - Vérifie l'authentification de l'utilisateur
 * - Redirige vers /sign-in si non authentifié
 * - Passe les données de session au composant Client MonstresPageContent
 *
 * Respecte le principe SRP : Gère uniquement la logique serveur de la page monstres
 * Respecte le principe DIP : Utilise des abstractions (auth)
 *
 * @returns {Promise<React.ReactNode>} Le contenu de la page monstres ou redirection
 *
 * @example
 * Route accessible via /monstres
 */
async function MonstresPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <MonstresPageContent session={session} />
  )
}

export default MonstresPage
