// 'use client'

// import { useSession } from '@/hooks/use-session'
// import { authClient } from '@/lib/auth-client'
// import { useRouter } from 'next/navigation'

// function DashboardPage(): React.ReactElement {
//   const { user, isLoading, isAuthenticated } = useSession()
//   const router = useRouter()

//   const handleSignOut = async (): Promise<void> => {
//     try {
//       await authClient.signOut({
//         fetchOptions: {
//           onSuccess: () => {
//             router.push('/sign-in')
//           }
//         }
//       })
//     } catch (error) {
//       console.error('Error signing out:', error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className='flex items-center justify-center min-h-screen'>
//         <div className='text-lg'>Chargement...</div>
//       </div>
//     )
//   }

//   if (!isAuthenticated || user == null) {
//     return (
//       <div className='flex items-center justify-center min-h-screen'>
//         <div className='text-lg'>Redirection...</div>
//       </div>
//     )
//   }

//   return (
//     <div className='container mx-auto p-6'>
//       <div className='max-w-2xl mx-auto'>
//         <header className='mb-8'>
//           <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
//           <p className='text-gray-600'>Bienvenue dans votre espace personnel, {user.name ?? user.email} !</p>
//         </header>

//         <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
//           <h2 className='text-xl font-semibold mb-4'>Informations de profil</h2>
//           <div className='space-y-3'>
//             <div>
//               <span className='font-medium'>Email:</span> {user.email}
//             </div>
//             {user.name != null && (
//               <div>
//                 <span className='font-medium'>Nom:</span> {user.name}
//               </div>
//             )}
//             {user.image != null && (
//               <div className='flex items-center space-x-3'>
//                 <span className='font-medium'>Photo:</span>
//                 <img
//                   src={user.image}
//                   alt='Avatar'
//                   className='w-12 h-12 rounded-full'
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <div className='flex justify-end'>
//           <button
//             onClick={() => { void handleSignOut() }}
//             className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
//           >
//             Se déconnecter
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DashboardPage
// import { getMonsters } from '@/actions/monsters.action'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMonsters } from '@/actions/monsters.action'

/**
 * Page Dashboard - Point d'entrée principal du tableau de bord utilisateur
 *
 * Cette page Server Component :
 * - Vérifie l'authentification de l'utilisateur
 * - Charge les monstres de l'utilisateur
 * - Redirige vers /sign-in si non authentifié
 * - Passe les données au composant Client DashboardContent
 *
 * Respecte le principe SRP : Gère uniquement la logique serveur du dashboard
 * Respecte le principe DIP : Utilise des abstractions (auth, getMonsters)
 *
 * @returns {Promise<React.ReactNode>} Le contenu du dashboard ou redirection
 *
 * @example
 * Route accessible via /dashboard
 */
async function DashboardPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  // Récupération des monstres de l'utilisateur
  const monsters = await getMonsters()

  // Sérialisation pour passage au composant client
  const plainMonsters = JSON.parse(JSON.stringify(monsters))

  return (
    <DashboardContent session={session} monsters={plainMonsters} />
  )
}

export default DashboardPage
