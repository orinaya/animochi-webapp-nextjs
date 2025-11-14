// Calcule le pourcentage d’avancement du niveau courant (0-100)
// Calcule le gain d’XP, la montée de niveau et retourne le résultat complet

import { MonsterAction } from '@/types'

// import type {MonsterAction} from "@/types/monster-actions"
export function calculateLevelProgress (currentXp: number, xpToNextLevel: number): number {
  if (xpToNextLevel <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((currentXp / xpToNextLevel) * 100)))
}

// Calcule l’XP totale requise pour atteindre un niveau donné (somme cumulative)
export function calculateTotalXpForLevel (level: number): number {
  let total = 0
  for (let l = 1; l <= level; l++) {
    total += getNextLevelXp(l)
  }
  return total
}

export function applyExperienceGain (
  currentExperience: number,
  currentLevel: number,
  action: MonsterAction
): {
    xpGained: number
    newExperience: number
    newLevel: number
    experienceToNextLevel: number
    leveledUp: boolean
    levelsGained: number
  } {
  const xpGained = getActionXpReward(action)
  let newExperience = currentExperience + xpGained
  let newLevel = currentLevel
  let experienceToNextLevel = getNextLevelXp(newLevel)
  let leveledUp = false
  let levelsGained = 0

  while (newExperience >= experienceToNextLevel) {
    newExperience -= experienceToNextLevel
    newLevel += 1
    experienceToNextLevel = getNextLevelXp(newLevel)
    leveledUp = true
    levelsGained += 1
  }

  return {
    xpGained,
    newExperience,
    newLevel,
    experienceToNextLevel,
    leveledUp,
    levelsGained
  }
}
// src/services/experience.ts
// Service pour calculer l’XP gagnée et la montée de niveau

export function getActionXpReward (action: string): number {
  switch (action) {
    case 'feed':
      return 10
    case 'play':
      return 8
    case 'heal':
      return 15
    case 'hug':
      return 6
    case 'comfort':
      return 6
    case 'wake':
      return 7
    case 'walk':
      return 6
    case 'train':
      return 8
    default:
      return 0
  }
}

export function getNextLevelXp (level: number): number {
  // Croissance exponentielle simple
  return Math.floor(100 * level * 1.5)
}
