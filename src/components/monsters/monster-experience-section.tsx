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

import { FiTrendingUp } from 'react-icons/fi'
import type { Monster } from '@/types/monster/monster'
import { calculateTotalXpForLevel } from '@/services/experience-calculator.service'

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
  const nextLevel = currentLevel + 1

  // Calcul de l'XP acquise dans le niveau courant
  const totalXpForCurrentLevel = calculateTotalXpForLevel(currentLevel)
  const xpInCurrentLevel = Math.max(0, experience - totalXpForCurrentLevel)
  const remainingXP = Math.max(0, experienceToNextLevel - xpInCurrentLevel)

  // Calcul du pourcentage de progression dans le niveau courant
  const progress = Math.min(100, Math.max(0, Math.floor((xpInCurrentLevel / experienceToNextLevel) * 100)))

  return (
    <div className='relative bg-linear-to-br from-strawberry-100 via-strawberry-150 to-strawberry-200 rounded-3xl p-6 shadow-lg overflow-hidden border border-strawberry-300 pb-8'>
      {/* Effet de brillance en arrière-plan */}
      <div className='absolute inset-0 bg-linear-to-tr from-transparent via-white/40 to-transparent' />

      {/* Cercles décoratifs en arrière-plan */}
      <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/60 rounded-full blur-3xl' />
      <div className='absolute -bottom-10 -left-10 w-32 h-32 bg-strawberry-200/40 rounded-full blur-3xl' />

      <div className='relative z-10'>
        {/* En-tête avec niveau actuel et prochain niveau (inversé pour clarté) */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-strawberry-900 flex items-center gap-2'>
              <FiTrendingUp className='text-strawberry-700 text-3xl' />
              Progression
            </h2>
            <p className='text-sm text-strawberry-700 mt-1'>
              Niveau suivant : <span className='font-bold text-strawberry-800'>{nextLevel}</span>
            </p>
          </div>
          {/* Badge "Niveau actuel" */}
          <div className='text-right bg-white rounded-2xl px-4 py-3 border-2 border-yellow-300 shadow-xl relative animate-glow-gaming'>
            <span className='text-xs text-yellow-700 block font-bold tracking-wide drop-shadow'>Niveau actuel</span>
            <div className='text-4xl font-extrabold text-yellow-600 drop-shadow-lg flex items-center justify-end gap-2'>
              <span className='inline-block animate-bounce-slow'>⭐</span>
              {currentLevel}
            </div>
            {/* Glow animé autour du badge */}
            <span className='pointer-events-none absolute -inset-1 rounded-2xl border-4 border-yellow-200 opacity-60 blur-lg animate-pulse-gaming' />
          </div>
        </div>

        {/* Barre de progression avec style amélioré */}
        <div className='bg-white/60 backdrop-blur-sm rounded-full p-1.5 mb-4 border border-strawberry-300'>
          <div className='relative h-8 bg-strawberry-150 rounded-full overflow-hidden'>
            <div
              className='absolute inset-y-0 left-0 bg-linear-to-r from-strawberry-400 via-strawberry-500 to-strawberry-600 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3 shadow-md'
              style={{ width: `${progress}%` }}
            >
              {progress > 15 && (
                <span className='text-xs font-bold text-white drop-shadow-md'>
                  {progress}%
                </span>
              )}
            </div>
            {progress <= 15 && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-xs font-bold text-strawberry-500'>
                  {progress}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Informations XP */}
        <div className='flex justify-between items-center text-sm'>
          <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-strawberry-300 shadow-sm'>
            <span className='text-strawberry-700'>XP :</span>
            <span className='font-bold text-strawberry-800'>{xpInCurrentLevel} / {experienceToNextLevel}</span>
          </div>
          <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-strawberry-300 shadow-sm'>
            <span className='text-strawberry-700'>Restante :</span>
            <span className='font-bold text-strawberry-800'>{remainingXP} XP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
