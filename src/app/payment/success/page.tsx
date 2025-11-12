'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PaymentSuccessPage (): React.ReactElement {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Rediriger immédiatement vers le wallet avec le paramètre session_id
    const params = new URLSearchParams()
    if (sessionId !== null && sessionId !== undefined) {
      params.set('session_id', sessionId)
    }
    router.replace(`/wallet?${params.toString()}`)
  }, [sessionId, router])

  // Afficher un loader pendant la redirection
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-blueberry-50'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-600'>Redirection vers votre wallet...</p>
      </div>
    </div>
  )
}
