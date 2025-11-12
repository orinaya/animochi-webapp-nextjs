'use client'

import React from 'react'

/**
 * Props pour le composant TextArea
 */
interface TextAreaProps {
  /** Nom du champ (pour formulaires) */
  name?: string
  /** Label affiché au-dessus du textarea */
  label?: string
  /** Valeur actuelle du textarea */
  value?: string
  /** Callback appelé lors du changement de valeur */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  /** Callback alternatif qui passe directement le texte */
  onChangeText?: (text: string) => void
  /** Texte d'aide affiché dans le textarea vide */
  placeholder?: string
  /** Indique si le champ est obligatoire */
  required?: boolean
  /** Indique si le champ est désactivé */
  disabled?: boolean
  /** Message d'erreur à afficher */
  error?: string
  /** Nombre de lignes visibles (hauteur) */
  rows?: number
  /** Nombre maximum de caractères autorisés */
  maxLength?: number
}

/**
 * Composant TextArea réutilisable
 *
 * Respecte le principe SRP : Gestion uniquement de l'affichage et saisie de texte multiligne
 * Respecte le principe OCP : Extensible via les props
 *
 * Suit le même pattern que InputField pour la cohérence de l'interface
 *
 * @param {TextAreaProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le textarea avec label et gestion d'erreurs
 *
 * @example
 * ```tsx
 * <TextArea
 *   label="Description"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   placeholder="Décrivez votre monstre..."
 *   maxLength={500}
 * />
 * ```
 */
function TextArea ({
  name,
  label,
  value,
  onChange,
  onChangeText,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 4,
  maxLength
}: TextAreaProps): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  const hasValue = value != null && value !== ''
  const hasError = error != null && error !== ''
  const characterCount = value?.length ?? 0

  return (
    <div className='relative mb-6'>
      <div className='flex items-center'>
        {label != null && (
          <label className='block text-sm font-medium text-blueberry-950 mb-3'>
            {label}
            {required && <span className='text-strawberry-600 text-xs'>!</span>}
          </label>
        )}
      </div>

      <div className='relative'>
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`
            peer w-full px-6 py-4 bg-latte-25 border-2 rounded-2xl 
            focus:outline-none transition-all duration-300 placeholder-transparent
            focus:bg-white focus:shadow-md resize-vertical
            ${hasError
              ? 'border-strawberry-400 focus:border-strawberry-500 bg-strawberry-50/30'
              : hasValue
                ? 'border-blueberry-950 focus:border-blueberry-900'
                : 'border-latte-200 focus:border-blueberry-950'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {placeholder != null && (
          <label className={`
            absolute left-6 transition-all duration-300 pointer-events-none
            ${hasValue || document?.activeElement === document?.querySelector(`textarea[name="${name ?? ''}"]`)
              ? 'top-2 text-xs text-blueberry-700'
              : 'top-4 text-base text-latte-500'
            }
          `}
          >
            {placeholder}
          </label>
        )}
      </div>

      <div className='flex justify-between items-center mt-2'>
        {hasError && (
          <p className='text-strawberry-600 text-xs'>{error}</p>
        )}

        {maxLength != null && (
          <p className={`text-xs ml-auto ${characterCount > maxLength * 0.9
            ? 'text-strawberry-600'
            : 'text-latte-500'
            }`}
          >
            {characterCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}

export default TextArea
