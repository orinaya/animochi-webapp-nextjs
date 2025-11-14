// src/infrastructure/repositories/monster-mongoose-repository.ts
// Implémentation MonsterRepository avec Mongoose

import type { MonsterRepository } from '@/domain/repositories/monster-repository'
import { Monster } from '@/domain/entities/monster'
import type { MonsterState } from '@/config/rewards.config'
import MongooseMonster from '@/db/models/monster.model'

export class MonsterMongooseRepository implements MonsterRepository {
  findAllWithNextStateDue = async (now: Date): Promise<Monster[]> => {
    const rows = await MongooseMonster.find({ nextStateAt: { $lte: now } })
    return rows.map((row) => {
      if (row.stateUpdatedAt == null || row.nextStateAt == null) {
        throw new Error('Invalid monster data: missing stateUpdatedAt or nextStateAt')
      }
      return new Monster({
        id: row._id.toString(),
        ownerId: row.ownerId.toString(),
        state: row.state as MonsterState,
        stateUpdatedAt: new Date(row.stateUpdatedAt),
        nextStateAt: new Date(row.nextStateAt)
      })
    })
  }

  save = async (monster: Monster): Promise<void> => {
    await MongooseMonster.updateOne(
      { _id: monster.id },
      {
        state: monster.state,
        stateUpdatedAt: monster.stateUpdatedAt,
        nextStateAt: monster.nextStateAt
      }
    )
  }
}
