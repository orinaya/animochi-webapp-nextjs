/**
 * useWallet Hook - Hook React pour gérer le wallet côté client
 * Principe SRP : Gère uniquement la récupération et l'état du wallet
 */

'use client'

import { useState, useEffect } from 'react'
import type { Wallet } from '@/types/wallet'
import { walletEvents } from '@/lib/wallet-events'

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
      console.log('💰 [useWallet] Fetching wallet...')
      setLoading(true)
      setError(null)

      const response = await fetch('/api/wallet', {
        cache: 'no-store', // Ne pas utiliser le cache pour avoir les données fraîches
        headers: {
          'Cache-Control': 'no-cache',
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('💰 [useWallet] Wallet reçu:', data)
      setWallet(data)
    } catch (err) {
      console.error('❌ [useWallet] Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setWallet(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🎯 [useWallet] Montage du hook')
    void fetchWallet()

    // S'abonner aux événements de changement du wallet
    const unsubscribe = walletEvents.subscribe(() => {
      console.log('🔄 [useWallet] Événement reçu, refetch...')
      void fetchWallet()
    })

    return unsubscribe
  }, [])

  return {
    wallet,
    loading,
    error,
    refetch: fetchWallet
  }
}
