/**
 * Wallet Types - Types TypeScript pour le système Animochi
 * Définit les interfaces et types utilisés par le wallet
 */

/**
 * Package d'achat d'Animochi disponible
 */
export interface WalletPackage {
  /** Quantité d'Animochi dans ce package */
  amount: number
  /** Prix en euros */
  price: number
  /** Emoji représentant le package */
  emoji: string
  /** Classes Tailwind pour le dégradé de couleur */
  color: string
  /** Badge affiché sur le package */
  badge: string
  /** Si ce package est marqué comme populaire */
  popular: boolean
}

/**
 * Carte d'information affichée en bas de page wallet
 */
export interface InfoCardData {
  /** Emoji/icône de la carte */
  icon: string
  /** Titre de la carte */
  title: string
  /** Texte descriptif */
  text: string
}

/**
 * Wallet complet avec toutes les informations
 */
export interface Wallet {
  /** ID unique du wallet */
  id: string
  /** ID du propriétaire (User._id) */
  ownerId: string
  /** Solde en Animochi */
  balance: number
  /** Date de création */
  createdAt: Date
  /** Date de dernière modification */
  updatedAt: Date
}

/**
 * DTO pour la réponse API du wallet
 */
export interface WalletDTO {
  id: string
  ownerId: string
  balance: number
  createdAt: string
  updatedAt: string
}

/**
 * Type de transaction
 */
export enum TransactionType {
  /** Ajout de fonds (achat, récompense, bonus) */
  CREDIT = "CREDIT",
  /** Retrait de fonds (achat accessoire, boost, etc.) */
  DEBIT = "DEBIT",
}

/**
 * Statut d'une transaction
 */
export enum TransactionStatus {
  /** Transaction en attente */
  PENDING = "PENDING",
  /** Transaction réussie */
  COMPLETED = "COMPLETED",
  /** Transaction échouée */
  FAILED = "FAILED",
  /** Transaction annulée */
  CANCELLED = "CANCELLED",
}

/**
 * Transaction complète
 */
export interface Transaction {
  /** ID unique de la transaction */
  id: string
  /** ID du wallet concerné */
  walletId: string
  /** Montant (positif pour CREDIT, négatif pour DEBIT) */
  amount: number
  /** Type de transaction */
  type: TransactionType
  /** Statut de la transaction */
  status: TransactionStatus
  /** Description de la transaction */
  description: string
  /** Métadonnées optionnelles (ID article acheté, etc.) */
  metadata?: Record<string, unknown>
  /** Date de création */
  createdAt: Date
  /** Date de dernière modification */
  updatedAt: Date
}

/**
 * DTO pour la réponse API d'une transaction
 */
export interface TransactionDTO {
  id: string
  walletId: string
  amount: number
  type: string
  status: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Résultat d'une opération sur le wallet
 */
export interface WalletOperationResult {
  /** Opération réussie ? */
  success: boolean
  /** Nouveau solde après l'opération */
  balance?: number
  /** Message d'erreur si échec */
  error?: string
}
