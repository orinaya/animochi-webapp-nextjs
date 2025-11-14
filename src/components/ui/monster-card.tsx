'use client'
/**
 * Composant MonsterCard - Carte d'affichage d'un monstre
 *
 * @module components/ui/monster-card
 */

import { useMemo, useState } from 'react'
import type { Monster, MonsterState } from '@/types/monster/monster'
// import { calculateLevelProgress } from '@/services/experience'
import ProgressBar from './progress-bar'
import Button from './button'
import { Modal } from './modal'
import { MonsterActionsDropdown } from '@/components/monsters/monster-actions-dropdown'
import { toggleMonsterVisibility } from '@/actions/gallery.actions'
import { toast } from 'react-toastify'
import { ACCESSORIES_CATALOG } from '@/data/accessories-catalog'
import { BACKGROUNDS_CATALOG } from '@/data/backgrounds-catalog'
import { FiGlobe, FiLock } from 'react-icons/fi'

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
export const STATE_CONFIG: Record<MonsterState, { label: string, emoji: string, className: string }> = {
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
  },
  bored: {
    label: 'S’ennuie',
    emoji: '🥱',
    className: 'bg-latte-100 text-latte-700 border-latte-300'
  },
  sick: {
    label: 'Malade',
    emoji: '🤒',
    className: 'bg-strawberry-100 text-strawberry-700 border-strawberry-300'
  }
}

/**
 * Badge d'état du monstre
 * Respecte SRP : Affiche uniquement l'état
 */
export function StateBadge ({ state }: { state: MonsterState }): React.ReactNode {
  const config = STATE_CONFIG[state]
  if (config === undefined) {
    // Badge générique si état inconnu
    return (
      <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-300'>
        <span>❓</span>
        <span>État inconnu</span>
      </div>
    )
  }
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
  // Calcul du pourcentage de progression dans le niveau courant
  const percentage = Math.min(100, Math.max(0, Math.floor((experience / experienceToNextLevel) * 100)))

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm'>
        <span className='font-semibold text-blueberry-950'>Niveau {level}</span>
        <span className='text-xs text-latte-600'>
          {experience} / {experienceToNextLevel} XP
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
  if (monster == null) {
    return (
      <div className={`bg-latte-100 rounded-xl flex items-center justify-center min-h-[180px] ${className}`}>
        <span className='text-latte-400 text-lg'>Monstre inconnu</span>
      </div>
    )
  }
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
   * Récupère le background équipé depuis le catalogue
   */
  const equippedBackground = useMemo(() => {
    const equipped = monster.equippedAccessories ?? {}
    if (equipped.background != null) {
      const bgData = [...ACCESSORIES_CATALOG, ...BACKGROUNDS_CATALOG].find(
        acc => acc.name === equipped.background
      )
      return bgData
    }
    return null
  }, [monster.equippedAccessories])

  /**
   * Récupère les accessoires équipés depuis le catalogue
   */
  const equippedAccessoriesData = useMemo(() => {
    const equipped = monster.equippedAccessories ?? {}
    const accessories: Array<{ svg: string, category: string }> = []

    // Récupérer chaque accessoire équipé depuis le catalogue
    if (equipped.hat != null) {
      const hatData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.hat)
      if (hatData?.svg != null) {
        accessories.push({ svg: hatData.svg, category: 'hat' })
      }
    }

    if (equipped.glasses != null) {
      const glassesData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.glasses)
      if (glassesData?.svg != null) {
        accessories.push({ svg: glassesData.svg, category: 'glasses' })
      }
    }

    if (equipped.shoes != null) {
      const shoesData = ACCESSORIES_CATALOG.find(acc => acc.name === equipped.shoes)
      if (shoesData?.svg != null) {
        accessories.push({ svg: shoesData.svg, category: 'shoes' })
      }
    }

    return accessories
  }, [monster.equippedAccessories])

  /**
   * Retourne les styles de positionnement et animations pour chaque catégorie d'accessoire
   * Adapté aux dimensions réduites de la carte (160px)
   */
  const getAccessoryStyles = (category: string): { position: string, size: string, animation: string } => {
    switch (category) {
      case 'hat':
        // Chapeau au-dessus de la tête - animation flottante douce
        return {
          position: 'top-[4%] left-[44%] -translate-x-1/2',
          size: 'w-[69%] h-auto',
          animation: 'animate-float-gentle'
        }
      case 'glasses':
        // Lunettes devant les yeux - pas d'animation
        return {
          position: 'top-[12%] left-[44%] -translate-x-1/2',
          size: 'w-[57%] h-auto',
          animation: ''
        }
      case 'shoes':
        // Chaussures au bas - rebond vertical
        return {
          position: 'bottom-[10%] left-[44%] -translate-x-1/2',
          size: 'w-[41%] h-auto',
          animation: 'animate-bounce-vertical'
        }
      default:
        return {
          position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          size: 'w-[50%] h-auto',
          animation: ''
        }
    }
  }

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
        {/* Badge de statut et menu actions */}
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <StateBadge state={state} />
            {/* Icône de visibilité public/privé */}
            {monster.isPublic === true
              ? (
                <div className='flex items-center gap-1 text-xs text-blueberry-600 bg-blueberry-50 px-2 py-1 rounded-full'>
                  <FiGlobe size={14} />
                  <span>Public</span>
                </div>
                )
              : (
                <div className='flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>
                  <FiLock size={14} />
                  <span>Privé</span>
                </div>
                )}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <MonsterActionsDropdown
              monsterId={monster._id ?? ''}
              isPublic={monster.isPublic ?? false}
              onEdit={handleOpenEditModal}
              onDelete={() => {
                setShowDeleteModal(true)
              }}
              onTogglePublic={() => {
                void (async () => {
                  try {
                    const newIsPublic = !(monster.isPublic ?? false)
                    const result = await toggleMonsterVisibility(monster._id ?? '', newIsPublic)
                    if (result.success) {
                      toast.success(result.message)
                      window.location.reload()
                    } else {
                      toast.error(result.message)
                    }
                  } catch (error) {
                    toast.error('Erreur lors du changement de visibilité')
                  }
                })()
              }}
            />
          </div>
        </div>

        {/* Titre du monstre */}
        <div className='mb-4'>
          <h3 className='text-lg font-bold text-blueberry-950 text-center'>
            {monster.name}
          </h3>
        </div>

        {/* Image SVG du monstre avec accessoires */}
        <div className='flex justify-center mb-4'>
          <div
            className='relative w-40 h-40 p-4 flex items-center justify-center rounded-2xl group-hover:scale-105 transition-transform duration-300 overflow-hidden'
            style={equippedBackground?.imagePath != null
              ? { backgroundImage: `url(${equippedBackground.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {}}
          >
            {/* Background SVG (gradient) si c'est un gradient */}
            {equippedBackground?.svg != null && (
              <div className='absolute inset-0 -z-10'>
                <svg
                  viewBox='0 0 100 100'
                  className='w-full h-full'
                  preserveAspectRatio='none'
                  dangerouslySetInnerHTML={{ __html: equippedBackground.svg }}
                />
              </div>
            )}

            {/* Fond par défaut si pas de background équipé */}
            {equippedBackground == null && (
              <div className='absolute inset-0 bg-linear-to-br from-blueberry-50 to-strawberry-50 -z-20' />
            )}

            {/* SVG du monstre */}
            <div
              className='w-full h-full flex items-center justify-center relative z-10'
              dangerouslySetInnerHTML={{ __html: monster.draw ?? '<svg></svg>' }}
            />

            {/* Overlay des accessoires équipés avec animations */}
            {equippedAccessoriesData.map((accessory, index) => {
              const styles = getAccessoryStyles(accessory.category)
              return (
                <div
                  key={`${accessory.category}-${index}`}
                  className={`absolute pointer-events-none z-20 ${styles.position} ${styles.size} ${styles.animation}`}
                >
                  <svg viewBox='0 0 80 80' className='w-full h-full'>
                    <g dangerouslySetInnerHTML={{ __html: accessory.svg }} />
                  </svg>
                </div>
              )
            })}
          </div>
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
