/**
 * WalletContext - Contexte global pour le wallet
 * Permet de partager l'état du wallet entre tous les composants
 * Principe SRP : Gère uniquement l'état global du wallet
 */

'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Wallet } from '@/types/wallet'

interface WalletContextType {
  wallet: Wallet | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps): React.ReactNode {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallet = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/wallet', {
        cache: 'no-store' // Toujours récupérer les données fraîches
      })

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

  return (
    <WalletContext.Provider value={{ wallet, loading, error, refetch: fetchWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext(): WalletContextType {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}
