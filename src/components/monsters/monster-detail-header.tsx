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
import AccessoryShopModal from '@/components/accessories/accessory-shop-modal'
import AccessoryInventoryModal from '@/components/accessories/accessory-inventory-modal'
import type { Monster } from '@/types/monster'
import type { AccessoryData, OwnedAccessory } from '@/types/monster-accessories'
import { useWallet } from '@/hooks/use-wallet'
import { walletEvents } from '@/lib/wallet-events'

interface MonsterDetailHeaderProps {
  /** Données du monstre */
  monster: Monster
  /** ID du monstre */
  monsterId: string
}

/**
 * Header de la page de détail du monstre
 *
 * @param {MonsterDetailHeaderProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le header avec nom et navigation
 */
export default function MonsterDetailHeader ({
  monster,
  monsterId
}: MonsterDetailHeaderProps): React.ReactNode {
  const router = useRouter()
  const { wallet, refetch: refetchWallet } = useWallet()
  const [showShop, setShowShop] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([])
  const [ownedAccessoriesDetails, setOwnedAccessoriesDetails] = useState<Array<OwnedAccessory & { details: AccessoryData }>>([])

  // Charger les accessoires possédés
  useEffect(() => {
    const fetchOwnedAccessories = async (): Promise<void> => {
      try {
        const response = await fetch('/api/accessories/owned')
        if (response.ok) {
          const data = await response.json() as { accessories: Array<OwnedAccessory & { details: AccessoryData }> }
          setOwnedAccessories(data.accessories.map((acc) => acc.details.name))
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
        setOwnedAccessories((prev) => [...prev, accessory.name])

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
  const handleEquipAccessory = async (accessoryId: string, category: string): Promise<void> => {
    try {
      // TODO: Implémenter l'appel API pour équiper un accessoire
      toast.info(`Équipement de l'accessoire ${accessoryId} - API à implémenter`)
      // const response = await fetch('/api/accessories/equip', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ accessoryId, monsterId, category })
      // })
      // if (response.ok) {
      //   toast.success('Accessoire équipé !')
      //   router.refresh()
      // }
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
      // TODO: Implémenter l'appel API pour retirer un accessoire
      toast.info(`Retrait de l'accessoire ${category} - API à implémenter`)
      // const response = await fetch('/api/accessories/unequip', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ monsterId, category })
      // })
      // if (response.ok) {
      //   toast.success('Accessoire retiré !')
      //   router.refresh()
      // }
    } catch (error) {
      console.error('Erreur lors du retrait:', error)
      toast.error('Impossible de retirer cet accessoire')
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
            onClick={() => { setShowInventory(true) }}
          >
            🎒 Inventaire
          </Button>
          <Button
            variant='outline'
            color='latte'
            size='md'
            onClick={() => { setShowShop(true) }}
          >
            🛍️ Boutique
          </Button>
        </div>
      </header>

      {/* Modal de la boutique d'accessoires */}
      <AccessoryShopModal
        isOpen={showShop}
        onClose={() => { setShowShop(false) }}
        animoneysBalance={wallet?.balance ?? 0}
        onPurchase={handlePurchaseAccessory}
        ownedAccessories={ownedAccessories}
      />

      {/* Modal de l'inventaire d'accessoires */}
      <AccessoryInventoryModal
        isOpen={showInventory}
        onClose={() => { setShowInventory(false) }}
        ownedAccessories={ownedAccessoriesDetails}
        equippedAccessories={monster.equippedAccessories ?? {}}
        monsterId={monsterId}
        onEquip={handleEquipAccessory}
        onUnequip={handleUnequipAccessory}
      />
    </>
  )
}
