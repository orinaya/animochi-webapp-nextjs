/**
 * Wallet Events - Système d'événements pour le wallet
 * Permet de notifier tous les composants quand le wallet change
 * Principe SRP : Gère uniquement les événements du wallet
 */

type WalletEventListener = () => void

class WalletEventEmitter {
  private listeners: WalletEventListener[] = []

  subscribe (listener: WalletEventListener): () => void {
    this.listeners.push(listener)
    console.log('🔔 [WalletEvents] Listener ajouté. Total:', this.listeners.length)
    // Retourne une fonction pour se désabonner
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
      console.log('🔕 [WalletEvents] Listener retiré. Total:', this.listeners.length)
    }
  }

  emit (): void {
    console.log('📢 [WalletEvents] Émission événement à', this.listeners.length, 'listeners')
    this.listeners.forEach((listener) => {
      listener()
    })
  }
}

// Instance singleton
export const walletEvents = new WalletEventEmitter()
