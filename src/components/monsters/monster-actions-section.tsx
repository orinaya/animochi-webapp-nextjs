/**
 * MonsterActionsSection - Section des actions du monstre
 *
 * Affiche tous les boutons d'action permettant d'interagir avec le monstre
 * (câliner, nourrir, consoler, réveiller, promener, entraîner)
 *
 * Respecte le principe SRP : Gère uniquement l'affichage des actions
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-actions-section
 */

'use client'

import { useState } from 'react'
import type { Monster } from '@/types/monster'
import type { MonsterAction } from '@/types/monster-actions'

interface MonsterActionsSectionProps {
  /** Données du monstre */
  monster: Monster
  /** ID du monstre */
  monsterId: string
}

/**
 * Configuration d'une action disponible
 */
interface ActionConfig {
  action: MonsterAction
  emoji: string
  label: string
  color: 'blueberry' | 'strawberry' | 'peach' | 'latte'
  description: string
}

/**
 * Liste des actions disponibles
 */
const AVAILABLE_ACTIONS: ActionConfig[] = [
  {
    action: 'hug',
    emoji: '🤗',
    label: 'Câliner',
    color: 'peach',
    description: 'Faire un câlin à votre monstre'
  },
  {
    action: 'feed',
    emoji: '🍎',
    label: 'Nourrir',
    color: 'strawberry',
    description: 'Donner à manger'
  },
  {
    action: 'comfort',
    emoji: '💙',
    label: 'Consoler',
    color: 'blueberry',
    description: 'Réconforter votre monstre'
  },
  {
    action: 'wake',
    emoji: '⏰',
    label: 'Réveiller',
    color: 'peach',
    description: 'Réveiller en douceur'
  },
  {
    action: 'walk',
    emoji: '🚶',
    label: 'Promener',
    color: 'blueberry',
    description: 'Faire une promenade'
  },
  {
    action: 'train',
    emoji: '💪',
    label: 'Entraîner',
    color: 'strawberry',
    description: 'Session d\'entraînement'
  }
]

/**
 * Section des actions du monstre
 *
 * @param {MonsterActionsSectionProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La section des actions
 */
export default function MonsterActionsSection({
  monster,
  monsterId
}: MonsterActionsSectionProps): React.ReactNode {
  const [loadingAction, setLoadingAction] = useState<MonsterAction | null>(null)

  /**
   * Gère l'exécution d'une action
   */
  const handleAction = async (action: MonsterAction): Promise<void> => {
    setLoadingAction(action)

    try {
      // TODO: Implémenter l'appel API pour exécuter l'action
      console.log(`Action ${action} sur monstre ${monsterId}`)

      // Simulation temporaire
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg border border-latte-100'>
      <h2 className='text-xl font-bold text-blueberry-950 mb-4'>
        Actions
      </h2>

      <p className='text-sm text-latte-600 mb-6'>
        Interagissez avec votre monstre pour le rendre heureux et gagner de l'expérience
      </p>

      {/* Grille d'actions */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        {AVAILABLE_ACTIONS.map((actionConfig) => (
          <button
            key={actionConfig.action}
            onClick={() => { void handleAction(actionConfig.action) }}
            disabled={loadingAction !== null}
            className={`
              flex flex-col items-center justify-center
              bg-latte-25 hover:bg-${actionConfig.color}-50
              rounded-2xl p-6
              border-2 border-latte-200 hover:border-${actionConfig.color}-300
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${loadingAction === actionConfig.action ? 'scale-95' : 'hover:scale-105'}
            `}
          >
            <span className='text-4xl mb-2'>
              {actionConfig.emoji}
            </span>
            <span className='text-sm font-semibold text-blueberry-950 mb-1'>
              {actionConfig.label}
            </span>
            <span className='text-xs text-latte-500 text-center'>
              {actionConfig.description}
            </span>
            {loadingAction === actionConfig.action && (
              <span className='text-xs text-latte-400 mt-2'>
                ⏳
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
