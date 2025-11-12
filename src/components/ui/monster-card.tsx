/**
 * Composant MonsterCard - Carte d'affichage d'un monstre
 *
 * @module components/ui/monster-card
 */

import type { Monster, MonsterState } from '@/types/monster'
import ProgressBar from './progress-bar'

/**
 * Props du composant MonsterCard
 */
interface MonsterCardProps {
  /** Données du monstre à afficher */
  monster: Monster
  /** Callback lors du clic sur la carte */
  onClick?: () => void
  /** Classe CSS additionnelle */
  className?: string
}

/**
 * Configuration des badges d'état du monstre
 * Respecte SRP : Responsabilité unique de mapping état → apparence
 *
 * Couleurs :
 * - happy = vert
 * - sad = bleu
 * - angry = rouge
 * - hungry = jaune
 * - sleepy = violet
 */
const STATE_CONFIG: Record<MonsterState, { label: string, emoji: string, className: string }> = {
  happy: {
    label: 'Heureux',
    emoji: '😊',
    className: 'bg-green-100 text-green-700 border-green-300'
  },
  sad: {
    label: 'Triste',
    emoji: '😢',
    className: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  angry: {
    label: 'En colère',
    emoji: '😠',
    className: 'bg-red-100 text-red-700 border-red-300'
  },
  hungry: {
    label: 'Affamé',
    emoji: '🍖',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  },
  sleepy: {
    label: 'Endormi',
    emoji: '😴',
    className: 'bg-purple-100 text-purple-700 border-purple-300'
  }
}

/**
 * Badge d'état du monstre
 * Respecte SRP : Affiche uniquement l'état
 */
function StateBadge ({ state }: { state: MonsterState }): React.ReactNode {
  const config = STATE_CONFIG[state]

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  )
}

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 * Respecte SRP : Responsabilité unique de calcul de progression
 *
 * @param {number} experience - Expérience actuelle
 * @param {number} experienceToNextLevel - Expérience requise pour le niveau suivant
 * @returns {number} Pourcentage de progression (0-100)
 */
function calculateProgressPercentage (experience: number, experienceToNextLevel: number): number {
  if (experienceToNextLevel <= 0) return 0
  return Math.min(Math.round((experience / experienceToNextLevel) * 100), 100)
}

/**
 * Section de progression du niveau
 * Respecte SRP : Affiche uniquement la progression de niveau
 */
function LevelProgress ({ level, experience, experienceToNextLevel }: {
  level: number
  experience: number
  experienceToNextLevel: number
}): React.ReactNode {
  const percentage = calculateProgressPercentage(experience, experienceToNextLevel)

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm'>
        <span className='font-semibold text-blueberry-950'>Niveau {level}</span>
        <span className='text-xs text-latte-600'>
          {experience} / {experienceToNextLevel} XP
        </span>
      </div>
      <ProgressBar
        value={percentage}
        size='md'
        variant='blueberry'
        animated
      />
    </div>
  )
}

/**
 * Composant MonsterCard - Carte d'affichage complète d'un monstre
 *
 * Affiche :
 * - Nom du monstre
 * - Image SVG du monstre
 * - Badge d'état (happy, angry, sad, etc.)
 * - Niveau avec barre de progression
 *
 * Respecte le principe SRP : Affichage uniquement des informations d'un monstre
 * Respecte le principe OCP : Extensible via props et composition
 *
 * @param {MonsterCardProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Une carte de monstre stylisée
 *
 * @example
 * ```tsx
 * <MonsterCard
 *   monster={monster}
 *   onClick={() => console.log('Monstre cliqué')}
 * />
 * ```
 */
export default function MonsterCard ({ monster, onClick, className = '' }: MonsterCardProps): React.ReactNode {
  const level = monster.level ?? 1
  const experience = monster.experience ?? 0
  const experienceToNextLevel = monster.experienceToNextLevel ?? 150
  const state = (monster.state ?? 'happy') as MonsterState

  return (
    <div
      className={`
        bg-white rounded-2xl p-6 shadow-md
        hover:shadow-lg hover:border-blueberry-300
        transition-all duration-300 ease-in-out
        cursor-pointer group
        ${className}
      `}
      onClick={onClick}
    >
      {/* En-tête avec nom à gauche et badge à droite */}
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-bold text-blueberry-950'>
          {monster.name}
        </h3>
        <StateBadge state={state} />
      </div>

      {/* Image SVG du monstre */}
      <div className='flex justify-center mb-6'>
        <div
          className='w-40 h-40 p-4 flex items-center justify-center bg-linear-to-br from-blueberry-50 to-strawberry-50 rounded-2xl group-hover:scale-105 transition-transform duration-300'
          dangerouslySetInnerHTML={{ __html: monster.draw ?? '<svg></svg>' }}
        />
      </div>

      {/* Progression de niveau */}
      <LevelProgress
        level={level}
        experience={experience}
        experienceToNextLevel={experienceToNextLevel}
      />
    </div>
  )
}
