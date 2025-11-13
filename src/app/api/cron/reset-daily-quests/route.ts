/**
 * API Route - Cron Job pour réinitialiser les quêtes journalières
 * Appelée automatiquement à minuit par Vercel Cron
 */

import { NextResponse } from 'next/server'
import { resetAllDailyQuests } from '@/actions/quests.actions'

/**
 * GET /api/cron/reset-daily-quests
 * Réinitialise toutes les quêtes journalières expirées
 * Protégé par un secret de cron
 */
export async function GET (request: Request): Promise<NextResponse> {
  try {
    // Récupérer le secret depuis les headers ou query params
    const authHeader = request.headers.get('authorization')
    const url = new URL(request.url)
    const secret = authHeader?.replace('Bearer ', '') ?? url.searchParams.get('secret')

    if (secret == null) {
      return NextResponse.json({ error: 'Missing authorization secret' }, { status: 401 })
    }

    // Exécuter la réinitialisation
    const result = await resetAllDailyQuests(secret)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message ?? 'Failed to reset quests' },
        { status: result.message === 'Non autorisé' ? 403 : 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Daily quests reset successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
