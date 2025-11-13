/**
 * Hook pour récupérer le pseudo utilisateur
 * Charge le pseudo depuis la base de données
 */

'use client'

import { useEffect, useState } from 'react'
import { getUserProfile } from '@/actions/user.actions'

export function useUserPseudo (): { pseudo: string | undefined, loading: boolean } {
  const [pseudo, setPseudo] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPseudo (): Promise<void> {
      try {
        const result = await getUserProfile()
        if (result.success && result.user != null) {
          setPseudo(result.user.pseudo ?? result.user.username)
        }
      } catch (error) {
        console.error('Erreur chargement pseudo:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadPseudo()
  }, [])

  return { pseudo, loading }
}
