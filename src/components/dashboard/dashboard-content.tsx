'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth/auth-client'
import { DashboardLayout } from '@/components/layout'
import type { Monster } from '@/types'
import { useAuth } from '@/hooks/use-auth'
import { MonsterCard } from '@/components/ui'
import { useRouter } from 'next/navigation'

type Session = typeof authClient.$Infer.Session

/**
 * Props pour le composant DashboardContent
 */
interface DashboardContentProps {
  /** Session utilisateur authentifié */
  session: Session
  /** Liste des monstres appartenant à l'utilisateur */
  monsters?: Monster[]
}

/**
 * Composant Carousel de Monstres
 * Affiche un monstre à la fois avec navigation gauche/droite
 *
 * Respecte le principe SRP : Gère uniquement l'affichage carousel des monstres
 */
function MonsterCarousel ({ monsters }: { monsters: Monster[] }): React.ReactNode {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  if (monsters.length === 0) {
    return (
      <div className='bg-white rounded-2xl p-12 shadow-md text-center'>
        <p className='text-latte-600 text-lg'>Aucun monstre pour le moment</p>
        <p className='text-latte-500 text-sm mt-2'>Créez votre premier monstre !</p>
      </div>
    )
  }

  const currentMonster = monsters[currentIndex]

  const goToPrevious = (): void => {
    setCurrentIndex((prev) => (prev === 0 ? monsters.length - 1 : prev - 1))
  }

  const goToNext = (): void => {
    setCurrentIndex((prev) => (prev === monsters.length - 1 ? 0 : prev + 1))
  }

  const handleMonsterClick = (index: number): void => {
    const monster = monsters[index]
    const monsterId = monster.id ?? monster._id ?? ''
    if (monsterId !== '') {
      router.push(`/monster/${monsterId}`)
    }
  }

  // Calcul des index pour les cartes précédente et suivante
  const prevIndex = currentIndex === 0 ? monsters.length - 1 : currentIndex - 1
  const nextIndex = currentIndex === monsters.length - 1 ? 0 : currentIndex + 1

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Chevron Gauche */}
      <button
        onClick={goToPrevious}
        className='absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-blueberry-100 hover:bg-blueberry-200 text-blueberry-950 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95'
        disabled={monsters.length <= 1}
        aria-label='Monstre précédent'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* Carousel Container */}
      <div className='flex items-center justify-center gap-4 px-16 py-4'>
        {/* Carte Précédente (réduite et opaque) */}
        {monsters.length > 1 && (
          <div
            className='w-64 opacity-40 scale-75 transform transition-all duration-300 hover:opacity-60 cursor-pointer'
            onClick={goToPrevious}
          >
            <MonsterCard
              monster={monsters[prevIndex]}
              onClick={() => { }}
              className='w-full pointer-events-none'
            />
          </div>
        )}

        {/* Carte Actuelle (taille normale) */}
        <div className='w-96 shrink-0 transition-all duration-300'>
          <MonsterCard
            monster={currentMonster}
            onClick={() => handleMonsterClick(currentIndex)}
            className='w-full transform transition-all duration-300 hover:scale-105 shadow-xl'
          />
          {monsters.length > 1 && (
            <div className='text-center mt-3 transition-opacity duration-300'>
              <p className='text-sm text-latte-600 font-medium'>
                {currentIndex + 1} / {monsters.length}
              </p>
            </div>
          )}
        </div>

        {/* Carte Suivante (réduite et opaque) */}
        {monsters.length > 1 && (
          <div
            className='w-64 opacity-40 scale-75 transform transition-all duration-300 hover:opacity-60 cursor-pointer'
            onClick={goToNext}
          >
            <MonsterCard
              monster={monsters[nextIndex]}
              onClick={() => { }}
              className='w-full pointer-events-none'
            />
          </div>
        )}
      </div>

      {/* Chevron Droit */}
      <button
        onClick={goToNext}
        className='absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-blueberry-100 hover:bg-blueberry-200 text-blueberry-950 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95'
        disabled={monsters.length <= 1}
        aria-label='Monstre suivant'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </button>
    </div>
  )
}

/**
 * Bouton d'Action Rapide
 * Respecte le principe SRP : Affiche un bouton d'action
 */
interface QuickActionProps {
  icon: string
  label: string
  description: string
  onClick: () => void
  color: 'blueberry' | 'strawberry' | 'peach' | 'latte'
}

function QuickAction ({ icon, label, description, onClick, color }: QuickActionProps): React.ReactNode {
  const colorClasses = {
    blueberry: 'bg-blueberry-100 hover:bg-blueberry-200 border-blueberry-300',
    strawberry: 'bg-strawberry-100 hover:bg-strawberry-200 border-strawberry-300',
    peach: 'bg-peach-100 hover:bg-peach-200 border-peach-300',
    latte: 'bg-latte-100 hover:bg-latte-200 border-latte-300'
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 shadow-md hover:shadow-lg ${colorClasses[color]}`}
    >
      <span className='text-4xl'>{icon}</span>
      <div className='text-center'>
        <p className='font-semibold text-blueberry-950'>{label}</p>
        <p className='text-xs text-latte-600 mt-1'>{description}</p>
      </div>
    </button>
  )
}

/**
 * Composant principal du contenu du Dashboard
 *
 * Orchestre l'affichage des différentes sections du dashboard :
 * - Titre de bienvenue avec email utilisateur
 * - Carousel de monstres
 * - Actions rapides
 *
 * Respecte le principe SRP : Orchestre uniquement l'affichage du dashboard
 * Respecte le principe DIP : Dépend des abstractions (hooks) plutôt que d'implémentations
 *
 * @param {DashboardContentProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le contenu complet du dashboard
 *
 * @example
 * ```tsx
 * <DashboardContent session={session} monsters={monsters} />
 * ```
 */
function DashboardContent ({ session, monsters = [] }: DashboardContentProps): React.ReactNode {
  const { logout } = useAuth()
  const router = useRouter()

  const userEmail = session.user.email ?? 'Utilisateur'

  console.log('DashboardContent - Nombre de monstres:', monsters.length)
  console.log('DashboardContent - Monstres:', monsters)

  return (
    <DashboardLayout session={session} onLogout={logout}>
      <div className='w-full max-w-6xl mx-auto space-y-12 px-4'>
        {/* Titre de Bienvenue */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-blueberry-950 mb-2'>
            Bienvenue, {userEmail}
          </h1>
        </div>

        {/* Section Monstres - Carousel */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-bold text-blueberry-950 text-center'>
            Mes Monstres
          </h2>
          <MonsterCarousel monsters={monsters} />
        </section>

        {/* Section Actions Rapides */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-bold text-blueberry-950 text-center'>
            Actions Rapides
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <QuickAction
              icon='✨'
              label='Créer un monstre'
              description='Créez une nouvelle créature'
              onClick={() => router.push('/dashboard/create-monster')}
              color='strawberry'
            />
            <QuickAction
              icon='👾'
              label='Mes monstres'
              description='Voir tous mes monstres'
              onClick={() => router.push('/monstres')}
              color='blueberry'
            />
            <QuickAction
              icon='🏪'
              label='Boutique'
              description='Acheter des items'
              onClick={() => router.push('/shop')}
              color='peach'
            />
            <QuickAction
              icon='🎒'
              label='Inventaire'
              description='Gérer mes objets'
              onClick={() => router.push('/inventory')}
              color='latte'
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default DashboardContent
