/**
 * DashboardLayout - Layout avec Sidebar et TopNavBar
 * Wrapper pour les pages du dashboard avec navigation latérale et supérieure
 * Responsive : Sidebar desktop / BottomTabBar + MobileTopBar mobile
 */

'use client'

import { Sidebar } from './sidebar'
import { BottomTabBar } from './bottom-tabbar'
import { MobileTopBar } from './mobile-topbar'
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

export function DashboardLayout({ session, onLogout, children, breadcrumbItems }: DashboardLayoutProps): React.ReactNode {
  return (
    <div className='flex min-h-screen flex-row'>
      {/* Sidebar fixe - Desktop uniquement */}
      <Sidebar session={session} onLogout={onLogout} />

      {/* Container principal - scrollable */}
      <div className='flex-6 h-screen overflow-y-auto w-full md:w-auto'>
        {/* TopBar mobile - Mobile uniquement */}
        <MobileTopBar session={session} onLogout={onLogout} />

        {/* TopNavBar - Desktop uniquement */}
        <div className='hidden md:block'>
          <TopNavBar session={session} onLogout={onLogout} breadcrumbItems={breadcrumbItems} />
        </div>

        {/* Contenu principal avec padding adapté mobile/desktop */}
        <main className='pt-4 px-4 pb-20 md:pt-6 md:p-8 md:pb-8'>
          {children}
        </main>
      </div>

      {/* BottomTabBar - Mobile uniquement */}
      <BottomTabBar />
    </div>
  )
}
