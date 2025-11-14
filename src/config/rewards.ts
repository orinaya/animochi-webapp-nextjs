// src/config/rewards.ts
// Configuration centralisée des gains et pertes d'animoney selon l'action et l'état du monstre

export type MonsterAction = "feed" | "play" | "heal" | "hug" | "comfort" | "wake" | "walk" | "train"
export type MonsterState = "happy" | "sad" | "angry" | "hungry" | "sleepy" | "bored" | "sick"

export const REWARD_AMOUNTS: Record<MonsterAction, number> = {
  feed: 10,
  play: 8,
  heal: 15,
  hug: 6,
  comfort: 6,
  wake: 7,
  walk: 6,
  train: 8,
}

export const PENALTY_AMOUNTS: Record<MonsterState, number> = {
  hungry: 5,
  bored: 4,
  sick: 10,
  happy: 0,
  sad: 3,
  angry: 4,
  sleepy: 2,
}
