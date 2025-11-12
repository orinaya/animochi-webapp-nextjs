/**
 * WalletPageContent - Contenu de la page Wallet avec sidebar
 * Principe SRP : Gère uniquement l'affichage de la page wallet
 */

'use client'

import { WalletCard, WalletActions, TransactionHistory } from '@/components/wallet'
import { DashboardLayout } from '@/components/layout'
import { authClient } from '@/lib/auth/auth-client'
import { deductFunds } from '@/actions/wallet.actions'
import { useWallet } from '@/hooks/use-wallet'
import { useTransactions } from '@/hooks/use-transactions'
import { useState } from 'react'
import { PaymentSuccessHandler } from './payment-success-modal'

type Session = typeof authClient.$Infer.Session

interface WalletPageContentProps {
  session: Session
}

export function WalletPageContent ({ session }: WalletPageContentProps): React.ReactNode {
  const { wallet, loading, error, refetch } = useWallet()
  const { transactions, loading: transactionsLoading, refetch: refetchTransactions } = useTransactions()
  const [subtractError, setSubtractError] = useState<string | null>(null)

  const handleLogout = (): void => {
    // Logout logic - could be handled via authClient
  }

  const handleSubtract = async (amount: number): Promise<void> => {
    setSubtractError(null)
    const result = await deductFunds(amount, 'MANUAL_SUBTRACT')

    if (!result.success) {
      setSubtractError(result.error ?? 'Erreur inconnue')
      return
    }

    await refetch()
    await refetchTransactions() // Rafraîchir l'historique après un retrait
  }

  if (error !== null && error !== '') {
    return (
      <DashboardLayout session={session} onLogout={handleLogout}>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-xl p-6 border border-strawberry-400 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='text-3xl'>⚠️</span>
              <h2 className='text-xl font-semibold text-strawberry-600'>
                Erreur
              </h2>
            </div>
            <p className='text-gray-700 mb-4'>{error}</p>
            <button
              onClick={() => { void refetch() }}
              className='px-4 py-2 bg-blueberry-950 text-white rounded-lg hover:bg-blueberry-900 transition-colors'
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout session={session} onLogout={handleLogout}>
      {/* Modal de succès de paiement */}
      <PaymentSuccessHandler
        onPaymentSuccess={() => {
          void refetch()
          void refetchTransactions() // Rafraîchir aussi les transactions après un paiement
        }}
      />

      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-blueberry-950 mb-2'>
            💰 Mon Wallet Animochi
          </h1>
          <p className='text-lg text-gray-600'>
            Gérez votre monnaie virtuelle Animochi (Ⱥ)
          </p>
        </div>

        {/* Wallet Card */}
        <WalletCard balance={wallet?.balance ?? 0} loading={loading} />

        {/* Actions */}
        {subtractError !== null && subtractError !== '' && (
          <div className='bg-strawberry-100 border border-strawberry-400 text-strawberry-800 px-4 py-3 rounded'>
            {subtractError}
          </div>
        )}
        <WalletActions
          onSubtract={handleSubtract}
          disabled={loading || (wallet == null)}
        />

        {/* Transaction History */}
        <TransactionHistory transactions={transactions} loading={transactionsLoading} />
      </div>
    </DashboardLayout>
  )
}
