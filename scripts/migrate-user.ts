/**
 * Script de migration pour ajouter pseudo aux utilisateurs existants
 * Usage: npx tsx --env-file=.env.local scripts/migrate-user.ts
 */

import { connectMongooseToDatabase } from '../src/db'
import UserModel from '../src/db/models/user.model'
import { generateUniqueUsername } from '../src/utils/username-generator'

async function migrateUser (): Promise<void> {
  try {
    console.log('🔄 Connexion à MongoDB...')
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI != null ? 'Défini ✅' : 'Non défini ❌')

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

    // Afficher TOUS les utilisateurs
    console.log('\n📋 Liste de TOUS les utilisateurs dans la collection "user":')
    const allUsersFirst = await UserModel.find({}).select('email pseudo username _id')
    console.log(`   Total: ${allUsersFirst.length} utilisateur(s)`)
    for (const user of allUsersFirst) {
      const u = user
      console.log(
        `   - ${user.email} | _id: ${user._id.toString()} | pseudo: ${
          u.pseudo ?? 'NULL'
        } | username: ${u.username ?? 'NULL'}`
      )
    }

    // Récupérer les utilisateurs sans pseudo
    console.log('\n🔍 Recherche des utilisateurs sans pseudo...')
    const usersWithoutPseudo = await UserModel.find({
      $or: [{ pseudo: { $exists: false } }, { pseudo: null }]
    })

    console.log(`📊 ${usersWithoutPseudo.length} utilisateur(s) trouvé(s) sans pseudo`)

    for (const user of usersWithoutPseudo) {
      console.log(`\n👤 Traitement utilisateur: ${user.email}`)
      console.log('   _id:', user._id.toString())

      // Générer un pseudo unique
      const pseudo = await generateUniqueUsername(async (name) => {
        const existingUser = await UserModel.findOne({
          $or: [{ username: name }, { pseudo: name }]
        })
        return existingUser !== null
      })

      console.log('   🎲 Nouveau pseudo généré:', pseudo)

      // Mettre à jour l'utilisateur
      await UserModel.findByIdAndUpdate(
        user._id,
        {
          $set: {
            pseudo
          }
        },
        { runValidators: true }
      )

      console.log('   ✅ Pseudo ajouté avec succès')
    }

    // Vérification finale
    console.log('\n🔍 Vérification finale...')
    const allUsers = await UserModel.find({}).select('email pseudo username')
    for (const user of allUsers) {
      const u = user
      console.log(`✅ ${user.email} - pseudo: ${u.pseudo ?? 'N/A'}}`)
    }

    console.log('\n🎉 Migration terminée !')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    process.exit(0)
  }
}

void migrateUser()
