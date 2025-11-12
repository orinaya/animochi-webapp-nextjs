'use client'

import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Composant NoSSR - Empêche le rendu côté serveur
 *
 * Utilisé pour éviter les erreurs d'hydratation quand le contenu
 * diffère entre le serveur et le client (comme les avatars dynamiques)
 */
export function NoSSR ({ children, fallback = null }: NoSSRProps): React.ReactNode {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return children
}
