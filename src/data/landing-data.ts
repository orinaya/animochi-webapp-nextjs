import { Benefit, GameAction } from '@/types'

export const gameActions: GameAction[] = [
  {
    id: 'feed',
    title: 'Nourrir',
    description:
      'Donnez des repas délicieux et équilibrés pour maintenir la santé de votre compagnon.',
    icon: '🍽️',
    color: 'strawberry'
  },
  {
    id: 'play',
    title: 'Jouer',
    description: 'Participez à des mini-jeux amusants pour divertir et stimuler votre créature.',
    icon: '🎾',
    color: 'blueberry'
  },
  {
    id: 'heal',
    title: 'Soigner',
    description: 'Utilisez des potions et des sorts de guérison pour traiter les petits bobos.',
    icon: '💊',
    color: 'peach'
  },
  {
    id: 'educate',
    title: 'Éduquer',
    description: 'Enseignez de nouveaux tours et compétences à votre compagnon virtuel.',
    icon: '📚',
    color: 'latte'
  },
  {
    id: 'explore',
    title: 'Explorer',
    description: "Partez à l'aventure dans des mondes magiques remplis de surprises.",
    icon: '🗺️',
    color: 'blueberry'
  },
  {
    id: 'customize',
    title: 'Personnaliser',
    description: "Décorez l'habitat de votre créature avec des objets uniques et colorés.",
    icon: '🎨',
    color: 'strawberry'
  }
]

export const benefits: Benefit[] = [
  {
    id: 'gameplay',
    title: 'Gameplay Immersif',
    description:
      'Interagissez avec votre créature en temps réel grâce à des mécaniques de jeu riches et engageantes.',
    icon: '🎮',
    color: 'blueberry'
  },
  {
    id: 'emotional',
    title: 'Lien Émotionnel',
    description:
      'Développez une relation unique avec votre compagnon qui évolue selon vos interactions et votre attention.',
    icon: '💖',
    color: 'strawberry'
  },
  {
    id: 'evolution',
    title: 'Évolution Continue',
    description:
      'Votre créature grandit, apprend et développe sa personnalité au fil de vos aventures partagées.',
    icon: '🌟',
    color: 'peach'
  }
]
