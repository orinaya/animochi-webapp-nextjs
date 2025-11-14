// src/domain/repositories/monster-repository.ts
// Interface d'accès aux monstres pour l'infrastructure

import type {Monster} from "@/domain/entities/monster"

export interface MonsterRepository {
  findAllWithNextStateDue: (now: Date) => Promise<Monster[]>
  save: (monster: Monster) => Promise<void>
}
