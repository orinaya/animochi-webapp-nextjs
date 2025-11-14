import { getMonsterById } from '@/actions/monsters.action'
import MonstrePageContent from '@/components/monsters/monster-page-content'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Page de détail d'une créature
 *
 * Page Server Component qui :
 * - Vérifie l'authentification de l'utilisateur
 * - Récupère le monstre par son ID
 * - Affiche toutes les informations détaillées
 * - Permet les interactions (nourrir, jouer, etc.)
 *
 * Respecte le principe SRP : Gère uniquement la logique serveur de la page créature
 * Respecte le principe DIP : Utilise l'abstraction getMonsterById
 *
 * @param {Object} params - Paramètres de la route dynamique
 * @returns {Promise<React.ReactNode>} La page de détail ou une erreur
 *
 * @example
 * Route accessible via /creature/[id]
 */
async function CreaturePage ({
  params
}: {
  params: Promise<{ id: string[] }>
}): Promise<React.ReactNode> {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  const { id: idArray } = await params
  const idRaw = Array.isArray((await params).id) ? (await params).id[0] : (await params).id
  const id = String(idRaw)
  // Validation stricte de l'ID (évite les .js.map et autres requêtes parasites)
  const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id)
  if (!isValidObjectId) {
    // Option 1 : Rediriger vers une 404 Next.js
    // notFound() // décommente si tu veux une vraie 404
    // Option 2 : Retourner un message d'erreur custom
    return <div className='text-center text-red-600 py-12'>ID de monstre invalide</div>
  }
  const monsterDoc = await getMonsterById(id)

  // Affichage d'une erreur si le monstre n'existe pas
  // if (monsterDoc === null || monsterDoc === undefined) {
  //   return <ErrorClient error={null} />
  // }

  // Conversion du document Mongoose en objet JavaScript simple pour le composant client
  const monster = JSON.parse(JSON.stringify(monsterDoc))

  console.log('📄 CreaturePage - Monstre récupéré:', {
    id,
    idArray,
    monster,
    experience: monster?.experience,
    level: monster?.level,
    experienceToNextLevel: monster?.experienceToNextLevel
  })

  return (
    <MonstrePageContent
      monster={monster}
      monsterId={id}
      session={session}
    />
  )
}

export default CreaturePage
