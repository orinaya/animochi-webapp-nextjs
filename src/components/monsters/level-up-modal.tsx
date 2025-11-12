/**
 * LevelUpModal - Modal de célébration de montée de niveau
 *
 * Affiche une animation de confettis et les informations sur le nouveau niveau
 * avec les récompenses débloquées
 *
 * Respecte le principe SRP : Gère uniquement l'affichage du level up
 * Respecte le principe OCP : Extensible via props
 *
 * @module components/monsters/level-up-modal
 */

'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import Button from '@/components/ui/button'

interface LevelUpModalProps {
  /** Afficher le modal */
  isOpen: boolean
  /** Nouveau niveau atteint */
  newLevel: number
  /** Nombre de niveaux gagnés */
  levelsGained: number
  /** Callback à la fermeture */
  onClose: () => void
}

/**
 * Représente un confetti individuel
 */
interface Confetti {
  id: number
  x: number
  y: number
  color: string
  size: number
  delay: number
  duration: number
}

/**
 * Génère des confettis aléatoires
 */
function generateConfetti (count: number): Confetti[] {
  const colors = ['#FF6B9D', '#4A90E2', '#FFB84D', '#E8DCC8']

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 8,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random()
  }))
}

/**
 * Calcule les récompenses débloquées au niveau donné
 */
function getUnlockedRewards (level: number): string[] {
  const rewards: string[] = []

  if (level === 5) rewards.push('🎩 Chapeau basique')
  if (level === 10) rewards.push('😎 Lunettes de soleil')
  if (level === 15) rewards.push('👟 Baskets cool')
  if (level === 20) rewards.push('🌟 Fond étoilé')
  if (level === 25) rewards.push('👑 Couronne royale')
  if (level % 10 === 0 && level > 0) rewards.push('💎 Bonus de rareté')

  return rewards
}

/**
 * Modal de level up avec confettis
 *
 * @param {LevelUpModalProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le modal
 */
export default function LevelUpModal ({
  isOpen,
  newLevel,
  levelsGained,
  onClose
}: LevelUpModalProps): React.ReactNode {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const rewards = getUnlockedRewards(newLevel)

  useEffect(() => {
    if (isOpen) {
      setConfetti(generateConfetti(30))
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Niveau ${newLevel} atteint !`}
      size='lg'
    >
      {/* Zone de confettis */}
      <div className='relative overflow-hidden h-full'>
        {confetti.map((c) => (
          <div
            key={c.id}
            className='absolute rounded-full animate-confetti-fall'
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`
            }}
          />
        ))}

        {/* Contenu principal */}
        <div className='relative z-10 text-center py-8'>
          {/* Emoji de célébration */}
          <div className='text-8xl mb-6 animate-bounce'>
            🎉
          </div>

          {/* Message de félicitations */}
          <h2 className='text-3xl font-bold text-blueberry-950 mb-4'>
            Félicitations !
          </h2>

          <p className='text-lg text-latte-700 mb-6'>
            Votre monstre a gagné{' '}
            <span className='font-bold text-strawberry-600'>
              {levelsGained} niveau{levelsGained > 1 ? 'x' : ''}
            </span>
            {' '}et atteint le niveau{' '}
            <span className='font-bold text-blueberry-600'>
              {newLevel}
            </span>
            {' '}!
          </p>

          {/* Récompenses débloquées */}
          {rewards.length > 0 && (
            <div className='bg-peach-50 rounded-2xl p-6 mb-6 border border-peach-200'>
              <h3 className='text-lg font-semibold text-blueberry-950 mb-4'>
                🎁 Récompenses débloquées
              </h3>
              <div className='space-y-2'>
                {rewards.map((reward, index) => (
                  <div
                    key={index}
                    className='text-left text-latte-800 px-4 py-2 bg-white rounded-lg'
                  >
                    {reward}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message de progression */}
          <p className='text-sm text-latte-600 mb-6'>
            Continuez à prendre soin de votre monstre pour débloquer encore plus de récompenses !
          </p>

          {/* Bouton de fermeture */}
          <Button
            onClick={onClose}
            variant='primary'
            size='lg'
          >
            Super ! 🎊
          </Button>
        </div>
      </div>
    </Modal>
  )
}
