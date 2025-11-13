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
import { FaHeart, FaSmile, FaBell, FaWalking, FaDumbbell } from 'react-icons/fa'
import { MdFastfood } from '@/components/icons/mdfastfood'
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

interface ActionConfig {
  action: MonsterAction
  icon: (props: { className?: string }) => React.ReactElement
  label: string
  description: string
  color: string // ex: 'strawberry', 'blueberry', 'peach', 'latte'
}

const AVAILABLE_ACTIONS: ActionConfig[] = [
  {
    action: 'hug',
    icon: (props) => <FaHeart {...props} />,
    label: 'Câliner',
    description: 'Faire un câlin à votre monstre',
    color: 'strawberry'
  },
  {
    action: 'feed',
    icon: (props) => <MdFastfood {...props} />,
    label: 'Nourrir',
    description: 'Donner à manger',
    color: 'peach'
  },
  {
    action: 'comfort',
    icon: (props) => <FaSmile {...props} />,
    label: 'Consoler',
    description: 'Réconforter votre monstre',
    color: 'blueberry'
  },
  {
    action: 'wake',
    icon: (props) => <FaBell {...props} />,
    label: 'Réveiller',
    description: 'Réveiller en douceur',
    color: 'latte'
  },
  {
    action: 'walk',
    icon: (props) => <FaWalking {...props} />,
    label: 'Promener',
    description: 'Faire une promenade',
    color: 'blueberry'
  },
  {
    action: 'train',
    icon: (props) => <FaDumbbell {...props} />,
    label: 'Entraîner',
    description: 'Session d\'entraînement',
    color: 'strawberry'
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
      {/* Actions en grille responsive 3 colonnes, boutons larges */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 w-full h-fit'>
        {AVAILABLE_ACTIONS.map((actionConfig) => {
          const xpReward = getActionXpReward(actionConfig.action)
          // Palette pastel : fond clair, texte/icône foncé
          const bg = `bg-${actionConfig.color}-100 hover:bg-${actionConfig.color}-200`
          const text = `text-${actionConfig.color}-800`
          return (
            <button
              key={actionConfig.action}
              onClick={() => { void handleAction(actionConfig.action) }}
              disabled={loadingAction !== null}
              className={[
                'flex flex-col justify-center items-center w-full',
                bg,
                'rounded-xl px-4 py-3',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                loadingAction === actionConfig.action ? 'scale-95' : 'hover:scale-105',
                'min-h-[70px]'
              ].join(' ')}
              title={`${actionConfig.description} (+${xpReward} XP)`}
            >
              <span className={`mb-1 ${text}`}>
                {actionConfig.icon({ className: `${text}` })}
              </span>
              <span className={`text-xs font-semibold ${text}`}>
                {actionConfig.label}
              </span>
              <span className={`text-[10px] font-bold mt-0.5 ${text}`}>
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
