'use client'

import { toggleMonsterVisibility } from '@/actions/gallery.actions'
import { useState, useTransition } from 'react'
import { toast } from 'react-toastify'
import { FiGlobe, FiLock } from 'react-icons/fi'

interface PublicToggleProps {
  /** ID du monstre */
  monsterId: string
  /** État initial de la visibilité */
  initialIsPublic: boolean
  /** Callback optionnel après le changement */
  onToggle?: (isPublic: boolean) => void
  /** Variant de style (compact pour les cartes, full pour les détails) */
  variant?: 'compact' | 'full'
}

/**
 * Composant Toggle pour rendre un monstre public/privé
 *
 * Composant client qui :
 * - Affiche un switch pour basculer entre public/privé
 * - Affiche un indicateur visuel de l'état
 * - Gère l'état de chargement pendant la transition
 * - Affiche un toast de confirmation
 *
 * Respecte le principe SRP : Gère uniquement l'interface du toggle
 * Respecte le principe OCP : Extensible via les variants
 *
 * @example
 * ```tsx
 * <PublicToggle
 *   monsterId="507f1f77bcf86cd799439011"
 *   initialIsPublic={false}
 *   variant="full"
 * />
 * ```
 */
export function PublicToggle ({
  monsterId,
  initialIsPublic,
  onToggle,
  variant = 'full'
}: PublicToggleProps): React.ReactElement {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (): void => {
    const newValue = !isPublic

    startTransition(async () => {
      const result = await toggleMonsterVisibility(monsterId, newValue)

      if (result.success) {
        setIsPublic(newValue)
        toast.success(result.message)
        onToggle?.(newValue)
      } else {
        toast.error(result.message)
      }
    })
  }

  if (variant === 'compact') {
    return (
      <div className='flex items-center gap-2 group/toggle relative'>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isPublic ? 'bg-blueberry-600' : 'bg-gray-300'}
          `}
          aria-label={isPublic ? 'Rendre privé' : 'Rendre public'}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
              transition-transform duration-200 ease-in-out
              ${isPublic ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        {isPublic
          ? (
            <div className='flex items-center gap-1 text-xs text-blueberry-600 bg-blueberry-50 px-2 py-1 rounded-full'>
              <FiGlobe size={14} />
              <span>Public</span>
            </div>
            )
          : (
            <div className='flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>
              <FiLock size={14} />
              <span>Privé</span>
            </div>
            )}

        {/* Tooltip */}
        <div className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/toggle:opacity-100 group-hover/toggle:visible transition-all duration-200 pointer-events-none z-50'>
          <div className='bg-blueberry-950 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap'>
            {isPublic
              ? 'Visible dans la galerie communautaire'
              : 'Visible uniquement par vous'}
            <div className='absolute top-full left-1/2 -translate-x-1/2 -mt-px'>
              <div className='border-4 border-transparent border-t-blueberry-950' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3 p-4 bg-latte-25 rounded-xl border border-latte-200'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h3 className='font-semibold text-blueberry-950 text-base'>
            Visibilité du monstre
          </h3>
          <p className='text-sm text-gray-600'>
            {isPublic
              ? 'Ce monstre est visible dans la galerie communautaire'
              : 'Ce monstre est privé, visible uniquement par vous'}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isPublic ? 'bg-blueberry-600' : 'bg-gray-300'}
          `}
          aria-label={isPublic ? 'Rendre privé' : 'Rendre public'}
        >
          <span
            className={`
              inline-block h-5 w-5 transform rounded-full bg-white shadow-lg
              transition-transform duration-200 ease-in-out
              ${isPublic ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      <div className='flex items-center gap-2 text-sm'>
        <span
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium
            ${isPublic
              ? 'bg-blueberry-100 text-blueberry-700'
              : 'bg-gray-100 text-gray-700'
            }
          `}
        >
          {isPublic ? '🌍' : '🔒'}
          {isPublic ? 'Visible par tous' : 'Visible uniquement par vous'}
        </span>
        {isPending && (
          <span className='text-gray-500 text-xs'>Mise à jour...</span>
        )}
      </div>
    </div>
  )
}
