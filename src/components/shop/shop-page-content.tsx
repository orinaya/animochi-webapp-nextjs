/**
 * ShopPageContent - Contenu de la page boutique avec sidebar
 *
 * Permet d'acheter des accessoires pour les monstres avec des Animoneys
 * Reprend exactement le contenu de l'onglet boutique de la modal d'inventaire
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de la boutique
 * Respecte le principe OCP : Extensible via hooks et services
 *
 * @module components/shop/shop-page-content
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { DashboardLayout } from '@/components/layout'
import { RARITY_COLORS } from '@/config/monster-accessories.config'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'
import { useWallet } from '@/hooks/use-wallet'
import { walletEvents } from '@/lib/events/wallet-events'
import { authClient } from '@/lib/auth/auth-client'
import type { AccessoryData, AccessoryCategory, OwnedAccessory, AccessoryRarity } from '@/types/monster/monster-accessories'

type Session = typeof authClient.$Infer.Session

interface ShopPageContentProps {
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
 * Retourne le label en français pour une rareté
 */
function getRarityLabel (rarity: AccessoryRarity): string {
  const labels: Record<AccessoryRarity, string> = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  }
  return labels[rarity]
}

/**
 * Contenu de la page boutique d'accessoires
 */
export function ShopPageContent ({ session }: ShopPageContentProps): React.ReactNode {
  const router = useRouter()
  const { wallet, refetch: refetchWallet } = useWallet()
  const [ownedAccessories, setOwnedAccessories] = useState<Array<OwnedAccessory & { details: AccessoryData }>>([])
  const [shopCategory, setShopCategory] = useState<AccessoryCategory | 'all'>('all')
  const [shopRarity, setShopRarity] = useState<AccessoryRarity | 'all'>('all')
  const [purchasing, setPurchasing] = useState<string | null>(null)

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Tableau de bord', href: '/dashboard' },
    { label: 'Boutique' }
  ]

  const handleLogout = (): void => {
    // Logout logic handled via authClient
  }

  /**
   * Charge les accessoires possédés au montage du composant
   */
  useEffect(() => {
    const fetchOwnedAccessories = async (): Promise<void> => {
      try {
        const response = await fetch('/api/accessories/owned')
        if (response.ok) {
          const data = await response.json() as { accessories: Array<OwnedAccessory & { details: AccessoryData }> }
          setOwnedAccessories(data.accessories)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires:', error)
      }
    }
    void fetchOwnedAccessories()
  }, [])

  /**
   * Combine les catalogues pour le shop
   */
  const allShopItems = useMemo(() => {
    return [...ACCESSORIES_CATALOG, ...BACKGROUNDS_CATALOG]
  }, [])

  /**
   * Filtre les accessoires du shop selon les critères
   */
  const shopFilteredAccessories = allShopItems.filter(accessory => {
    const categoryMatch = shopCategory === 'all' || accessory.category === shopCategory
    const rarityMatch = shopRarity === 'all' || accessory.rarity === shopRarity
    return categoryMatch && rarityMatch
  })

  /**
   * Gère l'achat d'un accessoire depuis la boutique
   */
  const handlePurchase = async (accessory: AccessoryData): Promise<void> => {
    setPurchasing(accessory.name)
    try {
      const response = await fetch('/api/accessories/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessoryName: accessory.name })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`${accessory.emoji} ${accessory.name} acheté avec succès !`)

        // Émettre l'événement pour notifier tous les composants qui utilisent useWallet
        walletEvents.emit()

        // Rafraîchir le wallet local et la liste des accessoires possédés
        void refetchWallet()

        // Rafraîchir les détails des accessoires
        const refreshResponse = await fetch('/api/accessories/owned')
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json() as { accessories: Array<OwnedAccessory & { details: AccessoryData }> }
          setOwnedAccessories(refreshData.accessories)
        }

        router.refresh()
      } else {
        toast.error(data.error ?? 'Impossible d\'acheter cet accessoire')
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error)
      toast.error('Impossible d\'acheter cet accessoire')
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <DashboardLayout session={session} onLogout={handleLogout} breadcrumbItems={breadcrumbItems}>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-blueberry-950 mb-2'>
            🛍️ Boutique d'Accessoires
          </h1>
          <p className='text-latte-600'>
            Achetez des accessoires uniques pour personnaliser vos monstres !
          </p>
        </div>

        {/* Solde d'Animoneys */}
        <div className='bg-linear-to-r from-strawberry-100 to-peach-100 rounded-xl p-6 mb-8 flex items-center justify-between shadow-lg'>
          <div className='flex items-center gap-4'>
            <span className='text-4xl'>💰</span>
            <div>
              <p className='text-sm text-latte-600 font-medium'>Votre solde</p>
              <p className='text-3xl font-bold text-blueberry-950'>
                {wallet?.balance ?? 0} <span className='text-2xl'>Ⱥ</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => { router.push('/wallet') }}
            className='px-6 py-3 bg-strawberry-500 text-white font-semibold rounded-lg hover:bg-strawberry-600 transition-all hover:scale-105'
          >
            Recharger
          </button>
        </div>

        {/* Filtres */}
        <div className='bg-white rounded-xl p-6 mb-6 shadow-sm border border-latte-200'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            {/* Filtre par catégorie */}
            <div className='flex-1'>
              <label className='block text-sm font-semibold text-blueberry-950 mb-3'>
                Catégorie
              </label>
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={() => { setShopCategory('all') }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${shopCategory === 'all'
                    ? 'bg-blueberry-500 text-white shadow-sm'
                    : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                    }`}
                >
                  Tout
                </button>
                {(['hat', 'glasses', 'shoes', 'background'] as AccessoryCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => { setShopCategory(category) }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${shopCategory === category
                      ? 'bg-blueberry-500 text-white shadow-sm'
                      : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                      }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>

            {/* Séparateur vertical (visible uniquement sur grand écran) */}
            <div className='hidden lg:block w-px h-16 bg-latte-200' />

            {/* Filtre par rareté */}
            <div className='flex-1'>
              <label className='block text-sm font-semibold text-blueberry-950 mb-3'>
                Rareté
              </label>
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={() => { setShopRarity('all') }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${shopRarity === 'all'
                    ? 'bg-peach-500 text-white shadow-sm'
                    : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                    }`}
                >
                  Tout
                </button>
                {(['common', 'rare', 'epic', 'legendary'] as AccessoryRarity[]).map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => { setShopRarity(rarity) }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${shopRarity === rarity
                      ? 'bg-peach-500 text-white shadow-sm'
                      : `${RARITY_COLORS[rarity]} hover:opacity-80`
                      }`}
                  >
                    {getRarityLabel(rarity)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compteur de résultats */}
        <div className='mb-6 text-latte-600'>
          <p className='text-sm'>
            <span className='font-semibold text-blueberry-950'>{shopFilteredAccessories.length}</span> accessoire{shopFilteredAccessories.length > 1 ? 's' : ''} disponible{shopFilteredAccessories.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille d'accessoires à acheter */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {shopFilteredAccessories.map((accessory) => {
            const canAfford = (wallet?.balance ?? 0) >= accessory.price
            const isPurchasing = purchasing === accessory.name
            const isOwned = ownedAccessories.some(owned => owned.accessoryName === accessory.name)

            return (
              <div
                key={accessory.name}
                className={`bg-white rounded-xl p-5 border-2 transition-all hover:shadow-xl ${isOwned
                  ? 'border-green-400 bg-green-50'
                  : 'border-latte-200 hover:border-blueberry-300'
                  }`}
              >
                {/* Badge de rareté et statut */}
                <div className='flex justify-between items-start mb-3'>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${RARITY_COLORS[accessory.rarity]}`}
                  >
                    {getRarityLabel(accessory.rarity)}
                  </span>
                  <div className='flex items-center gap-2'>
                    {isOwned && (
                      <span className='text-xs px-2 py-1 bg-green-500 text-white rounded-full font-semibold'>
                        ✓ Possédé
                      </span>
                    )}
                    <span className='text-2xl'>{accessory.emoji}</span>
                  </div>
                </div>

                {/* Prévisualisation SVG ou Image */}
                <div className='bg-latte-50 rounded-lg p-4 mb-4 flex items-center justify-center min-h-[120px] overflow-hidden'>
                  {accessory.category === 'background'
                    ? (
                        accessory.imagePath != null
                          ? (
                            <div
                              className='w-full h-28 rounded bg-cover bg-center'
                              style={{ backgroundImage: `url(${accessory.imagePath})` }}
                            />
                            )
                          : accessory.svg != null
                            ? (
                              <svg
                                viewBox='0 0 100 100'
                                className='w-full h-28 rounded'
                                dangerouslySetInnerHTML={{ __html: accessory.svg }}
                              />
                              )
                            : null
                      )
                    : (
                      <svg
                        viewBox='0 0 80 80'
                        className='w-24 h-24'
                        dangerouslySetInnerHTML={{ __html: accessory.svg ?? '' }}
                      />
                      )}
                </div>

                {/* Informations */}
                <div className='space-y-3'>
                  <h3 className='font-bold text-blueberry-950 text-base'>
                    {accessory.name}
                  </h3>
                  <p className='text-xs text-latte-600 min-h-10'>
                    {accessory.description}
                  </p>

                  {/* Prix et bouton d'achat */}
                  <div className='flex items-center justify-between pt-3 border-t border-latte-200'>
                    <div className='flex items-center gap-1'>
                      <span className='text-xl'>💰</span>
                      <span className='text-xl font-bold text-strawberry-600'>
                        {accessory.price}
                      </span>
                    </div>

                    <button
                      onClick={() => { void handlePurchase(accessory) }}
                      disabled={!canAfford || isPurchasing || isOwned}
                      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isOwned
                        ? 'bg-green-500 text-white cursor-default'
                        : canAfford && !isPurchasing
                          ? 'bg-strawberry-500 text-white hover:bg-strawberry-600 hover:scale-105'
                          : 'bg-latte-300 text-latte-500 cursor-not-allowed'
                        }`}
                    >
                      {isPurchasing ? '⏳' : isOwned ? '✓ Acheté' : canAfford ? 'Acheter' : '🔒'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message si aucun accessoire dans le filtre */}
        {shopFilteredAccessories.length === 0 && (
          <div className='text-center py-20 bg-white rounded-xl shadow-md'>
            <span className='text-6xl block mb-4'>🔍</span>
            <p className='text-latte-600 text-lg'>Aucun accessoire dans cette catégorie</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
