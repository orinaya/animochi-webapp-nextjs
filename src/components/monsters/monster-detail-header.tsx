/**
 * MonsterDetailHeader - Header de la page de détail du monstre
 *
 * Affiche le nom du monstre et les boutons de navigation (Inventaire, Boutique)
 * avec accès aux modales d'accessoires
 *
 * Respecte le principe SRP : Gère uniquement l'affichage du header
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-detail-header
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Button from '@/components/ui/button'
import AccessoryInventoryModal from '@/components/accessories/accessory-inventory-modal'
import type { Monster } from '@/types/monster'
import type { AccessoryData, OwnedAccessory, AccessoryCategory } from '@/types/monster-accessories'
import { useWallet } from '@/hooks/use-wallet'
import { walletEvents } from '@/lib/wallet-events'

interface MonsterDetailHeaderProps {
  /** Données du monstre */
  monster: Monster
  /** ID du monstre */
  monsterId: string
  /** Catégorie initiale pour le filtre du modal d'inventaire */
  initialInventoryCategory?: AccessoryCategory | null
  /** Callback pour réinitialiser la catégorie */
  onInventoryCategoryReset?: () => void
}

/**
 * Header de la page de détail du monstre
 *
 * @param {MonsterDetailHeaderProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le header avec nom et navigation
 */
export default function MonsterDetailHeader ({
  monster,
  monsterId,
  initialInventoryCategory = null,
  onInventoryCategoryReset
}: MonsterDetailHeaderProps): React.ReactNode {
  const router = useRouter()
  const { wallet, refetch: refetchWallet } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState<'inventory' | 'shop'>('inventory')
  const [ownedAccessoriesDetails, setOwnedAccessoriesDetails] = useState<Array<OwnedAccessory & { details: AccessoryData }>>([])

  // Ouvrir automatiquement la modal sur l'onglet inventaire si une catégorie est spécifiée
  useEffect(() => {
    if (initialInventoryCategory != null) {
      setModalTab('inventory')
      setShowModal(true)
    }
  }, [initialInventoryCategory])

  // Charger les accessoires possédés
  useEffect(() => {
    const fetchOwnedAccessories = async (): Promise<void> => {
      try {
        const response = await fetch('/api/accessories/owned')
        if (response.ok) {
          const data = await response.json() as { accessories: Array<OwnedAccessory & { details: AccessoryData }> }
          setOwnedAccessoriesDetails(data.accessories)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des accessoires:', error)
      }
    }
    void fetchOwnedAccessories()
  }, [])

  /**
   * Gère l'achat d'un accessoire
   */
  const handlePurchaseAccessory = async (accessory: AccessoryData): Promise<void> => {
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
          setOwnedAccessoriesDetails(refreshData.accessories)
        }

        router.refresh()
      } else {
        toast.error(data.error ?? 'Impossible d\'acheter cet accessoire')
      }
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error)
      toast.error('Impossible d\'acheter cet accessoire')
    }
  }

  /**
   * Gère l'équipement d'un accessoire
   */
  const handleEquipAccessory = async (accessoryName: string, category: string): Promise<void> => {
    try {
      const response = await fetch('/api/accessories/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessoryName, monsterId, category })
      })

      if (response.ok) {
        toast.success('Accessoire équipé !')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error ?? 'Erreur lors de l\'équipement')
      }
    } catch (error) {
      console.error('Erreur lors de l\'équipement:', error)
      toast.error('Impossible d\'équiper cet accessoire')
    }
  }

  /**
   * Gère le retrait d'un accessoire
   */
  const handleUnequipAccessory = async (category: string): Promise<void> => {
    try {
      const response = await fetch('/api/accessories/unequip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monsterId, category })
      })

      if (response.ok) {
        toast.success('Accessoire retiré !')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error ?? 'Erreur lors du retrait')
      }
    } catch (error) {
      console.error('Erreur lors du retrait:', error)
      toast.error('Impossible de retirer cet accessoire')
    }
  }

  /**
   * Ferme la modal et réinitialise la catégorie
   */
  const handleCloseModal = (): void => {
    setShowModal(false)
    if (onInventoryCategoryReset != null) {
      onInventoryCategoryReset()
    }
  }

  return (
    <>
      <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
        {/* Nom du monstre */}
        <div>
          <h1 className='text-3xl sm:text-4xl font-bold text-blueberry-950'>
            {monster.name}
          </h1>
          <p className='text-latte-600 mt-1'>
            Niveau {monster.level ?? 1}
          </p>
        </div>

        {/* Boutons de navigation */}
        <div className='flex gap-3'>
          <Button
            variant='outline'
            color='latte'
            size='md'
            onClick={() => {
              setModalTab('inventory')
              setShowModal(true)
            }}
          >
            🎒 Inventaire
          </Button>
          <Button
            variant='outline'
            color='latte'
            size='md'
            onClick={() => {
              setModalTab('shop')
              setShowModal(true)
            }}
          >
            🛍️ Boutique
          </Button>
        </div>
      </header>

      {/* Modal unifiée Inventaire + Boutique */}
      <AccessoryInventoryModal
        isOpen={showModal}
        onClose={handleCloseModal}
        ownedAccessories={ownedAccessoriesDetails}
        equippedAccessories={monster.equippedAccessories ?? {}}
        monsterId={monsterId}
        onEquip={handleEquipAccessory}
        onUnequip={handleUnequipAccessory}
        initialCategory={initialInventoryCategory ?? undefined}
        initialTab={modalTab}
        animoneysBalance={wallet?.balance ?? 0}
        onPurchase={handlePurchaseAccessory}
      />
    </>
  )
}
