/**
 * GaleriePage - Page de galerie communautaire
 *
 * Affiche tous les monstres publics avec filtres et pagination
 *
 * @module app/galerie/galerie-page
 */

'use client'

import { getPublicMonsters } from '@/actions/gallery.actions'
import { GalleryFilters } from '@/components/monsters/gallery-filters'
import { MonsterGalleryCardInstagram } from '@/components/monsters/monster-gallery-card-instagram'
import { DashboardLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth/auth-client'
import type { GalleryFilters as GalleryFiltersType, GalleryResult } from '@/types'
import { useEffect, useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'

type Session = typeof authClient.$Infer.Session

/**
 * Composant page de galerie communautaire
 *
 * Fonctionnalités :
 * - Affichage en grille des monstres publics
 * - Filtrage par niveau, état, tri
 * - Pagination
 * - Responsive design
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de la galerie
 */
export default function GaleriePage (): React.ReactElement {
  const [result, setResult] = useState<GalleryResult>({
    monsters: [],
    total: 0,
    page: 1,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  })
  const [filters, setFilters] = useState<GalleryFiltersType>({
    sortBy: 'newest',
    state: 'all',
    page: 1,
    limit: 12
  })
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Charger la session
  useEffect(() => {
    const loadSession = async (): Promise<void> => {
      const data = await authClient.getSession()
      setSession(data.data)
    }
    void loadSession()
  }, [])

  // Charger les monstres à chaque changement de filtre
  useEffect(() => {
    const loadMonsters = async (): Promise<void> => {
      setIsLoading(true)
      const data = await getPublicMonsters(filters)
      setResult(data)
      setIsLoading(false)
    }

    void loadMonsters()
  }, [filters])

  const handleFiltersChange = (newFilters: GalleryFiltersType): void => {
    setFilters({ ...newFilters, page: 1, limit: 12 })
  }

  const handlePageChange = (newPage: number): void => {
    setFilters({ ...filters, page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { logout } = useAuth()

  const handleLogout = (): void => {
    try {
      logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const breadcrumbItems = [
    { label: 'Tableau de bord', href: '/dashboard' },
    { label: 'Galerie Communautaire' }
  ]

  if (session == null) {
    return (
      <div className='min-h-screen bg-linear-to-b from-latte-25 to-white flex items-center justify-center'>
        <p className='text-gray-600'>Chargement...</p>
      </div>
    )
  }

  return (
    <DashboardLayout session={session} onLogout={handleLogout} breadcrumbItems={breadcrumbItems}>
      <div className='w-full max-w-6xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-blueberry-950 mb-2'>
                🌍 Galerie Communautaire
              </h1>
              <p className='text-latte-600'>
                Découvrez <span className='font-semibold text-blueberry-700'>{result.total}</span> monstres publics créés par la communauté
              </p>
            </div>

            {/* Bouton Filtres */}
            <button
              onClick={() => { setShowFilters(!showFilters) }}
              className='flex items-center gap-2 px-4 py-2 bg-blueberry-600 text-white rounded-lg hover:bg-blueberry-700 transition-colors'
            >
              {showFilters ? <FiX size={20} /> : <FiFilter size={20} />}
              <span className='hidden sm:inline'>{showFilters ? 'Masquer' : 'Filtres'}</span>
            </button>
          </div>

          {/* Filtres collapsibles */}
          {showFilters && (
            <div className='mb-6 animate-in slide-in-from-top duration-200'>
              <GalleryFilters
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
              />
            </div>
          )}
        </div>

        {/* Grille de monstres - 3 colonnes */}
        <main className='mt-8'>
          {isLoading
            ? (
              <div className='flex items-center justify-center py-20'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blueberry-600 mx-auto mb-4' />
                  <p className='text-gray-600'>Chargement des monstres...</p>
                </div>
              </div>
              )
            : result.monsters.length === 0
              ? (
                <div className='bg-white rounded-2xl border border-latte-200 p-12 text-center'>
                  <div className='text-6xl mb-4'>😢</div>
                  <h2 className='text-2xl font-bold text-blueberry-950 mb-2'>
                    Aucun monstre trouvé
                  </h2>
                  <p className='text-gray-600'>
                    Essayez de modifier vos filtres ou revenez plus tard !
                  </p>
                </div>
                )
              : (
                <>
                  {/* Grille de monstres - 3 colonnes responsive */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {result.monsters.map((monster) => (
                      <MonsterGalleryCardInstagram
                        key={monster.id ?? monster._id}
                        monster={monster}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {result.totalPages > 1 && (
                    <div className='bg-white rounded-2xl border border-latte-200 p-6 mt-8'>
                      <div className='flex items-center justify-between'>
                        <button
                          onClick={() => { handlePageChange(result.page - 1) }}
                          disabled={!result.hasPrevious}
                          className={`
                            px-4 py-2 rounded-lg font-medium transition-all
                            ${result.hasPrevious
                              ? 'bg-blueberry-600 text-white hover:bg-blueberry-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          ← Précédent
                        </button>

                        <div className='flex items-center gap-2'>
                          <span className='text-gray-600'>
                            Page <span className='font-bold text-blueberry-700'>{result.page}</span> sur {result.totalPages}
                          </span>
                        </div>

                        <button
                          onClick={() => { handlePageChange(result.page + 1) }}
                          disabled={!result.hasNext}
                          className={`
                            px-4 py-2 rounded-lg font-medium transition-all
                            ${result.hasNext
                              ? 'bg-blueberry-600 text-white hover:bg-blueberry-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  )}
                </>
                )}
        </main>
      </div>
    </DashboardLayout>
  )
}
