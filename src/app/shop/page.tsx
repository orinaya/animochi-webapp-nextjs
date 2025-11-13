/**
 * Shop Page - Page de la boutique d'accessoires
 *
 * Permet d'acheter des accessoires pour les monstres avec des Animoneys
 * Reprend exactement le contenu de l'onglet boutique de la modal d'inventaire
 *
 * Respecte le principe SRP : Affiche uniquement la boutique
 * Respecte le principe OCP : Extensible via hooks et services
 *
 * @module app/shop/page
 */

import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ShopPageContent } from '@/components/shop/shop-page-content'

export default async function ShopPage(): Promise<React.ReactNode> {
  // Vérifier l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session == null) {
    redirect('/sign-in')
  }

  return <ShopPageContent session={session} />
}
