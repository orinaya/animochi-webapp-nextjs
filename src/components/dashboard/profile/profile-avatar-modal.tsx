/**
 * Profile Avatar Modal - Modal de sélection d'avatar de profil
 * Permet à l'utilisateur de choisir parmi les images d'animaux disponibles
 * Respecte le principe SRP : Gère uniquement la sélection d'avatar
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { ANIMAL_AVATARS, getAnimalImageUrl } from '@/lib/avatar/animal-avatar-utils'

interface ProfileAvatarModalProps {
  /** Si la modal est ouverte */
  isOpen: boolean
  /** Fonction appelée à la fermeture */
  onClose: () => void
  /** Avatar actuellement sélectionné */
  currentAvatar: string | null
  /** Fonction appelée lors de la sélection d'un avatar */
  onSelectAvatar: (filename: string) => void
}

export function ProfileAvatarModal ({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar
}: ProfileAvatarModalProps): React.ReactNode {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar)

  const handleSelect = (filename: string): void => {
    setSelectedAvatar(filename)
  }

  const handleConfirm = (): void => {
    if (selectedAvatar != null && selectedAvatar.length > 0) {
      onSelectAvatar(selectedAvatar)
    }
    onClose()
  }

  const handleCancel = (): void => {
    setSelectedAvatar(currentAvatar)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title='Choisir votre avatar'
      size='lg'
    >
      <div className='space-y-6'>
        {/* Aperçu de l'avatar sélectionné */}
        <div className='flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg'>
          <div className='text-sm font-medium text-gray-700'>Aperçu</div>
          {(selectedAvatar != null && selectedAvatar.length > 0)
            ? (
              <div className='relative'>
                {(() => {
                  const avatarInfo = ANIMAL_AVATARS.find(a => a.filename === selectedAvatar)
                  return (
                    <div className={`w-20 h-20 rounded-full p-1 overflow-hidden ${avatarInfo?.backgroundColor ?? 'bg-gray-200'}`}>
                      <Image
                        src={getAnimalImageUrl(selectedAvatar)}
                        alt={avatarInfo?.displayName ?? 'Avatar'}
                        width={72}
                        height={72}
                        quality={100}
                        className='w-full h-full object-cover rounded-full scale-110'
                      />
                    </div>
                  )
                })()}
              </div>
              )
            : (
              <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center'>
                <span className='text-2xl'>👤</span>
              </div>
              )}
          <div className='text-sm text-gray-600'>
            {(selectedAvatar != null && selectedAvatar.length > 0)
              ? ANIMAL_AVATARS.find(a => a.filename === selectedAvatar)?.displayName
              : 'Aucun avatar sélectionné'}
          </div>
        </div>

        {/* Grille des avatars */}
        <div className='grid grid-cols-4 gap-3 max-h-80 overflow-y-auto'>
          {ANIMAL_AVATARS.map((avatar) => (
            <button
              key={avatar.filename}
              onClick={() => handleSelect(avatar.filename)}
              className={`relative p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${avatar.backgroundColor} ${selectedAvatar === avatar.filename
                ? 'border-strawberry-400 ring-2 ring-strawberry-200'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              type='button'
            >
              <div className='aspect-square rounded-full overflow-hidden'>
                <Image
                  src={getAnimalImageUrl(avatar.filename)}
                  alt={avatar.displayName}
                  width={140}
                  height={140}
                  quality={100}
                  className='w-full h-full object-cover scale-110'
                />
              </div>
              <div className={`text-xs font-medium mt-2 ${avatar.textColor}`}>
                {avatar.displayName}
              </div>
              {selectedAvatar === avatar.filename && (
                <div className='absolute -top-1 -right-1 w-6 h-6 bg-strawberry-400 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className='flex gap-3 pb-4'>
          <Button
            onClick={handleCancel}
            variant='ghost'
            color='blueberry'
            className='flex-1'
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            variant='primary'
            color='strawberry'
            className='flex-1'
            disabled={selectedAvatar == null || selectedAvatar.length === 0}
          >
            Confirmer
          </Button>
        </div>
      </div>
    </Modal>
  )
}
