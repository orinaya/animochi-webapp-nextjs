/**
 * DashboardLayout - Layout avec Sidebar
 * Wrapper pour les pages du dashboard avec navigation latérale
 */

'use client'

import { Sidebar } from './sidebar'
import type { authClient } from '@/lib/auth/auth-client'

type Session = typeof authClient.$Infer.Session

interface DashboardLayoutProps {
  session: Session
  onLogout: () => void
  children: React.ReactNode
}

export function DashboardLayout ({ session, onLogout, children }: DashboardLayoutProps) {
  return (
    <div className='flex min-h-screen bg-latte-50'>
      {/* Sidebar fixe */}
      <Sidebar session={session} onLogout={onLogout} />

      {/* Contenu principal avec marge pour la sidebar */}
      <main className='flex-1 ml-[280px] p-8'>
        {children}
      </main>
    </div>
  )
}
