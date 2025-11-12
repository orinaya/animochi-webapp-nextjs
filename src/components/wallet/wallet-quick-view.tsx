/**
 * WalletQuickView - Component UI Dashboard
 * Carte compacte affichant le solde et un lien rapide vers le wallet
 * Principe SRP : Affiche uniquement un aperçu du wallet sur le dashboard
 */

'use client'

import Link from 'next/link'

import { formatAnimochi } from '@/utils/wallet.utils'
import { useWallet } from '@/hooks/use-wallet'

export function WalletQuickView (): React.ReactNode {
  const { wallet, loading } = useWallet()

  if (loading) {
    return (
      <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm animate-pulse'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <div className='h-4 w-24 bg-latte-200 rounded mb-2' />
            <div className='h-8 w-32 bg-latte-200 rounded' />
          </div>
          <div className='h-10 w-10 bg-latte-200 rounded-full' />
        </div>
      </div>
    )
  }

  if (wallet == null) {
    return (
      <Link href='/wallet'>
        <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-latte-600 font-medium mb-1'>
                Wallet Animochi
              </p>
              <p className='text-lg font-semibold text-blueberry-950'>
                Créer mon wallet
              </p>
            </div>
            <div className='bg-latte-100 rounded-full p-2 w-10 h-10 flex items-center justify-center'>
              <span className='text-xl'>💰</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href='/wallet'>
      <div className='bg-linear-to-br from-blueberry-950 to-blueberry-900 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-blueberry-300 font-medium mb-1'>
              Mon Wallet
            </p>
            <div className='flex items-baseline gap-2'>
              <span className='text-3xl font-bold'>
                {formatAnimochi(wallet.balance)}
              </span>
            </div>
            <p className='text-xs text-blueberry-400 mt-1'>
              Cliquer pour gérer →
            </p>
          </div>
          <div className='bg-blueberry-800 rounded-full p-2 w-12 h-12 flex items-center justify-center'>
            <span className='text-2xl'>💰</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
