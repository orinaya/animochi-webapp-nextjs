/**
 * Animal Avatar Utils - Utilitaires pour les avatars d'animaux
 * Respecte le principe SRP : Gère uniquement la logique des avatars d'animaux
 */

/**
 * Configuration des avatars d'animaux disponibles
 */
export interface AnimalAvatar {
  /** Nom de fichier de l'image */
  filename: string
  /** Nom d'affichage de l'animal */
  displayName: string
  /** Couleur de fond pastel associée */
  backgroundColor: string
  /** Couleur de texte contrastée */
  textColor: string
}

/**
 * Liste des avatars d'animaux disponibles avec leurs couleurs pastels
 */
export const ANIMAL_AVATARS: AnimalAvatar[] = [
  {
    filename: 'blaireau.png',
    displayName: 'Blaireau',
    backgroundColor: 'bg-slate-200',
    textColor: 'text-slate-800'
  },
  {
    filename: 'cerf.png',
    displayName: 'Cerf',
    backgroundColor: 'bg-amber-200',
    textColor: 'text-amber-800'
  },
  {
    filename: 'corbeau.png',
    displayName: 'Corbeau',
    backgroundColor: 'bg-gray-200',
    textColor: 'text-gray-800'
  },
  {
    filename: 'esquie.png',
    displayName: 'Esquimau',
    backgroundColor: 'bg-cyan-200',
    textColor: 'text-cyan-800'
  },
  {
    filename: 'herisson.png',
    displayName: 'Hérisson',
    backgroundColor: 'bg-orange-200',
    textColor: 'text-orange-800'
  },
  {
    filename: 'hibou.png',
    displayName: 'Hibou',
    backgroundColor: 'bg-indigo-200',
    textColor: 'text-indigo-800'
  },
  {
    filename: 'lapin.png',
    displayName: 'Lapin',
    backgroundColor: 'bg-pink-200',
    textColor: 'text-pink-800'
  },
  {
    filename: 'lion.png',
    displayName: 'Lion',
    backgroundColor: 'bg-yellow-200',
    textColor: 'text-yellow-800'
  },
  {
    filename: 'morse.png',
    displayName: 'Morse',
    backgroundColor: 'bg-blue-200',
    textColor: 'text-blue-800'
  },
  {
    filename: 'panda-roux.png',
    displayName: 'Panda Roux',
    backgroundColor: 'bg-red-200',
    textColor: 'text-red-800'
  },
  {
    filename: 'panda-roux-2.png',
    displayName: 'Panda Roux 2',
    backgroundColor: 'bg-red-100',
    textColor: 'text-red-700'
  },
  {
    filename: 'pingouin.png',
    displayName: 'Pingouin',
    backgroundColor: 'bg-slate-100',
    textColor: 'text-slate-700'
  },
  {
    filename: 'raton.png',
    displayName: 'Raton Laveur',
    backgroundColor: 'bg-gray-300',
    textColor: 'text-gray-800'
  },
  {
    filename: 'renard.png',
    displayName: 'Renard',
    backgroundColor: 'bg-orange-100',
    textColor: 'text-orange-700'
  },
  {
    filename: 'requin.png',
    displayName: 'Requin',
    backgroundColor: 'bg-teal-200',
    textColor: 'text-teal-800'
  },
  {
    filename: 'souris.png',
    displayName: 'Souris',
    backgroundColor: 'bg-rose-200',
    textColor: 'text-rose-800'
  },
  {
    filename: 'tapir.png',
    displayName: 'Tapir',
    backgroundColor: 'bg-purple-200',
    textColor: 'text-purple-800'
  }
]

/**
 * Obtient les informations d'un avatar animal par son nom de fichier
 */
export function getAnimalAvatarByFilename (filename: string): AnimalAvatar | null {
  return ANIMAL_AVATARS.find((avatar) => avatar.filename === filename) ?? null
}

/**
 * Obtient l'URL complète d'une image d'animal
 */
export function getAnimalImageUrl (filename: string): string {
  return `/assets/images/animochi/animals/${filename}`
}

/**
 * Avatar par défaut (premier de la liste)
 */
export const DEFAULT_ANIMAL_AVATAR = ANIMAL_AVATARS[0]
