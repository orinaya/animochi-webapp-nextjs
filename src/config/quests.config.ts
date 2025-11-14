/**
 * Quest Configuration - Configuration centralisée des quêtes
 *
 * Responsabilité unique : Définir les modèles de quêtes disponibles
 * Principe OCP : Ajout de nouvelles quêtes sans modification du code existant
 * Principe SRP : Uniquement la configuration des quêtes
 */

import { QuestType, type Quest } from '@/domain/entities/quest.entity'

/**
 * Template de quête - définit la structure d'une quête
 */
export interface QuestTemplate {
  type: QuestType
  title: string
  description: string
  targetCount: number
  reward: number
  icon: string
  /** Poids pour la sélection aléatoire (plus élevé = plus de chances) */
  weight?: number
}

/**
 * Catalogue de toutes les quêtes disponibles
 * Chaque jour, 3 quêtes seront sélectionnées aléatoirement parmi cette liste
 */
export const QUEST_TEMPLATES: QuestTemplate[] = [
  // === QUÊTES DE NOURRISSAGE === 🍖
  {
    type: QuestType.FEED_MONSTER,
    title: 'Premier repas',
    description: 'Nourris 1 monstre',
    targetCount: 1,
    reward: 10,
    icon: '🍖',
    weight: 5
  },
  {
    type: QuestType.FEED_MONSTER,
    title: 'Petit déjeuner',
    description: 'Nourris 3 fois tes monstres',
    targetCount: 3,
    reward: 20,
    icon: '🍳',
    weight: 4
  },
  {
    type: QuestType.FEED_MONSTER,
    title: 'Festin du jour',
    description: 'Nourris 5 fois tes monstres',
    targetCount: 5,
    reward: 35,
    icon: '�️',
    weight: 3
  },
  {
    type: QuestType.FEED_MONSTER,
    title: 'Banquet royal',
    description: 'Nourris 10 fois tes monstres',
    targetCount: 10,
    reward: 60,
    icon: '👑',
    weight: 1
  },

  // === QUÊTES D'INTERACTION === 🤝
  {
    type: QuestType.INTERACT_WITH_MONSTERS,
    title: 'Dire bonjour',
    description: 'Interagis 1 fois avec un monstre',
    targetCount: 1,
    reward: 10,
    icon: '👋',
    weight: 5
  },
  {
    type: QuestType.INTERACT_WITH_MONSTERS,
    title: 'Câlins quotidiens',
    description: 'Interagis 3 fois avec tes monstres',
    targetCount: 3,
    reward: 25,
    icon: '�',
    weight: 4
  },
  {
    type: QuestType.INTERACT_WITH_MONSTERS,
    title: 'Meilleur ami',
    description: 'Interagis 5 fois avec tes monstres',
    targetCount: 5,
    reward: 40,
    icon: '❤️',
    weight: 2
  },
  {
    type: QuestType.INTERACT_WITH_MONSTERS,
    title: 'Compagnon dévoué',
    description: 'Interagis 10 fois avec tes monstres',
    targetCount: 10,
    reward: 70,
    icon: '💝',
    weight: 1
  },

  // === QUÊTES D'ÉVOLUTION === ⭐
  {
    type: QuestType.EVOLVE_MONSTER,
    title: 'Première évolution',
    description: 'Fais évoluer 1 monstre',
    targetCount: 1,
    reward: 50,
    icon: '⭐',
    weight: 3
  },
  {
    type: QuestType.EVOLVE_MONSTER,
    title: 'Double évolution',
    description: 'Fais évoluer 2 monstres',
    targetCount: 2,
    reward: 100,
    icon: '🌟',
    weight: 1
  },

  // === QUÊTES D'ACHAT === 🛍️
  {
    type: QuestType.BUY_ACCESSORY,
    title: 'Première emplette',
    description: 'Achète 1 accessoire',
    targetCount: 1,
    reward: 30,
    icon: '🛍️',
    weight: 4
  },
  {
    type: QuestType.BUY_ACCESSORY,
    title: 'Shopping modéré',
    description: 'Achète 2 accessoires',
    targetCount: 2,
    reward: 55,
    icon: '🛒',
    weight: 2
  },
  {
    type: QuestType.BUY_ACCESSORY,
    title: 'Frénésie shopping',
    description: 'Achète 3 accessoires',
    targetCount: 3,
    reward: 80,
    icon: '💳',
    weight: 1
  },

  // === QUÊTES DE PERSONNALISATION === ✨
  {
    type: QuestType.CUSTOMIZE_MONSTER,
    title: 'Premier look',
    description: 'Équipe 1 monstre avec un accessoire',
    targetCount: 1,
    reward: 25,
    icon: '�',
    weight: 4
  },
  {
    type: QuestType.CUSTOMIZE_MONSTER,
    title: 'Garde-robe complète',
    description: 'Équipe 2 monstres avec des accessoires',
    targetCount: 2,
    reward: 45,
    icon: '👗',
    weight: 2
  },
  {
    type: QuestType.CUSTOMIZE_MONSTER,
    title: 'Styliste professionnel',
    description: 'Équipe 3 monstres avec des accessoires',
    targetCount: 3,
    reward: 70,
    icon: '🎨',
    weight: 1
  },

  // === QUÊTES DE PARTAGE === 🌍
  {
    type: QuestType.MAKE_MONSTER_PUBLIC,
    title: 'Première publication',
    description: 'Rends 1 monstre public dans la galerie',
    targetCount: 1,
    reward: 20,
    icon: '📸',
    weight: 4
  },
  {
    type: QuestType.MAKE_MONSTER_PUBLIC,
    title: 'Portfolio',
    description: 'Rends 2 monstres publics',
    targetCount: 2,
    reward: 35,
    icon: '🖼️',
    weight: 2
  },
  {
    type: QuestType.MAKE_MONSTER_PUBLIC,
    title: 'Star de la galerie',
    description: 'Rends 3 monstres publics',
    targetCount: 3,
    reward: 55,
    icon: '🌟',
    weight: 1
  },

  // === QUÊTES D'EXPLORATION === 🔍
  {
    type: QuestType.VISIT_GALLERY,
    title: 'Visite culturelle',
    description: 'Visite la galerie publique',
    targetCount: 1,
    reward: 15,
    icon: '🎭',
    weight: 5
  },

  // === QUÊTES DE FIDÉLITÉ === 🔥
  {
    type: QuestType.LOGIN_STREAK,
    title: 'Assidu',
    description: 'Connecte-toi 2 jours consécutifs',
    targetCount: 2,
    reward: 40,
    icon: '📅',
    weight: 2
  },
  {
    type: QuestType.LOGIN_STREAK,
    title: 'Fidélité récompensée',
    description: 'Connecte-toi 3 jours consécutifs',
    targetCount: 3,
    reward: 70,
    icon: '🔥',
    weight: 1
  },
  {
    type: QuestType.LOGIN_STREAK,
    title: 'Habitué de la maison',
    description: 'Connecte-toi 5 jours consécutifs',
    targetCount: 5,
    reward: 120,
    icon: '💎',
    weight: 1
  }
]

/**
 * Configuration globale du système de quêtes
 */
export const QUEST_CONFIG = {
  /** Nombre de quêtes journalières par utilisateur */
  DAILY_QUESTS_COUNT: 3,

  /** Heure de renouvellement (minuit en heure locale serveur) */
  RESET_HOUR: 0,

  /** Durée de validité des quêtes en heures */
  QUEST_VALIDITY_HOURS: 24,

  /** Récompense bonus pour toutes les quêtes complétées */
  COMPLETION_BONUS: 20,

  /** Maximum de quêtes archivées conservées par utilisateur */
  MAX_ARCHIVED_QUESTS: 30
} as const

/**
 * Sélectionne aléatoirement N quêtes parmi les templates
 * Utilise le système de poids pour favoriser certaines quêtes
 */
export function selectRandomQuests (
  count: number = QUEST_CONFIG.DAILY_QUESTS_COUNT
): QuestTemplate[] {
  // Calculer le poids total
  const totalWeight = QUEST_TEMPLATES.reduce((sum, template) => sum + (template.weight ?? 1), 0)

  const selected: QuestTemplate[] = []
  const available = [...QUEST_TEMPLATES]

  for (let i = 0; i < Math.min(count, available.length); i++) {
    // Sélection pondérée
    let random = Math.random() * totalWeight
    let selectedIndex = 0

    for (let j = 0; j < available.length; j++) {
      random -= available[j].weight ?? 1
      if (random <= 0) {
        selectedIndex = j
        break
      }
    }

    selected.push(available[selectedIndex])
    available.splice(selectedIndex, 1)
  }

  return selected
}

/**
 * Convertit un template en quête avec un ID unique
 */
export function templateToQuest (template: QuestTemplate, questId: string): Quest {
  return {
    id: questId,
    type: template.type,
    title: template.title,
    description: template.description,
    targetCount: template.targetCount,
    reward: template.reward,
    icon: template.icon
  }
}

/**
 * Calcule la date d'expiration pour les quêtes du jour
 */
export function getQuestExpirationDate (): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(QUEST_CONFIG.RESET_HOUR, 0, 0, 0)
  return tomorrow
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function isToday (date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
