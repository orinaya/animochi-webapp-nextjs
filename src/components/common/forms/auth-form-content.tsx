'use client'

import { useState } from 'react'
import Image from 'next/image'
import SignInForm from './signin-form'
import SignUpForm from './signup-form'
import ErrorMessage from '../error-message'
// import ImageAnimochi from '../../../../public/assets/images/sign-in/animochi-signin.png'

function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const handleAuthError = (errorMessage: string): void => {
    setError(errorMessage)
  }

  const handleFormSwitch = (): void => {
    setIsSignIn(!isSignIn)
    setError('') // Clear errors when switching forms
  }

  return (
    <div className='w-full h-screen relative bg-latte-50 overflow-hidden flex flex-col lg:flex-row gap-6 p-6'>
      {/* Section Image à gauche - cachée sur mobile */}
      <div className='hidden lg:flex lg:flex-3 items-center justify-center rounded-2xl'>
        {/* <div className='rounded-[20px] w-full h-full flex items-center justify-center p-3.5'> */}
        <Image
          src='/assets/images/sign-in/animochi-signin.jpg'
          alt='Animochi creatures'
          width={776}
          height={900}
          className='w-full h-full object-cover rounded-2xl object-bottom'
          priority
          quality={100}
          sizes='(max-width: 1024px) 100vw, 60vw'
        />
        {/* </div> */}
      </div>

      {/* Section Formulaire à droite - pleine largeur sur mobile */}
      <div className='w-full lg:flex-2 flex items-center justify-center p-4 lg:p-8 bg-white rounded-2xl'>
        <div className='w-full max-w-md justify-center flex flex-col'>
          <div className='mb-8 text-center'>
            <div className='flex justify-center mb-4'>
              <Image
                src='/animochi-line.svg'
                alt='Animochi Logo'
                width={150}
                height={50}
                className='mb-4 justify-center'
                priority
              />
            </div>
            <h1 className='text-2xl lg:text-4xl font-medium text-blueberry-950 mb-2'>
              {isSignIn ? 'Connexion à votre compte' : 'Créer votre compte'}
            </h1>
            <p className='text-md text-blueberry-950'>
              {isSignIn
                ? 'Heureux de vous revoir ! Choisissez une méthode de connexion :'
                : 'Rejoignez Animochi et découvrez des créatures magiques !'}
            </p>
          </div>

          <ErrorMessage message={error} />

          {isSignIn
            ? (
              <SignInForm onError={handleAuthError} onFormSwitch={handleFormSwitch} />
              )
            : (
              <SignUpForm onError={handleAuthError} onFormSwitch={handleFormSwitch} />
              )}
        </div>
      </div>
    </div>
  )
}

export default AuthFormContent
