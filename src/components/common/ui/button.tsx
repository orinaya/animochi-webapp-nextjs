'use client'

import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { type ThemeColor, type ButtonSize, type ButtonVariant } from '@/types'

// Configuration centralisée des styles pour chaque couleur
interface ColorStateConfig {
  background: string
  hover: string
  text: string
  border: string
  focus: string
}

type ColorVariantConfig = Record<Exclude<ButtonVariant, 'google' | 'github'>, ColorStateConfig>

function getSize (size?: ButtonSize): string {
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-xl',
    xl: 'px-6 py-3 text-base rounded-xl'
  }
  return sizes[size ?? 'md']
}

function getColorVariants (color: ThemeColor): ColorVariantConfig {
  const colorConfigs: Record<ThemeColor, ColorVariantConfig> = {
    blueberry: {
      primary: {
        background: 'bg-blueberry-950',
        hover: 'hover:bg-blueberry-900',
        text: 'text-white',
        border: 'border-blueberry-950',
        focus: 'focus:ring-blueberry-950'
      },
      secondary: {
        background: 'bg-latte-25',
        hover: 'hover:bg-latte-50',
        text: 'text-blueberry-950',
        border: 'border-latte-100',
        focus: 'focus:ring-blueberry-950'
      },
      ghost: {
        background: 'bg-white',
        hover: 'hover:bg-blueberry-50',
        text: 'text-blueberry-950',
        border: 'border-transparent',
        focus: 'focus:ring-blueberry-950'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-latte-25 hover:border-blueberry-950',
        text: 'text-blueberry-950',
        border: 'border-latte-200',
        focus: 'focus:ring-blueberry-950'
      }
    },
    strawberry: {
      primary: {
        background: 'bg-strawberry-400',
        hover: 'hover:bg-strawberry-500',
        text: 'text-white',
        border: 'border-strawberry-400',
        focus: 'focus:ring-strawberry-400'
      },
      secondary: {
        background: 'bg-strawberry-100',
        hover: 'hover:bg-strawberry-200',
        text: 'text-strawberry-600',
        border: 'border-strawberry-100',
        focus: 'focus:ring-strawberry-400'
      },
      ghost: {
        background: 'bg-transparent',
        hover: 'hover:bg-strawberry-100',
        text: 'text-strawberry-600',
        border: 'border-transparent',
        focus: 'focus:ring-strawberry-400'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-strawberry-50 hover:border-strawberry-400 hover:text-strawberry-500',
        text: 'text-strawberry-600',
        border: 'border-strawberry-600',
        focus: 'focus:ring-strawberry-400'
      }
    },
    peach: {
      primary: {
        background: 'bg-peach-100',
        hover: 'hover:bg-peach-200',
        text: 'text-peach-800',
        border: 'border-peach-100',
        focus: 'focus:ring-peach-100'
      },
      secondary: {
        background: 'bg-peach-50',
        hover: 'hover:bg-peach-100',
        text: 'text-peach-700',
        border: 'border-peach-50',
        focus: 'focus:ring-peach-100'
      },
      ghost: {
        background: 'bg-transparent',
        hover: 'hover:bg-peach-50',
        text: 'text-peach-700',
        border: 'border-transparent',
        focus: 'focus:ring-peach-100'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-peach-50 hover:border-peach-100',
        text: 'text-peach-700',
        border: 'border-peach-200',
        focus: 'focus:ring-peach-100'
      }
    },
    latte: {
      primary: {
        background: 'bg-latte-50',
        hover: 'hover:bg-latte-100',
        text: 'text-latte-900',
        border: 'border-latte-50',
        focus: 'focus:ring-latte-50'
      },
      secondary: {
        background: 'bg-latte-100',
        hover: 'hover:bg-latte-200',
        text: 'text-latte-800',
        border: 'border-latte-100',
        focus: 'focus:ring-latte-50'
      },
      ghost: {
        background: 'bg-transparent',
        hover: 'hover:bg-latte-100',
        text: 'text-latte-800',
        border: 'border-transparent',
        focus: 'focus:ring-latte-50'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-latte-100 hover:border-latte-300',
        text: 'text-latte-800',
        border: 'border-latte-200',
        focus: 'focus:ring-latte-50'
      }
    },
    success: {
      primary: {
        background: 'bg-success-500',
        hover: 'hover:bg-success-600',
        text: 'text-white',
        border: 'border-success-500',
        focus: 'focus:ring-success-500'
      },
      secondary: {
        background: 'bg-success-100',
        hover: 'hover:bg-success-200',
        text: 'text-success-700',
        border: 'border-success-100',
        focus: 'focus:ring-success-500'
      },
      ghost: {
        background: 'bg-transparent',
        hover: 'hover:bg-success-100',
        text: 'text-success-600',
        border: 'border-transparent',
        focus: 'focus:ring-success-500'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-success-50 hover:border-success-500',
        text: 'text-success-600',
        border: 'border-success-600',
        focus: 'focus:ring-success-500'
      }
    },
    warning: {
      primary: {
        background: 'bg-warning-500',
        hover: 'hover:bg-warning-600',
        text: 'text-white',
        border: 'border-warning-500',
        focus: 'focus:ring-warning-500'
      },
      secondary: {
        background: 'bg-warning-100',
        hover: 'hover:bg-warning-200',
        text: 'text-warning-700',
        border: 'border-warning-100',
        focus: 'focus:ring-warning-500'
      },
      ghost: {
        background: 'bg-transparent',
        hover: 'hover:bg-warning-100',
        text: 'text-warning-600',
        border: 'border-transparent',
        focus: 'focus:ring-warning-500'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-warning-50 hover:border-warning-500',
        text: 'text-warning-600',
        border: 'border-warning-600',
        focus: 'focus:ring-warning-500'
      }
    },
    danger: {
      primary: {
        background: 'bg-danger-500',
        hover: 'hover:bg-danger-600',
        text: 'text-white',
        border: 'border-danger-500',
        focus: 'focus:ring-danger-500'
      },
      secondary: {
        background: 'bg-danger-100',
        hover: 'hover:bg-danger-200',
        text: 'text-danger-700',
        border: 'border-danger-100',
        focus: 'focus:ring-danger-500'
      },
      ghost: {
        background: 'bg-transparent',
        hover: 'hover:bg-danger-100',
        text: 'text-danger-600',
        border: 'border-transparent',
        focus: 'focus:ring-danger-500'
      },
      outline: {
        background: 'bg-transparent',
        hover: 'hover:bg-danger-50 hover:border-danger-500',
        text: 'text-danger-600',
        border: 'border-danger-600',
        focus: 'focus:ring-danger-500'
      }
    }
  }

  return colorConfigs[color]
}

function getVariant (variant: ButtonVariant, color: ThemeColor, disabled: boolean): string {
  const baseClasses = 'font-normal inline-flex justify-center items-center transition-all duration-300 transform text-center border-1'

  if (disabled) {
    return `${baseClasses} cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-200`
  }

  // Gestion des variantes spéciales (Google et GitHub)
  if (variant === 'google') {
    return `${baseClasses} bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400`
  }

  if (variant === 'github') {
    return `${baseClasses} bg-[#24292e] hover:bg-[#1a1e22] text-white border border-[#24292e] `
  }

  // Utilisation du système de configuration centralisé
  const colorVariants = getColorVariants(color)
  const config = colorVariants[variant]

  return `${baseClasses} ${config.background} ${config.hover} ${config.text} ${config.border} ${config.focus}`
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
