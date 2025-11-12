/**
 * DashboardLayout - Layout avec Sidebar et TopNavBar
 * Wrapper pour les pages du dashboard avec navigation latérale et supérieure
 */

'use client'

import { Sidebar } from './sidebar'
import TopNavBar from './top-navbar'
import type { authClient } from '@/lib/auth/auth-client'

type Session = typeof authClient.$Infer.Session

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DashboardLayoutProps {
  session: Session
  onLogout: () => void
  children: React.ReactNode
  breadcrumbItems?: BreadcrumbItem[]
}

export function DashboardLayout ({ session, onLogout, children, breadcrumbItems }: DashboardLayoutProps): React.ReactNode {
  return (
    <div className='flex min-h-screen flex-row'>
      {/* Sidebar fixe */}
      <Sidebar session={session} onLogout={onLogout} />

      {/* Container principal avec barre de navigation supérieure */}
      <div className='flex-6'>
        {/* Barre de navigation fixe en haut */}
        <TopNavBar session={session} onLogout={onLogout} breadcrumbItems={breadcrumbItems} />

        {/* Contenu principal avec marge pour la TopNavBar */}
        <main className='pt-6 p-8'>
          {children}
        </main>
      </div>
    </div>
  )
}
