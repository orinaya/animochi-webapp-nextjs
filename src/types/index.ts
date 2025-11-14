import type {Monster} from "./monster"
export type ThemeColor =
  | "blueberry"
  | "strawberry"
  | "peach"
  | "latte"
  | "success"
  | "warning"
  | "danger"

export type ButtonSize = "sm" | "md" | "lg" | "xl"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "google" | "github"

// Export tous les types de monstre (Monster, MonsterState, etc.)
export * from "./monster"
export * from "./monster-actions"
export * from "./gallery"

export type MonsterRarity = "Commun" | "Rare" | "Épique" | "Légendaire"

export interface SectionContentProps {
  title: string
  highlightedWords: string
  content: string
  alignment?: "left" | "center" | "right"
  titleSize?: "sm" | "md" | "lg" | "xl"
  buttons?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export interface GameAction {
  id: string
  title: string
  description: string
  icon: string
  color: ThemeColor
}

export interface Benefit {
  id: string
  title: string
  description: string
  icon: string
  color: ThemeColor
}

export const monsters: Monster[] = [
  {
    id: "blubbi",
    name: "Blubbi",
    description: "Créature aquatique paisible qui adore nager et collectionner les perles bleues.",
    color: "blueberry",
    emoji: "🐙",
    rarity: "Commun",
  },
  {
    id: "strawbinx",
    name: "Strawbinx",
    description: "Petit monstre gourmand aux joues roses qui raffole des fruits sucrés.",
    color: "strawberry",
    emoji: "🍓",
    rarity: "Rare",
  },
  {
    id: "peachiko",
    name: "Peachiko",
    description: "Créature solaire énergique qui brille comme un petit soleil d'été.",
    color: "peach",
    emoji: "🌞",
    rarity: "Épique",
  },
  {
    id: "latteon",
    name: "Latteon",
    description: "Monstre mystique rare qui contrôle les énergies cosmiques.",
    color: "latte",
    emoji: "✨",
    rarity: "Légendaire",
  },
]
