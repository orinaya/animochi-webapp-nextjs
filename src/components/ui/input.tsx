'use client'

import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

interface InputFieldProps {
  type: string
  name?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rightIcon?: React.ComponentType<{ className?: string }>
  leftIcon?: React.ComponentType<{ className?: string }>
}

function InputField ({
  type,
  name,
  label,
  value,
  onChange,
  onChangeText,
  placeholder,
  required = false,
  disabled = false,
  error,
  rightIcon: RightIcon,
  leftIcon: LeftIcon
}: InputFieldProps): React.ReactNode {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  const inputType = isPasswordType && showPassword ? 'text' : type

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
  }

  const hasValue = value != null && value !== ''
  const hasError = error != null && error !== ''

  return (
    <div className='relative mb-6'>
      <div className=' flex items-center'>
        {LeftIcon != null && (
          <div className='absolute left-4 top-1/2 -translate-y-1/2'>
            <LeftIcon className='w-5 h-5 text-strawberry-400' />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
          peer w-full py-4 bg-latte-25 border-2 rounded-xl
          focus:outline-none transition-all duration-300 placeholder-transparent
          focus:bg-white focus:shadow-md         
          ${LeftIcon != null ? 'pl-12' : 'pl-6'}
          ${RightIcon != null || isPasswordType ? 'pr-12' : 'pr-6'}
          ${hasError
              ? 'border-strawberry-300 focus:border-strawberry-400 bg-strawberry-25'
              : hasValue
                ? 'border-strawberry-400 focus:border-strawberry-500'
                : 'border-latte-50 focus:border-strawberry-500 hover:border-strawberry-300'
            }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        />
        {/* Icône de droite - soit l'icône personnalisée, soit l'icône d'œil pour password */}
        {isPasswordType
          ? (
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='cursor-pointer absolute right-5 hover:scale-110 transition-transform duration-200'
            >
              {showPassword
                ? (
                  <FiEyeOff className='w-5 h-5 text-latte-700 hover:text-blueberry-950' />
                  )
                : (
                  <FiEye className='w-5 h-5 text-latte-700 hover:text-blueberry-950' />
                  )}
            </button>
            )
          : (
              RightIcon != null && (
                <button type='button' className='cursor-pointer absolute right-5'>
                  <RightIcon className='w-4 h-4 text-latte-700' />
                </button>
              )
            )}

        {label != null && (
          <label
            htmlFor={name}
            className={`
            absolute transition-all duration-300 pointer-events-none bg-latte-25
            ${LeftIcon != null ? 'left-12' : 'left-6'}
            ${hasValue || placeholder != null
                ? '-top-3 text-sm px-3 rounded-full'
                : 'top-4 text-base'
              }
            peer-focus:-top-3 peer-focus:text-sm peer-focus:px-3 peer-focus:bg-white peer-focus:rounded-full
            ${hasError
                ? 'text-strawberry-600 peer-focus:text-strawberry-600'
                : hasValue
                  ? 'text-blueberry-950/90 peer-focus:text-blueberry-950'
                  : 'text-blueberry-950/60 peer-focus:text-blueberry-950'
              }
          `}
          >
            {label}
            {required && <span className='text-strawberry-400 ml-1'>*</span>}
          </label>
        )}

        {hasError && (
          <p className='mt-2 text-sm text-strawberry-600 flex items-center gap-2'>
            <span className='w-4 h-4 bg-strawberry-100 rounded-full flex items-center justify-center'>
              <span className='text-strawberry-600 text-xs'>!</span>
            </span>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default InputField
