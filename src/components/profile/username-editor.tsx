/**
 * UsernameEditor - Composant pour modifier le pseudo utilisateur
 *
 * @module components/profile/username-editor
 */

'use client'

import { useState, useTransition } from 'react'
import { updateUsername } from '@/actions/user.actions'
import { toast } from 'react-toastify'
import Button from '@/components/ui/button'
import { FiEdit3, FiCheck, FiX } from 'react-icons/fi'

interface UsernameEditorProps {
  /** Username actuel */
  currentUsername?: string
  /** Callback après mise à jour réussie */
  onUpdate?: () => void
}

/**
 * Composant pour éditer le pseudo utilisateur
 *
 * Respecte le principe SRP : Gère uniquement l'édition du username
 *
 * @param {UsernameEditorProps} props
 * @returns {React.ReactElement}
 */
export function UsernameEditor ({ currentUsername, onUpdate }: UsernameEditorProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(currentUsername ?? '')
  const [isPending, startTransition] = useTransition()

  const handleSave = (): void => {
    startTransition(() => {
      void (async () => {
        const result = await updateUsername(username)

        if (result.success) {
          toast.success(result.message)
          setIsEditing(false)
          onUpdate?.()
        } else {
          toast.error(result.message)
        }
      })()
    })
  }

  const handleCancel = (): void => {
    setUsername(currentUsername ?? '')
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className='flex items-center gap-3'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Pseudo
          </label>
          <div className='text-base text-gray-900'>
            {currentUsername ?? 'Non défini'}
          </div>
        </div>
        <Button
          onClick={() => { setIsEditing(true) }}
          size='sm'
          variant='ghost'
          color='blueberry'
          iconBefore={FiEdit3}
        >
          Modifier
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      <div>
        <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-1'>
          Nouveau pseudo
        </label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blueberry-500 focus:border-transparent'
          placeholder='Entrez votre pseudo'
          disabled={isPending}
          minLength={3}
          maxLength={30}
        />
        <p className='text-xs text-gray-500 mt-1'>
          Entre 3 et 30 caractères
        </p>
      </div>

      <div className='flex gap-2'>
        <Button
          onClick={handleSave}
          size='sm'
          variant='primary'
          color='blueberry'
          iconBefore={FiCheck}
          disabled={isPending || username.trim().length < 3}
        >
          {isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button
          onClick={handleCancel}
          size='sm'
          variant='ghost'
          color='danger'
          iconBefore={FiX}
          disabled={isPending}
        >
          Annuler
        </Button>
      </div>
    </div>
  )
}
