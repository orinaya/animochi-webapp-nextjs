'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type React from 'react'

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId?: string
  isCanceled?: boolean
  onPaymentSuccess?: () => void
}

export function PaymentSuccessModal ({ isOpen, onClose, sessionId, isCanceled = false, onPaymentSuccess }: PaymentSuccessModalProps): React.ReactElement | null {
  useEffect(() => {
    // Quand la modal s'ouvre pour un paiement réussi, on recharge le wallet
    if (isOpen && !isCanceled && onPaymentSuccess !== undefined) {
      onPaymentSuccess()
    }
  }, [isOpen, isCanceled, onPaymentSuccess])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in duration-300'>
        {/* Header avec icône de succès */}
        <div
          className={`p-8 text-center ${isCanceled
              ? 'bg-linear-to-r from-orange-500 to-red-500'
              : 'bg-linear-to-r from-green-500 to-emerald-600'
            }`}
        >
          <div className='w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4'>
            <svg
              className={`w-12 h-12 ${isCanceled ? 'text-red-500' : 'text-green-500'}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isCanceled
                ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                  )
                : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                  )}
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-white'>
            {isCanceled ? 'Paiement annulé' : 'Paiement réussi !'}
          </h2>
        </div>

        {/* Contenu */}
        <div className='p-8 text-center'>
          <p className='text-gray-600 mb-2'>
            {isCanceled
              ? 'Vous avez annulé le paiement'
              : 'Votre paiement a été traité avec succès'}
          </p>
          <p className='text-sm text-gray-500 mb-6'>
            {isCanceled
              ? 'Aucune modification n\'a été apportée à votre compte'
              : 'Vos Animoneys ont été crédités sur votre compte'}
          </p>

          {!isCanceled && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
              <p className='text-green-800 font-semibold'>
                ✨ Votre solde a été mis à jour
              </p>
            </div>
          )}

          {(sessionId !== undefined && sessionId !== null && sessionId !== '') && (
            <p className='text-xs text-gray-400 mb-6'>
              ID : {sessionId.slice(0, 20)}...
            </p>
          )}

          <button
            onClick={onClose}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${isCanceled
                ? 'bg-linear-to-r from-blueberry-600 to-blueberry-700 text-white hover:from-blueberry-700 hover:to-blueberry-800'
                : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
              }`}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

interface PaymentSuccessHandlerProps {
  onPaymentSuccess?: () => void
}

export function PaymentSuccessHandler ({ onPaymentSuccess }: PaymentSuccessHandlerProps = {}): React.ReactElement | null {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCanceled, setIsCanceled] = useState(false)
  const sessionId = searchParams.get('session_id')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    if (sessionId !== null) {
      setIsModalOpen(true)
      setIsCanceled(false)
    } else if (canceled === 'true') {
      setIsModalOpen(true)
      setIsCanceled(true)
    }
  }, [sessionId, canceled])

  const handleClose = (): void => {
    setIsModalOpen(false)
    // Nettoyer l'URL
    router.replace('/wallet')
  }

  return (
    <PaymentSuccessModal
      isOpen={isModalOpen}
      onClose={handleClose}
      sessionId={sessionId ?? undefined}
      isCanceled={isCanceled}
      onPaymentSuccess={onPaymentSuccess}
    />
  )
}
