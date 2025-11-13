/**
 * QuestList - Liste des quêtes journalières
 * Component avec gestion d'état
 */

'use client'

import { useEffect, useState } from 'react'
import type { QuestProgress } from '@/domain/entities/quest-progress.entity'
import { QuestCard } from './quest-card'
import { getDailyQuests } from '@/actions/quests.actions'
import { FiRefreshCw } from 'react-icons/fi'

export function QuestList (): React.ReactElement {
  const [quests, setQuests] = useState<QuestProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadQuests = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDailyQuests()

      if (data != null) {
        setQuests(data)
      } else {
        setError('Impossible de charger les quêtes')
      }
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadQuests()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-12 h-12 border-4 border-blueberry-200 border-t-blueberry-500 rounded-full animate-spin' />
          <p className='text-sm text-strawberry-600'>Chargement des quêtes...</p>
        </div>
      </div>
    )
  }

  if (error != null) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <p className='text-sm text-red-600 mb-3'>{error}</p>
          <button
            onClick={() => { void loadQuests() }}
            className='px-4 py-2 bg-blueberry-500 hover:bg-blueberry-600 text-white rounded-lg text-sm font-semibold transition-colors'
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (quests.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <p className='text-4xl mb-3'>🎯</p>
          <p className='text-sm text-strawberry-600 mb-3'>
            Aucune quête disponible pour le moment
          </p>
          <button
            onClick={() => { void loadQuests() }}
            className='flex items-center gap-2 mx-auto px-4 py-2 bg-blueberry-500 hover:bg-blueberry-600 text-white rounded-lg text-sm font-semibold transition-colors'
          >
            <FiRefreshCw className='w-4 h-4' />
            Actualiser
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Header avec titre et bouton refresh */}
      <div className='flex items-center justify-between mb-2'>
        <div>
          <h2 className='text-2xl font-bold text-strawberry-950'>
            Quêtes du jour
          </h2>
          <p className='text-sm text-strawberry-600'>
            Complète tes quêtes pour gagner des Animoneys
          </p>
        </div>
        <button
          onClick={() => { void loadQuests() }}
          className='flex items-center gap-2 px-3 py-2 bg-strawberry-100 hover:bg-strawberry-200 text-strawberry-700 rounded-lg text-sm font-medium transition-colors'
          title='Actualiser les quêtes'
        >
          <FiRefreshCw className='w-4 h-4' />
          <span className='hidden sm:inline'>Actualiser</span>
        </button>
      </div>

      {/* Liste des quêtes */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {quests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest as any}
            onComplete={() => { void loadQuests() }}
          />
        ))}
      </div>

      {/* Statistiques */}
      <div className='mt-6 p-4 bg-blueberry-50 rounded-xl border border-blueberry-200'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-blueberry-700 font-medium'>
              Progression du jour
            </p>
            <p className='text-xs text-blueberry-600'>
              {quests.filter(q => q.status === 'COMPLETED').length} / {quests.length} complétées
            </p>
          </div>
          <div className='text-3xl'>
            {quests.filter(q => q.status === 'COMPLETED').length === quests.length ? '🎉' : '⏳'}
          </div>
        </div>
      </div>
    </div>
  )
}
