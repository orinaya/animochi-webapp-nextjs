export type ThemeColor =
  | 'blueberry'
  | 'strawberry'
  | 'peach'
  | 'latte'
  | 'success'
  | 'warning'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'google' | 'github'

// Export tous les types de monstre (Monster, MonsterState, etc.)
export * from './monster'
export * from './monster-actions'
export * from './gallery'

export type MonsterRarity = 'Commun' | 'Rare' | 'Épique' | 'Légendaire'

export interface SectionContentProps {
  title: string
  highlightedWords: string
  content: string
  alignment?: 'left' | 'center' | 'right'
  titleSize?: 'sm' | 'md' | 'lg' | 'xl'
  buttons?: React.ReactNode
  className?: string
  children?: React.ReactNode
}
