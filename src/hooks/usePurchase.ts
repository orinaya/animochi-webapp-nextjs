/**
 * usePurchase Hook
 * Hook pour gérer l'achat d'Animoney via Stripe
 *
 * Principe SRP: Responsabilité unique de gérer le processus d'achat
 * Principe OCP: Extensible pour différents types d'achats
 */

'use client'

import { useState } from 'react'
import { AVAILABLE_AMOUNTS } from '@/config/pricing'

export interface UsePurchaseReturn {
  isPurchasing: boolean
  error: string | null
  purchaseAnimoney: (amount: number) => Promise<void>
  clearError: () => void
  validateAmount: (amount: number) => boolean
}

/**
 * Hook personnalisé pour gérer l'achat d'Animoney
 * Gère la validation, l'appel API et les états de chargement/erreur
 *
 * @returns {UsePurchaseReturn} État et fonctions d'achat
 */
export function usePurchase (): UsePurchaseReturn {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Valide qu'un montant est disponible dans la pricing table
   * @param amount - Montant à valider
   * @returns true si le montant est valide
   */
  const validateAmount = (amount: number): boolean => {
    return AVAILABLE_AMOUNTS.includes(amount)
  }

  /**
   * Gère l'achat d'Animoney via Stripe Checkout
   * @param amount - Montant d'Animoney à acheter (10, 50, 500, 1000, 5000)
   * @throws Redirection vers Stripe si succès, sinon définit l'erreur
   */
  const purchaseAnimoney = async (amount: number): Promise<void> => {
    setError(null)

    // Validation du montant
    if (!validateAmount(amount)) {
      setError(`Montant invalide. Montants disponibles : ${AVAILABLE_AMOUNTS.join(', ')} Ⱥ`)
      return
    }

    setIsPurchasing(true)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      })

      if (!response.ok) {
        const errorData = await response.json() as { error?: string }
        throw new Error(errorData.error ?? 'Erreur lors de la création de la session de paiement')
      }

      const { url } = await response.json() as { url: string }

      if (url !== null && url !== undefined && url !== '') {
        // Redirection vers Stripe Checkout
        window.location.href = url
      } else {
        throw new Error('URL de paiement invalide')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'achat d\'Animoney')
      setIsPurchasing(false)
    }
  }

  /**
   * Efface le message d'erreur
   */
  const clearError = (): void => {
    setError(null)
  }

  return {
    isPurchasing,
    error,
    purchaseAnimoney,
    clearError,
    validateAmount
  }
}
