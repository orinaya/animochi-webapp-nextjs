/**
 * InventoryPageContent - Contenu de la page Inventaire
 *
 * Affiche uniquement l'inventaire des accessoires possédés par l'utilisateur
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de l'inventaire
 *
 * @module components/inventory/inventory-page-content
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
// import { RARITY_COLORS } from '@/types/monster/monster-accessories'
import { authClient } from '@/lib/auth/auth-client'
import type { authClient as AuthClientType } from '@/lib/auth/auth-client'
import type { AccessoryCategory, OwnedAccessory, AccessoryData } from '@/types/monster/monster-accessories'
import { RARITY_COLORS } from '@/config/monster-accessories.config'

type Session = typeof AuthClientType.$Infer.Session

interface InventoryPageContentProps {
  session: Session
}

/**
 * Retourne le label en français pour une catégorie
 */
function getCategoryLabel (category: AccessoryCategory): string {
  const labels: Record<AccessoryCategory, string> = {
    hat: '🎩 Chapeaux',
    glasses: '👓 Lunettes',
    shoes: '👟 Chaussures',
    background: '🖼️ Arrière-plans'
  }
  return labels[category]
}

/**
 * Retourne l'emoji pour une catégorie
 */
function getCategoryEmoji (category: AccessoryCategory): string {
  const emojis: Record<AccessoryCategory, string> = {
    hat: '🎩',
    glasses: '👓',
    shoes: '👟',
    background: '🖼️'
  }
  return emojis[category]
}

export default function InventoryPageContent ({ session }: InventoryPageContentProps): React.ReactNode {
  const router = useRouter()
  const [ownedAccessories, setOwnedAccessories] = useState<Array<OwnedAccessory & { details: AccessoryData }>>([])
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Gère la déconnexion
   */
  const handleLogout = (): void => {
    void authClient.signOut().then(() => {
      router.push('/auth/login')
    })
  }

  /**
   * Charge les accessoires possédés au montage du composant
   */
  useEffect(() => {
    const fetchOwnedAccessories = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/accessories/owned')
        if (response.ok) {
          const data = await response.json() as { accessories: Array<OwnedAccessory & { details: AccessoryData }> }
          setOwnedAccessories(data.accessories)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchOwnedAccessories()
  }, [])

  /**
   * Filtre les accessoires selon la catégorie sélectionnée
   */
  const filteredAccessories = ownedAccessories.filter(item => {
    return selectedCategory === 'all' || item.details.category === selectedCategory
  })

  /**
   * Compte les accessoires par catégorie
   */
  const countByCategory = (category: AccessoryCategory): number => {
    return ownedAccessories.filter(item => item.details.category === category).length
  }

  return (
    <DashboardLayout
      session={session}
      onLogout={handleLogout}
      breadcrumbItems={[
        { label: 'Tableau de bord', href: '/dashboard' },
        { label: 'Inventaire' }
      ]}
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-blueberry-950 mb-2'>
            📦 Mon Inventaire
          </h1>
          <p className='text-latte-600'>
            Tous vos accessoires collectés pour personnaliser vos monstres
          </p>
        </div>

        {/* Statistiques */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
          <div className='bg-linear-to-br from-blueberry-100 to-blueberry-50 rounded-xl p-4 text-center'>
            <span className='text-3xl block mb-2'>🎒</span>
            <p className='text-sm text-blueberry-600 font-medium'>Total</p>
            <p className='text-2xl font-bold text-blueberry-950'>{ownedAccessories.length}</p>
          </div>
          <div className='bg-linear-to-br from-peach-100 to-peach-50 rounded-xl p-4 text-center'>
            <span className='text-3xl block mb-2'>🎩</span>
            <p className='text-sm text-peach-600 font-medium'>Chapeaux</p>
            <p className='text-2xl font-bold text-peach-950'>{countByCategory('hat')}</p>
          </div>
          <div className='bg-linear-to-br from-strawberry-100 to-strawberry-50 rounded-xl p-4 text-center'>
            <span className='text-3xl block mb-2'>👓</span>
            <p className='text-sm text-strawberry-600 font-medium'>Lunettes</p>
            <p className='text-2xl font-bold text-strawberry-950'>{countByCategory('glasses')}</p>
          </div>
          <div className='bg-linear-to-br from-latte-100 to-latte-50 rounded-xl p-4 text-center'>
            <span className='text-3xl block mb-2'>👟</span>
            <p className='text-sm text-latte-600 font-medium'>Chaussures</p>
            <p className='text-2xl font-bold text-latte-950'>{countByCategory('shoes')}</p>
          </div>
          <div className='bg-linear-to-br from-peach-100 to-peach-50 rounded-xl p-4 text-center'>
            <span className='text-3xl block mb-2'>🖼️</span>
            <p className='text-sm text-peach-600 font-medium'>Arrière-plans</p>
            <p className='text-2xl font-bold text-peach-950'>{countByCategory('background')}</p>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-latte-200'>
          <label className='block text-sm font-semibold text-blueberry-950 mb-3'>
            Filtrer par catégorie
          </label>
          <div className='flex gap-3 flex-wrap'>
            <button
              onClick={() => { setSelectedCategory('all') }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all'
                ? 'bg-blueberry-500 text-white shadow-md'
                : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                }`}
            >
              Tout ({ownedAccessories.length})
            </button>
            {(['hat', 'glasses', 'shoes', 'background'] as AccessoryCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category) }}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                  ? 'bg-blueberry-500 text-white shadow-md'
                  : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                  }`}
              >
                {getCategoryLabel(category)} ({countByCategory(category)})
              </button>
            ))}
          </div>
        </div>

        {/* Grille d'accessoires */}
        {isLoading
          ? (
            <div className='flex items-center justify-center py-20'>
              <div className='text-lg text-latte-600'>Chargement de votre inventaire...</div>
            </div>
            )
          : ownedAccessories.length === 0
            ? (
              <div className='text-center py-20 bg-white rounded-xl shadow-sm border border-latte-200'>
                <span className='text-6xl block mb-4'>🎒</span>
                <p className='text-latte-600 text-lg mb-2'>Votre inventaire est vide</p>
                <p className='text-sm text-latte-500 mb-6'>
                  Visitez la boutique pour acheter des accessoires !
                </p>
                <button
                  onClick={() => { router.push('/shop') }}
                  className='px-6 py-3 bg-strawberry-500 text-white font-semibold rounded-lg hover:bg-strawberry-600 transition-all hover:scale-105'
                >
                  🛍️ Aller à la boutique
                </button>
              </div>
              )
            : filteredAccessories.length === 0
              ? (
                <div className='text-center py-20 bg-white rounded-xl shadow-sm border border-latte-200'>
                  <span className='text-6xl block mb-4'>🔍</span>
                  <p className='text-latte-600 text-lg'>Aucun accessoire dans cette catégorie</p>
                </div>
                )
              : (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                  {filteredAccessories.map((item) => (
                    <div
                      key={item.id ?? item.accessoryName}
                      className='bg-white rounded-xl p-4 border-2 border-latte-200 hover:border-blueberry-300 hover:shadow-lg transition-all'
                    >
                      {/* Badge de rareté */}
                      <div className='flex justify-between items-start mb-3'>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${RARITY_COLORS[item.details.rarity]}`}
                        >
                          {item.details.rarity}
                        </span>
                        <span className='text-2xl'>{getCategoryEmoji(item.details.category)}</span>
                      </div>

                      {/* Prévisualisation SVG */}
                      <div className='bg-latte-50 rounded-lg p-3 mb-3 flex items-center justify-center min-h-20'>
                        {item.details.category === 'background'
                          ? (
                              item.details.imagePath != null
                                ? (
                                  <div
                                    className='w-full h-full min-h-20 rounded bg-cover bg-center'
                                    style={{ backgroundImage: `url(${item.details.imagePath})` }}
                                  />
                                  )
                                : (
                                  <svg
                                    viewBox='0 0 200 200'
                                    className='w-full h-full'
                                    dangerouslySetInnerHTML={{ __html: item.details.svg ?? '' }}
                                  />
                                  )
                            )
                          : (
                            <svg
                              viewBox='0 0 80 80'
                              className='w-16 h-16'
                              dangerouslySetInnerHTML={{ __html: item.details.svg ?? '' }}
                            />
                            )}
                      </div>

                      {/* Nom */}
                      <h4 className='font-bold text-blueberry-950 text-sm mb-2 text-center truncate'>
                        {item.details.name}
                      </h4>

                      {/* Description */}
                      <p className='text-xs text-latte-600 text-center line-clamp-2'>
                        {item.details.description}
                      </p>
                    </div>
                  ))}
                </div>
                )}
      </div>
    </DashboardLayout>
  )
}
