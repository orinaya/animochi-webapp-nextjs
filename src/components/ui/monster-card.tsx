/**
 * Composant MonsterCard - Carte d'affichage d'un monstre
 *
 * @module components/ui/monster-card
 */

import { useState } from 'react'
import type { Monster, MonsterState } from '@/types/monster'
import { calculateLevelProgress, calculateTotalXpForLevel } from '@/services/experience'
import ProgressBar from './progress-bar'
import Button from './button'
import { Modal } from './modal'
import { FiTrash2, FiEdit } from 'react-icons/fi'

/**
 * Props du composant MonsterCard
 */
interface MonsterCardProps {
  /** Données du monstre à afficher */
  monster: Monster
  /** Callback lors du clic sur la carte */
  onClick?: () => void
  /** Callback lors du clic sur le bouton supprimer */
  onDelete?: () => void
  /** Callback lors de l'édition du nom du monstre */
  onEdit?: (newName: string) => Promise<void>
  /** Classe CSS additionnelle */
  className?: string
}

/**
 * Configuration des badges d'état du monstre
 * Respecte SRP : Responsabilité unique de mapping état → apparence
 *
 * Couleurs :
 * - happy = vert
 * - sad = bleu
 * - angry = rouge
 * - hungry = jaune
 * - sleepy = violet
 */
const STATE_CONFIG: Record<MonsterState, { label: string, emoji: string, className: string }> = {
  happy: {
    label: 'Heureux',
    emoji: '😊',
    className: 'bg-green-100 text-green-700 border-green-300'
  },
  sad: {
    label: 'Triste',
    emoji: '😢',
    className: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  angry: {
    label: 'En colère',
    emoji: '😠',
    className: 'bg-red-100 text-red-700 border-red-300'
  },
  hungry: {
    label: 'Affamé',
    emoji: '🍖',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300'
  },
  sleepy: {
    label: 'Endormi',
    emoji: '😴',
    className: 'bg-purple-100 text-purple-700 border-purple-300'
  }
}

/**
 * Badge d'état du monstre
 * Respecte SRP : Affiche uniquement l'état
 */
function StateBadge ({ state }: { state: MonsterState }): React.ReactNode {
  const config = STATE_CONFIG[state]

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  )
}

/**
 * Section de progression du niveau
 * Respecte SRP : Affiche uniquement la progression de niveau
 *
 * Utilise le service d'expérience pour calculer la progression réelle
 * en tenant compte de la formule exponentielle (BASE_XP * level * GROWTH_FACTOR)
 */
function LevelProgress ({ level, experience, experienceToNextLevel }: {
  level: number
  experience: number
  experienceToNextLevel: number
}): React.ReactNode {
  // Calculer le pourcentage de progression avec le service métier
  const percentage = calculateLevelProgress(experience, level)

  // Calculer l'XP dans le niveau actuel (pas l'XP totale)
  const xpForCurrentLevel = calculateTotalXpForLevel(level)
  const xpInCurrentLevel = experience - xpForCurrentLevel

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm'>
        <span className='font-semibold text-blueberry-950'>Niveau {level}</span>
        <span className='text-xs text-latte-600'>
          {xpInCurrentLevel} / {experienceToNextLevel} XP
        </span>
      </div>
      <ProgressBar
        value={percentage}
        size='md'
        variant='blueberry'
        animated
      />
    </div>
  )
}

/**
 * Composant MonsterCard - Carte d'affichage complète d'un monstre
 *
 * Affiche :
 * - Nom du monstre
 * - Image SVG du monstre
 * - Badge d'état (happy, angry, sad, etc.)
 * - Niveau avec barre de progression
 * - Bouton supprimer (si onDelete est fourni)
 *
 * Respecte le principe SRP : Affichage uniquement des informations d'un monstre
 * Respecte le principe OCP : Extensible via props et composition
 *
 * @param {MonsterCardProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Une carte de monstre stylisée
 *
 * @example
 * ```tsx
 * <MonsterCard
 *   monster={monster}
 *   onClick={() => console.log('Monstre cliqué')}
 *   onDelete={() => console.log('Monstre supprimé')}
 * />
 * ```
 */
export default function MonsterCard ({ monster, onClick, onDelete, onEdit, className = '' }: MonsterCardProps): React.ReactNode {
  const level = monster.level ?? 1
  const experience = monster.experience ?? 0
  const experienceToNextLevel = monster.experienceToNextLevel ?? 150
  const state = (monster.state ?? 'happy') as MonsterState

  // États pour gérer l'affichage des modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editedName, setEditedName] = useState(monster.name)
  const [isEditLoading, setIsEditLoading] = useState(false)

  /**
   * Gestionnaire de confirmation de suppression
   */
  const handleConfirmDelete = (): void => {
    if (onDelete != null) {
      onDelete()
    }
    setShowDeleteModal(false)
  }

  /**
   * Gestionnaire de confirmation d'édition
   */
  const handleConfirmEdit = async (): Promise<void> => {
    if (onEdit != null && editedName.trim() !== '') {
      try {
        setIsEditLoading(true)
        await onEdit(editedName.trim())
        setShowEditModal(false)
      } catch (error) {
        console.error('Erreur lors de l\'édition du nom:', error)
      } finally {
        setIsEditLoading(false)
      }
    }
  }

  /**
   * Gestionnaire d'ouverture de la modal d'édition
   */
  const handleOpenEditModal = (): void => {
    setEditedName(monster.name)
    setShowEditModal(true)
  }

  return (
    <>
      <div
        className={`
          bg-white rounded-2xl p-6 shadow-md
          hover:shadow-lg hover:border-blueberry-300
          transition-all duration-300 ease-in-out
          cursor-pointer group
          ${className}
        `}
        onClick={onClick}
      >
        {/* Badge de statut et boutons d'action */}
        <div className='flex justify-between items-center mb-4'>
          <StateBadge state={state} />
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className='flex items-center gap-1'
          >
            <Button
              onClick={handleOpenEditModal}
              size='sm'
              variant='ghost'
              color='blueberry'
              className='p-2! min-w-0'
            >
              <FiEdit size={18} />
            </Button>
            <Button
              onClick={() => {
                setShowDeleteModal(true)
              }}
              size='sm'
              variant='ghost'
              color='danger'
              className='p-2! min-w-0'
            >
              <FiTrash2 size={18} />
            </Button>
          </div>
        </div>

        {/* Titre du monstre */}
        <div className='mb-4'>
          <h3 className='text-lg font-bold text-blueberry-950 text-center'>
            {monster.name}
          </h3>
        </div>

        {/* Image SVG du monstre */}
        <div className='flex justify-center mb-4'>
          <div
            className='w-40 h-40 p-4 flex items-center justify-center bg-linear-to-br from-blueberry-50 to-strawberry-50 rounded-2xl group-hover:scale-105 transition-transform duration-300'
            dangerouslySetInnerHTML={{ __html: monster.draw ?? '<svg></svg>' }}
          />
        </div>

        {/* Progression de niveau */}
        <LevelProgress
          level={level}
          experience={experience}
          experienceToNextLevel={experienceToNextLevel}
        />
      </div>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false) }}
        title='Supprimer le monstre'
        size='sm'
      >
        <div className='space-y-4'>
          <p className='text-latte-700'>
            Êtes-vous sûr de vouloir supprimer <strong>{monster.name}</strong> ?
            Cette action est irréversible.
          </p>

          <div className='flex gap-3 justify-end py-4'>
            <Button
              onClick={() => { setShowDeleteModal(false) }}
              variant='secondary'
              color='latte'
              size='md'
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant='primary'
              color='danger'
              size='md'
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal d'édition du nom */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false) }}
        title='Modifier le nom du monstre'
        size='sm'
      >
        <div className='space-y-4'>
          <div>
            <label htmlFor='monster-name' className='block text-sm font-medium text-blueberry-950 mb-2'>
              Nom du monstre
            </label>
            <input
              id='monster-name'
              type='text'
              value={editedName}
              onChange={(e) => { setEditedName(e.target.value) }}
              className='w-full px-4 py-2 border border-latte-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blueberry-500 focus:border-transparent'
              placeholder='Entrez un nouveau nom'
              maxLength={50}
            />
            <p className='text-xs text-latte-600 mt-1'>
              {editedName.length}/50 caractères
            </p>
          </div>

          <div className='flex gap-3 justify-end py-4'>
            <Button
              onClick={() => { setShowEditModal(false) }}
              variant='secondary'
              color='latte'
              size='md'
              disabled={isEditLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={() => { void handleConfirmEdit() }}
              variant='primary'
              color='blueberry'
              size='md'
              disabled={isEditLoading || editedName.trim() === '' || editedName === monster.name}
            >
              {isEditLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
