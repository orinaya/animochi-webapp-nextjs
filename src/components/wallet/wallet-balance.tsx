/**
 * WalletBalance - Component UI
 * Affiche le solde du wallet dans le header (version compacte)
 */

'use client'

import Link from 'next/link'
import { useWallet } from '@/hooks/use-wallet'

export function WalletBalance () {
  const { wallet, loading } = useWallet()

  if (loading) {
    return (
      <div className='px-3 py-1.5 bg-latte-100 rounded-lg animate-pulse'>
        <div className='h-4 w-20 bg-latte-200 rounded' />
      </div>
    )
  }

  if (wallet == null) {
    return null
  }

  return (
    <Link
      href='/wallet'
      className='px-3 py-1.5 bg-blueberry-950 text-white rounded-lg hover:bg-blueberry-900 transition-colors flex items-center gap-2 group'
    >
      <span className='text-sm font-medium'>
        {wallet.balance.toLocaleString('fr-FR')}
      </span>
      <span className='text-xs opacity-80 group-hover:opacity-100'>Ⱥ</span>
    </Link>
  )
}
