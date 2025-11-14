// src/app/api/cron/monster-auto-state-change/route.ts
// Route API pour déclencher le changement automatique d'état des monstres (à appeler par un cron Vercel)

import { NextResponse } from 'next/server'
import { connectMongooseToDatabase } from '@/db'
import { MonsterMongooseRepository } from '@/infrastructure/repositories/monster-mongoose-repository'
import { WalletMongooseRepository } from '@/infrastructure/repositories/wallet-mongoose-repository'
import { MonsterActionMongooseRepository } from '@/infrastructure/repositories/monster-action-mongoose-repository'
import { MonsterAutoStateChangeUseCase } from '@/domain/usecases/monster-auto-state-change.usecase'

export async function GET () {
  try {
    await connectMongooseToDatabase()
    const monsterRepository = new MonsterMongooseRepository()
    const walletRepository = new WalletMongooseRepository()
    const monsterActionRepository = new MonsterActionMongooseRepository()
    const useCase = new MonsterAutoStateChangeUseCase(
      monsterRepository,
      walletRepository,
      monsterActionRepository
    )
    await useCase.execute(new Date())
    return NextResponse.json({ ok: true, message: 'Changement d\'état automatique exécuté' })
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}
