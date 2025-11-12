/**
 * MonstresPageContent - Contenu de la page Mes Monstres
 * Affiche la liste complète des monstres de l'utilisateur avec navigation
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { authClient } from '@/lib/auth/auth-client'
import { FiUsers, FiPlus } from 'react-icons/fi'
import Button from '@/components/ui/button'
import { MonsterCard } from '@/components/ui'
import { CreateMonsterModal } from './create-monster-modal'
import { createMonster, getMonsters } from '@/actions/monsters.action'
import type { Monster } from '@/types/monster'

type Session = typeof authClient.$Infer.Session

interface MonstresPageContentProps {
  /** Session utilisateur contenant les informations de l'utilisateur connecté */
  session: Session
}

interface MonsterListHeaderProps {
  /** Nombre total de monstres */
  count: number
  /** Callback pour ouvrir la modal de création */
  onCreateMonster: () => void
}

/**
 * En-tête de la liste des monstres avec compteur et bouton d'action
 */
function MonsterListHeader({ count, onCreateMonster }: MonsterListHeaderProps): React.ReactNode {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center gap-3'>
        <div className='p-3 bg-blueberry-100 rounded-xl'>
          <FiUsers className='text-2xl text-blueberry-600' />
        </div>
        <div>
          <h2 className='text-2xl font-bold text-blueberry-950'>Mes Monstres</h2>
          <p className='text-latte-600'>
            {count === 0 ? 'Aucun monstre' : `${count} monstre${count > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
      <Button
        variant='primary'
        size='md'
        onClick={onCreateMonster}
        className='flex items-center gap-2'
      >
        <FiPlus className='text-lg' />
        Adopter un monstre
      </Button>
    </div>
  )
}

/**
 * État vide quand l'utilisateur n'a pas encore de monstres
 */
function EmptyMonstersState({ onCreateMonster }: { onCreateMonster: () => void }): React.ReactNode {
  return (
    <div className='text-center py-16'>
      <div className='mb-6'>
        <div className='w-24 h-24 bg-linear-to-br from-blueberry-100 to-strawberry-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-4xl'>🐾</span>
        </div>
      </div>
      <h3 className='text-2xl font-bold text-blueberry-950 mb-4'>
        Votre collection est vide !
      </h3>
      <p className='text-latte-600 mb-8 max-w-md mx-auto'>
        Commencez votre aventure Animochi en adoptant votre premier monstre.
        Chaque créature a sa personnalité unique !
      </p>
      <Button
        variant='primary'
        size='lg'
        onClick={onCreateMonster}
        className='flex items-center gap-2 mx-auto'
      >
        <FiPlus className='text-lg' />
        Adopter mon premier monstre
      </Button>
    </div>
  )
}

/**
 * Grille de monstres avec MonsterCard
 */
function MonstersGrid({ monsters }: { monsters: Monster[] }): React.ReactNode {
  const router = useRouter()

  if (monsters.length === 0) {
    return null
  }

  const handleMonsterClick = (monster: Monster): void => {
    const monsterId = monster.id ?? monster._id
    if (monsterId != null) {
      console.log('Navigation vers le monstre:', monster.name, 'ID:', monsterId)
      router.push(`/monster/${monsterId}`)
    } else {
      console.error('Impossible de naviguer: ID du monstre manquant', monster)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {monsters.map((monster, index) => (
        <MonsterCard
          key={monster.id ?? monster._id ?? index}
          monster={monster}
          onClick={() => handleMonsterClick(monster)}
        />
      ))}
    </div>
  )
}

/**
 * Composant principal du contenu de la page Monstres
 *
 * Respecte le principe SRP : Orchestre uniquement l'affichage de la page monstres
 * Respecte le principe OCP : Extensible via props et composition
 *
 * @param {MonstresPageContentProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le contenu complet de la page monstres
 */
export function MonstresPageContent({ session }: MonstresPageContentProps): React.ReactNode {
  const { logout } = useAuth()
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Données du fil d'Ariane
  const breadcrumbItems = [
    { label: 'Tableau de bord', href: '/dashboard' },
    { label: 'Mes Monstres' }
  ]

  const loadMonsters = async (): Promise<void> => {
    try {
      setIsLoading(true)

      // Récupération des monstres depuis la base de données
      const data = await getMonsters()
      setMonsters(data)
    } catch (error) {
      console.error('Erreur lors du chargement des monstres:', error)
      setMonsters([])
    } finally {
      setIsLoading(false)
    }
  }

  // Chargement initial des monstres au montage du composant
  useEffect(() => {
    void loadMonsters()
  }, [])

  const handleCreateMonster = (): void => {
    console.log('Ouverture du modal de création de monstre')
    setIsCreateModalOpen(true)
  }

  const handleCreateMonsterSubmit = async (newMonster: Partial<Monster>): Promise<void> => {
    try {
      console.log('Création du monstre:', newMonster)

      // Préparer les données pour le modèle MongoDB
      const monsterToCreate: Monster = {
        name: newMonster.name ?? 'Monstre sans nom',
        draw: newMonster.draw ?? 'placeholder',
        state: newMonster.state ?? 'happy',
        level: newMonster.level ?? 1,
        experience: newMonster.experience ?? 0,
        experienceToNextLevel: newMonster.experienceToNextLevel ?? 150,
        description: newMonster.description,
        color: newMonster.color,
        emoji: newMonster.emoji,
        rarity: newMonster.rarity,
        equippedAccessories: newMonster.equippedAccessories ?? null,
        equippedBackground: newMonster.equippedBackground ?? null
      }

      // Appel à la server action
      await createMonster(monsterToCreate)

      // Recharger la liste des monstres
      await loadMonsters()

      console.log('Monstre créé avec succès')
    } catch (error) {
      console.error('Erreur lors de la création du monstre:', error)
      throw error // Relancer l'erreur pour que le modal puisse l'afficher
    }
  }

  const handleLogout = (): void => {
    try {
      logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <DashboardLayout session={session} onLogout={handleLogout} breadcrumbItems={breadcrumbItems}>
      {/* Titre de la page en blueberry-950 */}
      <div className='mb-8'>
        <h1 className='text-3xl font-semibold text-blueberry-950 mb-2'>
          Mes Monstres
        </h1>
        {/* Bouton de test temporaire
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className='bg-red-500 text-white px-4 py-2 rounded text-sm'
        >
          🔧 TEST: Ouvrir Modal
        </button> */}
        {/* <p className='text-lg text-latte-600'>
          Découvrez et gérez votre collection de créatures Animochi
        </p> */}
      </div>

      {/* Contenu principal */}
      {isLoading
        ? (
          <div className='flex items-center justify-center py-16'>
            <div className='text-lg text-latte-600'>Chargement de vos monstres...</div>
          </div>
        )
        : (
          <div>
            {monsters.length === 0
              ? (
                <EmptyMonstersState onCreateMonster={handleCreateMonster} />
              )
              : (
                <>
                  <MonsterListHeader
                    count={monsters.length}
                    onCreateMonster={handleCreateMonster}
                  />
                  <MonstersGrid monsters={monsters} />
                </>
              )}
          </div>
        )}

      {/* Modal de création de monstre */}
      <CreateMonsterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMonsterSubmit}
      />
    </DashboardLayout>
  )
}
