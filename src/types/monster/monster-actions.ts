export type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | 'walk' | 'train'

export interface MonsterActionConfig {
  label: string
  emoji: string
  color: 'strawberry' | 'blueberry' | 'peach' | 'latte'
  animation: string
}

/**
 * Résultat d'une action appliquée sur un monstre
 */
export interface MonsterActionResult {
  /** Succès de l'action */
  success: boolean
  /** XP gagnée */
  xpGained: number
  /** Nouveau niveau (peut être différent de l'ancien si level up) */
  newLevel: number
  /** Le monstre a-t-il gagné un niveau ? */
  leveledUp: boolean
  /** Nombre de niveaux gagnés */
  levelsGained: number
  /** Message de feedback pour l'utilisateur */
  message: string
}
