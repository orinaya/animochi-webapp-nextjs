/**
 * Exemple de composant pour acheter des Koins avec Stripe
 *
 * Principe SRP: Ce composant gère uniquement l'UI d'achat de Koins
 */

'use client'

import { useState } from 'react'
import { createAnimoneysCheckoutSession } from '@/actions/shop.actions'
import { pricingTable, AVAILABLE_AMOUNTS } from '@/config/pricing'

interface KoinsPurchaseProps {
  userId: string
}

export function KoinsPurchase ({ userId }: KoinsPurchaseProps): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async (amount: number): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const result = await createAnimoneysCheckoutSession(amount)

      if ('error' in result) {
        setError(result.error)
      } else {
        // Rediriger vers Stripe Checkout
        window.location.href = result.url
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Acheter des Koins</h2>

      {error !== null && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {AVAILABLE_AMOUNTS.map((amount) => {
          const pkg = pricingTable[amount]
          const isPopular = amount === 100

          return (
            <div
              key={amount}
              className={`
                border rounded-lg p-6 relative
                ${isPopular ? 'border-purple-500 shadow-lg' : 'border-gray-200'}
              `}
            >
              {isPopular && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  Populaire
                </div>
              )}

              <div className='text-center space-y-4'>
                <div className='text-4xl'>Ⱥ</div>
                <div className='text-3xl font-bold'>{amount}</div>
                <div className='text-sm text-gray-600'>Koins</div>

                <div className='text-2xl font-bold text-purple-600'>
                  {pkg.price.toFixed(2)} €
                </div>

                <button
                  onClick={() => { void handlePurchase(amount) }}
                  disabled={loading}
                  className={`
                    w-full py-3 px-6 rounded-lg font-semibold
                    transition-colors
                    ${loading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }
                  `}
                >
                  {loading ? 'Chargement...' : 'Acheter'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className='text-sm text-gray-500 text-center'>
        Paiement sécurisé par Stripe • Les Koins sont crédités instantanément
      </div>
    </div>
  )
}
