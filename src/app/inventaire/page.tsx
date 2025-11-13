import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import InventoryPageContent from '@/components/inventory/inventory-page-content'

/**
 * Page Inventaire - Version pleine page de la modal inventaire/boutique
 *
 * Affiche tous les accessoires possédés par l'utilisateur
 * Permet d'acheter de nouveaux accessoires
 * Version responsive adaptée mobile et desktop
 */
export default async function InventairePage(): Promise<React.ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session == null) {
    redirect('/auth/login')
  }

  return <InventoryPageContent session={session} />
}
