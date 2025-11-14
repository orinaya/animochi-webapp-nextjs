'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth/auth-client'
import { UseSessionReturn, UseSessionError } from '@/types/user/user'
import { User } from 'better-auth'

export function useSession (): UseSessionReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<UseSessionError>(null)

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
