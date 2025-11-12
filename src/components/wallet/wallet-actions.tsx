/**
 * WalletActions - Component UI
 * Boutons pour ajouter et soustraire de l'Animoney
 * Principe SRP : Gère uniquement l'UI des actions du wallet
 * Principe DIP : Dépend de l'abstraction usePurchase
 */

'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

import { AVAILABLE_AMOUNTS, pricingTable } from '@/config/pricing'
import { usePurchase } from '@/hooks/usePurchase'

interface WalletActionsProps {
  onSubtract: (amount: number) => Promise<void>
  disabled?: boolean
}

export function WalletActions ({
  onSubtract,
  disabled = false
}: WalletActionsProps): React.ReactElement {
  const [amount, setAmount] = useState<string>('50')
  const [loadingSubtract, setLoadingSubtract] = useState(false)
  const [subtractError, setSubtractError] = useState<string | null>(null)

  // Utilisation du hook usePurchase pour gérer l'achat
  const { isPurchasing, error: purchaseError, purchaseAnimoney } = usePurchase()

  const handleAdd = async (): Promise<void> => {
    const numAmount = parseInt(amount, 10)

    if (isNaN(numAmount) || numAmount <= 0) {
      return
    }

    // Le hook usePurchase gère la validation et l'appel API
    await purchaseAnimoney(numAmount)
  }

  const handleSubtract = async (): Promise<void> => {
    const numAmount = parseInt(amount, 10)

    if (isNaN(numAmount) || numAmount <= 0) {
      setSubtractError('Le montant doit être un nombre positif')
      return
    }

    setSubtractError(null)
    setLoadingSubtract(true)

    try {
      await onSubtract(numAmount)
      setAmount('50') // Reset
    } catch (err) {
      setSubtractError(
        err instanceof Error ? err.message : 'Erreur lors du retrait'
      )
    } finally {
      setLoadingSubtract(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    // Accepter uniquement les chiffres
    if (value === '' || /^\d+$/.test(value)) {
      setAmount(value)
      setSubtractError(null)
    }
  }

  const currentAmount = parseInt(amount, 10)
  const isValidAmount = !isNaN(currentAmount) && AVAILABLE_AMOUNTS.includes(currentAmount)
  const priceInEuros = isValidAmount ? pricingTable[currentAmount].price : 0

  return (
    <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm'>
      <h3 className='text-lg font-semibold text-blueberry-950 mb-4'>
        Gérer votre Animoney
      </h3>

      {/* Input montant */}
      <div className='mb-4'>
        <label
          htmlFor='amount'
          className='block text-sm font-medium text-blueberry-900 mb-2'
        >
          Montant (Ⱥ)
        </label>
        <input
          id='amount'
          type='text'
          inputMode='numeric'
          value={amount}
          onChange={handleAmountChange}
          disabled={disabled || isPurchasing || loadingSubtract}
          className='w-full px-4 py-2 border border-latte-300 rounded-lg focus:ring-2 focus:ring-blueberry-950 focus:border-blueberry-950 disabled:bg-latte-100 disabled:cursor-not-allowed'
          placeholder='100'
        />
        <p className='text-xs text-latte-600 mt-1'>
          Montants disponibles : {AVAILABLE_AMOUNTS.join(', ')} Ⱥ
        </p>
        {isValidAmount && (
          <p className='text-xs text-blueberry-700 mt-1 font-medium'>
            Prix : {priceInEuros.toFixed(2)} €
          </p>
        )}
      </div>

      {/* Boutons prédéfinis */}
      <div className='flex gap-2 mb-4 flex-wrap'>
        {AVAILABLE_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type='button'
            onClick={() => setAmount(amt.toString())}
            className='flex-1 min-w-20 px-3 py-1.5 text-sm bg-latte-100 hover:bg-latte-200 text-blueberry-950 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={disabled || isPurchasing || loadingSubtract}
          >
            {amt.toLocaleString()} Ⱥ
          </button>
        ))}
      </div>

      {/* Messages d'erreur */}
      {(purchaseError !== null || subtractError !== null) && (
        <div className='mb-4 p-3 bg-strawberry-100 border border-strawberry-200 rounded-lg'>
          <p className='text-sm text-strawberry-600'>{purchaseError ?? subtractError}</p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className='flex gap-3'>
        <Button
          onClick={handleAdd}
          disabled={disabled || isPurchasing || loadingSubtract || !amount || !isValidAmount}
          color='blueberry'
          variant='primary'
          size='md'
          className='flex-1'
        >
          {isPurchasing ? 'Redirection...' : ' Acheter avec Stripe'}
        </Button>
        <Button
          onClick={handleSubtract}
          disabled={disabled || isPurchasing || loadingSubtract || !amount}
          color='strawberry'
          variant='outline'
          size='md'
          className='flex-1'
        >
          {loadingSubtract ? 'En cours...' : '➖ Retirer'}
        </Button>
      </div>
    </div>
  )
}
