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
import AccessoryInventoryModal from '@/components/accessories/accessory-inventory-modal'
import { PublicToggle } from '@/components/monsters/public-toggle'
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
  /** Callback appelé quand le monstre est mis à jour (équipement) */
  onMonsterUpdate?: (monster: Monster) => void
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
  onInventoryCategoryReset,
  onMonsterUpdate
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
  const handleEquipAccessory = async (accessoryName: string, category: AccessoryCategory): Promise<void> => {
    try {
      // Optimistic update : on met à jour le monstre localement tout de suite
      if (typeof onMonsterUpdate === 'function') {
        onMonsterUpdate({
          ...monster,
          equippedAccessories: {
            ...monster.equippedAccessories,
            [category]: accessoryName
          }
        })
      }
      const response = await fetch('/api/accessories/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessoryName, monsterId, category })
      })

      if (response.ok) {
        toast.success('Accessoire équipé !')
        // Optionnel : resynchroniser avec le serveur si besoin
        const monsterRes = await fetch(`/api/monsters/${monsterId}`)
        if (monsterRes.ok) {
          const data: unknown = await monsterRes.json()
          if (
            typeof data === 'object' && data !== null &&
            'monster' in data &&
            typeof onMonsterUpdate === 'function'
          ) {
            onMonsterUpdate((data as { monster: Monster }).monster)
          }
        }
        // router.refresh() supprimé pour éviter le rechargement
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
  const handleUnequipAccessory = async (category: AccessoryCategory): Promise<void> => {
    try {
      // Optimistic update : on retire l'accessoire localement tout de suite
      if (typeof onMonsterUpdate === 'function') {
        const updated = { ...monster.equippedAccessories }
        delete updated[category as keyof typeof updated]
        onMonsterUpdate({
          ...monster,
          equippedAccessories: updated
        })
      }
      const response = await fetch('/api/accessories/unequip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monsterId, category })
      })

      if (response.ok) {
        toast.success('Accessoire retiré !')
        // Optionnel : resynchroniser avec le serveur si besoin
        const monsterRes = await fetch(`/api/monsters/${monsterId}`)
        if (monsterRes.ok) {
          const data: unknown = await monsterRes.json()
          if (
            typeof data === 'object' && data !== null &&
            'monster' in data &&
            typeof onMonsterUpdate === 'function'
          ) {
            onMonsterUpdate((data as { monster: Monster }).monster)
          }
        }
        // router.refresh() supprimé pour éviter le rechargement
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
      <header className='mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          {/* Nom du monstre avec badge niveau */}
          <div className='flex items-center gap-3 flex-wrap'>
            <h1 className='text-3xl sm:text-4xl font-bold text-blueberry-950'>
              {monster.name}
            </h1>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blueberry-100 text-blueberry-700 border border-blueberry-200'>
              Niveau {monster.level ?? 1}
            </span>
          </div>

          {/* Toggle de visibilité publique */}
          <div className='shrink-0'>
            <PublicToggle
              monsterId={monsterId}
              initialIsPublic={monster.isPublic ?? false}
              variant='compact'
            />
          </div>
        </div>
      </header>

      {/* Modal unifiée Inventaire + Boutique */}
      <AccessoryInventoryModal
        isOpen={showModal}
        onClose={handleCloseModal}
        ownedAccessories={ownedAccessoriesDetails}
        monster={monster}
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
