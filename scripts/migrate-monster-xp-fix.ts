/**
 * Script de migration pour corriger les XP incohérentes des monstres
 * Usage: npx tsx --env-file=.env.local scripts/migrate-monster-xp-fix.ts
 */

import {connectMongooseToDatabase} from "@/db"
import MonsterModel from "@/db/models/monster.model"
import {getNextLevelXp} from "@/services/experience.service"

async function migrateMonsterXpFix(): Promise<void> {
  try {
    console.log("🔄 Connexion à MongoDB...")
    await connectMongooseToDatabase()

    // Afficher toutes les collections MongoDB
    const mongoose = await import("mongoose")
    const db = mongoose.default.connection.db
    if (db == null) {
      throw new Error("Database connection not established")
    }
    const collections = await db.listCollections().toArray()
    console.log("\n📦 Collections MongoDB disponibles:")
    for (const coll of collections) {
      console.log(`   - ${coll.name}`)
    }

    // Afficher tous les monstres
    console.log("\n📋 Liste de TOUS les monstres:")
    const allMonstersFirst = await MonsterModel.find({}).select(
      "name level experience experienceToNextLevel _id"
    )
    console.log(`   Total: ${allMonstersFirst.length} monstre(s)`)
    for (const monster of allMonstersFirst) {
      console.log(
        `   - ${monster.name} | _id: ${monster._id.toString()} | niveau: ${monster.level} | XP: ${
          monster.experience
        } / ${monster.experienceToNextLevel}`
      )
    }

    // Recherche des monstres à corriger
    console.log("\n🔍 Recherche des monstres à corriger...")
    const monstersToFix = await MonsterModel.find({
      $expr: {$gt: ["$experience", "$experienceToNextLevel"]},
    })
    console.log(`📊 ${monstersToFix.length} monstre(s) à corriger`)

    let fixedCount = 0
    for (const monster of monstersToFix) {
      let {experience, level, experienceToNextLevel} = monster
      experience = experience ?? 0
      level = typeof level === "number" && !isNaN(level) ? level : 1
      experienceToNextLevel =
        typeof experienceToNextLevel === "number" && !isNaN(experienceToNextLevel)
          ? experienceToNextLevel
          : getNextLevelXp(level)
      let changed = false
      // Correction de l'XP et du niveau si incohérence
      while (experience >= experienceToNextLevel) {
        experience -= experienceToNextLevel
        level += 1
        experienceToNextLevel = getNextLevelXp(level)
        changed = true
      }
      if (experience < 0) {
        experience = 0
        changed = true
      }
      if (experience >= experienceToNextLevel) {
        experience = experienceToNextLevel - 1
        changed = true
      }
      if (changed) {
        await MonsterModel.findByIdAndUpdate(
          monster._id,
          {
            $set: {
              level,
              experience,
              experienceToNextLevel,
            },
          },
          {runValidators: true}
        )
        fixedCount++
        console.log(
          `✅ Corrigé: ${monster.name} (${
            monster._id?.toString?.() ?? monster._id
          }) → niveau ${level}, XP ${experience}/${experienceToNextLevel}`
        )
      }
    }

    // Vérification finale
    console.log("\n🔍 Vérification finale...")
    const allMonsters = await MonsterModel.find({}).select(
      "name level experience experienceToNextLevel"
    )
    for (const monster of allMonsters) {
      console.log(
        `✅ ${monster.name} - niveau: ${monster.level ?? 1} | XP: ${monster.experience ?? 0} / ${
          monster.experienceToNextLevel ?? 0
        }`
      )
    }

    console.log(`\n🎉 Migration terminée ! ${fixedCount} monstre(s) corrigé(s).`)
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    process.exit(0)
  }
}

void migrateMonsterXpFix()
