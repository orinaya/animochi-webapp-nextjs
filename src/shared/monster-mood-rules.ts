// src/shared/monster-mood-rules.ts
// Règles d'évolution d'humeur inspirées de tamagotcho (plus déterministes)
import type {MonsterState} from "@/config/rewards.config"

export interface MonsterMoodContext {
  lastActionAt: Date
  lastFedAt: Date
  lastPlayedAt: Date
  lastSleptAt: Date
  now: Date
}

// Règle simple : priorité à l'état le plus négligé
export function getNextMonsterMood(current: MonsterState, ctx: MonsterMoodContext): MonsterState {
  const {now, lastFedAt, lastPlayedAt, lastSleptAt, lastActionAt} = ctx
  const hoursSinceFed = (now.getTime() - lastFedAt.getTime()) / 36e5
  const hoursSincePlayed = (now.getTime() - lastPlayedAt.getTime()) / 36e5
  const hoursSinceSlept = (now.getTime() - lastSleptAt.getTime()) / 36e5
  const hoursSinceAction = (now.getTime() - lastActionAt.getTime()) / 36e5

  if (hoursSinceFed > 6) return "hungry"
  if (hoursSinceSlept > 12) return "sleepy"
  if (hoursSincePlayed > 8) return "bored"
  if (hoursSinceAction > 24) return "sad"
  if (current === "sick") return "sick"
  if (current === "angry" && hoursSinceAction < 2) return "happy"
  return "happy"
}
