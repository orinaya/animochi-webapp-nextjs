/**
 * QuestProgressBar - Barre de progression pour les quêtes
 * Component UI pur, sans logique métier
 */

'use client'

interface QuestProgressBarProps {
  currentCount: number
  targetCount: number
  className?: string
}

export function QuestProgressBar ({ currentCount, targetCount, className = '' }: QuestProgressBarProps): React.ReactElement {
  const percentage = Math.min(100, (currentCount / targetCount) * 100)

  return (
    <div className={`w-full ${className}`}>
      <div className='flex justify-between items-center mb-1.5'>
        <span className='text-xs text-strawberry-600 font-medium'>
          Progression
        </span>
        <span className='text-xs text-strawberry-950 font-semibold'>
          {currentCount}/{targetCount}
        </span>
      </div>

      <div className='h-2 bg-strawberry-100 rounded-full overflow-hidden'>
        <div
          className='h-full bg-linear-to-r from-blueberry-400 to-blueberry-500 rounded-full transition-all duration-500 ease-out'
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className='text-xs text-strawberry-500 mt-1'>
        {percentage.toFixed(0)}% complété
      </p>
    </div>
  )
}
