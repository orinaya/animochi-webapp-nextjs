/**
 * InventoryPageContent - Contenu de la page Inventaire
 *
 * Affiche le catalogue complet des accessoires disponibles
 *
 * Respecte le principe SRP : Gère uniquement l'affichage du catalogue
 *
 * @module components/inventory/inventory-page-content
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { FiShoppingBag, FiPackage } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { authClient } from '@/lib/auth/auth-client'
import type { authClient as AuthClientType } from '@/lib/auth/auth-client'
import type { AccessoryCategory, AccessoryRarity } from '@/types/monster-accessories'

type Session = typeof AuthClientType.$Infer.Session

interface InventoryPageContentProps {
  session: Session
}

/**
 * Retourne le label en français pour une catégorie
 */
function getCategoryLabel(category: AccessoryCategory | 'all'): string {
  const labels: Record<AccessoryCategory | 'all', string> = {
    all: 'Tous',
    hat: '🎩 Chapeaux',
    glasses: '👓 Lunettes',
    shoes: '👟 Chaussures'
  }
  return labels[category]
}

/**
 * Retourne le label en français pour une rareté
 */
function getRarityLabel(rarity: AccessoryRarity | 'all'): string {
  const labels: Record<AccessoryRarity | 'all', string> = {
    all: 'Toutes',
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  }
  return labels[rarity]
}

/**
 * Retourne la couleur pour chaque rareté
 */
function getRarityColor(rarity: AccessoryRarity): { border: string, text: string, bg: string } {
  const colors = {
    common: { border: 'border-latte-300', text: 'text-latte-600', bg: 'bg-latte-50' },
    rare: { border: 'border-blue-400', text: 'text-blue-600', bg: 'bg-blue-50' },
    epic: { border: 'border-purple-400', text: 'text-purple-600', bg: 'bg-purple-50' },
    legendary: { border: 'border-yellow-400', text: 'text-yellow-600', bg: 'bg-yellow-50' }
  }
  return colors[rarity]
}

export default function InventoryPageContent({ session }: InventoryPageContentProps): React.ReactNode {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'inventory' | 'shop'>('shop')
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [selectedRarity, setSelectedRarity] = useState<AccessoryRarity | 'all'>('all')

  /**
   * Gère la déconnexion
   */
  const handleLogout = (): void => {
    authClient.signOut().then(() => {
      router.push('/auth/login')
    }).catch((error) => {
      console.error('Erreur déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
    })
  }

  // Filtrer le catalogue pour la boutique
  const filteredShopAccessories = ACCESSORIES_CATALOG.filter(accessory => {
    // Filtrer par catégorie
    if (selectedCategory !== 'all' && accessory.category !== selectedCategory) {
      return false
    }
    // Filtrer par rareté
    if (selectedRarity !== 'all' && accessory.rarity !== selectedRarity) {
      return false
    }
    return true
  })

  const categories: Array<AccessoryCategory | 'all'> = ['all', 'hat', 'glasses', 'shoes']
  const rarities: Array<AccessoryRarity | 'all'> = ['all', 'common', 'rare', 'epic', 'legendary']

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
        {/* En-tête */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-blueberry-950 mb-2'>
              Catalogue d'Accessoires
            </h1>
            <p className='text-latte-600'>
              Découvrez tous les accessoires disponibles pour vos monstres
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className='flex gap-2 mb-6 border-b border-latte-200'>
          <button
            onClick={() => { setActiveTab('inventory') }}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${activeTab === 'inventory'
                ? 'text-blueberry-600 border-b-2 border-blueberry-600'
                : 'text-latte-500 hover:text-blueberry-600'
              }`}
          >
            <FiPackage size={20} />
            <span>Mon Inventaire</span>
            <span className='text-xs bg-blueberry-100 text-blueberry-700 px-2 py-0.5 rounded-full'>
              Bientôt
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('shop') }}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${activeTab === 'shop'
                ? 'text-strawberry-600 border-b-2 border-strawberry-600'
                : 'text-latte-500 hover:text-strawberry-600'
              }`}
          >
            <FiShoppingBag size={20} />
            <span>Catalogue</span>
          </button>
        </div>

        {/* Filtres */}
        <div className='flex flex-wrap gap-3 mb-6'>
          {/* Filtre par catégorie */}
          <div className='flex gap-2 flex-wrap'>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category) }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedCategory === category
                    ? 'bg-blueberry-600 text-white'
                    : 'bg-white text-blueberry-900 border border-latte-200 hover:border-blueberry-300'
                  }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* Filtre par rareté */}
          <div className='flex gap-2 flex-wrap'>
            {rarities.map(rarity => (
              <button
                key={rarity}
                onClick={() => { setSelectedRarity(rarity) }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedRarity === rarity
                    ? 'bg-strawberry-600 text-white'
                    : 'bg-white text-blueberry-900 border border-latte-200 hover:border-strawberry-300'
                  }`}
              >
                {getRarityLabel(rarity)}
              </button>
            ))}
          </div>
        </div>

        {/* Catalogue */}
        {activeTab === 'shop' && (
          <div>
            {filteredShopAccessories.length > 0
              ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                  {filteredShopAccessories.map(accessory => {
                    const rarityColor = getRarityColor(accessory.rarity)

                    return (
                      <div
                        key={accessory.name}
                        className={`bg-white rounded-xl p-4 border-2 ${rarityColor.border} hover:shadow-lg transition-all`}
                      >
                        <div className={`w-full aspect-square ${rarityColor.bg} rounded-lg mb-3 flex items-center justify-center`}>
                          <svg viewBox='0 0 80 80' className='w-20 h-20'>
                            <g dangerouslySetInnerHTML={{ __html: accessory.svg ?? '' }} />
                          </svg>
                        </div>
                        <h3 className='font-semibold text-blueberry-950 text-sm mb-1 truncate'>
                          {accessory.name}
                        </h3>
                        <div className='flex items-center justify-between mb-3'>
                          <span className={`text-xs font-medium ${rarityColor.text}`}>
                            {getRarityLabel(accessory.rarity)}
                          </span>
                          <span className='text-sm font-bold text-blueberry-950'>
                            {accessory.price} Ⱥ
                          </span>
                        </div>
                        <p className='text-xs text-latte-600 line-clamp-2'>
                          {accessory.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
              : (
                <div className='text-center py-16'>
                  <div className='text-6xl mb-4'>🔍</div>
                  <p className='text-latte-600 mb-2'>
                    Aucun accessoire trouvé avec ces filtres
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Inventaire (à venir) */}
        {activeTab === 'inventory' && (
          <div className='text-center py-16'>
            <div className='text-6xl mb-4'>📦</div>
            <p className='text-latte-600 mb-2'>
              Fonctionnalité en cours de développement
            </p>
            <p className='text-sm text-latte-500'>
              Vous pourrez bientôt voir tous vos accessoires possédés ici
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
