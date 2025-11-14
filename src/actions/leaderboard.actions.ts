import { connectMongooseToDatabase } from '@/db'
import monsterModel from '@/db/models/monster.model'
import userModel from '@/db/models/user.model'

/**
 * Récupère les meilleurs monstres de l'application pour le leaderboard
 * Trie par niveau puis expérience décroissante
 * Limite à 20 résultats
 * Anonymise le propriétaire si le monstre est privé
 */
export async function getLeaderboardMonsters (limit = 20): Promise<
Array<{
  rank: number
  monster: string
  owner: string
  xp: number
  level: number
}>
> {
  await connectMongooseToDatabase()
  // On récupère les monstres triés par niveau puis expérience
  const monsters = await monsterModel
    .find({})
    .sort({ level: -1, experience: -1 })
    .limit(limit)
    .lean()
    .exec()

  // On récupère les IDs uniques des propriétaires
  const ownerIds = [...new Set(monsters.map((m) => m.ownerId?.toString()))]
  // On charge les utilisateurs associés
  const users = (await userModel
    .find({ _id: { $in: ownerIds } })
    .select('displayName name pseudo email preferences')
    .lean()
    .exec()) as Array<{
    _id: string
    displayName?: string
    name?: string
    pseudo?: string
    email?: string
    preferences?: {
      theme?: 'light' | 'dark' | 'auto'
      notifications?: {
        email?: boolean
        push?: boolean
        dailyReminder?: boolean
      }
      privacy?: {
        profilePublic?: boolean
        showStats?: boolean
      }
    }
  }>
  const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]))

  // On construit le leaderboard avec anonymisation si nécessaire
  return monsters.map((monster, i) => {
    const owner = userMap[monster.ownerId?.toString()]
    let ownerDisplay = 'Anonyme'
    if (monster.isPublic === true && owner != null) {
      let emailName: string | undefined
      if (owner.email != null && owner.email !== '') {
        emailName = owner.email.split('@')[0] ?? undefined
      }
      ownerDisplay = owner.displayName ?? owner.pseudo ?? owner.name ?? emailName ?? 'Utilisateur'
    }
    return {
      rank: i + 1,
      monster: monster.name,
      owner: ownerDisplay,
      xp: monster.experience ?? 0,
      level: monster.level ?? 1
    }
  })
}
