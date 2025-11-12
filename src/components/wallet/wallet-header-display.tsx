/**
 * WalletHeaderDisplay - Composant pour afficher le wallet dans le header
 * Principe SRP : Affiche uniquement le solde dans le header de navigation
 */

'use client'

import Link from 'next/link'
import { useWallet } from '@/hooks/use-wallet'
import { formatAnimochi } from '@/utils/wallet.utils'

export function WalletHeaderDisplay(): React.ReactNode {
  const { wallet, loading } = useWallet()

  if (loading) {
    return (
      <div className='bg-blueberry-100 rounded-lg px-3 py-2 animate-pulse'>
        <div className='h-5 w-20 bg-blueberry-200 rounded' />
      </div>
    )
  }

  if (wallet == null) {
    return null
  }

  return (
    <Link
      href='/wallet'
      className='bg-linear-to-r from-blueberry-950 to-blueberry-900 text-white rounded-lg px-4 py-2 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 border border-blueberry-800'
    >
      <span className='text-lg font-bold'>
        {formatAnimochi(wallet.balance)}
      </span>
    </Link>
  )
}
