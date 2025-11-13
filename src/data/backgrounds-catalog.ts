/**
 * Catalogue des arrière-plans disponibles
 * Respecte le principe SRP : Gère uniquement les données des backgrounds
 *
 * @module data/backgrounds-catalog
 */

import type { AccessoryData } from '@/types/monster-accessories'

/**
 * Catalogue complet des arrière-plans disponibles dans la boutique
 *
 * Inclut des images et des dégradés CSS
 */
export const BACKGROUNDS_CATALOG: AccessoryData[] = [
  // ============================================================================
  // ARRIÈRE-PLANS IMAGES
  // ============================================================================
  {
    name: 'Plage Tropicale',
    category: 'background',
    emoji: '🏖️',
    description: 'Une plage de sable fin avec des palmiers',
    price: 200,
    rarity: 'common',
    imagePath: '/assets/images/background/beach.jpg'
  },
  {
    name: 'Champs de Fleurs',
    category: 'background',
    emoji: '🌸',
    description: 'Un magnifique champ de fleurs colorées',
    price: 250,
    rarity: 'rare',
    imagePath: '/assets/images/background/champs.jpg'
  },
  {
    name: 'Cirque Magique',
    category: 'background',
    emoji: '🎪',
    description: "L'ambiance festive d'un cirque",
    price: 400,
    rarity: 'epic',
    imagePath: '/assets/images/background/circus.jpg'
  },
  {
    name: 'Forêt Enchantée',
    category: 'background',
    emoji: '🌲',
    description: 'Une forêt mystérieuse et verdoyante',
    price: 300,
    rarity: 'rare',
    imagePath: '/assets/images/background/forest.jpg'
  },
  {
    name: 'Jardin Zen',
    category: 'background',
    emoji: '🎋',
    description: 'Un jardin japonais apaisant',
    price: 500,
    rarity: 'epic',
    imagePath: '/assets/images/background/garden.jpg'
  },
  {
    name: 'Marché Oriental',
    category: 'background',
    emoji: '🏮',
    description: 'Un marché coloré et animé',
    price: 350,
    rarity: 'rare',
    imagePath: '/assets/images/background/market.jpg'
  },

  // ============================================================================
  // ARRIÈRE-PLANS DÉGRADÉS
  // ============================================================================
  {
    name: 'Dégradé Aurore',
    category: 'background',
    emoji: '🌅',
    description: 'Un magnifique dégradé rose et orange',
    price: 150,
    rarity: 'common',
    svg: `<defs>
      <linearGradient id="gradient-aurora" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#fad0c4;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-aurora)"/>`
  },
  {
    name: 'Dégradé Océan',
    category: 'background',
    emoji: '🌊',
    description: "Un dégradé bleu profond comme l'océan",
    price: 150,
    rarity: 'common',
    svg: `<defs>
      <linearGradient id="gradient-ocean" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-ocean)"/>`
  },
  {
    name: 'Dégradé Forêt',
    category: 'background',
    emoji: '🌿',
    description: 'Un dégradé vert naturel et apaisant',
    price: 150,
    rarity: 'common',
    svg: `<defs>
      <linearGradient id="gradient-forest" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#56ab2f;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#a8e063;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-forest)"/>`
  },
  {
    name: 'Dégradé Coucher de Soleil',
    category: 'background',
    emoji: '🌇',
    description: 'Un dégradé chaleureux de coucher de soleil',
    price: 200,
    rarity: 'rare',
    svg: `<defs>
      <linearGradient id="gradient-sunset" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6e7f;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#bfe9ff;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-sunset)"/>`
  },
  {
    name: 'Dégradé Nuit Étoilée',
    category: 'background',
    emoji: '✨',
    description: 'Un dégradé sombre et mystérieux',
    price: 250,
    rarity: 'rare',
    svg: `<defs>
      <linearGradient id="gradient-night" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#0f2027;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#203a43;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2c5364;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-night)"/>`
  },
  {
    name: 'Dégradé Arc-en-Ciel',
    category: 'background',
    emoji: '🌈',
    description: 'Un dégradé multicolore éclatant',
    price: 400,
    rarity: 'epic',
    svg: `<defs>
      <linearGradient id="gradient-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff0844;stop-opacity:1" />
        <stop offset="25%" style="stop-color:#ffb199;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#f9f871;stop-opacity:1" />
        <stop offset="75%" style="stop-color:#a8e063;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#667eea;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-rainbow)"/>`
  },
  {
    name: 'Dégradé Doré',
    category: 'background',
    emoji: '✨',
    description: 'Un dégradé doré luxueux',
    price: 1000,
    rarity: 'legendary',
    svg: `<defs>
      <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f4c542;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#f7e8a8;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#f4c542;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-gold)"/>`
  },
  {
    name: 'Dégradé Diamant',
    category: 'background',
    emoji: '💎',
    description: 'Un dégradé brillant et cristallin',
    price: 1500,
    rarity: 'legendary',
    svg: `<defs>
      <linearGradient id="gradient-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8ec5fc;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#e0c3fc;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8ec5fc;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="shine-diamond">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient-diamond)"/>
    <circle cx="50%" cy="50%" r="30%" fill="url(#shine-diamond)"/>`
  }
]
