/**
 * Mapping des actions vers les états qu'elles résolvent
 *
 * Chaque action correspond à un état spécifique du monstre.
 * Quand on applique l'action correcte, le monstre passe à l'état 'happy'
 * et gagne de l'XP.
 *
 * Respecte le principe SRP : Responsabilité unique de configuration
 *
 * @module config/monster-actions-map
 */

import type { MonsterAction } from '@/types/monster/monster-actions'
import type { MonsterState } from '@/types/monster/monster'

/**
 * Map des actions vers les états qu'elles résolvent
 *
 * @example
 * - Si le monstre est 'hungry', l'action 'feed' le rendra 'happy'
 * - Si le monstre est 'sleepy', l'action 'wake' le rendra 'happy'
 */
export const actionsStatesMap: Record<MonsterAction, MonsterState> = {
  feed: 'hungry', // Nourrir résout la faim
  comfort: 'sad', // Consoler résout la tristesse
  hug: 'angry', // Câliner résout la colère
  wake: 'sleepy', // Réveiller résout la somnolence
  walk: 'sad', // Promener aide aussi contre la tristesse
  train: 'angry' // Entraîner canalise la colère
}

/**
 * Emojis d'animation pour chaque action
 * Ces emojis s'affichent autour du monstre lors de l'exécution de l'action
 */
export const actionAnimationEmojis: Record<MonsterAction, string[]> = {
  feed: ['🍎', '🍕', '🍔', '🥗', '🍰', '🍪'],
  comfort: ['💙', '💜', '💚', '🤍', '💛', '✨'],
  hug: ['🤗', '💕', '💖', '💝', '💗', '🫂'],
  wake: ['⏰', '☀️', '🌅', '⏰', '🔔', '☕'],
  walk: ['🚶', '👣', '🌳', '🌿', '🦋', '🌸'],
  train: ['💪', '🏋️', '⚡', '🔥', '💯', '🎯']
}
