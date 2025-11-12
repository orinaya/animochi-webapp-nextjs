/**
 * Service d'expérience - Barrel export
 *
 * Centralise l'export des fonctions du système d'expérience
 *
 * @module services/experience
 */

export {
  calculateXpForNextLevel,
  calculateTotalXpForLevel,
  getActionXpReward,
  calculateLevelFromExperience,
  applyExperienceGain,
  calculateLevelProgress,
  type MonsterAction,
  type ExperienceGainResult
} from './experience-calculator'
