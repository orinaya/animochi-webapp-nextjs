'use client'

/**
 * Breadcrumb - Fil d'Ariane pour la navigation
 */

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

/**
 * Composant fil d'Ariane
 *
 * Respecte le principe SRP : Affiche uniquement le fil d'Ariane
 *
 * @param {BreadcrumbProps} props - Les propriétés du composant
 * @returns {React.ReactNode} Le fil d'Ariane
 */
export function Breadcrumb ({ items }: BreadcrumbProps): React.ReactNode {
  return (
    <nav className='flex items-center gap-2 text-sm mb-6'>
      {items.map((item, index) => (
        <div key={index} className='flex items-center gap-2'>
          {index > 0 && (
            <span className='text-latte-400'>/</span>
          )}
          {item.href !== undefined && item.href !== null
            ? (
              <Link
                href={item.href}
                className='text-blueberry-600 hover:text-blueberry-800 transition-colors font-medium'
              >
                {item.label}
              </Link>
              )
            : (
              <span className='text-latte-700 font-medium'>{item.label}</span>
              )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
