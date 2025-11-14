import { getLeaderboardMonsters } from '@/actions/leaderboard.actions'
import { NextResponse } from 'next/server'

export async function GET () {
  const data = await getLeaderboardMonsters(20)
  return NextResponse.json(data)
}
