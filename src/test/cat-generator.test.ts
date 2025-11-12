import { generatePixelCat } from '../services/cat-generator.service'

/**
 * Test simple du générateur de chats pour vérifier les corrections
 */
function testCatGenerator (): void {
  console.log('🐱 Test du générateur de chats...')

  // Générer 3 chats pour tester
  for (let i = 1; i <= 3; i++) {
    const cat = generatePixelCat()
    console.log(`Chat ${i} généré:`, cat.length, 'caractères')

    // Vérifier que c'est bien du SVG
    if (cat.includes('<svg') && cat.includes('</svg>')) {
      console.log(`✅ Chat ${i}: SVG valide`)
    } else {
      console.log(`❌ Chat ${i}: SVG invalide`)
    }

    // Vérifier la taille de la viewBox (doit être 200x200)
    if (cat.includes('viewBox="0 0 200 200"')) {
      console.log(`✅ Chat ${i}: Dimensions correctes`)
    } else {
      console.log(`❌ Chat ${i}: Dimensions incorrectes`)
    }
  }

  console.log('🎉 Test terminé !')
}

// Exporter pour utilisation potentielle
export { testCatGenerator }

// Auto-test si exécuté directement
if (typeof window === 'undefined') {
  testCatGenerator()
}
