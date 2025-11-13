/**
 * Script de migration pour copier les données de 'user' vers 'users'
 * Usage: npx tsx --env-file=.env.local scripts/migrate-user-to-users.ts
 */

import { connectMongooseToDatabase } from '../src/db'
import mongoose from 'mongoose'

async function migrateData (): Promise<void> {
  try {
    console.log('🔄 Connexion à MongoDB...')
    await connectMongooseToDatabase()

    const db = mongoose.connection.db
    if (db == null) {
      throw new Error('Database connection not established')
    }

    // Collections
    const userCollection = db.collection('user')
    const usersCollection = db.collection('users')

    // Compter les documents
    const userCount = await userCollection.countDocuments()
    const usersCount = await usersCollection.countDocuments()

    console.log(`📊 Collection 'user': ${userCount} document(s)`)
    console.log(`📊 Collection 'users': ${usersCount} document(s)`)

    if (userCount === 0) {
      console.log('⚠️  Aucun document dans "user", rien à migrer')
      return
    }

    // Récupérer tous les documents de 'user'
    const userDocs = await userCollection.find({}).toArray()
    console.log(`\n📦 Migration de ${userDocs.length} document(s) de 'user' vers 'users'...`)

    for (const doc of userDocs) {
      const email = (doc as any).email
      console.log(`\n👤 Migration: ${email}`)
      console.log(`   _id: ${(doc as any)._id}`)

      // Vérifier si existe déjà dans 'users'
      const existingInUsers = await usersCollection.findOne({ _id: doc._id })
      if (existingInUsers != null) {
        console.log('   ⚠️  Existe déjà dans "users", mise à jour...')
        await usersCollection.updateOne({ _id: doc._id }, { $set: doc })
        console.log('   ✅ Mis à jour')
      } else {
        console.log('   📝 Insertion dans "users"...')
        await usersCollection.insertOne(doc)
        console.log('   ✅ Inséré')
      }
    }

    console.log('\n🎉 Migration terminée !')
    console.log(`📊 Collection 'users': ${await usersCollection.countDocuments()} document(s)`)
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    process.exit(0)
  }
}

void migrateData()
