/**
 * Wallet API Route - GET /api/wallet
 * Récupère le wallet de l'utilisateur connecté
 */

import { NextResponse } from 'next/server'
import { getWallet } from '@/actions/wallet.actions'

export async function GET (): Promise<NextResponse> {
  try {
    const wallet = await getWallet()

    if (wallet == null) {
      return NextResponse.json(
        { error: 'Wallet non trouvé ou utilisateur non connecté' },
        { status: 404 }
      )
    }

    return NextResponse.json(wallet)
  } catch (error) {
    console.error('Error in GET /api/wallet:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
