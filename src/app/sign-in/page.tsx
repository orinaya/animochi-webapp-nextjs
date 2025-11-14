
'use client'

import React from 'react'
import AuthFormContent from '@/components/forms/auth-form-content'

function getReasonFromSearch (): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('reason')
}

function SignInPage (): React.ReactNode {
  const [reason, setReason] = React.useState<string | null>(null)

  React.useEffect(() => {
    setReason(getReasonFromSearch())
  }, [])

  return (
    <div className='min-h-screen bg-latte-50 flex items-center justify-center'>
      <div className='w-full'>
        {reason === 'session-expired' && (
          <div className='mb-4 rounded bg-strawberry-100 border border-strawberry-400 text-strawberry-900 px-4 py-3 text-center font-medium'>
            Votre session a expiré, veuillez vous reconnecter.
          </div>
        )}
        <AuthFormContent />
      </div>
    </div>
  )
}

export default SignInPage
