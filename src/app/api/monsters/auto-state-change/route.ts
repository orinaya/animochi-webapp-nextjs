// src/app/api/monsters/auto-state-change/route.ts
// Route API POST pour déclencher le changement d'état automatique des monstres

import {NextResponse} from "next/server"

import {MonsterMongooseRepository} from "@/infrastructure/repositories/monster-mongoose-repository"
import {WalletMongooseRepository} from "@/infrastructure/repositories/wallet-mongoose-repository"
import {MonsterActionMongooseRepository} from "@/infrastructure/repositories/monster-action-mongoose-repository"
import {MonsterAutoStateChangeUseCase} from "@/domain/usecases/monster-auto-state-change.usecase"
import {connectMongooseToDatabase} from "@/db"

export async function POST(): Promise<Response> {
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
  return NextResponse.json({ok: true})
}
