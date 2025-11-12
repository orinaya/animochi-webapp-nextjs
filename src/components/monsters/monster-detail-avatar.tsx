/**
 * MonsterDetailAvatar - Avatar du monstre en grand format
 *
 * Affiche l'image SVG du monstre de manière centrée et responsive
 *
 * Respecte le principe SRP : Gère uniquement l'affichage de l'avatar
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/monster-detail-avatar
 */

'use client'

import type { Monster } from '@/types/monster'

interface MonsterDetailAvatarProps {
  /** Données du monstre */
  monster: Monster
}

/**
 * Retourne l'emoji correspondant à l'état du monstre
 *
 * @param {string | null} state - État du monstre
 * @returns {string} Emoji représentant l'état
 */
function getStateEmoji (state: string | null): string {
  const stateEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    hungry: '🍎',
    sleepy: '😴'
  }

  return stateEmojis[state ?? 'happy'] ?? '😊'
}

/**
 * Avatar du monstre en détail
 *
 * @param {MonsterDetailAvatarProps} props - Les propriétés du composant
 * @returns {React.ReactNode} L'avatar du monstre
 */
export default function MonsterDetailAvatar ({
  monster
}: MonsterDetailAvatarProps): React.ReactNode {
  const stateEmoji = getStateEmoji(monster.state ?? null)

  return (
    <div className='relative bg-linear-to-br from-blueberry-50 to-peach-50 rounded-3xl p-8 shadow-lg'>
      {/* Badge d'état */}
      <div className='absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-md'>
        <span className='text-2xl'>{stateEmoji}</span>
      </div>

      {/* Image SVG du monstre */}
      <div className='flex items-center justify-center min-h-[300px] sm:min-h-[400px]'>
        {monster.draw != null && monster.draw !== ''
          ? (
            <div
              className='w-full max-w-md'
              dangerouslySetInnerHTML={{ __html: monster.draw }}
            />
            )
          : (
            <div className='text-center text-latte-600'>
              <span className='text-6xl mb-4 block'>🐾</span>
              <p>Aucune apparence définie</p>
            </div>
            )}
      </div>
    </div>
  )
}
