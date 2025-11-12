/**
 * Exemple de composant pour acheter des boosts XP avec Stripe
 *
 * Principe SRP: Ce composant gère uniquement l'UI d'achat de boosts XP
 */

'use client'

import { useState } from 'react'
import { createXpBoostCheckoutSession, buyXpBoost } from '@/actions/shop.actions'
import { xpBoosts } from '@/config/shop.config'

interface XpBoostPurchaseProps {
  monsterId: string
  userKoins: number
}

export function XpBoostPurchase ({ monsterId, userKoins }: XpBoostPurchaseProps): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleStripePayment = async (boostId: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const result = await createXpBoostCheckoutSession(monsterId, boostId)

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

  const handleKoinsPayment = async (boostId: string, price: number): Promise<void> => {
    if (userKoins < price) {
      setError('Koins insuffisants')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await buyXpBoost(monsterId, boostId)
      setSuccess(true)
      setTimeout(() => { setSuccess(false) }, 3000)
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Boosts d&apos;XP</h2>

      {error !== null && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
          Boost acheté avec succès !
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {xpBoosts.map((boost) => {
          const canAfford = userKoins >= boost.price
          const isPopular = boost.popular

          return (
            <div
              key={boost.id}
              className={`
                border rounded-lg p-6 relative
                bg-gradient-to-br ${boost.color}
                text-white
                ${isPopular ? 'ring-2 ring-yellow-400' : ''}
              `}
            >
              {isPopular && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold'>
                  {boost.badge}
                </div>
              )}

              <div className='space-y-4'>
                <div className='text-5xl text-center'>{boost.emoji}</div>

                <div className='text-center'>
                  <h3 className='text-xl font-bold'>{boost.name}</h3>
                  <p className='text-sm opacity-90 mt-2'>{boost.description}</p>
                </div>

                <div className='flex justify-between items-center bg-white/20 rounded-lg p-3'>
                  <span className='text-sm'>XP</span>
                  <span className='text-2xl font-bold'>+{boost.xpAmount}</span>
                </div>

                <div className='flex justify-between items-center bg-white/20 rounded-lg p-3'>
                  <span className='text-sm'>Prix</span>
                  <span className='text-xl font-bold'>{boost.price} Ⱥ</span>
                </div>

                <div className='space-y-2'>
                  {/* Paiement avec Koins */}
                  <button
                    onClick={() => { void handleKoinsPayment(boost.id, boost.price) }}
                    disabled={loading || !canAfford}
                    className={`
                      w-full py-3 px-6 rounded-lg font-semibold
                      transition-colors
                      ${!canAfford
                        ? 'bg-gray-400 cursor-not-allowed'
                        : loading
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    {!canAfford ? 'Koins insuffisants' : loading ? 'Achat...' : 'Acheter avec Koins'}
                  </button>

                  {/* Paiement avec Stripe */}
                  <button
                    onClick={() => { void handleStripePayment(boost.id) }}
                    disabled={loading}
                    className={`
                      w-full py-2 px-4 rounded-lg text-sm
                      transition-colors
                      ${loading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-white/20 hover:bg-white/30'
                      }
                    `}
                  >
                    Ou payer par carte
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
