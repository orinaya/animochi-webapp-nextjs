'use client'

import { useEffect, type ReactNode } from 'react'

/**
 * Props pour le composant Modal
 */
interface ModalProps {
  /** Indique si la modal est ouverte */
  isOpen: boolean
  /** Callback appelé lors de la fermeture de la modal */
  onClose: () => void
  /** Contenu de la modal */
  children: ReactNode
  /** Titre de la modal (optionnel) */
  title?: string
  /** Taille de la modal */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Retourne les classes CSS pour la taille de la modal
 *
 * @param {string} size - Taille de la modal
 * @returns {string} Classes Tailwind CSS
 */
function getModalSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  return sizes[size]
}

/**
 * Composant Modal réutilisable
 *
 * Responsabilité unique : Afficher une fenêtre modale avec overlay
 * - Gère l'ouverture/fermeture
 * - Bloque le scroll du body quand ouvert
 * - Fermeture au clic sur l'overlay ou la touche Escape
 *
 * Respecte le principe SRP : Gestion uniquement de l'affichage modal
 * Respecte le principe OCP : Extensible via les props children et size
 *
 * @param {ModalProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La modal ou null si fermée
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Ma Modal">
 *   <p>Contenu de la modal</p>
 * </Modal>
 * ```
 */
export function Modal ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md'
}: ModalProps): ReactNode {
  // Bloquer le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Gérer la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Contenu de la modal */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl
          w-full ${getModalSize(size)}
          max-h-[90vh] overflow-y-auto
          transform transition-all duration-300
          animate-fade-in-up
        `}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title !== undefined ? 'modal-title' : undefined}
      >
        {/* En-tête avec titre et bouton de fermeture */}
        {title !== undefined && (
          <div className='sticky top-0 z-10 flex items-center justify-between p-6 border-b border-latte-100 bg-white rounded-t-2xl'>
            <h2
              id='modal-title'
              className='text-2xl font-bold text-blueberry-900'
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className='text-blueberry-400 hover:text-blueberry-600 transition-colors duration-200 p-2 hover:bg-latte-50 rounded-lg'
              aria-label='Fermer la modal'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        )}

        {/* Contenu */}
        <div className={title !== undefined ? 'p-6' : 'p-8'}>
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}
      </style>
    </div>
  )
}

export default Modal
