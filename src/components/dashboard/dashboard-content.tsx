// eslint-disable-next-line @typescript-eslint/quotes
'use client'

import { useState, useEffect } from 'react'
import { authClient } from '@/lib/auth/auth-client'
import { DashboardLayout } from '@/components/layout'
import type { Monster } from '@/types'
import { useAuth } from '@/hooks/use-auth'
import { useUserPseudo } from '@/hooks/use-user-pseudo'
import { MonsterCard } from '@/components/ui'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'
import type { AccessoryData } from '@/types/monster/monster-accessories'

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

  if (!Array.isArray(monsters) || monsters.length === 0) {
    return (
      <div className='bg-white rounded-2xl p-12 shadow-md text-center'>
        <p className='text-latte-600 text-lg'>Aucun monstre pour le moment</p>
        <p className='text-latte-500 text-sm mt-2'>Créez votre premier monstre !</p>
      </div>
    )
  }

  const currentMonster = monsters[currentIndex] ?? null
  // Sécurise l'accès à l'index
  const safeIndex = currentIndex >= 0 && currentIndex < monsters.length ? currentIndex : 0

  const goToPrevious = (): void => {
    setCurrentIndex((prev) => (prev === 0 ? monsters.length - 1 : prev - 1))
  }

  const goToNext = (): void => {
    setCurrentIndex((prev) => (prev === monsters.length - 1 ? 0 : prev + 1))
  }

  const handleMonsterClick = (index: number): void => {
    try {
      const monster = monsters[index]
      if (!monster) {
        console.error('handleMonsterClick: Monstre introuvable à l’index', index)
        return
      }
      const monsterId = monster.id ?? monster._id ?? ''
      if (monsterId !== '') {
        router.push(`/monster/${monsterId}`)
      } else {
        console.error('handleMonsterClick: ID du monstre manquant', monster)
      }
    } catch (err) {
      console.error('Erreur lors du clic sur un monstre:', err)
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
      <div className='flex items-center justify-center gap-4'>
        {/* Carte Précédente (réduite et opaque) */}
        {monsters.length > 1 && !!monsters[prevIndex] && (
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
        {!!currentMonster && (
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
        )}

        {/* Carte Suivante (réduite et opaque) */}
        {monsters.length > 1 && !!monsters[nextIndex] && (
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

function DashboardShop (): React.ReactNode {
  // On combine tous les accessoires et backgrounds
  const items: AccessoryData[] = [...ACCESSORIES_CATALOG, ...BACKGROUNDS_CATALOG]
  // Rareté couleurs (copié de la boutique)
  const RARITY_COLORS: Record<string, string> = {
    common: 'bg-latte-200 text-blueberry-900',
    rare: 'bg-blueberry-200 text-blueberry-900',
    epic: 'bg-peach-200 text-blueberry-900',
    legendary: 'bg-strawberry-200 text-blueberry-900'
  }
  // Labels
  const getRarityLabel = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'Commun'
      case 'rare': return 'Rare'
      case 'epic': return 'Épique'
      case 'legendary': return 'Légendaire'
      default: return rarity
    }
  }
  return (
    <div className='bg-white rounded-2xl shadow-md p-4 h-full flex flex-col'>
      <h3 className='text-lg font-bold text-blueberry-950 mb-2'>Boutique</h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-1' style={{ maxHeight: '100%' }}>
        {items.map((accessory, idx) => (
          <div
            key={`${accessory.name}-${idx}`}
            className='bg-white rounded-xl p-5 border-2 transition-all hover:shadow-xl border-latte-200 hover:border-blueberry-300 flex flex-col'
          >
            {/* Badge de rareté */}
            <div className='flex justify-between items-start mb-3'>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${RARITY_COLORS[accessory.rarity]}`}
              >
                {getRarityLabel(accessory.rarity)}
              </span>
              <span className='text-2xl'>{accessory.emoji}</span>
            </div>
            {/* Preview SVG ou image */}
            <div className='bg-latte-50 rounded-lg p-4 mb-4 flex items-center justify-center min-h-[100px] overflow-hidden'>
              {accessory.category === 'background'
                ? (
                    accessory.imagePath != null
                      ? (
                        <div
                          className='w-full h-20 rounded bg-cover bg-center'
                          style={{ backgroundImage: `url(${accessory.imagePath})` }}
                        />
                        )
                      : accessory.svg != null
                        ? (
                          <svg
                            viewBox='0 0 100 100'
                            className='w-full h-20 rounded'
                            dangerouslySetInnerHTML={{ __html: accessory.svg }}
                          />
                          )
                        : null
                  )
                : (
                  <svg
                    viewBox='0 0 80 80'
                    className='w-16 h-16'
                    dangerouslySetInnerHTML={{ __html: accessory.svg ?? '' }}
                  />
                  )}
            </div>
            {/* Infos */}
            <div className='space-y-2 flex-1'>
              <h3 className='font-bold text-blueberry-950 text-base'>{accessory.name}</h3>
              <p className='text-xs text-latte-600 min-h-8'>{accessory.description}</p>
            </div>
            {/* Prix et bouton */}
            <div className='flex items-center justify-between pt-3 border-t border-latte-200 mt-2'>
              <div className='flex items-center gap-1'>
                <span className='text-xl'>💰</span>
                <span className='text-xl font-bold text-strawberry-600'>{accessory.price}</span>
              </div>
              <button
                className='px-5 py-2.5 rounded-lg text-sm font-semibold transition-all bg-strawberry-500 text-white hover:bg-strawberry-600 hover:scale-105'
              >
                Acheter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardLeaderboard (): React.ReactNode {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/leaderboard')
      .then(async (res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement du leaderboard')
        return await res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='bg-gradient-to-br from-blueberry-100 via-peach-50 to-latte-100 rounded-2xl shadow-lg p-5 h-full flex flex-col border-2 border-blueberry-200'>
      <h3 className='text-xl font-extrabold text-blueberry-900 mb-3 tracking-wide flex items-center gap-2'>
        <span className='inline-block text-2xl drop-shadow-glow'>🏆</span>
        Leaderboard
      </h3>
      <div className='overflow-y-auto custom-scrollbar' style={{ maxHeight: 340 }}>
        {loading
          ? (
            <div className='text-center text-latte-500 py-8 font-mono animate-pulse'>Chargement...</div>
            )
          : (error != null && error !== '')
              ? (
                <div className='text-center text-red-500 py-8 font-mono'>{error}</div>
                )
              : (
                <table className='min-w-full text-sm font-mono'>
                  <thead>
                    <tr className='bg-blueberry-50 text-blueberry-700 uppercase text-xs'>
                      <th className='text-left pr-2 py-2 rounded-tl-xl'>#</th>
                      <th className='text-left pr-2'>Monstre</th>
                      <th className='text-left pr-2'>Propriétaire</th>
                      <th className='text-right pr-2'>XP</th>
                      <th className='text-right'>Niv.</th>
                      {/* Colonne visuel supprimée */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr
                        key={row.rank}
                        className={`transition-all duration-200 border-b last:border-b-0 ${row.rank === 1
                        ? 'bg-yellow-100/80 font-bold text-yellow-700 shadow-sm'
                        : row.rank === 2
                          ? 'bg-blueberry-100/60 font-semibold text-blueberry-700'
                          : row.rank === 3
                            ? 'bg-peach-100/60 font-semibold text-peach-700'
                            : idx % 2 === 0
                              ? 'bg-white/80'
                              : 'bg-latte-50/80'
                        }`}
                      >
                        <td className='font-extrabold pr-2 text-lg text-center drop-shadow-glow'>{row.rank}</td>
                        <td className='pr-2 font-semibold tracking-wide'>{row.monster}</td>
                        <td className='pr-2 text-blueberry-800'>{row.owner}</td>
                        <td className='text-right pr-2 text-strawberry-700 font-bold'>{row.xp}</td>
                        <td className='text-right text-blueberry-700 font-bold'>{row.level}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
      </div>
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

  const handleClick = () => {
    try {
      onClick()
    } catch (err) {
      console.error('Erreur lors de l\'action rapide:', err)
    }
  }
  return (
    <button
      onClick={handleClick}
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
  const { pseudo } = useUserPseudo()
  const userDisplayName = pseudo ?? session.user.name ?? session.user.email ?? 'Utilisateur'

  // Gestion modale création monstre (comme sur /monstres)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const CreateMonsterModal = dynamic(async () => await import('@/components/monsters/create-monster-modal'), { ssr: false })

  return (
    <DashboardLayout session={session} onLogout={logout}>
      <div
        className='w-full mx-auto'
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {/* Titre de Bienvenue */}
        <div>
          <h1 className='text-4xl font-bold text-blueberry-950 mb-2'>
            Bienvenue, {userDisplayName}
          </h1>
        </div>
        {/* Ligne principale : slider + actions rapides */}
        <div className='flex h-fit gap-6'>
          {/* Slider Monstres (moins large) */}
          <section className='flex flex-col justify-start h-fit'>
            <h2 className='text-xl font-semibold text-blueberry-950 text-start  mb-4'>
              Mes Monstres
            </h2>
            <div className='flex items-center justify-center'>
              <MonsterCarousel monsters={monsters} />
            </div>
          </section>
          {/* Actions rapides (plus large) */}
          <aside className='flex flex-col justify-start items-start'>
            <h2 className='text-xl font-semibold text-blueberry-950 text-start mb-4'>
              Actions Rapides
            </h2>
            <div className='grid grid-cols-2 gap-4 w-full'>
              <QuickAction
                icon='✨'
                label='Créer un monstre'
                description='Nouvelle créature'
                onClick={() => setShowCreateModal(true)}
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
                onClick={() => router.push('/inventaire')}
                color='latte'
              />
            </div>
            {/* Modale création monstre (import dynamique Next.js) */}
            {showCreateModal && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                <div className='bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full'>
                  <CreateMonsterModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onCreate={async (monster) => {
                      const { createMonster } = await import('@/actions/monsters.action')
                      await createMonster(monster as any)
                      setShowCreateModal(false)
                      window.location.reload()
                    }}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
        {/* Ligne secondaire : boutique + leaderboard */}
        <div className='flex h-full gap-6 mt-6'>
          <div className='w-[60%] min-w-[320px] h-full overflow-hidden flex flex-col'>
            <DashboardShop />
          </div>
          <div className='w-[40%] min-w-[220px] h-full overflow-hidden flex flex-col'>
            <DashboardLeaderboard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardContent
