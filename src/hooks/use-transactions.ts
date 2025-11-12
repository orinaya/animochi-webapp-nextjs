/**
 * useTransactions Hook - Hook React pour gérer les transactions côté client
 * Principe SRP : Gère uniquement la récupération et l'état des transactions
 */

'use client'

import { useState, useEffect } from 'react'

export interface Transaction {
  id: string
  walletId: string
  type: 'CREDIT' | 'DEBIT'
  amount: number
  reason: string
  metadata?: Record<string, unknown>
  createdAt: string // Format ISO string pour la sérialisation
}

interface UseTransactionsReturn {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook pour récupérer et gérer les transactions de l'utilisateur connecté
 * @param limit - Nombre maximum de transactions à récupérer
 * @param skip - Nombre de transactions à sauter (pagination)
 * @returns {UseTransactionsReturn} Liste des transactions, loading, erreur et fonction refetch
 */
export function useTransactions (limit: number = 50, skip: number = 0): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/wallet/transactions?limit=${limit}&skip=${skip}`)

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Les transactions sont déjà au bon format (createdAt en string ISO)
      setTransactions(data.transactions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchTransactions()
  }, [limit, skip])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions
  }
}
