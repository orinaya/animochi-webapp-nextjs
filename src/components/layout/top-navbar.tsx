'use client'

import { FiSearch, FiArrowLeft, FiHome } from 'react-icons/fi'
import type { authClient } from '@/lib/auth/auth-client'
import { FaRegBell } from 'react-icons/fa6'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { WalletHeaderDisplay } from '../wallet/wallet-header-display'
import { QuestsButton } from '../quests/quests-button'

type Session = typeof authClient.$Infer.Session

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopNavBarProps {
  session: Session
  onLogout?: () => void
  breadcrumbItems?: BreadcrumbItem[]
}

/**
 * Composant TopNavBar - Barre de navigation fixe en haut du dashboard
 *
 * Affiche les boutons de navigation, le breadcrumb, la barre de recherche, les notifications et le profil utilisateur
 * Respecte le principe SRP : Gère uniquement l'affichage de la navigation supérieure
 * Respecte le principe OCP : Extensible via props sans modification du code
 *
 * @param {TopNavBarProps} props - Les propriétés de la barre de navigation
 * @returns {React.ReactNode} La barre de navigation supérieure
 */
function TopNavBar ({ session, onLogout, breadcrumbItems }: TopNavBarProps): React.ReactNode {
  const router = useRouter()
  const pathname = usePathname()

  // Vérifie si on est sur la page d'accueil/dashboard
  const isHomePage = pathname === '/dashboard' || pathname === '/'

  const handleGoBack = (): void => {
    router.back()
  }

  const handleGoHome = (): void => {
    router.push('/dashboard')
  }

  return (
    <div className='bg-white flex items-center justify-between gap-6 z-40 px-8 h-16'>
      {/* Section gauche : Navigation et Breadcrumb */}
      <div className='flex items-center gap-4 flex-1'>
        {/* Boutons de navigation - seulement si pas sur l'accueil */}
        {!isHomePage && (
          <div className='flex items-center gap-2'>
            <div title='Retour'>
              <Button
                onClick={handleGoBack}
                variant='ghost'
                color='latte'
                size='sm'
                className='h-8 w-8 p-0! min-w-0'
                iconCenter={FiArrowLeft}
              >
                <span className='sr-only'>Retour</span>
              </Button>
            </div>
            <div title='Accueil'>
              <Button
                onClick={handleGoHome}
                variant='ghost'
                color='latte'
                size='sm'
                className='h-8 w-8 p-0! min-w-0'
                iconCenter={FiHome}
              >
                <span className='sr-only'>Accueil</span>
              </Button>
            </div>
          </div>
        )}

        {/* Breadcrumb - seulement si pas sur l'accueil et s'il y a des éléments */}
        {!isHomePage && breadcrumbItems !== undefined && breadcrumbItems !== null && breadcrumbItems.length > 0 && (
          <nav className='flex items-center gap-2 text-sm'>
            {breadcrumbItems.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                {index > 0 && (
                  <span className='text-latte-200'>/</span>
                )}
                {item.href !== undefined && item.href !== null
                  ? (
                    <Link
                      href={item.href}
                      className='text-blueberry-950 hover:text-blueberry-800 transition-colors font-medium text-sm'
                    >
                      {item.label}
                    </Link>
                    )
                  : (
                    <span className='text-strawberry-600 font-medium text-sm'>{item.label}</span>
                    )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Section droite : Recherche + Actions Gaming (Quêtes → Wallet → Notifs) */}
      <div className='flex items-center gap-4'>
        {/* Barre de recherche */}
        <div className='max-w-sm relative'>
          <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-strawberry-400 w-3.5 h-3.5' />
          <input
            type='text'
            placeholder='Rechercher...'
            className='w-full h-8 pl-9 pr-4 bg-[#F6F5F4] rounded-full focus:outline-none focus:ring-1 focus:ring-strawberry-400 focus:border-transparent text-sm'
          />
        </div>

        {/* Séparateur visuel */}
        <div className='h-6 w-px bg-latte-200' />

        {/* Bouton Quêtes - Action primaire */}
        <QuestsButton />

        {/* Wallet Display - Récompenses */}
        <WalletHeaderDisplay />

        {/* Cloche de notifications - Action secondaire */}
        <div className='relative'>
          <Button
            variant='ghost'
            color='strawberry'
            size='sm'
            className='h-8 w-8 p-0! min-w-0 relative'
            iconCenter={FaRegBell}
          >
            <span className='sr-only'>Notifications</span>
          </Button>
          {/* Badge de notification (optionnel) */}
          <span className='absolute -top-1 -right-1 bg-strawberry-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold pointer-events-none'>
            3
          </span>
        </div>
      </div>
    </div>
  )
}

export default TopNavBar
