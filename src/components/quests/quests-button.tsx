/**
 * QuestsButton - Bouton pour ouvrir le modal des quêtes
 * Affiche un badge avec le nombre de quêtes complétées
 */

'use client'

import { useState, useEffect } from 'react'
import { getDailyQuests } from '@/actions/quests.actions'
import { QuestStatus } from '@/domain/entities/quest-progress.entity'
import { QuestsModal } from './quests-modal'
import Button from '@/components/ui/button'
import { questEvents } from '@/lib/events/quest-events'

export function QuestsButton (): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const updateCompletedCount = async (): Promise<void> => {
    try {
      const quests = await getDailyQuests()
      if (quests != null) {
        const completed = quests.filter(q => q.status === QuestStatus.COMPLETED).length
        setCompletedCount(completed)
      }
    } catch (error) {
      console.error('Error loading quests count:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void updateCompletedCount()

    // S'abonner aux événements de quêtes
    const unsubscribe = questEvents.subscribe(() => {
      console.log('🎯 [QuestsButton] Quest event received, updating count...')
      void updateCompletedCount()
    })

    // Rafraîchir le count toutes les 30 secondes
    const interval = setInterval(() => {
      void updateCompletedCount()
    }, 30000)

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  return (
    <>
      <div className='relative'>
        <Button
          onClick={() => { setIsModalOpen(true) }}
          variant='outline'
          color='strawberry'
          size='sm'
          className='h-8 px-3 gap-2 hover:bg-strawberry-50 hover:border-blueberry-400 group'
        >
          {/* Icône avec animation si quêtes complétées */}
          <span className={`text-base ${completedCount > 0 ? 'animate-bounce' : ''}`}>
            🎯
          </span>
          {/* Texte (caché sur mobile) */}
          <span className='hidden sm:inline text-sm font-semibold group-hover:text-blueberry-600'>
            Quêtes
          </span>
        </Button>

        {/* Badge de notification */}
        {!loading && completedCount > 0 && (
          <div className='absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-linear-to-r from-success-500 to-success-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse pointer-events-none'>
            {completedCount}
          </div>
        )}

        {/* Effet glow quand quêtes complétées */}
        {completedCount > 0 && (
          <div className='absolute inset-0 rounded-xl bg-success-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none' />
        )}
      </div>

      {/* Modal */}
      <QuestsModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false) }}
        onQuestClaimed={() => { void updateCompletedCount() }}
      />
    </>
  )
}
