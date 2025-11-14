/**
 * Utils pour la gestion des préférences utilisateur
 * Respecte le principe SRP : Gère uniquement les préférences locales
 */

// Clés de localStorage pour l'application
export const STORAGE_KEYS = {
  USER_AVATAR: 'animochi-user-avatar',
  USER_PREFERENCES: 'animochi-user-preferences',
  THEME: 'animochi-theme'
} as const

/**
 * Sauvegarde une valeur dans localStorage avec gestion d'erreur
 */
export function saveToStorage (key: string, value: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`Erreur lors de la sauvegarde de ${key}:`, error)
    return false
  }
}

/**
 * Charge une valeur depuis localStorage avec gestion d'erreur
 */
export function loadFromStorage (key: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Erreur lors du chargement de ${key}:`, error)
    return null
  }
}

/**
 * Sauvegarde un objet JSON dans localStorage
 */
export function saveObjectToStorage (key: string, object: Record<string, unknown>): boolean {
  try {
    return saveToStorage(key, JSON.stringify(object))
  } catch (error) {
    console.warn(`Erreur lors de la sauvegarde de l'objet ${key}:`, error)
    return false
  }
}

/**
 * Charge un objet JSON depuis localStorage
 */
export function loadObjectFromStorage<T = Record<string, unknown>> (key: string): T | null {
  try {
    const value = loadFromStorage(key)
    return value != null ? JSON.parse(value) : null
  } catch (error) {
    console.warn(`Erreur lors du chargement de l'objet ${key}:`, error)
    return null
  }
}

/**
 * Supprime une valeur du localStorage
 */
export function removeFromStorage (key: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Erreur lors de la suppression de ${key}:`, error)
    return false
  }
}

/**
 * Vide complètement le localStorage (attention !)
 */
export function clearStorage (): boolean {
  if (typeof window === 'undefined') return false

  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.warn('Erreur lors du vidage du localStorage:', error)
    return false
  }
}
