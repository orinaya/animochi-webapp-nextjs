'use client'

import { useCallback } from 'react'
import { trackQuestProgress } from '@/actions/quests.actions'
import { questEvents } from '@/lib/quest-events'
import type { QuestType } from '@/domain/entities/quest.entity'

export function useQuestTracking (): {
  track: (questType: QuestType, amount?: number) => Promise<void>
} {
  const track = useCallback(async (questType: QuestType, amount: number = 1) => {
    const questCompleted = await trackQuestProgress(questType, amount)

    if (questCompleted) {
      console.log('🎯 [useQuestTracking] Quest completed! Emitting event...')
      questEvents.emit()
    }
  }, [])

  return { track }
}
