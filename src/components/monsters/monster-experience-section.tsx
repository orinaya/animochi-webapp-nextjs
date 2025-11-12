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
import { calculateLevelProgress, calculateTotalXpForLevel } from '@/services/experience'
import type { Monster } from '@/types/monster'

interface MonsterExperienceSectionProps {
  /** Données du monstre */
  monster: Monster
}

/**
 * Section d'expérience du monstre
 *
 * @param {MonsterExperienceSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section d'expérience
 */
export default function MonsterExperienceSection ({
  monster
}: MonsterExperienceSectionProps): React.ReactNode {
  const currentLevel = monster.level ?? 1
  const experience = monster.experience ?? 0
  const experienceToNextLevel = monster.experienceToNextLevel ?? 150

  // Utiliser le service de calcul d'XP pour calculer la progression réelle
  const progress = calculateLevelProgress(experience, currentLevel)

  const nextLevel = currentLevel + 1

  // Calculer l'XP dans le niveau actuel
  const xpForCurrentLevel = calculateTotalXpForLevel(currentLevel)
  const xpInCurrentLevel = experience - xpForCurrentLevel
  const remainingXP = experienceToNextLevel - xpInCurrentLevel

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg border border-latte-100'>
      {/* En-tête avec niveau actuel et prochain niveau */}
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-xl font-bold text-blueberry-950'>
            Progression
          </h2>
          <p className='text-sm text-latte-600 mt-1'>
            Niveau actuel : <span className='font-semibold text-blueberry-700'>{currentLevel}</span>
          </p>
        </div>
        <div className='text-right'>
          <span className='text-sm text-latte-600'>Niveau suivant</span>
          <div className='text-2xl font-bold text-blueberry-950'>
            {nextLevel}
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <ProgressBar
        value={progress}
        variant='blueberry'
        size='lg'
        label={`${xpInCurrentLevel} / ${experienceToNextLevel} XP`}
        showLabel
        animated
      />

      {/* Informations additionnelles */}
      <div className='mt-4 flex justify-between text-sm text-latte-600'>
        <span>
          XP restante : <span className='font-semibold text-strawberry-600'>{remainingXP}</span>
        </span>
        <span className='font-semibold text-blueberry-700'>{progress}%</span>
      </div>
    </div>
  )
}
