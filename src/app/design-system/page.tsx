'use client'

import { useState } from 'react'
import { FiHome, FiMail, FiLock, FiSearch, FiUser } from 'react-icons/fi'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { Button, InputField } from '@/components/ui'
import CatGeneratorTest from '@/components/test/cat-generator-test'

interface ComponentConfig {
  readonly id: string
  readonly name: string
  readonly icon: string
  readonly description: string
}

const components: readonly ComponentConfig[] = [
  { id: 'overview', name: 'Vue d\'ensemble', icon: '👋', description: 'Introduction au design system Animochi' },
  { id: 'colors', name: 'Couleurs', icon: '🎨', description: 'Palette de couleurs thématiques' },
  { id: 'typography', name: 'Typographie', icon: '📝', description: 'Styles de texte et hiérarchie' },
  { id: 'buttons', name: 'Boutons', icon: '🔘', description: 'Composant Button avec variantes' },
  { id: 'inputs', name: 'Champs de saisie', icon: '📝', description: 'InputField et composants de formulaire' },
  { id: 'cat-generator', name: 'Générateur de Chats', icon: '🐱', description: 'Test du générateur de chats en pixel art' },
  { id: 'tokens', name: 'Design Tokens', icon: '⚙️', description: 'Variables et espacements' },
  { id: 'guidelines', name: 'Guidelines', icon: '📋', description: 'Bonnes pratiques et utilisation' }
] as const

// Helper functions suivant les principes SOLID (Single Responsibility)
function getColorVariants (): readonly number[] {
  return [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 950] as const
}

function getThemeColors (): ReadonlyArray<{ name: string, color: string, description: string, mainVariant: number }> {
  return [
    { name: 'Blueberry', color: 'blueberry', description: 'Couleur principale pour les actions primaires', mainVariant: 950 },
    { name: 'Strawberry', color: 'strawberry', description: 'Couleur d\'accent pour les CTA et erreurs', mainVariant: 400 },
    { name: 'Peach', color: 'peach', description: 'Couleur chaleureuse pour les succès', mainVariant: 100 },
    { name: 'Latte', color: 'latte', description: 'Couleur neutre pour les textes et arrière-plans', mainVariant: 50 }
  ] as const
}

function DesignSystemPage (): React.ReactNode {
  const [activeComponent, setActiveComponent] = useState('overview')

  // Vue d'ensemble - Section d'introduction
  const OverviewSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-blueberry-950'>
          Design System Animochi
        </h1>
        <p className='text-lg text-latte-700 max-w-3xl mx-auto'>
          Un système de design cohérent et accessible pour créer des expériences utilisateur
          exceptionnelles dans l'univers Animochi.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-2xl border border-latte-200 hover:border-blueberry-200 transition-all duration-300'>
          <h3 className='text-lg font-semibold text-blueberry-950 mb-2'>🎨 Palette Cohérente</h3>
          <p className='text-latte-700 text-sm'>
            4 couleurs thématiques principales avec leurs variantes (50-950) pour une cohérence visuelle parfaite.
          </p>
        </div>
        <div className='bg-white p-6 rounded-2xl border border-latte-200 hover:border-strawberry-200 transition-all duration-300'>
          <h3 className='text-lg font-semibold text-blueberry-950 mb-2'>🧩 Composants Modulaires</h3>
          <p className='text-latte-700 text-sm'>
            Composants réutilisables suivant les principes SOLID pour une architecture maintenable.
          </p>
        </div>
        <div className='bg-white p-6 rounded-2xl border border-latte-200 hover:border-peach-200 transition-all duration-300'>
          <h3 className='text-lg font-semibold text-blueberry-950 mb-2'>♿ Accessible</h3>
          <p className='text-latte-700 text-sm'>
            Conçu avec l'accessibilité en tête, respectant les standards WCAG pour tous les utilisateurs.
          </p>
        </div>
      </div>

      <div className='bg-linear-to-r from-blueberry-50 to-strawberry-50 p-8 rounded-2xl'>
        <h2 className='text-2xl font-bold text-blueberry-950 mb-4'>Architecture & Principes</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold text-blueberry-900 mb-3'>🏗️ Clean Architecture</h3>
            <ul className='space-y-2 text-sm text-latte-700'>
              <li>• <strong>Domain</strong> : Logique métier pure</li>
              <li>• <strong>Application</strong> : Orchestration et DTOs</li>
              <li>• <strong>Infrastructure</strong> : Implémentations concrètes</li>
              <li>• <strong>Presentation</strong> : UI et état local</li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-strawberry-700 mb-3'>⚡ Principes SOLID</h3>
            <ul className='space-y-2 text-sm text-latte-700'>
              <li>• <strong>SRP</strong> : Une responsabilité par composant</li>
              <li>• <strong>OCP</strong> : Ouvert/fermé via composition</li>
              <li>• <strong>LSP</strong> : Interfaces interchangeables</li>
              <li>• <strong>ISP</strong> : Interfaces segregées</li>
              <li>• <strong>DIP</strong> : Dépendance vers abstractions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const ColorSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Palette de couleurs</h2>
        <p className='text-latte-700 mb-6'>
          Notre design system utilise 4 couleurs thématiques principales avec leurs variantes.
          Chaque couleur a un rôle sémantique précis dans l'interface.
        </p>
      </div>

      {getThemeColors().map((colorGroup) => (
        <div key={colorGroup.color} className='space-y-4'>
          <div className='flex items-center gap-4 mb-4'>
            <div className={`w-6 h-6 rounded-full bg-${colorGroup.color}-${colorGroup.mainVariant} border-2 border-white shadow-md`} />
            <div>
              <h3 className='text-xl font-semibold text-blueberry-950'>{colorGroup.name}</h3>
              <p className='text-sm text-latte-600'>{colorGroup.description}</p>
            </div>
          </div>
          <div className='grid grid-cols-5 md:grid-cols-10 gap-3'>
            {getColorVariants().map((variant) => (
              <div key={variant} className='text-center group'>
                <div
                  className={`
                    w-full h-16 md:h-20 rounded-xl border border-latte-200
                    bg-${colorGroup.color}-${variant}
                    group-hover:scale-105 transition-transform duration-200
                    shadow-sm hover:shadow-md
                  `}
                />
                <p className='text-xs mt-2 font-medium text-latte-700'>{variant}</p>
                <p className={`text-xs text-${colorGroup.color}-${variant} font-mono`}>
                  {colorGroup.color}-{variant}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Section couleurs sémantiques */}
      <div className='mt-12 p-6 bg-white rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-4'>🎯 Couleurs sémantiques</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex items-center gap-3 p-4 bg-success-50 rounded-xl'>
            <div className='w-4 h-4 rounded-full bg-success-500' />
            <div>
              <p className='font-medium text-success-800'>Success</p>
              <p className='text-xs text-success-600'>Confirmations et succès</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-4 bg-warning-50 rounded-xl'>
            <div className='w-4 h-4 rounded-full bg-warning-500' />
            <div>
              <p className='font-medium text-warning-800'>Warning</p>
              <p className='text-xs text-warning-600'>Avertissements</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-4 bg-red-50 rounded-xl'>
            <div className='w-4 h-4 rounded-full bg-red-500' />
            <div>
              <p className='font-medium text-red-800'>Danger</p>
              <p className='text-xs text-red-600'>Erreurs et suppressions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const TypographySection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Typographie</h2>
        <p className='text-latte-700 mb-6'>
          Hiérarchie typographique claire et cohérente utilisant les polices Outfit et Tehegan.
        </p>
      </div>

      {/* Hiérarchie des titres */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>Hiérarchie des titres</h3>
        <div className='space-y-6'>
          <div className='flex flex-col md:flex-row md:items-baseline gap-4 p-4 border-l-4 border-blueberry-200'>
            <h1 className='text-4xl font-bold text-blueberry-950 font-tehegan'>Titre H1 - 4xl</h1>
            <code className='text-sm text-latte-600 bg-latte-100 px-2 py-1 rounded'>text-4xl font-bold</code>
          </div>
          <div className='flex flex-col md:flex-row md:items-baseline gap-4 p-4 border-l-4 border-strawberry-200'>
            <h2 className='text-3xl font-bold text-blueberry-950'>Titre H2 - 3xl</h2>
            <code className='text-sm text-latte-600 bg-latte-100 px-2 py-1 rounded'>text-3xl font-bold</code>
          </div>
          <div className='flex flex-col md:flex-row md:items-baseline gap-4 p-4 border-l-4 border-peach-200'>
            <h3 className='text-2xl font-semibold text-blueberry-950'>Titre H3 - 2xl</h3>
            <code className='text-sm text-latte-600 bg-latte-100 px-2 py-1 rounded'>text-2xl font-semibold</code>
          </div>
          <div className='flex flex-col md:flex-row md:items-baseline gap-4 p-4 border-l-4 border-latte-200'>
            <h4 className='text-xl font-semibold text-blueberry-950'>Titre H4 - xl</h4>
            <code className='text-sm text-latte-600 bg-latte-100 px-2 py-1 rounded'>text-xl font-semibold</code>
          </div>
        </div>
      </div>

      {/* Corps de texte */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>Corps de texte</h3>
        <div className='space-y-4'>
          <div className='p-4 bg-latte-25 rounded-xl'>
            <p className='text-lg text-blueberry-950 mb-2'>Texte large - Utilisé pour les introductions importantes</p>
            <code className='text-sm text-latte-600'>text-lg</code>
          </div>
          <div className='p-4 bg-latte-25 rounded-xl'>
            <p className='text-base text-latte-800 mb-2'>Texte standard - Utilisé pour le contenu principal</p>
            <code className='text-sm text-latte-600'>text-base</code>
          </div>
          <div className='p-4 bg-latte-25 rounded-xl'>
            <p className='text-sm text-latte-700 mb-2'>Texte petit - Utilisé pour les descriptions et métadonnées</p>
            <code className='text-sm text-latte-600'>text-sm</code>
          </div>
          <div className='p-4 bg-latte-25 rounded-xl'>
            <p className='text-xs text-latte-600 mb-2'>Texte très petit - Utilisé pour les légendes et mentions légales</p>
            <code className='text-sm text-latte-600'>text-xs</code>
          </div>
        </div>
      </div>

      {/* Polices spéciales */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>Polices spéciales</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <h4 className='text-4xl font-tehegan text-blueberry-950'>Tehegan</h4>
            <p className='text-sm text-latte-700'>
              Police personnalisée pour les titres principaux et la marque Animochi.
            </p>
            <code className='text-xs bg-latte-100 px-2 py-1 rounded'>font-tehegan</code>
          </div>
          <div className='space-y-4'>
            <h4 className='text-2xl text-latte-800'>Outfit</h4>
            <p className='text-sm text-latte-700'>
              Police secondaire pour le contenu et les éléments d'interface.
            </p>
            <code className='text-xs bg-latte-100 px-2 py-1 rounded'>font-sans (Outfit)</code>
          </div>
        </div>
      </div>
    </div>
  )

  const ButtonSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Boutons</h2>
        <p className='text-latte-700 mb-6'>
          Composant Button avec ses différentes variantes, tailles et couleurs.
          Suit les principes d'accessibilité et de cohérence visuelle.
        </p>
      </div>

      {/* Guide d'utilisation rapide */}
      <div className='bg-blue-50 border border-blue-200 rounded-2xl p-6'>
        <h3 className='text-lg font-semibold text-blue-900 mb-4'>💡 Guide d'utilisation</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='font-medium text-blue-800 mb-2'>Primary (Blueberry/Strawberry)</p>
            <p className='text-blue-700'>Actions principales: validation, soumission</p>
          </div>
          <div>
            <p className='font-medium text-blue-800 mb-2'>Secondary</p>
            <p className='text-blue-700'>Actions secondaires: annulation, retour</p>
          </div>
          <div>
            <p className='font-medium text-blue-800 mb-2'>Outline</p>
            <p className='text-blue-700'>Actions alternatives et filtres</p>
          </div>
          <div>
            <p className='font-medium text-blue-800 mb-2'>Ghost</p>
            <p className='text-blue-700'>Actions discrètes, liens d'action</p>
          </div>
        </div>
      </div>

      {/* Variantes principales */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Variantes principales</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='space-y-3 text-center'>
              <Button variant='primary' color='strawberry'>Primary</Button>
              <p className='text-xs text-latte-600'>Actions principales</p>
            </div>
            <div className='space-y-3 text-center'>
              <Button variant='secondary' color='blueberry'>Secondary</Button>
              <p className='text-xs text-latte-600'>Actions secondaires</p>
            </div>
            <div className='space-y-3 text-center'>
              <Button variant='outline' color='peach'>Outline</Button>
              <p className='text-xs text-latte-600'>Actions alternatives</p>
            </div>
            <div className='space-y-3 text-center'>
              <Button variant='ghost' color='latte'>Ghost</Button>
              <p className='text-xs text-latte-600'>Actions discrètes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons spéciaux pour OAuth */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Boutons OAuth</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <Button variant='google' size='lg' className='w-full'>
                Se connecter avec Google
              </Button>
              <Button variant='github' size='lg' className='w-full'>
                Se connecter avec GitHub
              </Button>
            </div>
            <div className='space-y-4'>
              <Button variant='google' size='sm'>Google</Button>
              <Button variant='github' size='sm'>GitHub</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tailles */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Tailles disponibles</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='flex flex-wrap items-end gap-6'>
            <div className='text-center space-y-2'>
              <Button size='sm' variant='primary' color='strawberry'>Small</Button>
              <p className='text-xs text-latte-600'>sm</p>
            </div>
            <div className='text-center space-y-2'>
              <Button size='md' variant='primary' color='strawberry'>Medium</Button>
              <p className='text-xs text-latte-600'>md (défaut)</p>
            </div>
            <div className='text-center space-y-2'>
              <Button size='lg' variant='primary' color='strawberry'>Large</Button>
              <p className='text-xs text-latte-600'>lg</p>
            </div>
            <div className='text-center space-y-2'>
              <Button size='xl' variant='primary' color='strawberry'>Extra Large</Button>
              <p className='text-xs text-latte-600'>xl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons avec icônes */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Avec icônes</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Button variant='primary' color='blueberry' iconBefore={FiHome}>
              Accueil
            </Button>
            <Button variant='outline' color='peach' iconBefore={FiSearch}>
              Rechercher
            </Button>
            <Button variant='secondary' color='latte' iconAfter={FiMail}>
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* États et interactions */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>États et interactions</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-3'>
              <p className='text-sm font-medium text-latte-800'>État normal</p>
              <Button variant='primary' color='strawberry'>Normal</Button>
            </div>
            <div className='space-y-3'>
              <p className='text-sm font-medium text-latte-800'>État focus</p>
              <Button variant='primary' color='strawberry' className='ring-2 ring-strawberry-300'>
                Focus
              </Button>
            </div>
            <div className='space-y-3'>
              <p className='text-sm font-medium text-latte-800'>État désactivé</p>
              <Button variant='primary' color='strawberry' disabled>
                Désactivé
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Code d'exemple */}
      <div className='bg-latte-950 text-latte-100 p-6 rounded-2xl'>
        <h4 className='text-lg font-semibold mb-4'>💻 Exemple d'utilisation</h4>
        <pre className='text-sm font-mono overflow-x-auto'>
          {`<Button
  variant="primary"
  color="strawberry"
  size="md"
  iconBefore={FiHome}
  onClick={() => console.log('Clicked!')}
>
  Bouton d'exemple
</Button>`}
        </pre>
      </div>

      {/* Tableau complet des variantes */}
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-semibold'>Matrice complète des variantes</h3>
          <p className='text-sm text-latte-600 mt-1'>
            Toutes les combinaisons couleurs × variantes × états
          </p>
        </div>

        {/* Tableau avec headers */}
        <div className='overflow-x-auto bg-white border border-latte-200 rounded-xl'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-latte-200'>
                <th className='text-left p-4 font-semibold text-latte-800 min-w-32'>
                  Couleur / État
                </th>
                <th className='text-center p-4 font-semibold text-latte-800 min-w-40'>
                  Primary
                </th>
                <th className='text-center p-4 font-semibold text-latte-800 min-w-40'>
                  Secondary
                </th>
                <th className='text-center p-4 font-semibold text-latte-800 min-w-40'>
                  Outline
                </th>
                <th className='text-center p-4 font-semibold text-latte-800 min-w-40'>
                  Ghost
                </th>
                <th className='text-center p-4 font-semibold text-latte-800 min-w-40'>
                  Google
                </th>
                <th className='text-center p-4 font-semibold text-latte-800 min-w-40'>
                  GitHub
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Blueberry */}
              <tr className='border-b border-latte-100'>
                <td className='p-4 font-medium text-blueberry-700 bg-blueberry-25'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-blueberry-500' />
                    Blueberry
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='primary' color='blueberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='primary' color='blueberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='primary' color='blueberry' className='ring-2 ring-blueberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='primary' color='blueberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='secondary' color='blueberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='secondary' color='blueberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='secondary' color='blueberry' className='ring-2 ring-blueberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='secondary' color='blueberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='outline' color='blueberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='outline' color='blueberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='outline' color='blueberry' className='ring-2 ring-blueberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='outline' color='blueberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='ghost' color='blueberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='ghost' color='blueberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='ghost' color='blueberry' className='ring-2 ring-blueberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='ghost' color='blueberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='google' iconBefore={FaGoogle}>Google</Button>
                    <div className='group'>
                      <Button size='sm' variant='google' iconBefore={FaGoogle} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} className='ring-2 ring-blue-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='github' iconBefore={FaGithub}>GitHub</Button>
                    <div className='group'>
                      <Button size='sm' variant='github' iconBefore={FaGithub} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='github' iconBefore={FaGithub} className='ring-2 ring-gray-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='github' iconBefore={FaGithub} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
              </tr>

              {/* Strawberry */}
              <tr className='border-b border-latte-100'>
                <td className='p-4 font-medium text-strawberry-700 bg-strawberry-25'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-strawberry-500' />
                    Strawberry
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='primary' color='strawberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='primary' color='strawberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='primary' color='strawberry' className='ring-2 ring-strawberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='primary' color='strawberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='secondary' color='strawberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='secondary' color='strawberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='secondary' color='strawberry' className='ring-2 ring-strawberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='secondary' color='strawberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='outline' color='strawberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='outline' color='strawberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='outline' color='strawberry' className='ring-2 ring-strawberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='outline' color='strawberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='ghost' color='strawberry'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='ghost' color='strawberry' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='ghost' color='strawberry' className='ring-2 ring-strawberry-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='ghost' color='strawberry' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='google' iconBefore={FaGoogle}>Google</Button>
                    <div className='group'>
                      <Button size='sm' variant='google' iconBefore={FaGoogle} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} className='ring-2 ring-blue-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='github' iconBefore={FaGithub}>GitHub</Button>
                    <div className='group'>
                      <Button size='sm' variant='github' iconBefore={FaGithub} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='github' iconBefore={FaGithub} className='ring-2 ring-gray-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='github' iconBefore={FaGithub} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
              </tr>

              {/* Peach */}
              <tr className='border-b border-latte-100'>
                <td className='p-4 font-medium text-peach-700 bg-peach-25'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-peach-500' />
                    Peach
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='primary' color='peach'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='primary' color='peach' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='primary' color='peach' className='ring-2 ring-peach-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='primary' color='peach' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='secondary' color='peach'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='secondary' color='peach' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='secondary' color='peach' className='ring-2 ring-peach-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='secondary' color='peach' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='outline' color='peach'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='outline' color='peach' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='outline' color='peach' className='ring-2 ring-peach-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='outline' color='peach' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='ghost' color='peach'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='ghost' color='peach' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='ghost' color='peach' className='ring-2 ring-peach-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='ghost' color='peach' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='google' iconBefore={FaGoogle}>Google</Button>
                    <div className='group'>
                      <Button size='sm' variant='google' iconBefore={FaGoogle} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} className='ring-2 ring-blue-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='github' iconBefore={FaGithub}>GitHub</Button>
                    <div className='group'>
                      <Button size='sm' variant='github' iconBefore={FaGithub} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='github' iconBefore={FaGithub} className='ring-2 ring-gray-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='github' iconBefore={FaGithub} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
              </tr>

              {/* Latte */}
              <tr>
                <td className='p-4 font-medium text-latte-700 bg-latte-50'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-latte-500' />
                    Latte
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='primary' color='latte'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='primary' color='latte' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='primary' color='latte' className='ring-2 ring-latte-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='primary' color='latte' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='secondary' color='latte'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='secondary' color='latte' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='secondary' color='latte' className='ring-2 ring-latte-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='secondary' color='latte' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='outline' color='latte'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='outline' color='latte' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='outline' color='latte' className='ring-2 ring-latte-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='outline' color='latte' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='ghost' color='latte'>Normal</Button>
                    <div className='group'>
                      <Button size='sm' variant='ghost' color='latte' className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='ghost' color='latte' className='ring-2 ring-latte-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='ghost' color='latte' disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='google' iconBefore={FaGoogle}>Google</Button>
                    <div className='group'>
                      <Button size='sm' variant='google' iconBefore={FaGoogle} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} className='ring-2 ring-blue-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='google' iconBefore={FaGoogle} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
                <td className='p-4 text-center space-y-2'>
                  <div className='space-y-1'>
                    <Button size='sm' variant='github' iconBefore={FaGithub}>GitHub</Button>
                    <div className='group'>
                      <Button size='sm' variant='github' iconBefore={FaGithub} className='group-hover:scale-105'>
                        Hover
                      </Button>
                    </div>
                    <Button size='sm' variant='github' iconBefore={FaGithub} className='ring-2 ring-gray-300'>
                      Focus
                    </Button>
                    <Button size='sm' variant='github' iconBefore={FaGithub} disabled>
                      Disabled
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tableau des tailles */}
        <div className='mt-8'>
          <h4 className='text-md font-semibold mb-3'>Matrice des tailles</h4>
          <div className='overflow-x-auto bg-white border border-latte-200 rounded-xl'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-latte-200'>
                  <th className='text-left p-4 font-semibold text-latte-800'>
                    Taille
                  </th>
                  <th className='text-center p-4 font-semibold text-latte-800'>
                    Primary
                  </th>
                  <th className='text-center p-4 font-semibold text-latte-800'>
                    Secondary
                  </th>
                  <th className='text-center p-4 font-semibold text-latte-800'>
                    Outline
                  </th>
                  <th className='text-center p-4 font-semibold text-latte-800'>
                    Ghost
                  </th>
                  <th className='text-center p-4 font-semibold text-latte-800'>
                    Google
                  </th>
                  <th className='text-center p-4 font-semibold text-latte-800'>
                    GitHub
                  </th>
                </tr>
              </thead>
              <tbody>
                {['sm', 'md', 'lg', 'xl'].map((size) => (
                  <tr key={size} className='border-b border-latte-100 last:border-b-0'>
                    <td className='p-4 font-medium text-latte-700 bg-latte-25 capitalize'>
                      {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : size === 'lg' ? 'Large' : 'Extra Large'}
                    </td>
                    <td className='p-4 text-center'>
                      <Button size={size as 'sm' | 'md' | 'lg' | 'xl'} variant='primary' color='strawberry'>
                        Button
                      </Button>
                    </td>
                    <td className='p-4 text-center'>
                      <Button size={size as 'sm' | 'md' | 'lg' | 'xl'} variant='secondary' color='blueberry'>
                        Button
                      </Button>
                    </td>
                    <td className='p-4 text-center'>
                      <Button size={size as 'sm' | 'md' | 'lg' | 'xl'} variant='outline' color='peach'>
                        Button
                      </Button>
                    </td>
                    <td className='p-4 text-center'>
                      <Button size={size as 'sm' | 'md' | 'lg' | 'xl'} variant='ghost' color='latte'>
                        Button
                      </Button>
                    </td>
                    <td className='p-4 text-center'>
                      <Button size={size as 'sm' | 'md' | 'lg' | 'xl'} variant='google'>
                        Google
                      </Button>
                    </td>
                    <td className='p-4 text-center'>
                      <Button size={size as 'sm' | 'md' | 'lg' | 'xl'} variant='github'>
                        GitHub
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

  const InputSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Champs de saisie</h2>
        <p className='text-latte-700 mb-6'>
          Composant InputField avec ses différentes variantes et fonctionnalités.
          Conçu pour une excellente expérience utilisateur et accessibilité.
        </p>
      </div>

      {/* Champs basiques */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Champs de base</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              type='text'
              label='Nom complet'
              placeholder='Entrez votre nom'
            />
            <InputField
              type='email'
              label='Email'
              placeholder='exemple@email.com'
              leftIcon={FiMail}
            />
          </div>
        </div>
      </div>

      {/* Champs avec icônes */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Avec icônes</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              type='email'
              label='Email avec icône gauche'
              placeholder='exemple@email.com'
              leftIcon={FiMail}
            />
            <InputField
              type='text'
              label='Recherche avec icône droite'
              placeholder='Rechercher...'
              rightIcon={FiSearch}
            />
          </div>
        </div>
      </div>

      {/* Champs mot de passe */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Mot de passe avec toggle</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              type='password'
              label='Mot de passe'
              placeholder='••••••••'
              leftIcon={FiLock}
            />
            <InputField
              type='password'
              label='Confirmer le mot de passe'
              placeholder='••••••••'
              leftIcon={FiLock}
            />
          </div>
        </div>
      </div>

      {/* États de validation */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>États de validation</h3>
        <div className='bg-white p-8 rounded-2xl border border-latte-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InputField
              type='email'
              label='Email invalide'
              value='email-invalide'
              error="Format d'email invalide"
              leftIcon={FiMail}
            />
            <InputField
              type='text'
              label='Champ désactivé'
              value='Valeur non modifiable'
              disabled
              leftIcon={FiUser}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const TokensSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Design Tokens</h2>
        <p className='text-latte-700 mb-6'>
          Variables CSS et espacements utilisés de manière cohérente dans tout le design system.
        </p>
      </div>

      {/* Espacements */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>Espacements (Spacing)</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24].map((size) => (
            <div key={size} className='text-center'>
              <div className={`bg-blueberry-200 h-${size} w-full rounded mb-2`} />
              <p className='text-xs font-mono text-latte-700'>h-{size}</p>
              <p className='text-xs text-latte-600'>{size * 0.25}rem</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rayons de bordure */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>Rayons de bordure (Border Radius)</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-strawberry-200 rounded mx-auto mb-2' />
            <p className='text-sm font-mono text-latte-700'>rounded</p>
            <p className='text-xs text-latte-600'>0.25rem</p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-strawberry-200 rounded-lg mx-auto mb-2' />
            <p className='text-sm font-mono text-latte-700'>rounded-lg</p>
            <p className='text-xs text-latte-600'>0.5rem</p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-strawberry-200 rounded-xl mx-auto mb-2' />
            <p className='text-sm font-mono text-latte-700'>rounded-xl</p>
            <p className='text-xs text-latte-600'>0.75rem</p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-strawberry-200 rounded-2xl mx-auto mb-2' />
            <p className='text-sm font-mono text-latte-700'>rounded-2xl</p>
            <p className='text-xs text-latte-600'>1rem</p>
          </div>
        </div>
      </div>

      {/* Shadows */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>Ombres (Shadows)</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center p-4'>
            <div className='w-16 h-16 bg-white shadow-sm rounded-xl mx-auto mb-4' />
            <p className='text-sm font-mono text-latte-700'>shadow-sm</p>
            <p className='text-xs text-latte-600'>Subtile</p>
          </div>
          <div className='text-center p-4'>
            <div className='w-16 h-16 bg-white shadow-md rounded-xl mx-auto mb-4' />
            <p className='text-sm font-mono text-latte-700'>shadow-md</p>
            <p className='text-xs text-latte-600'>Moyenne</p>
          </div>
          <div className='text-center p-4'>
            <div className='w-16 h-16 bg-white shadow-lg rounded-xl mx-auto mb-4' />
            <p className='text-sm font-mono text-latte-700'>shadow-lg</p>
            <p className='text-xs text-latte-600'>Importante</p>
          </div>
        </div>
      </div>
    </div>
  )

  const GuidelinesSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>Guidelines d'utilisation</h2>
        <p className='text-latte-700 mb-6'>
          Bonnes pratiques et directives pour une utilisation cohérente du design system.
        </p>
      </div>

      {/* Principes généraux */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>🎯 Principes généraux</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-2 h-2 bg-blueberry-500 rounded-full mt-2 shrink-0' />
              <div>
                <h4 className='font-semibold text-blueberry-950'>Cohérence</h4>
                <p className='text-sm text-latte-700'>Utilisez toujours les mêmes composants pour des actions similaires</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-2 h-2 bg-strawberry-400 rounded-full mt-2 shrink-0' />
              <div>
                <h4 className='font-semibold text-blueberry-950'>Accessibilité</h4>
                <p className='text-sm text-latte-700'>Respectez les contrastes et utilisez des labels appropriés</p>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-2 h-2 bg-peach-100 rounded-full mt-2 shrink-0' />
              <div>
                <h4 className='font-semibold text-blueberry-950'>Performance</h4>
                <p className='text-sm text-latte-700'>Optimisez les interactions et les temps de chargement</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-2 h-2 bg-latte-400 rounded-full mt-2 shrink-0' />
              <div>
                <h4 className='font-semibold text-blueberry-950'>Lisibilité</h4>
                <p className='text-sm text-latte-700'>Maintenez une hiérarchie claire et des textes lisibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exemples à faire et à éviter */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-green-50 p-6 rounded-2xl border border-green-200'>
          <h4 className='text-lg font-semibold text-green-800 mb-4'>✅ À faire</h4>
          <ul className='space-y-2 text-sm text-green-700'>
            <li>• Utilisez Primary pour l'action principale</li>
            <li>• Groupez les actions liées</li>
            <li>• Respectez l'ordre visuel des priorités</li>
            <li>• Utilisez les couleurs sémantiques</li>
          </ul>
        </div>
        <div className='bg-red-50 p-6 rounded-2xl border border-red-200'>
          <h4 className='text-lg font-semibold text-red-800 mb-4'>❌ À éviter</h4>
          <ul className='space-y-2 text-sm text-red-700'>
            <li>• Plusieurs boutons Primary côte à côte</li>
            <li>• Mélanger les styles sans logique</li>
            <li>• Ignorer les états disabled/loading</li>
            <li>• Utiliser des couleurs incorrectes</li>
          </ul>
        </div>
      </div>

      {/* Code examples */}
      <div className='bg-latte-950 text-latte-100 p-8 rounded-2xl'>
        <h4 className='text-lg font-semibold mb-4'>💻 Import et utilisation</h4>
        <pre className='text-sm font-mono overflow-x-auto whitespace-pre-wrap'>
          {`// Import des composants
import { Button, InputField } from '@/components/ui'

// Utilisation avec TypeScript
interface FormProps {
  onSubmit: (data: FormData) => void
}

function MyForm({ onSubmit }: FormProps) {
  return (
    <form onSubmit={onSubmit}>
      <InputField
        type="email"
        label="Email"
        required
        leftIcon={FiMail}
      />
      <Button
        type="submit"
        variant="primary"
        color="strawberry"
      >
        Soumettre
      </Button>
    </form>
  )
}`}
        </pre>
      </div>
    </div>
  )

  // Section Générateur de Chats - Test du service de génération
  const CatGeneratorSection = (): React.ReactNode => (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold mb-4'>🐱 Générateur de Chats en Pixel Art</h2>
        <p className='text-latte-700 mb-6'>
          Testez le service de génération de chats en pixel art 20x20 avec des couleurs aléatoires
          et des variations dans les rayures et caractéristiques.
        </p>
      </div>

      {/* Composant de test intégré */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>🎮 Interface de test</h3>
        <div className='flex justify-center'>
          <CatGeneratorTest />
        </div>
      </div>

      {/* Caractéristiques techniques */}
      <div className='bg-linear-to-r from-blueberry-50 to-strawberry-50 p-8 rounded-2xl'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>⚙️ Caractéristiques techniques</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white/80 p-6 rounded-xl border border-white/50'>
            <h4 className='font-semibold text-blueberry-800 mb-3'>🎨 Palettes de couleurs</h4>
            <p className='text-sm text-blueberry-700 mb-2'>
              15 palettes prédéfinies + génération automatique de nouvelles palettes
            </p>
            <p className='text-xs text-latte-600'>
              Service: <code className='bg-latte-100 px-1 rounded'>cat-generator.service.ts</code>
            </p>
          </div>

          <div className='bg-white/80 p-6 rounded-xl border border-white/50'>
            <h4 className='font-semibold text-strawberry-700 mb-3'>🎭 Rayures et variations</h4>
            <p className='text-sm text-strawberry-600 mb-2'>
              50% de chance d'avoir des rayures visibles ou cachées
            </p>
            <p className='text-xs text-latte-600'>
              Couleurs variables pour joues, museau, pattes et moustaches
            </p>
          </div>

          <div className='bg-white/80 p-6 rounded-xl border border-white/50'>
            <h4 className='font-semibold text-peach-700 mb-3'>📐 Dimensions SVG</h4>
            <p className='text-sm text-peach-600 mb-2'>
              Grille 20x20 pixels avec optimisation SVG
            </p>
            <p className='text-xs text-latte-600'>
              Format: SVG avec paths optimisés
            </p>
          </div>
        </div>
      </div>

      {/* Architecture et principes SOLID */}
      <div className='bg-white p-8 rounded-2xl border border-latte-200'>
        <h3 className='text-lg font-semibold text-blueberry-950 mb-6'>🏗️ Architecture et principes SOLID</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h4 className='font-semibold text-blueberry-900 mb-4'>Single Responsibility Principle</h4>
            <ul className='space-y-2 text-sm text-latte-700'>
              <li className='flex items-start gap-2'>
                <span className='text-blueberry-500'>•</span>
                <span><code className='bg-latte-50 px-1 rounded text-xs'>generatePixelCat()</code> - Fonction principale de génération</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blueberry-500'>•</span>
                <span><code className='bg-latte-50 px-1 rounded text-xs'>generateColorPalette()</code> - Création des palettes</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blueberry-500'>•</span>
                <span><code className='bg-latte-50 px-1 rounded text-xs'>createCatSVG()</code> - Génération du SVG</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-strawberry-700 mb-4'>Open/Closed Principle</h4>
            <ul className='space-y-2 text-sm text-latte-700'>
              <li className='flex items-start gap-2'>
                <span className='text-strawberry-400'>•</span>
                <span>Nouvelles palettes ajoutables sans modification du code existant</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-strawberry-400'>•</span>
                <span>Patterns de rayures extensibles via configuration</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-strawberry-400'>•</span>
                <span>Interface flexible pour nouveaux types de variations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Documentation d'utilisation */}
      <div className='bg-latte-950 text-latte-100 p-8 rounded-2xl'>
        <h4 className='text-lg font-semibold mb-6'>💻 Utilisation du service</h4>
        <pre className='text-sm font-mono overflow-x-auto whitespace-pre-wrap mb-6'>
          {`// Import du service
import { generatePixelCat } from '@/services/cat-generator.service'

// Génération simple
const catSvg = generatePixelCat()

// Utilisation dans un composant React
function CatDisplay() {
  const [catSvg, setCatSvg] = useState('')
  
  const generateNewCat = () => {
    const newCat = generatePixelCat()
    setCatSvg(newCat)
  }
  
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: catSvg }} />
      <button onClick={generateNewCat}>Nouveau chat</button>
    </div>
  )
}`}
        </pre>
        <div className='text-xs text-latte-300'>
          <p><strong>Note:</strong> Le service est conçu selon les principes Clean Architecture.</p>
          <p>Aucune dépendance externe, facilement testable et extensible.</p>
        </div>
      </div>
    </div>
  )

  const renderContent = (): React.ReactNode => {
    switch (activeComponent) {
      case 'overview':
        return <OverviewSection />
      case 'colors':
        return <ColorSection />
      case 'typography':
        return <TypographySection />
      case 'buttons':
        return <ButtonSection />
      case 'inputs':
        return <InputSection />
      case 'cat-generator':
        return <CatGeneratorSection />
      case 'tokens':
        return <TokensSection />
      case 'guidelines':
        return <GuidelinesSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className='min-h-screen bg-latte-50'>
      <div className='flex'>
        {/* Sidebar améliorée */}
        <div className='w-80 bg-white border-r border-latte-200 min-h-screen sticky top-0'>
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 bg-linear-to-r from-blueberry-500 to-strawberry-400 rounded-xl flex items-center justify-center'>
                <span className='text-white text-xl'>🎨</span>
              </div>
              <div>
                <h1 className='text-xl font-bold text-blueberry-950'>Design System</h1>
                <p className='text-sm text-latte-600'>Animochi v1.0</p>
              </div>
            </div>
            <nav className='space-y-2'>
              {components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setActiveComponent(component.id)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-200
                    flex items-start gap-4 group
                    ${activeComponent === component.id
                      ? 'bg-blueberry-50 text-blueberry-950 border border-blueberry-200 shadow-sm'
                      : 'text-latte-700 hover:bg-latte-50 hover:text-blueberry-900'
                    }
                  `}
                >
                  <span className='text-xl shrink-0'>{component.icon}</span>
                  <div className='flex-1'>
                    <p className='font-semibold text-sm'>{component.name}</p>
                    <p className='text-xs opacity-70 mt-1'>{component.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className='flex-1 p-8'>
          <div className='max-w-6xl mx-auto'>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignSystemPage
