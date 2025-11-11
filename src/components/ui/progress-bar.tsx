/**
 * Composant ProgressBar - Barre de progression réutilisable
 *
 * @module components/ui/progress-bar
 */

/**
 * Tailles disponibles pour la barre de progression
 */
type ProgressBarSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Variantes visuelles de la barre de progression
 */
type ProgressBarVariant = 'blueberry' | 'strawberry' | 'peach' | 'latte' | 'default'

/**
 * Props du composant ProgressBar
 */
interface ProgressBarProps {
  /** Pourcentage de progression (0-100) */
  value: number
  /** Taille de la barre */
  size?: ProgressBarSize
  /** Variante de couleur */
  variant?: ProgressBarVariant
  /** Afficher le pourcentage en texte */
  showLabel?: boolean
  /** Label personnalisé (ex: "120 / 150 XP") */
  label?: string
  /** Classe CSS additionnelle */
  className?: string
  /** Animation de pulsation lors de changement */
  animated?: boolean
}

/**
 * Retourne la classe CSS correspondant à la taille de la barre
 *
 * Respecte SRP : Responsabilité unique de mapping taille → classe
 *
 * @param {ProgressBarSize} size - Taille souhaitée
 * @returns {string} Classes CSS Tailwind
 */
function getSize (size: ProgressBarSize): string {
  const sizes: Record<ProgressBarSize, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
    xl: 'h-5'
  }

  return sizes[size]
}

/**
 * Retourne la classe CSS correspondant à la variante de couleur
 *
 * Respecte SRP : Responsabilité unique de mapping variante → classe
 *
 * @param {ProgressBarVariant} variant - Variante souhaitée
 * @returns {string} Classes CSS Tailwind
 */
function getVariant (variant: ProgressBarVariant): string {
  const variants: Record<ProgressBarVariant, string> = {
    blueberry: 'bg-blueberry-500',
    strawberry: 'bg-strawberry-500',
    peach: 'bg-peach-500',
    latte: 'bg-latte-500',
    default: 'bg-blueberry-500'
  }

  return variants[variant]
}

/**
 * Composant ProgressBar - Barre de progression réutilisable
 *
 * Composant UI générique pour afficher une progression (XP, santé, etc.)
 *
 * Caractéristiques :
 * - Multiples tailles et couleurs
 * - Animation optionnelle
 * - Label personnalisable
 * - Responsive et accessible
 *
 * Respecte le principe SRP : Affichage uniquement de progression
 * Respecte le principe OCP : Extensible via props sans modification
 *
 * @param {ProgressBarProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Une barre de progression stylisée
 *
 * @example
 * ```tsx
 * // Simple
 * <ProgressBar value={75} />
 *
 * // Avec label et couleur
 * <ProgressBar
 *   value={60}
 *   variant="peach"
 *   label="120 / 200 XP"
 *   showLabel
 * />
 *
 * // Grande et animée
 * <ProgressBar
 *   value={90}
 *   size="xl"
 *   variant="strawberry"
 *   animated
 * />
 * ```
 */
function ProgressBar ({
  value,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className = '',
  animated = false
}: ProgressBarProps): React.ReactNode {
  // Validation : clamp value entre 0 et 100
  const clampedValue = Math.min(100, Math.max(0, value))

  // Classes pour le conteneur
  const containerClasses = [
    'w-full bg-latte-100 rounded-full overflow-hidden',
    getSize(size),
    className
  ].filter(Boolean).join(' ')

  // Classes pour la barre de progression
  const barClasses = [
    'h-full transition-all duration-500 ease-out rounded-full',
    getVariant(variant),
    animated && clampedValue < 100 ? 'animate-pulse' : ''
  ].filter(Boolean).join(' ')

  // Label à afficher
  const displayLabel = label ?? `${clampedValue}%`

  return (
    <div className='w-full space-y-2'>
      {/* Label optionnel au-dessus de la barre */}
      {showLabel && (
        <div className='flex justify-between items-center text-sm font-medium text-latte-700'>
          <span>{displayLabel}</span>
        </div>
      )}

      {/* Conteneur de la barre */}
      <div className={containerClasses} role='progressbar' aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100}>
        {/* Barre de progression remplie */}
        <div
          className={barClasses}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
