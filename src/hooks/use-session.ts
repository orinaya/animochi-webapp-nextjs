'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { UseSessionReturn } from '@/types/user/user'
import { User } from 'better-auth'

export function useSession (): UseSessionReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const getSession = async (): Promise<void> => {
      try {
        const session = await authClient.getSession()
        setUser(session.data?.user ?? null)
        setError(null)
      } catch (err) {
        setError(err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void getSession()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: user != null,
    error
  }
}
