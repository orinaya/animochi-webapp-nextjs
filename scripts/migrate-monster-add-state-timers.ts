import { connectMongooseToDatabase } from '@/db'
import MonsterModel from '@/db/models/monster.model'

/**
 * Script de migration pour ajouter stateUpdatedAt et nextStateAt aux monstres existants
 * Usage: npx tsx --env-file=.env.local scripts/migrate-monster-add-state-timers.ts
 */

// import { connectMongooseToDatabase } from '../src/db'
// import MonsterModel from '../src/db/models/monster.model'

async function migrateMonsters (): Promise<void> {
  try {
    console.log('🔄 Connexion à MongoDB...')
    await connectMongooseToDatabase()

    // Afficher toutes les collections MongoDB
    const mongoose = await import('mongoose')
    const db = mongoose.default.connection.db
    if (db == null) {
      throw new Error('Database connection not established')
    }
    const collections = await db.listCollections().toArray()
    console.log('\n📦 Collections MongoDB disponibles:')
    for (const coll of collections) {
      console.log(`   - ${coll.name}`)
    }

    // Afficher tous les monstres
    console.log('\n📋 Liste de TOUS les monstres:')
    const allMonstersFirst = await MonsterModel.find({}).select(
      'name state stateUpdatedAt nextStateAt _id'
    )
    console.log(`   Total: ${allMonstersFirst.length} monstre(s)`)
    for (const monster of allMonstersFirst) {
      console.log(
        `   - ${monster.name} | _id: ${monster._id.toString()} | state: ${
          monster.state
        } | stateUpdatedAt: ${
          monster.stateUpdatedAt !== null && monster.stateUpdatedAt !== undefined
            ? monster.stateUpdatedAt.toISOString()
            : 'NULL'
        } | nextStateAt: ${
          monster.nextStateAt !== null && monster.nextStateAt !== undefined
            ? monster.nextStateAt.toISOString()
            : 'NULL'
        }`
      )
    }

    // Récupérer les monstres à migrer
    console.log('\n🔍 Recherche des monstres à migrer...')
    const monstersToMigrate = await MonsterModel.find({
      $or: [
        { stateUpdatedAt: { $exists: false } },
        { stateUpdatedAt: null },
        { nextStateAt: { $exists: false } },
        { nextStateAt: null }
      ]
    })
    console.log(`📊 ${monstersToMigrate.length} monstre(s) à migrer`)

    const now = new Date()
    for (const monster of monstersToMigrate) {
      console.log(`\n👾 Traitement monstre: ${monster.name} (_id: ${monster._id.toString()})`)
      await MonsterModel.findByIdAndUpdate(
        monster._id,
        {
          $set: {
            stateUpdatedAt: now,
            nextStateAt: now
          }
        },
        { runValidators: true }
      )
      console.log('   ✅ Champs ajoutés avec succès')
    }

    // Vérification finale
    console.log('\n🔍 Vérification finale...')
    const allMonsters = await MonsterModel.find({}).select('name state stateUpdatedAt nextStateAt')
    for (const monster of allMonsters) {
      console.log(
        `✅ ${monster.name} - stateUpdatedAt: ${
          monster.stateUpdatedAt !== null && monster.stateUpdatedAt !== undefined
            ? monster.stateUpdatedAt.toISOString()
            : 'N/A'
        } | nextStateAt: ${
          monster.nextStateAt !== null && monster.nextStateAt !== undefined
            ? monster.nextStateAt.toISOString()
            : 'N/A'
        }`
      )
    }

    console.log('\n🎉 Migration terminée !')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    process.exit(0)
  }
}

void migrateMonsters()
