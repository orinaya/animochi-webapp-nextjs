/**
 * Hook pour la gestion de l'avatar utilisateur
 * Respecte le principe SRP : Gère uniquement l'état de l'avatar
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { DEFAULT_ANIMAL_AVATAR } from '@/lib/avatar/animal-avatar-utils'
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/avatar/storage-utils'

interface UseUserAvatarReturn {
  /** Avatar actuellement sélectionné */
  selectedAvatar: string
  /** Fonction pour changer d'avatar */
  setSelectedAvatar: (filename: string) => void
  /** Si la modal est ouverte */
  isModalOpen: boolean
  /** Ouvrir la modal */
  openModal: () => void
  /** Fermer la modal */
  closeModal: () => void
}

/**
 * Hook pour gérer l'avatar utilisateur avec sauvegarde automatique
 */
export function useUserAvatar (initialAvatar?: string): UseUserAvatarReturn {
  // Initialiser avec l'avatar du localStorage ou la valeur par défaut
  const [selectedAvatar, setAvatar] = useState<string>(() => {
    const savedAvatar = loadFromStorage(STORAGE_KEYS.USER_AVATAR)
    return savedAvatar ?? initialAvatar ?? DEFAULT_ANIMAL_AVATAR.filename
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Charger l'avatar au montage du composant
  useEffect(() => {
    const savedAvatar = loadFromStorage(STORAGE_KEYS.USER_AVATAR)
    if (savedAvatar != null && savedAvatar !== selectedAvatar) {
      setAvatar(savedAvatar)
    }
  }, [selectedAvatar])

  const setSelectedAvatar = useCallback((filename: string): void => {
    setAvatar(filename)
    const success = saveToStorage(STORAGE_KEYS.USER_AVATAR, filename)
    if (success) {
      console.log(`Avatar "${filename}" sauvegardé avec succès`)
    }
  }, [])

  const openModal = useCallback((): void => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback((): void => {
    setIsModalOpen(false)
  }, [])

  return {
    selectedAvatar,
    setSelectedAvatar,
    isModalOpen,
    openModal,
    closeModal
  }
}
