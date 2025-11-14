
'use client'
import { getActionXpReward } from '@/services/experience'
import { REWARD_AMOUNTS, PENALTY_AMOUNTS } from '@/config/rewards'
import type { MonsterAction } from '@/types/monster-actions'

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

import React, { useState } from 'react'
import { walletEvents } from '@/lib/wallet-events'
import { FaHeart, FaSmile, FaBell, FaWalking, FaDumbbell } from 'react-icons/fa'
import { MdFastfood } from '@/components/icons/mdfastfood'

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
// import { applyMonsterAction } from '@/actions/monsters.action'

// Props explicites pour MonsterActionsSection
interface MonsterActionsSectionProps {
  monster: import('@/types/monster').Monster
  monsterId: string
  setMonster?: (monster: import('@/types/monster').Monster) => void
  onActionStart?: (action: MonsterAction) => void
  onActionDone?: () => void
}

interface ApiResponse {
  ok: boolean
  reward: number
  penalty: number
  matched: boolean
  expectedAction: MonsterAction
  xpGained?: number
  newLevel?: number
  leveledUp?: boolean
}

interface ActionConfig {
  action: MonsterAction
  icon: (props: { className?: string }) => React.ReactElement
  label: string
  description: string
  color: string // ex: 'strawberry', 'blueberry', 'peach', 'latte'
}

// Mapping front (labels/actions UI) -> backend (actions API)
const FRONT_TO_BACKEND_ACTION: Record<string, 'feed' | 'play' | 'heal'> = {
  feed: 'feed',
  hug: 'play',
  comfort: 'play',
  walk: 'play',
  train: 'play',
  wake: 'heal'
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
const MonsterActionsSection: React.FC<MonsterActionsSectionProps> = ({
  monster,
  monsterId,
  setMonster,
  onActionStart,
  onActionDone
}) => {
  const router = useRouter()
  const [loadingAction, setLoadingAction] = useState<MonsterAction | null>(null)
  // const [showLevelUp, setShowLevelUp] = useState(false)
  // const [levelUpData, setLevelUpData] = useState<{ newLevel: number, levelsGained: number }>({ newLevel: 1, levelsGained: 0 })

  /**
   * Gère l'exécution d'une action
   */
  // Mapping état -> action attendue (doit matcher le backend)
  const STATE_TO_ACTION: Record<string, string> = {
    hungry: 'feed',
    bored: 'play',
    sick: 'heal',
    happy: 'hug',
    sad: 'comfort',
    angry: 'hug',
    sleepy: 'wake'
  }

  const expectedAction = typeof monster.state === 'string' ? STATE_TO_ACTION[monster.state] : undefined

  const handleAction = async (action: MonsterAction): Promise<void> => {
    // Conversion action front -> backend
    const backendAction = FRONT_TO_BACKEND_ACTION[action] ?? 'feed'
    setLoadingAction(action)
    if (typeof onActionStart === 'function') {
      onActionStart(action)
    }
    try {
      // Appel sécurisé à la route API
      const res = await fetch(`/api/monsters/${monsterId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: backendAction, userId: monster.ownerId })
      })
      const result: ApiResponse = await res.json()
      if (result.ok && result.matched && result.reward > 0) {
        // Notifier tous les composants wallet (navbar, etc.)
        walletEvents.emit()
        toast.success(`+${result.reward} Animoney ! 🎉`)
        if (result.leveledUp === true && typeof result.newLevel === 'number' && result.newLevel > 0) {
          toast.info(`🎉 Ton monstre passe niveau ${result.newLevel} !`, { autoClose: 4000 })
        }
        // Mise à jour du monstre (XP/niveau réactif)
        if (typeof setMonster === 'function') {
          setMonster({
            ...monster,
            experience: (monster.experience ?? 0) + (result.xpGained ?? 0),
            level: result.newLevel ?? monster.level
          })
        }
      } else if (result.ok && !result.matched && result.penalty > 0) {
        walletEvents.emit()
        toast.error(`Mauvaise action ! -${result.penalty} Animoney. Action attendue : ${result.expectedAction}`)
      } else if (result.ok && !result.matched) {
        toast.info("Ce n'était pas l'action attendue pour l'état du monstre.")
      } else {
        toast.error('Erreur lors de l’action')
      }
      setTimeout(() => {
        if (typeof onActionDone === 'function') {
          onActionDone()
        }
        router.refresh()
      }, 1000)
    } catch (error) {
      toast.error('Erreur lors de l’action')
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
          const bg = `bg-${actionConfig.color}-100 hover:bg-${actionConfig.color}-200`
          const text = `text-${actionConfig.color}-800`
          const isExpected = expectedAction !== undefined && FRONT_TO_BACKEND_ACTION[actionConfig.action] === expectedAction
          // Montant animoney affiché
          const animoney = isExpected
            ? REWARD_AMOUNTS[FRONT_TO_BACKEND_ACTION[actionConfig.action] as keyof typeof REWARD_AMOUNTS] ?? 0
            : PENALTY_AMOUNTS[monster.state as keyof typeof PENALTY_AMOUNTS] ?? 0
          return (
            <div key={actionConfig.action} className='relative'>
              <button
                onClick={() => { void handleAction(actionConfig.action) }}
                disabled={loadingAction !== null}
                className={[
                  'flex flex-col justify-center items-center w-full',
                  bg,
                  'rounded-xl px-4 py-3',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  loadingAction === actionConfig.action ? 'scale-95' : 'hover:scale-105',
                  'min-h-[70px]',
                  isExpected ? 'ring-2 ring-blueberry-500 ring-offset-2 shadow-lg' : ''
                ].join(' ')}
                title={isExpected
                  ? `${actionConfig.description} (+${xpReward} XP, +${animoney} Animoney) — Action attendue !`
                  : `${actionConfig.description} (+0 XP, -${animoney} Animoney)`}
              >
                <span className={`mb-1 ${text}`}>
                  {actionConfig.icon({ className: `${text}` })}
                </span>
                <span className={`text-xs font-semibold ${text}`}>
                  {actionConfig.label}
                  {isExpected ? <span className='ml-2 px-2 py-0.5 rounded-full bg-blueberry-200 text-blueberry-900 text-[10px] font-bold animate-pulse'>Action attendue</span> : null}
                </span>
                <span className={`text-[10px] font-bold mt-0.5 ${text}`}>
                  {isExpected
                    ? `+${xpReward} XP, +${animoney}🪙`
                    : `+0 XP, -${animoney}🪙`}
                </span>
              </button>
              {/* Plus d’aide contextuelle textuelle, uniquement le badge visuel */}
            </div>
          )
        })}
      </div>

      {/* Modal de level up */}
      {/* Modal de level up désactivé (code mort) */}
      {/* <LevelUpModal
        isOpen={showLevelUp}
        newLevel={levelUpData.newLevel}
        levelsGained={levelUpData.levelsGained}
        onClose={() => { setShowLevelUp(false) }}
      /> */}
    </>
  )
}

export default MonsterActionsSection
