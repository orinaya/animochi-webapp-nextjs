/**
 * MonsterActionsDropdown - Menu dropdown avec 3 points pour les actions du monstre
 *
 * @module components/monsters/monster-actions-dropdown
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { FiEdit, FiTrash2, FiGlobe, FiMoreVertical } from 'react-icons/fi'

interface MonsterActionsDropdownProps {
  /** ID du monstre */
  monsterId: string
  /** Indique si le monstre est public */
  isPublic?: boolean
  /** Callback pour éditer le nom */
  onEdit: () => void
  /** Callback pour supprimer */
  onDelete: () => void
  /** Callback pour basculer la visibilité publique */
  onTogglePublic?: () => void
}

/**
 * Composant dropdown pour les actions du monstre
 *
 * Remplace les boutons Edit et Delete par un menu avec 3 points
 */
export function MonsterActionsDropdown ({
  isPublic = false,
  onEdit,
  onDelete,
  onTogglePublic
}: MonsterActionsDropdownProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current != null && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleEdit = (): void => {
    onEdit()
    setIsOpen(false)
  }

  const handleDelete = (): void => {
    onDelete()
    setIsOpen(false)
  }

  const handleTogglePublic = (): void => {
    onTogglePublic?.()
    setIsOpen(false)
  }

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Bouton 3 points */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className='p-2 hover:bg-latte-100 rounded-full transition-colors'
        aria-label='Actions'
      >
        <FiMoreVertical className='text-lg text-gray-600' />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className='absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-latte-200 py-1 z-50'>
          {/* Option : Éditer */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit()
            }}
            className='w-full px-4 py-2 text-left hover:bg-latte-50 flex items-center gap-3 text-sm text-gray-700'
          >
            <FiEdit className='text-blueberry-600' />
            <span>Éditer le nom</span>
          </button>

          {/* Option : Rendre public/privé */}
          {onTogglePublic != null && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleTogglePublic()
              }}
              className='w-full px-4 py-2 text-left hover:bg-latte-50 flex items-center gap-3 text-sm text-gray-700'
            >
              <FiGlobe className={isPublic ? 'text-green-600' : 'text-gray-600'} />
              <span>{isPublic ? 'Rendre privé' : 'Rendre public'}</span>
            </button>
          )}

          {/* Séparateur */}
          <div className='my-1 border-t border-latte-100' />

          {/* Option : Supprimer */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className='w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600'
          >
            <FiTrash2 />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </div>
  )
}
