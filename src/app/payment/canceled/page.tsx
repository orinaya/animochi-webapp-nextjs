'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentCanceledPage () {
  const router = useRouter()

  useEffect(() => {
    // Rediriger immédiatement vers le wallet avec paramètre canceled
    router.replace('/wallet?canceled=true')
  }, [router])

  // Afficher un loader pendant la redirection
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-blueberry-50'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-600'>Redirection vers votre wallet...</p>
      </div>
    </div>
  )
}
