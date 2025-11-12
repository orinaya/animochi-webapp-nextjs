/**
 * MonsterStatsSection - Section des statistiques du monstre
 *
 * Affiche les stats émotionnelles du monstre (bonheur, tristesse, etc.)
 * basées sur son état actuel
 *
 * Respecte le principe SRP : Gère uniquement l'affichage des stats
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-stats-section
 */

'use client'

import type { Monster, MonsterState } from '@/types/monster'

interface MonsterStatsSectionProps {
  /** Données du monstre */
  monster: Monster
}

/**
 * Configuration d'une stat émotionnelle
 */
interface StatConfig {
  id: string
  label: string
  emoji: string
  color: string
  bgColor: string
}

/**
 * Retourne les stats émotionnelles basées sur l'état du monstre
 *
 * @param {string | null} state - État actuel du monstre
 * @returns {StatConfig[]} Configuration des stats avec valeurs
 */
function getEmotionalStats(state: string | null): Array<StatConfig & { value: number }> {
  const currentState = (state ?? 'happy') as MonsterState

  // Valeurs de base pour chaque stat
  const baseStats: Record<string, StatConfig & { value: number }> = {
    happy: {
      id: 'happiness',
      label: 'Bonheur',
      emoji: '😊',
      color: 'text-peach-600',
      bgColor: 'bg-peach-100',
      value: 50
    },
    sad: {
      id: 'sadness',
      label: 'Tristesse',
      emoji: '😢',
      color: 'text-blueberry-600',
      bgColor: 'bg-blueberry-100',
      value: 50
    },
    hungry: {
      id: 'hunger',
      label: 'Faim',
      emoji: '🍎',
      color: 'text-strawberry-600',
      bgColor: 'bg-strawberry-100',
      value: 50
    },
    sleepy: {
      id: 'energy',
      label: 'Énergie',
      emoji: '⚡',
      color: 'text-peach-600',
      bgColor: 'bg-peach-100',
      value: 50
    }
  }

  // Ajuster les valeurs selon l'état actuel
  const stats = { ...baseStats }

  switch (currentState) {
    case 'happy':
      stats.happy.value = 100
      stats.sad.value = 0
      break
    case 'sad':
      stats.sad.value = 100
      stats.happy.value = 20
      break
    case 'angry':
      stats.sad.value = 80
      stats.happy.value = 10
      break
    case 'hungry':
      stats.hungry.value = 100
      stats.happy.value = 30
      break
    case 'sleepy':
      stats.sleepy.value = 20
      stats.happy.value = 40
      break
  }

  return Object.values(stats)
}

/**
 * Section des statistiques émotionnelles du monstre
 *
 * @param {MonsterStatsSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section des stats
 */
export default function MonsterStatsSection({
  monster
}: MonsterStatsSectionProps): React.ReactNode {
  const stats = getEmotionalStats(monster.state ?? null)

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg border border-latte-100'>
      <h2 className='text-xl font-bold text-blueberry-950 mb-4'>
        État émotionnel
      </h2>

      <div className='grid grid-cols-2 gap-4'>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className='flex flex-col'
          >
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-2'>
                <span className='text-2xl'>{stat.emoji}</span>
                <span className='text-sm font-semibold text-latte-700'>
                  {stat.label}
                </span>
              </div>
              <span className={`text-sm font-bold ${stat.color}`}>
                {stat.value}%
              </span>
            </div>

            {/* Barre de progression pour chaque stat */}
            <div className='w-full bg-latte-100 rounded-full h-2.5 overflow-hidden'>
              <div
                className={`h-full rounded-full transition-all duration-500 ${stat.bgColor}`}
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
