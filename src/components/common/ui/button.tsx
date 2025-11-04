'use client'

import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { type ThemeColor, type ButtonSize, type ButtonVariant } from '@/types'

function getSize (size?: ButtonSize): string {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base'
  }
  return sizes[size ?? 'md']
}

function getVariant (variant: ButtonVariant, color: ThemeColor, disabled: boolean): string {
  const baseClasses = 'font-normal rounded-xl inline-flex justify-center items-center transition-all duration-300 transform text-center'

  if (disabled) {
    return `${baseClasses} cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-200`
  }

  // Gestion des variantes spéciales (Google et GitHub)
  if (variant === 'google') {
    return `${baseClasses} bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 `
  }

  if (variant === 'github') {
    return `${baseClasses} bg-[#24292e] hover:bg-[#1a1e22] text-white border border-[#24292e] focus:ring-2 focus:ring-gray-500`
  }

  // Configuration des styles par couleur et variant avec vos couleurs principales
  const styleMap: Record<ThemeColor, Record<Exclude<ButtonVariant, 'google' | 'github'>, string>> = {
    blueberry: {
      primary: `${baseClasses} bg-blueberry-950 hover:bg-blueberry-900 text-white border-blueberry-950 focus:ring-blueberry-950`,
      secondary: `${baseClasses} bg-latte-25 hover:bg-latte-50 text-blueberry-950 border-latte-100 focus:ring-blueberry-950`,
      ghost: `${baseClasses} bg-white text-blueberry-950 border-1 focus:ring-blueberry-950 hover:bg-blueberry-50`,
      outline: `${baseClasses} bg-transparent border-1 hover:bg-latte-25 text-blueberry-950 border-latte-200 hover:border-blueberry-950 focus:ring-blueberry-950`
    },
    strawberry: {
      primary: `${baseClasses} bg-strawberry-400 hover:bg-strawberry-500 text-white border-strawberry-400 focus:ring-strawberry-400`,
      secondary: `${baseClasses} bg-strawberry-100 hover:bg-strawberry-200 text-strawberry-600 border-strawberry-100 focus:ring-strawberry-400`,
      ghost: `${baseClasses} bg-transparent hover:bg-strawberry-100 text-strawberry-600 border-transparent focus:ring-strawberry-400 border-1`,
      outline: `${baseClasses} bg-transparent border-1 hover:bg-latte-25 text-strawberry-600 border-strawberry-600 hover:border-strawberry-400 hover:text-strawberry-500 focus:ring-strawberry-400`
    },
    peach: {
      primary: `${baseClasses} bg-peach-100 hover:bg-peach-200 text-peach-800 border-peach-100 focus:ring-peach-100`,
      secondary: `${baseClasses} bg-peach-50 hover:bg-peach-100 text-peach-700 border-peach-50 focus:ring-peach-100`,
      ghost: `${baseClasses} bg-transparent hover:bg-peach-50 text-peach-700 border-transparent focus:ring-peach-100 border-1`,
      outline: `${baseClasses} bg-transparent hover:bg-peach-50 text-peach-700 border-peach-200 hover:border-peach-100 focus:ring-peach-100`
    },
    latte: {
      primary: `${baseClasses} bg-latte-50 hover:bg-latte-100 text-latte-900 border-latte-50 focus:ring-latte-50`,
      secondary: `${baseClasses} bg-latte-100 hover:bg-latte-200 text-latte-800 border-latte-100 focus:ring-latte-50`,
      ghost: `${baseClasses} bg-transparent hover:bg-latte-100 text-latte-800 border-transparent focus:ring-latte-50 border-1`,
      outline: `${baseClasses} bg-transparent hover:bg-latte-100 text-latte-800 border-latte-200 hover:border-latte-300 focus:ring-latte-50`
    }
  }

  return styleMap[color][variant]
}

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  size?: ButtonSize
  variant?: ButtonVariant
  disabled?: boolean
  color?: ThemeColor
  type?: 'button' | 'submit' | 'reset'
  className?: string
  iconBefore?: React.ComponentType<{ className?: string }>
  iconAfter?: React.ComponentType<{ className?: string }>
  iconCenter?: React.ComponentType<{ className?: string }>
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  color = 'strawberry',
  type = 'button',
  className = '',
  iconBefore: IconBefore,
  iconAfter: IconAfter,
  iconCenter: IconCenter
}: ButtonProps): React.ReactNode {
  // Gérer automatiquement les icônes pour les variantes spéciales
  const renderIcon = (): React.ReactNode => {
    if (variant === 'google') {
      return (
        <Image
          src='/assets/images/logo/google-favicon.svg'
          alt='Google'
          width={16}
          height={16}
          className='mr-2'
        />
      )
    }

    if (variant === 'github') {
      return <FaGithub className='mr-2' />
    }

    // Icônes personnalisées pour les autres variantes
    if (IconBefore != null) {
      return <IconBefore className='mr-2' />
    }

    return null
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${getSize(size)} ${getVariant(variant, color, disabled)} ${className}`}
    >
      {renderIcon()}
      {children}
      {(IconCenter != null) && <IconCenter className={`mx-2 ${className}`} />}
      {(IconAfter != null) && <IconAfter className='ml-2' />}
    </button>
  )
}

export default Button
