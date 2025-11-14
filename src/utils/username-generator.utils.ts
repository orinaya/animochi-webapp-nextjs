/**
 * Générateur de pseudos aléatoires pour les utilisateurs
 *
 * @module utils/username-generator
 */

import { ADJECTIVES, CREATURES } from '@/config/username.config'
//   'Lapin',
//   'Hibou',
//   'Aigle',
//   'Dauphin',
//   'Licorne',
//   'Phénix'
// ]

/**
 * Génère un nombre aléatoire entre min et max (inclus)
 */
function randomInt (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Génère un pseudo aléatoire du type "PetitDragon42"
 *
 * Respecte le principe SRP : Gère uniquement la génération de pseudo
 *
 * @returns {string} Un pseudo aléatoire unique
 *
 * @example
 * ```ts
 * const username = generateRandomUsername()
 * // => "BraveLion37"
 * ```
 */
export function generateRandomUsername (): string {
  const adjective = ADJECTIVES[randomInt(0, ADJECTIVES.length - 1)]
  const creature = CREATURES[randomInt(0, CREATURES.length - 1)]
  const number = randomInt(10, 99)

  return `${adjective}${creature}${number}`
}

/**
 * Génère un pseudo aléatoire unique en vérifiant qu'il n'existe pas déjà
 *
 * @param {Function} checkExists - Fonction async qui vérifie si le pseudo existe
 * @param {number} maxAttempts - Nombre maximum de tentatives (par défaut 10)
 * @returns {Promise<string>} Un pseudo unique
 *
 * @example
 * ```ts
 * const username = await generateUniqueUsername(async (name) => {
 *   const user = await userModel.findOne({ username: name })
 *   return user !== null
 * })
 * ```
 */
export async function generateUniqueUsername (
  checkExists: (username: string) => Promise<boolean>,
  maxAttempts: number = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const username = generateRandomUsername()
    const exists = await checkExists(username)

    if (!exists) {
      return username
    }
  }

  // Fallback avec timestamp si toutes les tentatives échouent
  const timestamp = Date.now().toString().slice(-6)
  return `Animochi${timestamp}`
}
