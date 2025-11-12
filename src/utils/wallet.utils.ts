/**
 * Wallet Utils - Fonctions utilitaires pour le wallet
 * Principe SRP : Gère uniquement le formatage des montants
 */

import {CURRENCY_SYMBOL} from "@/config/wallet.constants"

/**
 * Formate un montant en Animochi avec le symbole Ⱥ
 * @param amount - Montant à formater
 * @param locale - Locale à utiliser (par défaut 'fr-FR')
 * @returns Montant formaté (ex: "7 680 Ⱥ")
 */
export function formatAnimochi(amount: number, locale: string = "fr-FR"): string {
  return `${amount.toLocaleString(locale)} ${CURRENCY_SYMBOL}`
}

/**
 * Formate un montant en euros
 * @param amount - Montant à formater
 * @param locale - Locale à utiliser (par défaut 'fr-FR')
 * @returns Montant formaté (ex: "7,99 €")
 */
export function formatEuros(amount: number, locale: string = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

/**
 * Formate un montant avec un signe + ou - pour les transactions
 * @param amount - Montant à formater (positif = crédit, négatif = débit)
 * @param locale - Locale à utiliser (par défaut 'fr-FR')
 * @returns Montant formaté avec signe (ex: "+100 Ⱥ" ou "-50 Ⱥ")
 */
export function formatTransactionAmount(amount: number, locale: string = "fr-FR"): string {
  const sign = amount >= 0 ? "+" : ""
  return `${sign}${amount.toLocaleString(locale)} ${CURRENCY_SYMBOL}`
}
