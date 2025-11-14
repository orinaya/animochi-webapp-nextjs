// src/domain/repositories/monster-action-repository.ts
// Interface pour vérifier si l'action utilisateur a été faite pour un monstre donné

import type {MonsterAction} from "@/config/rewards"

export interface MonsterActionRepository {
  hasActionBeenDone: (monsterId: string, action: MonsterAction, since: Date) => Promise<boolean>
}
