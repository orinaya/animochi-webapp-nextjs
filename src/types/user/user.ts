export interface User {
  id: string
  email: string
  name?: string
  image?: string | null
  createdAt?: Date
  updatedAt?: Date
  emailVerified?: boolean
  username?: string
  pseudo?: string
  displayName?: string
  level?: number
}

export type UseSessionError = string | Error | null | unknown

export interface UseSessionReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: UseSessionError
}
