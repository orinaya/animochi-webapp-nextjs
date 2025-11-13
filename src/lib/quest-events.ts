/**
 * Quest Events - Système d'événements pour les quêtes
 * Permet de notifier tous les composants quand une quête change
 * Principe SRP : Gère uniquement les événements des quêtes
 */

type QuestEventListener = () => void

class QuestEventEmitter {
  private listeners: QuestEventListener[] = []

  subscribe (listener: QuestEventListener): () => void {
    this.listeners.push(listener)
    console.log('🔔 [QuestEvents] Listener ajouté. Total:', this.listeners.length)
    // Retourne une fonction pour se désabonner
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
      console.log('🔕 [QuestEvents] Listener retiré. Total:', this.listeners.length)
    }
  }

  emit (): void {
    console.log('📢 [QuestEvents] Émission événement à', this.listeners.length, 'listeners')
    this.listeners.forEach((listener) => {
      listener()
    })
  }
}

// Instance singleton
export const questEvents = new QuestEventEmitter()
