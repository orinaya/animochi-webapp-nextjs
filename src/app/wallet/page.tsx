/**
 * Wallet Page - Page dédiée au wallet Animoney
 * Affiche le solde, permet d'ajouter/retirer de l'Animoney
 * et affiche l'historique des transactions
 */

import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { WalletPageContent } from '@/components/wallet/wallet-page-content'

export default async function WalletPage(): Promise<React.ReactNode> {
  // Vérifier l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session == null) {
    redirect('/sign-in')
  }

  return <WalletPageContent session={session} />
}
