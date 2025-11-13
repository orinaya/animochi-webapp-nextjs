/**
 * Quest Entity - Entité de domaine pour les quêtes
 *
 * Responsabilité unique : Représenter une quête avec ses propriétés et règles métier
 * Principe SRP : Uniquement la logique de validation et règles d'une quête
 * Principe OCP : Extensible via de nouveaux types de quêtes sans modifier l'entité
 */

/**
 * Types de quêtes disponibles
 */
export enum QuestType {
  /** Nourrir un monstre un certain nombre de fois */
  FEED_MONSTER = 'FEED_MONSTER',
  /** Faire évoluer un monstre */
  EVOLVE_MONSTER = 'EVOLVE_MONSTER',
  /** Interagir avec plusieurs monstres différents */
  INTERACT_WITH_MONSTERS = 'INTERACT_WITH_MONSTERS',
  /** Acheter un accessoire */
  BUY_ACCESSORY = 'BUY_ACCESSORY',
  /** Rendre un monstre public */
  MAKE_MONSTER_PUBLIC = 'MAKE_MONSTER_PUBLIC',
  /** Personnaliser un monstre avec un accessoire */
  CUSTOMIZE_MONSTER = 'CUSTOMIZE_MONSTER',
  /** Visiter la galerie */
  VISIT_GALLERY = 'VISIT_GALLERY',
  /** Connecter plusieurs jours consécutifs */
  LOGIN_STREAK = 'LOGIN_STREAK',
}

/**
 * Interface représentant une quête
 */
export interface Quest {
  /** Identifiant unique de la quête */
  readonly id: string
  /** Type de quête */
  readonly type: QuestType
  /** Titre de la quête */
  readonly title: string
  /** Description détaillée */
  readonly description: string
  /** Objectif à atteindre (nombre de fois) */
  readonly targetCount: number
  /** Récompense en animoneys */
  readonly reward: number
  /** Icône représentant la quête (emoji ou classe d'icône) */
  readonly icon: string
}

/**
 * Factory pour créer des quêtes valides
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class QuestFactory {
  /**
   * Crée une nouvelle quête avec validation
   */
  static create (params: {
    id: string
    type: QuestType
    title: string
    description: string
    targetCount: number
    reward: number
    icon: string
  }): Quest {
    // Validation
    if (params.targetCount <= 0) {
      throw new Error('Le nombre cible doit être supérieur à 0')
    }

    if (params.reward <= 0) {
      throw new Error('La récompense doit être supérieure à 0')
    }

    if (params.title.trim() === '') {
      throw new Error('Le titre ne peut pas être vide')
    }

    return {
      id: params.id,
      type: params.type,
      title: params.title,
      description: params.description,
      targetCount: params.targetCount,
      reward: params.reward,
      icon: params.icon
    }
  }
}
