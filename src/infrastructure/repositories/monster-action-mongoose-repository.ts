// src/infrastructure/repositories/monster-action-mongoose-repository.ts
// Implémentation MonsterActionRepository avec Mongoose

import type { MonsterActionRepository } from '@/domain/repositories/monster-action-repository'
import MonsterActionModel from '@/db/models/monster-action.model'
import type { MonsterAction } from '@/config/rewards.config'

export class MonsterActionMongooseRepository implements MonsterActionRepository {
  hasActionBeenDone = async (
    monsterId: string,
    action: MonsterAction,
    since: Date
  ): Promise<boolean> => {
    const found = await MonsterActionModel.findOne({
      monsterId,
      action,
      createdAt: { $gte: since }
    })
    return found != null
  }

  getLastActionAt = async (monsterId: string, action?: string): Promise<Date | null> => {
    const query: any = { monsterId }
    if (action) query.action = action
    const last = await MonsterActionModel.findOne(query).sort({ createdAt: -1 })
    return last?.createdAt ?? null
  }
}
