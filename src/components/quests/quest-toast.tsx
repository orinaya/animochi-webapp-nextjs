/**
 * QuestToast - Toast de notification pour les quêtes
 * Affiche une notification élégante quand une quête est complétée
 */

'use client'

import { useEffect, useState } from 'react'
import { FiCheckCircle, FiX } from 'react-icons/fi'

export interface QuestToastData {
  id: string
  title: string
  reward: number
  icon: string
}

interface QuestToastProps {
  quest: QuestToastData | null
  onClose: () => void
  onClaim?: () => void
}

export function QuestToast ({ quest, onClose, onClaim }: QuestToastProps): React.ReactElement | null {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (quest != null) {
      setIsVisible(true)

      // Auto-fermeture après 10 secondes
      const timer = setTimeout(() => {
        handleClose()
      }, 10000)

      return () => { clearTimeout(timer) }
    }
  }, [quest])

  const handleClose = (): void => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Attendre la fin de l'animation
  }

  const handleClaim = (): void => {
    onClaim?.()
    handleClose()
  }

  if (quest == null) return null

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
    >
      <div className='bg-white rounded-2xl shadow-2xl border-2 border-success-300 p-4 min-w-[320px] max-w-md'>
        {/* Header */}
        <div className='flex items-start gap-3 mb-3'>
          {/* Icône avec animation */}
          <div className='text-4xl animate-bounce'>
            {quest.icon}
          </div>

          {/* Contenu */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-2'>
              <h4 className='font-bold text-success-700 text-sm'>
                🎉 Quête complétée !
              </h4>
              <button
                onClick={handleClose}
                className='p-1 text-strawberry-400 hover:text-strawberry-600 transition-colors'
              >
                <FiX className='w-4 h-4' />
              </button>
            </div>
            <p className='text-sm text-strawberry-950 font-semibold mt-1'>
              {quest.title}
            </p>
          </div>
        </div>

        {/* Récompense */}
        <div className='bg-success-50 rounded-xl p-3 mb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>💰</span>
              <div>
                <p className='text-xs text-success-700'>Récompense</p>
                <p className='text-lg font-bold text-success-800'>
                  +{quest.reward} Ⱥ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de récupération */}
        <button
          onClick={handleClaim}
          className='w-full py-2.5 bg-linear-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-success-200'
        >
          <FiCheckCircle className='w-4 h-4' />
          Récupérer maintenant
        </button>

        {/* Animation de confettis */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden rounded-2xl'>
          <div className='absolute top-0 left-1/4 w-2 h-2 bg-success-400 rounded-full animate-ping' style={{ animationDelay: '0s' }} />
          <div className='absolute top-0 right-1/4 w-2 h-2 bg-blueberry-400 rounded-full animate-ping' style={{ animationDelay: '0.2s' }} />
          <div className='absolute top-2 left-1/2 w-2 h-2 bg-strawberry-400 rounded-full animate-ping' style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}

/**
 * Hook pour gérer les toasts de quêtes
 */
export function useQuestToast (): {
  showToast: (quest: QuestToastData) => void
  ToastComponent: React.ReactElement
} {
  const [currentQuest, setCurrentQuest] = useState<QuestToastData | null>(null)

  const showToast = (quest: QuestToastData): void => {
    setCurrentQuest(quest)
  }

  const handleClose = (): void => {
    setCurrentQuest(null)
  }

  const ToastComponent = (
    <QuestToast
      quest={currentQuest}
      onClose={handleClose}
    />
  )

  return { showToast, ToastComponent }
}
