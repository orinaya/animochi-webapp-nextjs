// src/shared/monster-mood.ts
// Mapping centralisé des états d'humeur, descriptions et emojis (inspiré de tamagotcho)
import type { MonsterState } from '@/config/rewards.config'

export interface MonsterMoodInfo {
  key: MonsterState
  label: string
  description: string
  emoji: string
}

export const MONSTER_MOODS: Record<MonsterState, MonsterMoodInfo> = {
  happy: {
    key: 'happy',
    label: 'Heureux',
    description: 'Heureux et satisfait',
    emoji: '😄'
  },
  sad: {
    key: 'sad',
    label: 'Triste',
    description: 'Triste et déprimé',
    emoji: '😢'
  },
  angry: {
    key: 'angry',
    label: 'En colère',
    description: 'En colère',
    emoji: '😠'
  },
  hungry: {
    key: 'hungry',
    label: 'Affamé',
    description: 'A faim',
    emoji: '🍽️'
  },
  sleepy: {
    key: 'sleepy',
    label: 'Fatigué',
    description: 'Endormi ou fatigué',
    emoji: '😴'
  },
  bored: {
    key: 'bored',
    label: 'S’ennuie',
    description: 'S’ennuie',
    emoji: '🥱'
  },
  sick: {
    key: 'sick',
    label: 'Malade',
    description: 'Malade',
    emoji: '🤒'
  }
}

export function getMonsterMoodInfo (state: MonsterState): MonsterMoodInfo {
  return MONSTER_MOODS[state]
}
