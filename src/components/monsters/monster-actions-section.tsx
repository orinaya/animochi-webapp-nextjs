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
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { applyMonsterAction } from '@/actions/monsters.action'
import { getActionXpReward } from '@/services/experience'
import type { Monster } from '@/types/monster'
import type { MonsterAction } from '@/types/monster-actions'
import LevelUpModal from './level-up-modal'

interface MonsterActionsSectionProps {
  /** Données du monstre */
  monster: Monster
  /** ID du monstre */
  monsterId: string
  /** Callback quand une action démarre */
  onActionStart?: (action: MonsterAction) => void
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
export default function MonsterActionsSection ({
  monster,
  monsterId,
  onActionStart
}: MonsterActionsSectionProps): React.ReactNode {
  const router = useRouter()
  const [loadingAction, setLoadingAction] = useState<MonsterAction | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number, levelsGained: number }>({ newLevel: 1, levelsGained: 0 })

  /**
   * Gère l'exécution d'une action
   */
  const handleAction = async (action: MonsterAction): Promise<void> => {
    setLoadingAction(action)

    // Déclencher l'animation sur l'avatar
    if (onActionStart !== null && onActionStart !== undefined) {
      onActionStart(action)
    }

    try {
      const result = await applyMonsterAction(monsterId, action)

      if (result.success) {
        // Afficher le toast de succès
        toast.success(result.message)

        // Si level up, afficher le modal après l'animation
        if (result.leveledUp) {
          setTimeout(() => {
            setLevelUpData({
              newLevel: result.newLevel,
              levelsGained: result.levelsGained
            })
            setShowLevelUp(true)
          }, 1500)
        }

        // Rafraîchir la page après l'animation pour mettre à jour l'état
        setTimeout(() => {
          router.refresh()
        }, result.leveledUp ? 1500 : 1000)
      } else {
        toast.warning(result.message)
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <>
      {/* Actions en ligne sans fond - pour intégration dans stats */}
      <div className='flex gap-2 justify-center flex-wrap'>
        {AVAILABLE_ACTIONS.map((actionConfig) => {
          const xpReward = getActionXpReward(actionConfig.action)
          return (
            <button
              key={actionConfig.action}
              onClick={() => { void handleAction(actionConfig.action) }}
              disabled={loadingAction !== null}
              className={`
                flex flex-col items-center justify-center
                bg-${actionConfig.color}-50 hover:bg-${actionConfig.color}-100
                rounded-xl px-3 py-2
                border-2 border-${actionConfig.color}-200 hover:border-${actionConfig.color}-300
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${loadingAction === actionConfig.action ? 'scale-95' : 'hover:scale-105'}
                min-w-[70px]
              `}
              title={`${actionConfig.description} (+${xpReward} XP)`}
            >
              <span className='text-2xl mb-1'>
                {actionConfig.emoji}
              </span>
              <span className='text-xs font-semibold text-blueberry-950'>
                {actionConfig.label}
              </span>
              <span className='text-[10px] text-strawberry-600 font-bold mt-0.5'>
                +{xpReward} XP
              </span>
            </button>
          )
        })}
      </div>

      {/* Modal de level up */}
      <LevelUpModal
        isOpen={showLevelUp}
        newLevel={levelUpData.newLevel}
        levelsGained={levelUpData.levelsGained}
        onClose={() => { setShowLevelUp(false) }}
      />
    </>
  )
}
