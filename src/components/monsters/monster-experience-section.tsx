/**
 * MonsterExperienceSection - Section d'expérience du monstre
 *
 * Affiche la progression vers le prochain niveau avec une barre de progression
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de l'expérience
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-experience-section
 */

'use client'

import ProgressBar from '@/components/ui/progress-bar'
import type { Monster } from '@/types/monster'

interface MonsterExperienceSectionProps {
  /** Données du monstre */
  monster: Monster
}

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 *
 * @param {number} experience - Expérience actuelle
 * @param {number} experienceToNextLevel - Expérience nécessaire pour le niveau suivant
 * @returns {number} Pourcentage de progression (0-100)
 */
function calculateProgressPercentage(
  experience: number | null | undefined,
  experienceToNextLevel: number | null | undefined
): number {
  const exp = experience ?? 0
  const expToNext = experienceToNextLevel ?? 150

  if (expToNext <= 0) return 100

  return Math.min(100, Math.round((exp / expToNext) * 100))
}

/**
 * Section d'expérience du monstre
 *
 * @param {MonsterExperienceSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section d'expérience
 */
export default function MonsterExperienceSection({
  monster
}: MonsterExperienceSectionProps): React.ReactNode {
  const experience = monster.experience ?? 0
  const experienceToNextLevel = monster.experienceToNextLevel ?? 150
  const progress = calculateProgressPercentage(experience, experienceToNextLevel)
  const nextLevel = (monster.level ?? 1) + 1

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg border border-latte-100'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-blueberry-950'>
          Progression
        </h2>
        <span className='text-sm text-latte-600'>
          Niveau {nextLevel}
        </span>
      </div>

      {/* Barre de progression */}
      <ProgressBar
        value={progress}
        variant='blueberry'
        size='lg'
        label={`${experience} / ${experienceToNextLevel} XP`}
        showLabel
        animated
      />

      {/* Informations additionnelles */}
      <div className='mt-4 flex justify-between text-sm text-latte-600'>
        <span>XP restante : {experienceToNextLevel - experience}</span>
        <span>{progress}%</span>
      </div>
    </div>
  )
}
