/**
 * ActionAnimation - Animation d'émojis lors d'une action
 *
 * Affiche des émojis animés qui flottent autour du monstre
 * pour donner un feedback visuel de l'action effectuée
 *
 * Respecte le principe SRP : Gère uniquement l'animation d'action
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/action-animation
 */

'use client'

import { useEffect, useState } from 'react'
import type { MonsterAction } from '@/types/monster-actions'
import { actionAnimationEmojis } from '@/config/monster-actions-map'

interface ActionAnimationProps {
  /** Action en cours */
  action: MonsterAction
  /** Callback quand l'animation est terminée */
  onComplete?: () => void
}

/**
 * Représente un emoji animé individuel
 */
interface FloatingEmoji {
  id: number
  emoji: string
  x: number
  y: number
  delay: number
  duration: number
}

/**
 * Composant d'animation d'action
 *
 * @param {ActionAnimationProps} props - Les propriétés du composant
 * @returns {React.ReactNode} L'animation
 */
export default function ActionAnimation ({
  action,
  onComplete
}: ActionAnimationProps): React.ReactNode {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    // Générer les emojis flottants
    const emojiList = actionAnimationEmojis[action]
    const floatingEmojis: FloatingEmoji[] = emojiList.map((emoji, index) => ({
      id: index,
      emoji,
      x: Math.random() * 80 + 10, // 10% à 90% de la largeur
      y: Math.random() * 60 + 20, // 20% à 80% de la hauteur
      delay: Math.random() * 0.3,
      duration: 1 + Math.random() * 0.5
    }))

    setEmojis(floatingEmojis)

    // Déclencher la fin de l'animation après 1.5 secondes
    const timer = setTimeout(() => {
      if (onComplete !== null && onComplete !== undefined) {
        onComplete()
      }
    }, 1500)

    return () => { clearTimeout(timer) }
  }, [action, onComplete])

  return (
    <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className='absolute text-4xl animate-float-up-fade'
          style={{
            left: `${emoji.x}%`,
            top: `${emoji.y}%`,
            animationDelay: `${emoji.delay}s`,
            animationDuration: `${emoji.duration}s`
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  )
}
