
// ...imports existants...

// Debug : log à chaque changement de la prop monster
// (doit être placé après les imports et dans le composant)
/**
 * AccessoryInventoryModal - Modal unifiée inventaire + boutique
 *
 * Permet de gérer les accessoires (équiper/retirer) ET acheter de nouveaux accessoires
 * Interface avec onglets pour basculer entre Inventaire et Boutique
 *
 * Respecte le principe SRP : Gère l'affichage et navigation des accessoires
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/accessories/accessory-inventory-modal
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { RARITY_COLORS } from '@/types/monster-accessories'
import dynamic from 'next/dynamic'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'
import type { AccessoryData, AccessoryCategory, OwnedAccessory, AccessoryRarity } from '@/types/monster-accessories'

import type { Monster } from '@/types/monster'
const MonsterDetailAvatar = dynamic(async () => await import('@/components/monsters/monster-detail-avatar'), { ssr: false })

interface AccessoryInventoryModalProps {
  /** Indique si la modal est ouverte */
  isOpen: boolean
  /** Callback appelé lors de la fermeture */
  onClose: () => void
  /** Liste des accessoires possédés avec leurs détails */
  ownedAccessories: Array<OwnedAccessory & { details: AccessoryData }>
  /** Monstre complet à afficher */
  monster: Monster
  /** Callback appelé lors de l'équipement d'un accessoire */
  onEquip: (accessoryId: string, category: AccessoryCategory) => Promise<void>
  /** Callback appelé lors du retrait d'un accessoire */
  onUnequip: (category: AccessoryCategory) => Promise<void>
  /** Catégorie initiale à afficher (optionnel) */
  initialCategory?: AccessoryCategory
  /** Onglet initial à afficher : 'inventory' ou 'shop' */
  initialTab?: 'inventory' | 'shop'
  /** Solde actuel en Animoneys (pour la boutique) */
  animoneysBalance?: number
  /** Callback appelé lors de l'achat d'un accessoire */
  onPurchase?: (accessory: AccessoryData) => Promise<void>
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
 * Modal de l'inventaire et boutique d'accessoires
 */
export default function AccessoryInventoryModal ({
  isOpen,
  onClose,
  ownedAccessories,
  monster,
  onEquip,
  onUnequip,
  initialCategory,
  initialTab = 'inventory',
  animoneysBalance = 0,
  onPurchase
}: AccessoryInventoryModalProps): React.ReactNode {
  const [activeTab, setActiveTab] = useState<'inventory' | 'shop'>(initialTab)
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [processing, setProcessing] = useState<string | null>(null)

  // Debug : log à chaque changement de la prop monster
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[AccessoryInventoryModal] monster prop changed', monster)
  }, [monster])

  // États pour la boutique
  const [shopCategory, setShopCategory] = useState<AccessoryCategory | 'all'>('all')
  const [shopRarity, setShopRarity] = useState<AccessoryRarity | 'all'>('all')
  const [purchasing, setPurchasing] = useState<string | null>(null)

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
    if (onPurchase == null) return
    setPurchasing(accessory.name)
    try {
      await onPurchase(accessory)
    } finally {
      setPurchasing(null)
    }
  }

  // Appliquer la catégorie et l'onglet initial si fournis
  useEffect(() => {
    if (initialCategory != null) {
      setSelectedCategory(initialCategory)
    }
    if (initialTab != null) {
      setActiveTab(initialTab)
    }
  }, [initialCategory, initialTab])

  /**
   * Filtre les accessoires selon la catégorie sélectionnée
   */
  const filteredAccessories = ownedAccessories.filter(item => {
    return selectedCategory === 'all' || item.details.category === selectedCategory
  })

  /**
   * Vérifie si un accessoire est équipé
   */
  const isEquipped = (accessoryName: string, category: AccessoryCategory): boolean => {
    return monster.equippedAccessories?.[category] === accessoryName
  }

  /**
   * Gère l'équipement d'un accessoire
   */
  const handleEquip = async (accessoryName: string, category: AccessoryCategory): Promise<void> => {
    setProcessing(accessoryName)
    try {
      await onEquip(accessoryName, category)
    } finally {
      setProcessing(null)
    }
  }

  /**
   * Gère le retrait d'un accessoire
   */
  const handleUnequip = async (category: AccessoryCategory): Promise<void> => {
    setProcessing(category)
    try {
      await onUnequip(category)
    } finally {
      setProcessing(null)
    }
  }

  /**
   * Compte les accessoires par catégorie
   */
  const countByCategory = (category: AccessoryCategory): number => {
    return ownedAccessories.filter(item => item.details.category === category).length
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='� Accessoires' size='xl'>
      <div className='space-y-6'>
        {/* Onglets */}
        <div className='flex gap-2 border-b-2 border-latte-200'>
          <button
            onClick={() => { setActiveTab('inventory') }}
            className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'inventory'
              ? 'text-blueberry-600 border-b-2 border-blueberry-600 -mb-0.5'
              : 'text-latte-600 hover:text-blueberry-500'
              }`}
          >
            �🎒 Mon Inventaire
            {ownedAccessories.length > 0 && (
              <span className='ml-2 px-2 py-0.5 bg-blueberry-100 text-blueberry-700 text-xs rounded-full'>
                {ownedAccessories.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('shop') }}
            className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'shop'
              ? 'text-strawberry-600 border-b-2 border-strawberry-600 -mb-0.5'
              : 'text-latte-600 hover:text-strawberry-500'
              }`}
          >
            🛍️ Boutique
          </button>
        </div>

        {/* Contenu de l'onglet Inventaire */}
        {activeTab === 'inventory' && (
          <div className='space-y-6'>

            {/* Visualisation du monstre */}
            <div className='bg-white rounded-2xl p-4 shadow-lg flex justify-center items-center'>
              <MonsterDetailAvatar
                monster={monster}
              />
            </div>

            {/* Filtres par catégorie */}
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
                  <span className='ml-2 px-2 py-0.5 bg-latte-200 text-latte-700 text-xs rounded-full'>
                    {ownedAccessories.length}
                  </span>
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
                    <span className='ml-2 px-2 py-0.5 bg-latte-200 text-latte-700 text-xs rounded-full'>
                      {countByCategory(category)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Liste horizontale d'accessoires avec scroll */}
            <div className='relative'>
              {/* Chevron gauche (desktop uniquement) */}
              <button
                type='button'
                aria-label='Faire défiler vers la gauche'
                className='hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 border border-latte-300 rounded-full shadow p-2 hover:bg-blueberry-100 transition disabled:opacity-30'
                onClick={() => {
                  const el = document.getElementById('accessory-scroll-list')
                  if (el !== null) el.scrollBy({ left: -300, behavior: 'smooth' })
                }}
              >
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path d='M15 19l-7-7 7-7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /></svg>
              </button>

              {/* Liste scrollable */}
              <div
                id='accessory-scroll-list'
                className='flex overflow-x-auto gap-3 py-2 px-1 scrollbar-thin scrollbar-thumb-blueberry-200 scrollbar-track-latte-100 md:scroll-smooth'
                style={{ scrollBehavior: 'smooth' }}
              >
                {filteredAccessories.map((item) => {
                  const equipped = isEquipped(item.accessoryName, item.details.category)
                  const isProcessing = processing === item.accessoryName
                  return (
                    <div
                      key={item.id ?? item.accessoryName}
                      className={`min-w-40 max-w-[180px] shrink-0 bg-white rounded-xl p-3 border-2 transition-all hover:shadow-lg ${equipped
                        ? 'border-strawberry-400 bg-strawberry-50'
                        : 'border-latte-200 hover:border-blueberry-300'
                        }`}
                    >
                      {/* Badge de rareté */}
                      <div className='flex justify-between items-start mb-2'>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${RARITY_COLORS[item.details.rarity]}`}
                        >
                          {item.details.rarity}
                        </span>
                        {equipped && (
                          <span className='text-lg'>✓</span>
                        )}
                      </div>

                      {/* Prévisualisation SVG ou Image */}
                      <div className='bg-latte-50 rounded-lg p-2 mb-2 flex items-center justify-center min-h-[60px] overflow-hidden'>
                        {item.details.category === 'background'
                          ? (
                              item.details.imagePath != null
                                ? (
                                  <div
                                    className='w-full h-16 rounded bg-cover bg-center'
                                    style={{ backgroundImage: `url(${item.details.imagePath})` }}
                                  />
                                  )
                                : item.details.svg != null
                                  ? (
                                    <svg
                                      viewBox='0 0 100 100'
                                      className='w-full h-16 rounded'
                                      dangerouslySetInnerHTML={{ __html: item.details.svg }}
                                    />
                                    )
                                  : null
                            )
                          : (
                            <svg
                              viewBox='0 0 80 80'
                              className='w-14 h-14'
                              dangerouslySetInnerHTML={{ __html: item.details.svg ?? '' }}
                            />
                            )}
                      </div>

                      {/* Nom */}
                      <h4 className='font-bold text-blueberry-950 text-xs mb-2 text-center'>
                        {item.details.name}
                      </h4>

                      {/* Bouton d'action */}
                      <button
                        onClick={() => {
                          if (equipped) {
                            void handleUnequip(item.details.category)
                          } else {
                            void handleEquip(item.accessoryName, item.details.category)
                          }
                        }}
                        disabled={isProcessing}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${equipped
                          ? 'bg-strawberry-500 text-white hover:bg-strawberry-600'
                          : 'bg-blueberry-500 text-white hover:bg-blueberry-600'
                          } disabled:bg-latte-300 disabled:cursor-not-allowed`}
                      >
                        {isProcessing ? '⏳' : equipped ? 'Retirer' : 'Équiper'}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Chevron droit (desktop uniquement) */}
              <button
                type='button'
                aria-label='Faire défiler vers la droite'
                className='hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 border border-latte-300 rounded-full shadow p-2 hover:bg-blueberry-100 transition disabled:opacity-30'
                onClick={() => {
                  const el = document.getElementById('accessory-scroll-list')
                  if (el !== null) el.scrollBy({ left: 300, behavior: 'smooth' })
                }}
              >
                <svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path d='M9 5l7 7-7 7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /></svg>
              </button>
            </div>

            {/* Message si inventaire vide */}
            {ownedAccessories.length === 0 && (
              <div className='text-center py-12'>
                <span className='text-6xl block mb-4'>🎒</span>
                <p className='text-latte-600 mb-2'>Votre inventaire est vide</p>
                <p className='text-sm text-latte-500'>Visitez la boutique pour acheter des accessoires !</p>
              </div>
            )}

            {/* Message si aucun résultat avec filtre */}
            {ownedAccessories.length > 0 && filteredAccessories.length === 0 && (
              <div className='text-center py-12'>
                <span className='text-6xl block mb-4'>🔍</span>
                <p className='text-latte-600'>Aucun accessoire dans cette catégorie</p>
              </div>
            )}
          </div>
        )}

        {/* Contenu de l'onglet Boutique */}
        {activeTab === 'shop' && (
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
                    onClick={() => { setShopCategory('all') }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${shopCategory === 'all'
                      ? 'bg-blueberry-500 text-white'
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
                    onClick={() => { setShopRarity('all') }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${shopRarity === 'all'
                      ? 'bg-peach-500 text-white'
                      : 'bg-latte-100 text-latte-700 hover:bg-latte-200'
                      }`}
                  >
                    Tout
                  </button>
                  {(['common', 'rare', 'epic', 'legendary'] as AccessoryRarity[]).map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => { setShopRarity(rarity) }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${shopRarity === rarity
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

            {/* Grille d'accessoires à acheter */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2'>
              {shopFilteredAccessories.map((accessory) => {
                const canAfford = animoneysBalance >= accessory.price
                const isPurchasing = purchasing === accessory.name
                const isOwned = ownedAccessories.some(owned => owned.accessoryName === accessory.name)

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
                                <div
                                  className='w-full h-24 rounded bg-cover bg-center'
                                  style={{ backgroundImage: `url(${accessory.imagePath})` }}
                                />
                                )
                              : accessory.svg != null
                                ? (
                                  <svg
                                    viewBox='0 0 100 100'
                                    className='w-full h-24 rounded'
                                    dangerouslySetInnerHTML={{ __html: accessory.svg }}
                                  />
                                  )
                                : null
                          )
                        : (
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

            {/* Message si aucun accessoire dans le filtre */}
            {shopFilteredAccessories.length === 0 && (
              <div className='text-center py-12'>
                <span className='text-6xl block mb-4'>🔍</span>
                <p className='text-latte-600'>Aucun accessoire dans cette catégorie</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
