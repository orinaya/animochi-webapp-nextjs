/**
 * useWallet Hook - Hook React pour gérer le wallet côté client
 * Principe SRP : Gère uniquement la récupération et l'état du wallet
 */

'use client'

import { useState, useEffect } from 'react'
import type { Wallet } from '@/types/wallet'

interface UseWalletReturn {
  wallet: Wallet | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook pour récupérer et gérer le wallet de l'utilisateur connecté
 * @returns {UseWalletReturn} État du wallet, loading, erreur et fonction refetch
 */
export function useWallet (): UseWalletReturn {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallet = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/wallet')

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setWallet(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setWallet(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchWallet()
  }, [])

  return {
    wallet,
    loading,
    error,
    refetch: fetchWallet
  }
}
