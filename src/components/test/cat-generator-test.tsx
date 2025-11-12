'use client'

import { useState } from 'react'
import { generatePixelCat } from '@/services/cat-generator.service'

/**
 * Composant de test pour le générateur de chats en pixel art
 *
 * Permet de tester la génération et l'affichage des chats SVG
 */
export function CatGeneratorTest (): React.ReactNode {
  const [catSvg, setCatSvg] = useState<string>('')
  const [generationCount, setGenerationCount] = useState(0)

  const handleGenerateNewCat = (): void => {
    const newCat = generatePixelCat()
    setCatSvg(newCat)
    setGenerationCount(prev => prev + 1)
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg'>
      <h2 className='text-xl font-bold text-center mb-4'>
        Générateur de Chats Pixel
      </h2>

      {/* Zone d'affichage du chat */}
      <div className='w-full h-64 bg-latte-50 border-2 border-dashed border-latte-200 rounded-lg flex items-center justify-center mb-4'>
        {catSvg !== ''
          ? (
            <div
              className='w-48 h-48'
              dangerouslySetInnerHTML={{ __html: catSvg }}
            />
            )
          : (
            <div className='text-center text-latte-500'>
              <p>Cliquez pour générer un chat !</p>
            </div>
            )}
      </div>

      {/* Bouton de génération */}
      <button
        onClick={handleGenerateNewCat}
        className='w-full bg-strawberry-500 hover:bg-strawberry-600 text-white font-medium py-3 px-4 rounded-lg transition-colors'
      >
        {generationCount === 0 ? 'Générer mon premier chat' : `Générer un nouveau chat (${generationCount} générés)`}
      </button>

      {/* Affichage du SVG brut pour débogage */}
      {catSvg !== '' && (
        <details className='mt-4'>
          <summary className='cursor-pointer text-sm text-blueberry-600 hover:text-blueberry-800'>
            Voir le code SVG
          </summary>
          <pre className='mt-2 p-3 bg-latte-50 text-xs overflow-auto rounded border'>
            {catSvg}
          </pre>
        </details>
      )}
    </div>
  )
}

export default CatGeneratorTest
