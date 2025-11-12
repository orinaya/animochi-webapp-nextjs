/**
 * WalletCard - Component UI
 * Affiche le solde du wallet avec l'icône Animoney
 * Principe SRP : Responsable uniquement de l'affichage du solde
 */

'use client'

interface WalletCardProps {
  balance: number
  loading?: boolean
}

export function WalletCard ({ balance, loading = false }: WalletCardProps) {
  if (loading) {
    return (
      <div className='bg-white rounded-xl p-6 border border-latte-200 shadow-sm animate-pulse'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='h-4 w-24 bg-latte-200 rounded mb-2' />
            <div className='h-8 w-32 bg-latte-200 rounded' />
          </div>
          <div className='h-12 w-12 bg-latte-200 rounded-full' />
        </div>
      </div>
    )
  }

  return (
    <div className='bg-linear-to-br from-blueberry-950 to-blueberry-900 rounded-xl p-6 text-white shadow-lg'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-blueberry-300 font-medium mb-1'>
            Votre solde
          </p>
          <div className='flex items-baseline gap-2'>
            <span className='text-4xl font-bold'>{balance.toLocaleString('fr-FR')}</span>
            <span className='text-xl text-blueberry-200'>Ⱥ</span>
          </div>
          <p className='text-xs text-blueberry-400 mt-1'>Animoney</p>
        </div>
        <div className='bg-blueberry-800 rounded-full p-3 w-16 h-16 flex items-center justify-center'>
          <span className='text-3xl'>💰</span>
        </div>
      </div>
    </div>
  )
}
