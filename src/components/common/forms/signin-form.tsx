'use client'

import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { Button, InputField } from '../ui'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

interface SignInFormProps {
  onError: (error: string) => void
  onFormSwitch?: () => void
}

function SignInForm ({ onError, onFormSwitch }: SignInFormProps): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleOAuthSignIn = async (provider: 'google' | 'github'): Promise<void> => {
    try {
      setIsLoading(true)

      if (provider === 'github') {
        await authClient.signIn.social({
          provider: 'github',
          callbackURL: '/dashboard'
        })
      } else if (provider === 'google') {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: '/dashboard'
        })
      }
    } catch (error) {
      console.error(`OAuth sign-in error with ${provider}:`, error)
      onError('Erreur lors de la connexion avec ' + provider)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)

    void authClient.signIn.email(
      {
        email: credentials.email,
        password: credentials.password,
        callbackURL: '/dashboard'
      },
      {
        onRequest: (ctx) => {
          console.log('Sign-in request initiated:', ctx)
        },
        onSuccess: (ctx) => {
          console.log('Sign-in successful:', ctx)
          setIsLoading(false)
        },
        onError: (ctx) => {
          console.error('Sign-in error:', ctx)
          setIsLoading(false)
          onError(ctx.error?.message ?? 'Erreur lors de la connexion')
        }
      }
    )
  }

  return (
    <div className='space-y-8'>
      {/* Boutons OAuth */}
      <div className='flex gap-4'>
        <Button
          type='button'
          variant='google'
          className='flex-1'
          onClick={() => { void handleOAuthSignIn('google') }}
        >
          Google
        </Button>
        <Button
          type='button'
          variant='github'
          className='flex-1 '
          onClick={() => { void handleOAuthSignIn('github') }}
        >
          Github
        </Button>
      </div>

      {/* Séparateur */}
      <div className='flex items-center justify-center gap-10'>
        <div className='h-[0.8px] flex-1 bg-latte-300' />
        <span className='text-sm leading-[131.25%] uppercase text-latte-700'>Ou</span>
        <div className='h-[0.8px] flex-1 bg-latte-300' />
      </div>

      {/* Formulaire email/password */}
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-3'>
          <InputField
            type='email'
            name='email'
            label='Email'
            value={credentials.email}
            required
            leftIcon={FiMail}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                email: e.target.value
              })}
          />
          <InputField
            type='password'
            name='password'
            label='Mot de passe'
            value={credentials.password}
            required
            leftIcon={FiLock}
            rightIcon={FaEye}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password: e.target.value
              })}
          />
        </div>

        <div className='space-y-1.5'>
          <Button
            type='submit'
            variant='primary'
            color='strawberry'
            disabled={isLoading}
            iconBefore={FiUser}
            size='xl'
            className='w-full'
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
          <div className='text-right'>
            <a href='#' className='text-sm text-latte-700 underline hover:text-blueberry-950'>
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <div className='text-center text-sm leading-[131.25%] text-blueberry-950'>
          <span>Pas de compte ? </span>
          <button
            type='button'
            onClick={onFormSwitch}
            className='font-bold uppercase text-strawberry-600 hover:text-strawberry-700'
          >
            S&apos;inscrire
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
