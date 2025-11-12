import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET (request: NextRequest): Promise<Response> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  const monsterId = request.nextUrl.searchParams.get('id')
  if (monsterId === null || monsterId === undefined) {
    return new Response('Missing monster id', { status: 400 })
  }

  await connectMongooseToDatabase()
  const monster = await Monster.findOne({ ownerId: session.user.id, _id: monsterId }).exec()

  if (monster === null) {
    return new Response('Monster not found', { status: 404 })
  }

  // Initialiser les champs XP s'ils sont manquants (migration automatique)
  let needsUpdate = false

  if (monster.xp === undefined || monster.xp === null) {
    monster.xp = 0
    needsUpdate = true
  }

  if (monster.maxXp === undefined || monster.maxXp === null) {
    monster.maxXp = (monster.level ?? 1) * 100
    needsUpdate = true
  }

  if (needsUpdate) {
    monster.markModified('xp')
    monster.markModified('maxXp')
    await monster.save()
  }

  // Sérialisation JSON pour éviter les problèmes de typage Next.js
  return Response.json(monster)
}
