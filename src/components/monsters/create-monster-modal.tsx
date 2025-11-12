'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui'
import InputField from '@/components/ui/input'
import { generatePixelCat } from '@/services/cat-generator.service'
import type { Monster } from '@/types/monster'

interface CreateMonsterModalProps {
  /** Indique si la modal est ouverte */
  isOpen: boolean
  /** Callback appelé lors de la fermeture de la modal */
  onClose: () => void
  /** Callback appelé lors de la création du monstre */
  onCreate: (monster: Partial<Monster>) => Promise<void>
}

/**
 * Données du formulaire de création de monstre
 */
interface MonsterFormData {
  name: string
  description: string
}

/**
 * Erreurs de validation du formulaire
 */
interface FormErrors {
  name?: string
  description?: string
}

/**
 * Modal de création d'un nouveau monstre
 *
 * Responsabilité unique : Gérer la création d'un nouveau monstre via un formulaire
 * - Affiche un formulaire avec tous les champs nécessaires
 * - Gère la validation des données
 * - Appelle le callback onCreate avec les données validées
 *
 * Respecte le principe SRP : Gestion uniquement de la création de monstre
 * Respecte le principe OCP : Extensible via les props de callback
 *
 * @param {CreateMonsterModalProps} props - Les propriétés du composant
 * @returns {React.ReactNode} La modal de création ou null si fermée
 */
export function CreateMonsterModal ({
  isOpen,
  onClose,
  onCreate
}: CreateMonsterModalProps): React.ReactNode {
  const [formData, setFormData] = useState<MonsterFormData>({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCatSvg, setGeneratedCatSvg] = useState<string>('')

  /**
   * Gestionnaire de génération d'un nouveau chat
   */
  const handleGenerateCat = (): void => {
    const newCatSvg = generatePixelCat()
    setGeneratedCatSvg(newCatSvg)
  }

  /**
   * Validation des données du formulaire
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validation du nom (obligatoire, 2-50 caractères)
    if (formData.name.trim().length === 0) {
      newErrors.name = 'Le nom est obligatoire'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères'
    }

    // Validation de la description (optionnelle, max 200 caractères)
    if (formData.description.trim().length > 200) {
      newErrors.description = 'La description ne peut pas dépasser 200 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Gestionnaire de soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    void (async (): Promise<void> => {
      try {
        setIsLoading(true)

        // Créer l'objet monstre - les valeurs par défaut seront appliquées par MongoDB
        const newMonster: Partial<Monster> = {
          name: formData.name.trim(),
          description: formData.description.trim() !== '' ? formData.description.trim() : undefined,
          draw: generatedCatSvg !== '' ? generatedCatSvg : 'placeholder', // Utilise le SVG généré ou un placeholder
          // Les autres champs (level, state, experience, etc.) auront leurs valeurs par défaut du schéma MongoDB
          equippedAccessories: null,
          equippedBackground: null
        }

        await onCreate(newMonster)

        // Réinitialiser le formulaire et fermer la modal
        setFormData({
          name: '',
          description: ''
        })
        setErrors({})
        setGeneratedCatSvg('')
        onClose()
      } catch (error) {
        console.error('Erreur lors de la création du monstre:', error)
        // TODO: Afficher un toast d'erreur
      } finally {
        setIsLoading(false)
      }
    })()
  }

  /**
   * Gestionnaire de changement des champs du formulaire
   */
  const handleInputChange = (field: keyof MonsterFormData) => (value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Effacer l'erreur pour ce champ si elle existe
    if (errors[field as keyof FormErrors] !== undefined) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  /**
   * Gestionnaire de fermeture de la modal
   */
  const handleClose = (): void => {
    if (!isLoading) {
      setFormData({
        name: '',
        description: ''
      })
      setErrors({})
      setGeneratedCatSvg('')
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Adopter un nouveau monstre'
      size='lg'
    >
      <form onSubmit={handleSubmit} className='space-y-6 pb-6'>
        {/* Encadré pour le visuel du monstre */}
        <div className='mb-8'>
          <label className='block text-sm font-medium text-blueberry-950 mb-3'>
            Aperçu de votre monstre
          </label>
          <div className='w-full min-h-48 bg-linear-to-br from-latte-50 to-latte-100 border-2 border-dashed border-latte-300 rounded-xl flex items-center justify-center p-4'>
            {generatedCatSvg !== ''
              ? (
                <div
                  className='w-48 h-48 shrink-0'
                  dangerouslySetInnerHTML={{ __html: generatedCatSvg }}
                />
                )
              : (
                <div className='text-center'>
                  <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm'>
                    <span className='text-2xl'>🎨</span>
                  </div>
                  <p className='text-latte-600 text-sm'>
                    Le visuel de votre monstre apparaîtra ici
                  </p>
                </div>
                )}
          </div>

          {/* Bouton pour générer le monstre */}
          <div className='mt-4 flex justify-center'>
            <Button
              type='button'
              variant='secondary'
              size='md'
              disabled={isLoading}
              className='flex items-center gap-2'
              onClick={handleGenerateCat}
            >
              <span className='text-lg'>✨</span>
              Générer mon monstre
            </Button>
          </div>
        </div>

        {/* Nom du monstre */}
        <InputField
          type='text'
          label='Nom du monstre'
          value={formData.name}
          onChangeText={handleInputChange('name')}
          placeholder='Ex: Mochi, Bubbles, Shadow...'
          required
          error={errors.name}
          disabled={isLoading}
        />

        {/* Description du monstre */}
        <div className='relative'>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description')(e.target.value)}
            placeholder='Décrivez la personnalité de votre monstre...'
            disabled={isLoading}
            className={`
              w-full py-4 px-6 bg-latte-25 border-2 rounded-xl resize-none h-24
              focus:outline-none transition-all duration-300
              focus:bg-white focus:shadow-md
              ${formData.description.trim().length > 0
                ? 'border-strawberry-400 focus:border-strawberry-500'
                : 'border-latte-50 focus:border-strawberry-500 hover:border-strawberry-300'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
          <label
            className={`
              absolute transition-all duration-300 pointer-events-none bg-latte-25 left-6
              ${formData.description.trim().length > 0
                ? '-top-3 text-sm px-3 rounded-full text-blueberry-950/90'
                : 'top-4 text-base text-blueberry-950/60'
              }
            `}
          >
            Description
          </label>
          {errors.description !== undefined && (
            <p className='mt-2 text-sm text-strawberry-600 flex items-center gap-2'>
              <span className='w-4 h-4 bg-strawberry-100 rounded-full flex items-center justify-center'>
                <span className='text-strawberry-600 text-xs'>!</span>
              </span>
              {errors.description}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className='flex justify-end gap-4 pt-4'>
          <Button
            type='button'
            variant='ghost'
            size='md'
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type='submit'
            variant='primary'
            size='md'
            disabled={isLoading}
            className='flex items-center gap-2'
          >
            {isLoading
              ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Création...
                </>
                )
              : (
                  'Adopter ce monstre'
                )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateMonsterModal
