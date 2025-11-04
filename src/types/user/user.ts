export interface User {
  id: string
  email: string
  name?: string
  image?: string | null
  createdAt?: Date
  updatedAt?: Date
  emailVerified?: boolean
}

export interface UseSessionReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: any
}
