/**
 * AccessoryShopModal - Modal de la boutique d'accessoires
 *
 * Permet d'acheter des accessoires pour les monstres
 * Affiche le catalogue avec filtres par catégorie et rareté
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de la boutique
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/accessories/accessory-shop-modal
 */

'use client'

import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'
import { RARITY_COLORS } from '@/types/monster-accessories'
import type { AccessoryData, AccessoryCategory, AccessoryRarity } from '@/types/monster-accessories'

interface AccessoryShopModalProps {
  /** Indique si la modal est ouverte */
  isOpen: boolean
  /** Callback appelé lors de la fermeture */
  onClose: () => void
  /** Solde actuel en Animoneys */
  animoneysBalance: number
  /** Callback appelé lors de l'achat d'un accessoire */
  onPurchase: (accessory: AccessoryData) => Promise<void>
  /** Liste des accessoires déjà possédés (noms) */
  ownedAccessories?: string[]
}

/**
 * Retourne le label en français pour une catégorie
 */
function getCategoryLabel(category: AccessoryCategory): string {
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
function getRarityLabel(rarity: AccessoryRarity): string {
  const labels: Record<AccessoryRarity, string> = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  }
  return labels[rarity]
}

/**
 * Modal de la boutique d'accessoires
 */
export default function AccessoryShopModal({
  isOpen,
  onClose,
  animoneysBalance,
  onPurchase,
  ownedAccessories = []
}: AccessoryShopModalProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [selectedRarity, setSelectedRarity] = useState<AccessoryRarity | 'all'>('all')
  const [purchasing, setPurchasing] = useState<string | null>(null)

  /**
   * Combine les catalogues d'accessoires et de backgrounds
   */
  const allItems = useMemo(() => {
    return [...ACCESSORIES_CATALOG, ...BACKGROUNDS_CATALOG]
  }, [])

  /**
   * Filtre les accessoires selon les critères sélectionnés
   */
  const filteredAccessories = allItems.filter(accessory => {
    const categoryMatch = selectedCategory === 'all' || accessory.category === selectedCategory
    const rarityMatch = selectedRarity === 'all' || accessory.rarity === selectedRarity
    return categoryMatch && rarityMatch
  })

  /**
   * Gère l'achat d'un accessoire
   */
  const handlePurchase = async (accessory: AccessoryData): Promise<void> => {
    setPurchasing(accessory.name)
    try {
      await onPurchase(accessory)
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🛍️ Boutique d'Accessoires" size='xl'>
      <div className='space-y-6'>
        {/* Solde d'Animoneys */}
        <div className='bg-linear-to-r from-strawberry-100 to-peach-100 rounded-xl p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-3xl'>💰</span>
            <div>
              <p className='text-sm text-latte-600'>Votre solde</p>
              <p className='text-2xl font-bold text-blueberry-950'>
                {animoneysBalance} <span className='text-lg'>Ⱥ</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className='space-y-3'>
          {/* Filtre par catégorie */}
          <div>
            <label className='block text-sm font-semibold text-blueberry-950 mb-2'>
              Catégorie
            </label>
            <div className='flex gap-2 flex-wrap'>
              <button
                onClick={() => { setSelectedCategory('all') }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all'
                  ? 'bg-blueberry-500 text-white'
                  : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                  }`}
              >
                Tout
              </button>
              {(['hat', 'glasses', 'shoes', 'background'] as AccessoryCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category) }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category
                    ? 'bg-blueberry-500 text-white'
                    : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                    }`}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre par rareté */}
          <div>
            <label className='block text-sm font-semibold text-blueberry-950 mb-2'>
              Rareté
            </label>
            <div className='flex gap-2 flex-wrap'>
              <button
                onClick={() => { setSelectedRarity('all') }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRarity === 'all'
                  ? 'bg-peach-500 text-white'
                  : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                  }`}
              >
                Tout
              </button>
              {(['common', 'rare', 'epic', 'legendary'] as AccessoryRarity[]).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => { setSelectedRarity(rarity) }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedRarity === rarity
                    ? 'bg-peach-500 text-white'
                    : `${RARITY_COLORS[rarity]}`
                    }`}
                >
                  {getRarityLabel(rarity)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grille d'accessoires */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2'>
          {filteredAccessories.map((accessory) => {
            const canAfford = animoneysBalance >= accessory.price
            const isPurchasing = purchasing === accessory.name
            const isOwned = ownedAccessories.includes(accessory.name)

            return (
              <div
                key={accessory.name}
                className={`bg-white rounded-xl p-4 border-2 transition-all hover:shadow-lg ${isOwned
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
                <div className='bg-latte-50 rounded-lg p-4 mb-3 flex items-center justify-center min-h-[100px] overflow-hidden'>
                  {accessory.category === 'background'
                    ? (
                      accessory.imagePath != null
                        ? (
                          // Background image
                          <div
                            className='w-full h-24 rounded bg-cover bg-center'
                            style={{ backgroundImage: `url(${accessory.imagePath})` }}
                          />
                        )
                        : accessory.svg != null
                          ? (
                            // Background gradient SVG
                            <svg
                              viewBox='0 0 100 100'
                              className='w-full h-24 rounded'
                              dangerouslySetInnerHTML={{ __html: accessory.svg }}
                            />
                          )
                          : null
                    )
                    : (
                      // Accessoire SVG
                      <svg
                        viewBox='0 0 80 80'
                        className='w-20 h-20'
                        dangerouslySetInnerHTML={{ __html: accessory.svg ?? '' }}
                      />
                    )}
                </div>

                {/* Informations */}
                <div className='space-y-2'>
                  <h3 className='font-bold text-blueberry-950 text-sm'>
                    {accessory.name}
                  </h3>
                  <p className='text-xs text-latte-600'>
                    {accessory.description}
                  </p>

                  {/* Prix et bouton d'achat */}
                  <div className='flex items-center justify-between pt-2 border-t border-latte-200'>
                    <div className='flex items-center gap-1'>
                      <span className='text-lg'>💰</span>
                      <span className='text-lg font-bold text-strawberry-600'>
                        {accessory.price}
                      </span>
                    </div>

                    <button
                      onClick={() => { void handlePurchase(accessory) }}
                      disabled={!canAfford || isPurchasing || isOwned}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isOwned
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

        {/* Message si aucun résultat */}
        {filteredAccessories.length === 0 && (
          <div className='text-center py-12'>
            <span className='text-6xl block mb-4'>🔍</span>
            <p className='text-latte-600'>Aucun accessoire trouvé</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
