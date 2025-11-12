/**
 * API Route - Récupération des transactions du wallet
 * Application Layer : Route API pour exposer les transactions
 */

import { NextResponse } from 'next/server'
import { getTransactions } from '@/actions/wallet.actions'

export async function GET (request: Request): Promise<NextResponse> {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') ?? '50', 10)
    const skip = parseInt(searchParams.get('skip') ?? '0', 10)

    // Récupérer les transactions via la server action
    const result = await getTransactions(limit, skip)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Erreur lors de la récupération des transactions' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      transactions: result.transactions ?? [],
      count: result.transactions?.length ?? 0
    })
  } catch (error) {
    console.error('Error in transactions API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
