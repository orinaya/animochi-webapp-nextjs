/**
 * QuestCard - Carte affichant une quête avec sa progression
 * Component UI avec interactions
 */

'use client'

import type { QuestProgress } from '@/domain/entities/quest-progress.entity'
import { QuestStatus } from '@/domain/entities/quest-progress.entity'
import { QuestProgressBar } from './quest-progress-bar'
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'

interface QuestCardProps {
  quest: QuestProgress & {
    questTitle?: string
    questDescription?: string
    questIcon?: string
  }
  onComplete?: () => void
}

export function QuestCard ({ quest, onComplete }: QuestCardProps): React.ReactElement {
  const isCompleted = quest.status === QuestStatus.COMPLETED
  const isExpired = quest.status === QuestStatus.EXPIRED
  const isInProgress = quest.status === QuestStatus.IN_PROGRESS

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 shadow-sm border-2 transition-all duration-300 ${isCompleted
        ? 'border-success-300 bg-success-50'
        : isExpired
          ? 'border-strawberry-200 bg-strawberry-50 opacity-60'
          : 'border-strawberry-200 hover:border-blueberry-300 hover:shadow-md'
        }`}
    >
      {/* Badge de statut */}
      <div className='absolute top-3 right-3'>
        {isCompleted && (
          <div className='flex items-center gap-1.5 bg-success-100 text-success-700 px-2.5 py-1 rounded-full'>
            <FiCheckCircle className='w-3.5 h-3.5' />
            <span className='text-xs font-semibold'>Complété</span>
          </div>
        )}
        {isExpired && (
          <div className='flex items-center gap-1.5 bg-strawberry-200 text-strawberry-700 px-2.5 py-1 rounded-full'>
            <FiXCircle className='w-3.5 h-3.5' />
            <span className='text-xs font-semibold'>Expiré</span>
          </div>
        )}
        {isInProgress && (
          <div className='flex items-center gap-1.5 bg-blueberry-100 text-blueberry-700 px-2.5 py-1 rounded-full'>
            <FiClock className='w-3.5 h-3.5' />
            <span className='text-xs font-semibold'>En cours</span>
          </div>
        )}
      </div>

      {/* Icône et titre */}
      <div className='flex items-start gap-3 mb-3 pr-20'>
        <div className='text-4xl shrink-0'>
          {quest.questIcon ?? '🎯'}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-bold text-strawberry-950 mb-1'>
            {quest.questTitle ?? 'Quête'}
          </h3>
          <p className='text-sm text-strawberry-600 line-clamp-2'>
            {quest.questDescription ?? 'Description de la quête'}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      {!isExpired && (
        <QuestProgressBar
          currentCount={quest.currentCount}
          targetCount={quest.targetCount}
          className='mb-3'
        />
      )}

      {/* Récompense et actions */}
      <div className='flex items-center justify-between pt-3 border-t border-strawberry-100'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>💰</span>
          <div>
            <p className='text-xs text-strawberry-500'>Récompense</p>
            <p className='text-base font-bold text-blueberry-600'>
              +{quest.reward} Animoneys
            </p>
          </div>
        </div>

        {isCompleted && onComplete !== undefined && (
          <button
            onClick={onComplete}
            className='px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg text-sm font-semibold transition-colors'
          >
            Récupérer
          </button>
        )}
      </div>

      {/* Animation de complétion */}
      {isCompleted && (
        <div className='absolute inset-0 pointer-events-none rounded-2xl overflow-hidden'>
          <div className='absolute inset-0 bg-linear-to-br from-success-400/20 to-transparent animate-pulse' />
        </div>
      )}
    </div>
  )
}
