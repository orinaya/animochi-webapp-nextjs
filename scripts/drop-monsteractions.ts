// scripts/drop-monsteractions.ts
// Script TypeScript pour supprimer la collection monsteractions (actions du monstre)
// Usage : ts-node scripts/drop-monsteractions.ts

import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/animochi'

async function main () {
  try {
    await mongoose.connect(uri)
    const db = mongoose.connection.db
    if (db == null) {
      throw new Error('Connexion à la base MongoDB échouée (db undefined)')
    }
    const collections = await db.listCollections({ name: 'monsteractions' }).toArray()
    if (collections.length > 0) {
      await db.dropCollection('monsteractions')
      console.log('✅ Collection monsteractions supprimée.')
    } else {
      console.log("ℹ️  La collection monsteractions n'existe pas déjà.")
    }
    process.exit(0)
  } catch (err) {
    console.error('Erreur lors de la suppression :', err)
    process.exit(1)
  }
}

main()
