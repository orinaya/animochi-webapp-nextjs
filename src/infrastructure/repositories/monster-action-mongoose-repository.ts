// src/infrastructure/repositories/monster-action-mongoose-repository.ts
// Implémentation MonsterActionRepository avec Mongoose

import type {MonsterActionRepository} from "@/domain/repositories/monster-action-repository"
import MonsterActionModel from "@/db/models/monster-action.model"
import type {MonsterAction} from "@/config/rewards"

export class MonsterActionMongooseRepository implements MonsterActionRepository {
  hasActionBeenDone = async (
    monsterId: string,
    action: MonsterAction,
    since: Date
  ): Promise<boolean> => {
    const found = await MonsterActionModel.findOne({
      monsterId,
      action,
      createdAt: {$gte: since},
    })
    return found != null
  }
}
