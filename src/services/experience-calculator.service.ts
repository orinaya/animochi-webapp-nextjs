/**
 * Service de calcul d'expérience et de niveau
 *
 * Responsabilité unique (SRP) : Gère tous les calculs liés à l'XP et au leveling
 * Pas de dépendances externes : logique métier pure et testable
 *
 * Formule de progression :
 * - XP pour le niveau N = 100 * N * 1.5 (progression exponentielle douce)
 * - Chaque action réussie donne entre 10 et 50 XP selon le type
 *
 * @module services/experience
 */

// ============================================================================
// CONSTANTES DE CONFIGURATION
// ============================================================================

/**
 * XP de base pour atteindre le niveau 2
 * Formule : BASE_XP * level * GROWTH_FACTOR
 */
const BASE_XP = 100

/**
 * Facteur de croissance de l'XP nécessaire par niveau
 * 1.5 = croissance douce (niveau 10 = 1500 XP, niveau 20 = 3000 XP)
 */
const GROWTH_FACTOR = 1.5

/**
 * XP par défaut pour une action simple
 */
const DEFAULT_ACTION_XP = 20

/**
 * Table de gains d'XP par type d'action
 */
const ACTION_XP_REWARDS = {
  feed: 25, // Nourrir demande de l'attention
  comfort: 30, // Réconforter est plus complexe
  hug: 20, // Câlin basique
  wake: 15, // Réveiller est simple
  walk: 35, // Promener est une activité physique
  train: 40 // Entraîner demande beaucoup d'effort
} as const

// ============================================================================
// TYPES
// ============================================================================

/**
 * Type des actions possibles sur un monstre
 */
export type MonsterAction = keyof typeof ACTION_XP_REWARDS

/**
 * Résultat du calcul de gain d'XP
 */
export interface ExperienceGainResult {
  /** XP ajouté */
  xpGained: number
  /** Nouvelle XP totale */
  newExperience: number
  /** XP nécessaire pour le niveau suivant */
  experienceToNextLevel: number
  /** Niveau actuel après gain */
  newLevel: number
  /** Le monstre a-t-il gagné un niveau ? */
  leveledUp: boolean
  /** Nombre de niveaux gagnés (peut être > 1 si beaucoup d'XP d'un coup) */
  levelsGained: number
}

// ============================================================================
// FONCTIONS DE CALCUL
// ============================================================================

/**
 * Calcule l'XP nécessaire pour atteindre le niveau suivant
 *
 * Formule : BASE_XP * level * GROWTH_FACTOR
 * Garantit une progression exponentielle douce
 *
 * @param {number} currentLevel - Niveau actuel du monstre (minimum 1)
 * @returns {number} XP nécessaire pour passer au niveau suivant
 *
 * @example
 * calculateXpForNextLevel(1) // 150
 * calculateXpForNextLevel(5) // 750
 * calculateXpForNextLevel(10) // 1500
 */
export function calculateXpForNextLevel (currentLevel: number): number {
  // Validation : niveau minimum 1
  const validLevel = Math.max(1, currentLevel)

  return Math.floor(BASE_XP * validLevel * GROWTH_FACTOR)
}

/**
 * Calcule l'XP totale cumulée nécessaire pour atteindre un niveau donné
 *
 * Somme de tous les paliers d'XP depuis le niveau 1
 * Utile pour la migration de données ou vérifications
 *
 * @param {number} targetLevel - Niveau cible
 * @returns {number} XP totale cumulée nécessaire
 *
 * @example
 * calculateTotalXpForLevel(1) // 0
 * calculateTotalXpForLevel(2) // 150
 * calculateTotalXpForLevel(3) // 450 (150 + 300)
 */
export function calculateTotalXpForLevel (targetLevel: number): number {
  if (targetLevel <= 1) return 0

  let totalXp = 0
  for (let level = 1; level < targetLevel; level++) {
    totalXp += calculateXpForNextLevel(level)
  }

  return totalXp
}

/**
 * Retourne le gain d'XP pour une action donnée
 *
 * @param {MonsterAction} action - Type d'action effectuée
 * @returns {number} XP gagnée
 *
 * @example
 * getActionXpReward('feed') // 25
 * getActionXpReward('comfort') // 30
 */
export function getActionXpReward (action: MonsterAction): number {
  return ACTION_XP_REWARDS[action] ?? DEFAULT_ACTION_XP
}

/**
 * Calcule le nouveau niveau en fonction de l'XP actuelle
 *
 * Fonction pure qui détermine le niveau atteint
 * en fonction de l'XP totale accumulée
 *
 * @param {number} currentExperience - XP totale accumulée
 * @returns {number} Niveau calculé (minimum 1)
 *
 * @example
 * calculateLevelFromExperience(0) // 1
 * calculateLevelFromExperience(150) // 2
 * calculateLevelFromExperience(500) // 3
 */
export function calculateLevelFromExperience (currentExperience: number): number {
  let level = 1
  let xpNeeded = 0

  // Calcul itératif du niveau
  while (xpNeeded <= currentExperience) {
    const nextLevelXp = calculateXpForNextLevel(level)
    if (xpNeeded + nextLevelXp > currentExperience) {
      break
    }
    xpNeeded += nextLevelXp
    level++
  }

  return level
}

/**
 * Applique un gain d'XP et calcule les conséquences
 *
 * Fonction principale du système d'expérience.
 * Gère automatiquement les montées de niveau multiples.
 *
 * Respecte SRP : uniquement calcul, pas de persistance
 * Fonction pure : pas d'effets de bord
 *
 * @param {number} currentExperience - XP actuelle du monstre
 * @param {number} currentLevel - Niveau actuel du monstre
 * @param {MonsterAction} action - Action effectuée
 * @returns {ExperienceGainResult} Résultat détaillé du gain d'XP
 *
 * @example
 * ```typescript
 * const result = applyExperienceGain(100, 1, 'feed')
 * // {
 * //   xpGained: 25,
 * //   newExperience: 125,
 * //   newLevel: 1,
 * //   experienceToNextLevel: 150,
 * //   leveledUp: false,
 * //   levelsGained: 0
 * // }
 * ```
 */
export function applyExperienceGain (
  currentExperience: number,
  currentLevel: number,
  action: MonsterAction
): ExperienceGainResult {
  // Validation des entrées
  const validExperience = Math.max(0, currentExperience)
  const validLevel = Math.max(1, currentLevel)

  // Calcul du gain d'XP
  const xpGained = getActionXpReward(action)
  const newExperience = validExperience + xpGained

  // Calcul du nouveau niveau
  const newLevel = calculateLevelFromExperience(newExperience)
  const levelsGained = newLevel - validLevel
  const leveledUp = levelsGained > 0

  // Calcul de l'XP pour le niveau suivant
  const experienceToNextLevel = calculateXpForNextLevel(newLevel)

  return {
    xpGained,
    newExperience,
    newLevel,
    experienceToNextLevel,
    leveledUp,
    levelsGained
  }
}

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 *
 * Utile pour afficher une barre de progression
 *
 * @param {number} currentExperience - XP actuelle
 * @param {number} currentLevel - Niveau actuel
 * @returns {number} Pourcentage (0-100)
 *
 * @example
 * calculateLevelProgress(75, 1) // 50 (75/150 = 50%)
 * calculateLevelProgress(150, 1) // 100 (montée de niveau)
 */
export function calculateLevelProgress (currentExperience: number, currentLevel: number): number {
  const validExperience = Math.max(0, currentExperience)
  const validLevel = Math.max(1, currentLevel)

  // XP totale nécessaire pour le niveau actuel
  const xpForCurrentLevel = calculateTotalXpForLevel(validLevel)

  // XP nécessaire pour le niveau suivant
  const xpForNextLevel = calculateXpForNextLevel(validLevel)

  // XP dans le niveau actuel
  const xpInCurrentLevel = validExperience - xpForCurrentLevel

  // Pourcentage de progression
  const progress = (xpInCurrentLevel / xpForNextLevel) * 100

  // Clamp entre 0 et 100
  return Math.min(100, Math.max(0, Math.floor(progress)))
}
