/**
 * WalletHeaderDisplay - Composant pour afficher le wallet dans le header
 * Principe SRP : Affiche uniquement le solde dans le header de navigation
 */

'use client'

import { useRouter } from 'next/navigation'
import { useWallet } from '@/hooks/use-wallet'
import { formatAnimochi } from '@/utils/wallet.utils'
import Button from '@/components/ui/button'

export function WalletHeaderDisplay (): React.ReactNode {
  const { wallet, loading } = useWallet()
  const router = useRouter()

  console.log('🎨 [WalletHeaderDisplay] Render - wallet:', wallet?.balance, 'loading:', loading)

  if (loading) {
    return (
      <div className='bg-blueberry-100 rounded-lg px-3 h-8 flex items-center animate-pulse'>
        <div className='h-4 w-20 bg-blueberry-200 rounded' />
      </div>
    )
  }

  if (wallet == null) {
    return null
  }

  return (
    <Button
      onClick={() => { router.push('/wallet') }}
      variant='primary'
      color='blueberry'
      size='sm'
      className='h-8 px-3 text-sm font-bold hover:shadow-lg hover:scale-105'
    >
      {formatAnimochi(wallet.balance)}
    </Button>
  )
}
