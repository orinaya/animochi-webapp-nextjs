/**
 * AccessoryInventoryModal - Modal de l'inventaire d'accessoires
 *
 * Permet de gérer les accessoires possédés (équiper/retirer)
 * Affiche les accessoires achetés groupés par catégorie
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de l'inventaire
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/accessories/accessory-inventory-modal
 */

'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { RARITY_COLORS } from '@/types/monster-accessories'
import type { AccessoryData, AccessoryCategory, OwnedAccessory, EquippedAccessories } from '@/types/monster-accessories'

interface AccessoryInventoryModalProps {
  /** Indique si la modal est ouverte */
  isOpen: boolean
  /** Callback appelé lors de la fermeture */
  onClose: () => void
  /** Liste des accessoires possédés avec leurs détails */
  ownedAccessories: Array<OwnedAccessory & { details: AccessoryData }>
  /** Accessoires actuellement équipés sur le monstre */
  equippedAccessories: EquippedAccessories
  /** ID du monstre concerné */
  monsterId: string
  /** Callback appelé lors de l'équipement d'un accessoire */
  onEquip: (accessoryId: string, category: AccessoryCategory) => Promise<void>
  /** Callback appelé lors du retrait d'un accessoire */
  onUnequip: (category: AccessoryCategory) => Promise<void>
}

/**
 * Retourne le label en français pour une catégorie
 */
function getCategoryLabel (category: AccessoryCategory): string {
  const labels: Record<AccessoryCategory, string> = {
    hat: '🎩 Chapeaux',
    glasses: '👓 Lunettes',
    shoes: '👟 Chaussures'
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
    shoes: '👟'
  }
  return emojis[category]
}

/**
 * Modal de l'inventaire d'accessoires
 */
export default function AccessoryInventoryModal ({
  isOpen,
  onClose,
  ownedAccessories,
  equippedAccessories,
  monsterId,
  onEquip,
  onUnequip
}: AccessoryInventoryModalProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [processing, setProcessing] = useState<string | null>(null)

  /**
   * Filtre les accessoires selon la catégorie sélectionnée
   */
  const filteredAccessories = ownedAccessories.filter(item => {
    return selectedCategory === 'all' || item.details.category === selectedCategory
  })

  /**
   * Vérifie si un accessoire est équipé
   */
  const isEquipped = (accessoryId: string, category: AccessoryCategory): boolean => {
    return equippedAccessories[category] === accessoryId
  }

  /**
   * Gère l'équipement d'un accessoire
   */
  const handleEquip = async (accessoryId: string, category: AccessoryCategory): Promise<void> => {
    setProcessing(accessoryId)
    try {
      await onEquip(accessoryId, category)
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
    <Modal isOpen={isOpen} onClose={onClose} title='🎒 Mon Inventaire' size='xl'>
      <div className='space-y-6'>
        {/* Statistiques */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          <div className='bg-linear-to-br from-blueberry-100 to-blueberry-50 rounded-xl p-3 text-center'>
            <span className='text-2xl block mb-1'>🎒</span>
            <p className='text-sm text-blueberry-600'>Total</p>
            <p className='text-xl font-bold text-blueberry-950'>{ownedAccessories.length}</p>
          </div>
          <div className='bg-linear-to-br from-peach-100 to-peach-50 rounded-xl p-3 text-center'>
            <span className='text-2xl block mb-1'>🎩</span>
            <p className='text-sm text-peach-600'>Chapeaux</p>
            <p className='text-xl font-bold text-peach-950'>{countByCategory('hat')}</p>
          </div>
          <div className='bg-linear-to-br from-strawberry-100 to-strawberry-50 rounded-xl p-3 text-center'>
            <span className='text-2xl block mb-1'>👓</span>
            <p className='text-sm text-strawberry-600'>Lunettes</p>
            <p className='text-xl font-bold text-strawberry-950'>{countByCategory('glasses')}</p>
          </div>
          <div className='bg-linear-to-br from-latte-100 to-latte-50 rounded-xl p-3 text-center'>
            <span className='text-2xl block mb-1'>👟</span>
            <p className='text-sm text-latte-600'>Chaussures</p>
            <p className='text-xl font-bold text-latte-950'>{countByCategory('shoes')}</p>
          </div>
        </div>

        {/* Accessoires actuellement équipés */}
        <div className='bg-linear-to-r from-strawberry-50 to-peach-50 rounded-xl p-4'>
          <h3 className='text-lg font-bold text-blueberry-950 mb-3 flex items-center gap-2'>
            <span>✨</span>
            Actuellement équipé
          </h3>
          <div className='grid grid-cols-3 gap-3'>
            {(['hat', 'glasses', 'shoes'] as AccessoryCategory[]).map((category) => {
              const equippedId = equippedAccessories[category]
              const equippedItem = equippedId != null
                ? ownedAccessories.find(item => item.accessoryId === equippedId)
                : null

              return (
                <div
                  key={category}
                  className='bg-white rounded-lg p-3 text-center border-2 border-latte-200'
                >
                  <p className='text-xs font-semibold text-latte-600 mb-2'>
                    {getCategoryEmoji(category)}
                  </p>
                  {equippedItem != null
                    ? (
                      <>
                        <svg
                          viewBox='0 0 80 80'
                          className='w-12 h-12 mx-auto mb-2'
                          dangerouslySetInnerHTML={{ __html: equippedItem.details.svg ?? '' }}
                        />
                        <p className='text-xs font-bold text-blueberry-950 mb-2'>
                          {equippedItem.details.name}
                        </p>
                        <button
                          onClick={() => { void handleUnequip(category) }}
                          disabled={processing === category}
                          className='w-full px-2 py-1 text-xs bg-strawberry-500 text-white rounded hover:bg-strawberry-600 disabled:bg-latte-300 disabled:cursor-not-allowed transition-all'
                        >
                          {processing === category ? '⏳' : 'Retirer'}
                        </button>
                      </>
                      )
                    : (
                      <p className='text-xs text-latte-400 py-4'>Vide</p>
                      )}
                </div>
              )
            })}
          </div>
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
            </button>
            {(['hat', 'glasses', 'shoes'] as AccessoryCategory[]).map((category) => (
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

        {/* Grille d'accessoires */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2'>
          {filteredAccessories.map((item) => {
            const equipped = isEquipped(item.accessoryId, item.details.category)
            const isProcessing = processing === item.accessoryId

            return (
              <div
                key={item._id ?? item.accessoryId}
                className={`bg-white rounded-xl p-3 border-2 transition-all hover:shadow-lg ${equipped
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

                {/* Prévisualisation SVG */}
                <div className='bg-latte-50 rounded-lg p-2 mb-2 flex items-center justify-center min-h-[60px]'>
                  <svg
                    viewBox='0 0 80 80'
                    className='w-14 h-14'
                    dangerouslySetInnerHTML={{ __html: item.details.svg ?? '' }}
                  />
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
                      void handleEquip(item.accessoryId, item.details.category)
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
    </Modal>
  )
}
