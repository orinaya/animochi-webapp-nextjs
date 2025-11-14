/**
 * QuestsModal - Modal affichant les quêtes journalières
 * Component UI moderne avec animations et récupération de récompenses
 */

'use client'

import { useEffect, useState } from 'react'
import type { QuestProgress } from '@/domain/entities/quest-progress.entity'
import { QuestStatus } from '@/domain/entities/quest-progress.entity'
import { getDailyQuests, resetUserDailyQuests } from '@/actions/quests.actions'
import { FiX, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi'
import { QuestProgressBar } from './quest-progress-bar'
import { walletEvents } from '@/lib/wallet-events'
import { WalletHeaderDisplay } from '@/components/wallet/wallet-header-display'

interface QuestsModalProps {
  isOpen: boolean
  onClose: () => void
  onQuestClaimed?: () => void
}

export function QuestsModal ({ isOpen, onClose, onQuestClaimed }: QuestsModalProps): React.ReactElement | null {
  const [quests, setQuests] = useState<Array<QuestProgress & {
    questTitle: string
    questDescription: string
    questIcon: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [claimingQuest, setClaimingQuest] = useState<string | null>(null)
  const [justClaimedQuest, setJustClaimedQuest] = useState<string | null>(null)

  const loadQuests = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await getDailyQuests()
      if (data != null) {
        setQuests(data)
      }
    } catch (error) {
      console.error('Error loading quests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshQuests = async (): Promise<void> => {
    try {
      setLoading(true)
      console.log('🔄 [QuestsModal] Resetting and refreshing quests...')

      // Réinitialiser les quêtes (les supprimer et en créer de nouvelles)
      const resetResult = await resetUserDailyQuests()

      if (resetResult.success) {
        console.log('🔄 [QuestsModal] Quests reset successfully, loading new quests...')
        // Recharger les nouvelles quêtes
        await loadQuests()
        // Notifier le parent pour mettre à jour le badge
        onQuestClaimed?.()
      } else {
        console.error('🔄 [QuestsModal] Failed to reset quests:', resetResult.message)
      }
    } catch (error) {
      console.error('🔄 [QuestsModal] Error refreshing quests:', error)
    }
  }

  useEffect(() => {
    if (isOpen) {
      void loadQuests()
    }
  }, [isOpen])

  const handleClaimReward = async (questId: string): Promise<void> => {
    console.log('🎯 [QuestsModal] Claiming reward for quest:', questId)
    setClaimingQuest(questId)
    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { claimQuestReward } = await import('@/actions/quests.actions')
      console.log('🎯 [QuestsModal] Calling claimQuestReward...')
      const result = await claimQuestReward(questId)
      console.log('🎯 [QuestsModal] Result:', result)

      if (result.success) {
        console.log('🎯 [QuestsModal] Success! Showing animation...')

        // 1. Arrêter le spinner de chargement
        setClaimingQuest(null)

        // 2. Déclencher l'animation d'étoiles
        setJustClaimedQuest(questId)

        // 3. Émettre un événement pour rafraîchir le wallet immédiatement
        walletEvents.emit()

        // 4. Notifier le parent immédiatement (pour mettre à jour le badge)
        onQuestClaimed?.()

        // 5. Attendre la fin de l'animation (2 secondes) avant de recharger
        setTimeout(() => {
          setJustClaimedQuest(null)
          // Recharger les quêtes pour mettre à jour l'affichage
          void loadQuests()
        }, 2000)
      } else {
        console.error('🎯 [QuestsModal] Failed:', result.message)
        setClaimingQuest(null)
      }
    } catch (error) {
      console.error('🎯 [QuestsModal] Error claiming reward:', error)
      setClaimingQuest(null)
    }
  }

  if (!isOpen) return null

  const completedQuests = quests.filter(q => q.status === QuestStatus.COMPLETED)
  const inProgressQuests = quests.filter(q => q.status === QuestStatus.IN_PROGRESS || q.status === QuestStatus.NOT_STARTED)
  const pastQuests = quests.filter(q => q.status === QuestStatus.CLAIMED || q.status === QuestStatus.EXPIRED)

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col'>
        {/* Header */}
        <div className='bg-linear-to-r from-blueberry-500 to-strawberry-500 p-6 text-white shrink-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='text-4xl'>🎯</div>
              <div>
                <h2 className='text-2xl font-bold'>Quêtes du jour</h2>
                <p className='text-sm text-white/90'>
                  {completedQuests.length} / {quests.length} complétées
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => { void handleRefreshQuests() }}
                disabled={loading}
                className='p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50'
                title='Actualiser les quêtes'
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <WalletHeaderDisplay />
              <button
                onClick={onClose}
                className='p-2 hover:bg-white/20 rounded-lg transition-colors'
              >
                <FiX className='w-6 h-6' />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto flex-1'>
          {loading
            ? (
              <div className='flex items-center justify-center py-12'>
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-12 h-12 border-4 border-blueberry-200 border-t-blueberry-500 rounded-full animate-spin' />
                  <p className='text-sm text-strawberry-600'>Chargement...</p>
                </div>
              </div>
              )
            : (
              <div className='space-y-4'>
                {/* Quêtes complétées */}
                {completedQuests.length > 0 && (
                  <div className='space-y-3'>
                    <h3 className='text-sm font-semibold text-success-700 flex items-center gap-2'>
                      <FiCheckCircle className='w-4 h-4' />
                      Complétées - Récupère tes récompenses !
                    </h3>
                    {completedQuests.map((quest) => (
                      <QuestCardCompact
                        key={quest.id}
                        quest={quest}
                        onClaim={() => { void handleClaimReward(quest.questId) }}
                        isClaiming={claimingQuest === quest.questId}
                        justClaimed={justClaimedQuest === quest.questId}
                      />
                    ))}
                  </div>
                )}

                {/* Quêtes en cours */}
                {inProgressQuests.length > 0 && (
                  <div className='space-y-3'>
                    <h3 className='text-sm font-semibold text-blueberry-700 flex items-center gap-2'>
                      <FiClock className='w-4 h-4' />
                      En cours
                    </h3>
                    {inProgressQuests.map((quest) => (
                      <QuestCardCompact
                        key={quest.id}
                        quest={quest}
                      />
                    ))}
                  </div>
                )}

                {/* Quêtes passées */}
                {pastQuests.length > 0 && (
                  <div className='space-y-3'>
                    <h3 className='text-sm font-semibold text-gray-500 flex items-center gap-2'>
                      <FiCheckCircle className='w-4 h-4' />
                      Quêtes passées
                    </h3>
                    {pastQuests.map((quest) => (
                      <QuestCardCompact
                        key={quest.id}
                        quest={quest}
                        isPast
                      />
                    ))}
                  </div>
                )}

                {/* Aucune quête */}
                {/* Aucune quête */}
                {quests.length === 0 && (
                  <div className='text-center py-8'>
                    <p className='text-4xl mb-3'>🎯</p>
                    <p className='text-sm text-strawberry-600'>
                      Aucune quête disponible
                    </p>
                    <button
                      onClick={() => { void loadQuests() }}
                      className='mt-3 flex items-center gap-2 mx-auto px-4 py-2 bg-blueberry-500 hover:bg-blueberry-600 text-white rounded-lg text-sm font-semibold transition-colors'
                    >
                      <FiRefreshCw className='w-4 h-4' />
                      Actualiser
                    </button>
                  </div>
                )}
              </div>
              )}
        </div>

        {/* Footer */}
        <div className='p-4 bg-strawberry-50 border-t border-strawberry-100 shrink-0'>
          <div className='flex items-center justify-between text-sm'>
            <p className='text-strawberry-600'>
              Les quêtes se renouvellent chaque jour à minuit
            </p>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-strawberry-500 hover:bg-strawberry-600 text-white rounded-lg font-semibold transition-colors'
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Carte de quête compacte pour le modal
 */
interface QuestCardCompactProps {
  quest: QuestProgress & {
    questTitle: string
    questDescription: string
    questIcon: string
  }
  onClaim?: () => void
  isClaiming?: boolean
  justClaimed?: boolean
  isPast?: boolean
}

function QuestCardCompact ({ quest, onClaim, isClaiming, justClaimed, isPast = false }: QuestCardCompactProps): React.ReactElement {
  const isCompleted = quest.status === QuestStatus.COMPLETED

  console.log('🎯 [QuestCardCompact] Rendering quest:', {
    id: quest.id,
    questId: quest.questId,
    title: quest.questTitle,
    status: quest.status,
    isCompleted,
    isPast,
    hasOnClaim: onClaim !== undefined
  })

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${isPast
        ? 'bg-gray-50 border-gray-200 opacity-60'
        : isCompleted
          ? 'bg-white border-strawberry-200'
          : 'bg-white border-strawberry-200 hover:border-blueberry-300'
        }`}
    >
      <div className='flex items-start gap-3'>
        {/* Icône */}
        <div className={`text-3xl shrink-0 ${isPast ? 'grayscale opacity-50' : ''}`}>
          {quest.questIcon}
        </div>

        {/* Contenu */}
        <div className='flex-1 min-w-0'>
          <h4 className={`font-bold mb-1 ${isPast ? 'text-gray-500' : 'text-strawberry-950'}`}>
            {quest.questTitle}
            {quest.status === QuestStatus.CLAIMED && (
              <span className='ml-2 text-xs text-success-600 font-normal'>✓ Récupérée</span>
            )}
            {quest.status === QuestStatus.EXPIRED && (
              <span className='ml-2 text-xs text-gray-500 font-normal'>⌛ Expirée</span>
            )}
          </h4>
          <p className={`text-sm mb-2 ${isPast ? 'text-gray-500' : 'text-strawberry-600'}`}>
            {quest.questDescription}
          </p>

          {/* Progression */}
          {!isCompleted && !isPast && (
            <QuestProgressBar
              currentCount={quest.currentCount}
              targetCount={quest.targetCount}
              className='mb-2'
            />
          )}

          {/* Récompense */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <span className={`text-lg ${isPast ? 'grayscale opacity-50' : ''}`}>💰</span>
              <span className={`text-sm font-bold ${isPast ? 'text-gray-500' : 'text-blueberry-600'}`}>
                +{quest.reward} Ⱥ
              </span>
            </div>

            {/* Bouton récupérer */}
            {isCompleted && onClaim !== undefined && !isPast && (
              <div className='relative'>
                <button
                  onClick={() => {
                    console.log('🎯 [QuestCardCompact] Button clicked!')
                    onClaim()
                  }}
                  disabled={isClaiming === true}
                  className={`px-4 py-2 bg-success-500 hover:bg-success-600 disabled:bg-success-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${justClaimed === true ? 'animate-sparkle-burst' : ''
                    }`}
                >
                  {isClaiming === true
                    ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        Récupération...
                      </>
                      )
                    : (
                      <>
                        <FiCheckCircle className='w-4 h-4' />
                        Récupérer
                      </>
                      )}
                </button>

                {/* Particules d'étoiles */}
                {justClaimed === true && (
                  <>
                    <span className='absolute -top-2 -right-2 text-2xl animate-sparkle'>✨</span>
                    <span className='absolute -top-3 left-1/4 text-xl animate-sparkle' style={{ animationDelay: '0.2s' }}>⭐</span>
                    <span className='absolute -bottom-2 -left-2 text-xl animate-sparkle' style={{ animationDelay: '0.4s' }}>💫</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
