/**
 * Quest Actions - Server Actions pour gérer les quêtes journalières
 * Application Layer : Orchestration des use cases et gestion de l'état
 */

"use server"

import {auth} from "@/lib/auth/auth"
import {headers} from "next/headers"
import {connectMongooseToDatabase} from "@/db"
import {questRepository} from "@/infrastructure/repositories/quest.repository"
import {GetDailyQuestsUseCase} from "@/domain/usecases/get-daily-quests.usecase"
import {UpdateQuestProgressUseCase} from "@/domain/usecases/update-quest-progress.usecase"
import {ResetDailyQuestsUseCase} from "@/domain/usecases/reset-daily-quests.usecase"
import type {QuestProgress} from "@/domain/entities/quest-progress.entity"
import {QuestType} from "@/domain/entities/quest.entity"
import {addFunds} from "./wallet.actions"
import {QUEST_TEMPLATES} from "@/config/quests.config"

/**
 * Résultat d'une action de quête
 */
export interface QuestActionResult {
  success: boolean
  message?: string
  data?: Record<string, unknown>
}

/**
 * Récupère les quêtes journalières de l'utilisateur connecté
 * Enrichit les données avec les informations des templates (titre, description, icône)
 */
export async function getDailyQuests(): Promise<Array<
  QuestProgress & {
    questTitle: string
    questDescription: string
    questIcon: string
  }
> | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return null
    }

    await connectMongooseToDatabase()

    const useCase = new GetDailyQuestsUseCase(questRepository)
    const quests = await useCase.execute(session.user.id)

    // Enrichir chaque quête avec les données du template correspondant
    const enrichedQuests = quests.map((quest) => {
      // Trouver le template correspondant (même type et même targetCount)
      const template = QUEST_TEMPLATES.find(
        (t) => t.type === quest.questType && t.targetCount === quest.targetCount
      )

      // Si pas de template exact, chercher juste par type
      const fallbackTemplate = QUEST_TEMPLATES.find((t) => t.type === quest.questType)

      const questData = template ?? fallbackTemplate

      return {
        ...quest,
        questTitle: questData?.title ?? "Quête mystère",
        questDescription: questData?.description ?? "Complète cette quête",
        questIcon: questData?.icon ?? "🎯",
      }
    })

    return enrichedQuests
  } catch (error) {
    console.error("Error fetching daily quests:", error)
    return null
  }
}

/**
 * Incrémente la progression d'une quête
 * Récompense l'utilisateur si la quête est complétée
 */
export async function updateQuestProgress(
  questId: string,
  incrementAmount: number = 1
): Promise<QuestActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return {success: false, message: "Non authentifié"}
    }

    await connectMongooseToDatabase()

    const useCase = new UpdateQuestProgressUseCase(questRepository)
    const result = await useCase.execute(session.user.id, questId, incrementAmount)

    // Si la quête vient d'être complétée, créditer la récompense
    if (result.justCompleted && result.reward > 0) {
      await addFunds(result.reward, "QUEST_REWARD")
    }

    return {
      success: true,
      data: {
        progress: result.progress,
        justCompleted: result.justCompleted,
        reward: result.reward,
      },
    }
  } catch (error) {
    console.error("Error updating quest progress:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
    }
  }
}

/**
 * Helper pour tracker automatiquement la progression d'une quête en fonction du type
 * Retourne true si au moins une quête a été complétée
 */
export async function trackQuestProgress(
  questType: QuestType,
  amount: number = 1
): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return false
    }

    await connectMongooseToDatabase()

    // Récupérer les quêtes actives de l'utilisateur
    const quests = await questRepository.getDailyQuestsForUser(session.user.id)

    // Trouver les quêtes correspondant au type ET qui ne sont pas encore complétées/réclamées
    const matchingQuests = quests.filter(
      (q) => q.questType === questType && q.status !== "COMPLETED" && q.status !== "CLAIMED"
    )

    // Mettre à jour la progression de chaque quête correspondante
    const useCase = new UpdateQuestProgressUseCase(questRepository)
    let anyQuestCompleted: boolean = false

    for (const quest of matchingQuests) {
      try {
        const result = await useCase.execute(session.user.id, quest.questId, amount)
        if (result.justCompleted) {
          anyQuestCompleted = true
        }
        // La récompense sera créditée uniquement lors du clic sur "Récupérer"
      } catch (error) {
        // Continuer même si une quête échoue
        console.error(`Error updating quest ${quest.questId}:`, error)
      }
    }

    return anyQuestCompleted
  } catch (error) {
    console.error("Error tracking quest progress:", error)
    return false
  }
}

/**
 * Réinitialise les quêtes journalières de l'utilisateur
 */
export async function resetUserDailyQuests(): Promise<QuestActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      return {success: false, message: "Non authentifié"}
    }

    await connectMongooseToDatabase()

    // Supprimer toutes les quêtes de l'utilisateur pour en générer de nouvelles
    await questRepository.deleteAllUserQuests(session.user.id)

    return {success: true}
  } catch (error) {
    console.error("Error resetting daily quests:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur lors de la réinitialisation",
    }
  }
}

/**
 * Réinitialise toutes les quêtes journalières (utilisé par le cron)
 * Cette action est protégée et ne devrait être appelée que par le cron job
 */
export async function resetAllDailyQuests(cronSecret: string): Promise<QuestActionResult> {
  try {
    // Vérifier le secret du cron
    if (cronSecret !== process.env.CRON_SECRET) {
      return {success: false, message: "Non autorisé"}
    }

    await connectMongooseToDatabase()

    const useCase = new ResetDailyQuestsUseCase(questRepository)
    await useCase.executeForAll()

    return {success: true}
  } catch (error) {
    console.error("Error resetting all daily quests:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur lors de la réinitialisation",
    }
  }
}

/**
 * Récupère la récompense d'une quête complétée
 * Marque la quête comme réclamée et crédite les Animoneys
 */
export async function claimQuestReward(questId: string): Promise<QuestActionResult> {
  try {
    console.log("🎯 [claimQuestReward] Starting for questId:", questId)

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (session?.user?.id == null) {
      console.log("🎯 [claimQuestReward] No session found")
      return {success: false, message: "Non authentifié"}
    }

    console.log("🎯 [claimQuestReward] User:", session.user.id)
    await connectMongooseToDatabase()

    // Récupérer la quête
    const quest = await questRepository.getQuestProgress(session.user.id, questId)
    console.log("🎯 [claimQuestReward] Quest found:", quest)

    if (quest == null) {
      console.log("🎯 [claimQuestReward] Quest not found")
      return {success: false, message: "Quête introuvable"}
    }

    if (quest.status !== "COMPLETED") {
      console.log("🎯 [claimQuestReward] Quest not completed, status:", quest.status)
      return {success: false, message: "Quête non complétée"}
    }

    console.log("🎯 [claimQuestReward] Marking quest as claimed...")
    // Marquer la quête comme réclamée
    const updatedQuest = await questRepository.markQuestAsClaimed(session.user.id, questId)

    if (updatedQuest == null) {
      console.log("🎯 [claimQuestReward] Failed to mark as claimed")
      return {success: false, message: "Impossible de marquer la quête comme réclamée"}
    }

    console.log("🎯 [claimQuestReward] Crediting reward:", quest.reward)
    // Créditer la récompense
    const creditResult = await addFunds(quest.reward, "QUEST_REWARD")
    console.log("🎯 [claimQuestReward] Credit result:", creditResult)

    if (!creditResult.success) {
      console.log("🎯 [claimQuestReward] Failed to credit funds")
      return {success: false, message: "Erreur lors du crédit de la récompense"}
    }

    console.log("🎯 [claimQuestReward] Success! New balance:", creditResult.balance)
    return {
      success: true,
      data: {
        reward: quest.reward,
        newBalance: creditResult.balance,
      },
    }
  } catch (error) {
    console.error("🎯 [claimQuestReward] Error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur lors de la récupération",
    }
  }
}
