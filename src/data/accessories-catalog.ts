/**
 * Catalogue des accessoires disponibles
 * Respecte le principe SRP : Gère uniquement les données des accessoires
 *
 * @module data/accessories-catalog
 */

import type { AccessoryData } from '@/types/monster-accessories'

/**
 * Catalogue complet des accessoires disponibles dans la boutique
 *
 * Format pixel art SVG cohérent avec le design des chats Animochi
 * Chaque accessoire est dessiné avec des carrés de 8x8px pour un style rétro
 */
export const ACCESSORIES_CATALOG: AccessoryData[] = [
  // ============================================================================
  // CHAPEAUX (Hats)
  // ============================================================================
  {
    name: 'Chapeau Haut-de-Forme',
    category: 'hat',
    emoji: '🎩',
    description: 'Un élégant chapeau noir pour chat distingué',
    price: 50,
    rarity: 'common',
    svg: `
      <g id="top-hat">
        <!-- Bord du chapeau -->
        <rect x="20" y="8" width="8" height="8" fill="#1a1a1a"/>
        <rect x="28" y="8" width="8" height="8" fill="#1a1a1a"/>
        <rect x="36" y="8" width="8" height="8" fill="#1a1a1a"/>
        <rect x="44" y="8" width="8" height="8" fill="#1a1a1a"/>
        <rect x="52" y="8" width="8" height="8" fill="#1a1a1a"/>
        <!-- Corps du chapeau -->
        <rect x="28" y="0" width="8" height="8" fill="#2a2a2a"/>
        <rect x="36" y="0" width="8" height="8" fill="#2a2a2a"/>
        <rect x="44" y="0" width="8" height="8" fill="#2a2a2a"/>
        <rect x="28" y="-8" width="8" height="8" fill="#1a1a1a"/>
        <rect x="36" y="-8" width="8" height="8" fill="#1a1a1a"/>
        <rect x="44" y="-8" width="8" height="8" fill="#1a1a1a"/>
        <!-- Reflet -->
        <rect x="36" y="-4" width="4" height="4" fill="#4a4a4a" opacity="0.5"/>
      </g>
    `
  },
  {
    name: 'Béret Français',
    category: 'hat',
    emoji: '🧢',
    description: 'Un béret rouge très français, parfait pour les chats artistes',
    price: 75,
    rarity: 'rare',
    svg: `
      <g id="beret">
        <!-- Base du béret -->
        <rect x="24" y="4" width="8" height="8" fill="#c41e3a"/>
        <rect x="32" y="0" width="8" height="8" fill="#c41e3a"/>
        <rect x="40" y="0" width="8" height="8" fill="#c41e3a"/>
        <rect x="48" y="4" width="8" height="8" fill="#c41e3a"/>
        <!-- Volume -->
        <rect x="32" y="-8" width="8" height="8" fill="#e83a54"/>
        <rect x="40" y="-8" width="8" height="8" fill="#e83a54"/>
        <!-- Ombre -->
        <rect x="48" y="8" width="4" height="4" fill="#901829" opacity="0.6"/>
        <!-- Petite tige -->
        <rect x="38" y="-12" width="4" height="4" fill="#901829"/>
      </g>
    `
  },
  {
    name: 'Couronne Dorée',
    category: 'hat',
    emoji: '👑',
    description: 'Une couronne royale pour chat majestueux',
    price: 200,
    rarity: 'epic',
    svg: `
      <g id="crown">
        <!-- Base de la couronne -->
        <rect x="24" y="8" width="8" height="8" fill="#ffd700"/>
        <rect x="32" y="8" width="8" height="8" fill="#ffd700"/>
        <rect x="40" y="8" width="8" height="8" fill="#ffd700"/>
        <rect x="48" y="8" width="8" height="8" fill="#ffd700"/>
        <!-- Pointes -->
        <rect x="24" y="0" width="8" height="8" fill="#ffed4e"/>
        <rect x="36" y="-4" width="8" height="12" fill="#ffed4e"/>
        <rect x="48" y="0" width="8" height="8" fill="#ffed4e"/>
        <!-- Joyaux -->
        <circle cx="28" cy="4" r="2" fill="#ff4444"/>
        <circle cx="40" cy="0" r="3" fill="#4444ff"/>
        <circle cx="52" cy="4" r="2" fill="#44ff44"/>
        <!-- Brillance -->
        <rect x="38" y="-2" width="2" height="2" fill="#ffffff" opacity="0.8"/>
      </g>
    `
  },
  {
    name: 'Auréole Céleste',
    category: 'hat',
    emoji: '😇',
    description: 'Une auréole divine pour les chats angéliques',
    price: 500,
    rarity: 'legendary',
    svg: `
      <g id="halo">
        <!-- Auréole principale -->
        <ellipse cx="40" cy="-8" rx="16" ry="4" fill="none" stroke="#ffff88" stroke-width="3" opacity="0.9"/>
        <ellipse cx="40" cy="-8" rx="16" ry="4" fill="none" stroke="#ffffff" stroke-width="1.5"/>
        <!-- Rayons lumineux -->
        <line x1="24" y1="-8" x2="20" y2="-12" stroke="#ffff88" stroke-width="2" opacity="0.6"/>
        <line x1="56" y1="-8" x2="60" y2="-12" stroke="#ffff88" stroke-width="2" opacity="0.6"/>
        <line x1="40" y1="-12" x2="40" y2="-18" stroke="#ffff88" stroke-width="2" opacity="0.6"/>
        <!-- Effet de lumière -->
        <circle cx="40" cy="-8" r="2" fill="#ffffff" opacity="0.8"/>
      </g>
    `
  },

  // ============================================================================
  // LUNETTES (Glasses)
  // ============================================================================
  {
    name: 'Lunettes Rondes',
    category: 'glasses',
    emoji: '🤓',
    description: 'Des lunettes rondes pour chat intellectuel',
    price: 60,
    rarity: 'common',
    svg: `
      <g id="round-glasses">
        <!-- Verre gauche -->
        <circle cx="28" cy="32" r="6" fill="none" stroke="#2a2a2a" stroke-width="2"/>
        <circle cx="28" cy="32" r="6" fill="#87ceeb" opacity="0.2"/>
        <!-- Verre droit -->
        <circle cx="52" cy="32" r="6" fill="none" stroke="#2a2a2a" stroke-width="2"/>
        <circle cx="52" cy="32" r="6" fill="#87ceeb" opacity="0.2"/>
        <!-- Pont -->
        <line x1="34" y1="32" x2="46" y2="32" stroke="#2a2a2a" stroke-width="2"/>
        <!-- Reflets -->
        <circle cx="26" cy="30" r="2" fill="#ffffff" opacity="0.6"/>
        <circle cx="50" cy="30" r="2" fill="#ffffff" opacity="0.6"/>
      </g>
    `
  },
  {
    name: 'Lunettes de Soleil',
    category: 'glasses',
    emoji: '😎',
    description: 'Des lunettes de soleil cool pour chat branché',
    price: 100,
    rarity: 'rare',
    svg: `
      <g id="sunglasses">
        <!-- Monture gauche -->
        <rect x="22" y="28" width="12" height="8" rx="2" fill="#1a1a1a"/>
        <rect x="22" y="28" width="12" height="8" rx="2" fill="#000000" opacity="0.8"/>
        <!-- Monture droite -->
        <rect x="46" y="28" width="12" height="8" rx="2" fill="#1a1a1a"/>
        <rect x="46" y="28" width="12" height="8" rx="2" fill="#000000" opacity="0.8"/>
        <!-- Pont épais -->
        <rect x="34" y="30" width="12" height="4" fill="#1a1a1a"/>
        <!-- Reflet cool -->
        <rect x="24" y="29" width="4" height="2" fill="#ffffff" opacity="0.4"/>
        <rect x="48" y="29" width="4" height="2" fill="#ffffff" opacity="0.4"/>
      </g>
    `
  },
  {
    name: 'Monocle Chic',
    category: 'glasses',
    emoji: '🧐',
    description: 'Un monocle raffiné pour chat aristocrate',
    price: 180,
    rarity: 'epic',
    svg: `
      <g id="monocle">
        <!-- Cadre du monocle -->
        <circle cx="52" cy="32" r="8" fill="none" stroke="#d4af37" stroke-width="2"/>
        <circle cx="52" cy="32" r="8" fill="#87ceeb" opacity="0.15"/>
        <!-- Verre -->
        <circle cx="52" cy="32" r="6" fill="#e6f3ff" opacity="0.3"/>
        <!-- Chaînette -->
        <path d="M 60 32 Q 65 35, 68 40" stroke="#d4af37" stroke-width="1.5" fill="none"/>
        <circle cx="68" cy="40" r="2" fill="#d4af37"/>
        <!-- Reflet -->
        <circle cx="50" cy="30" r="3" fill="#ffffff" opacity="0.7"/>
      </g>
    `
  },
  {
    name: 'Lunettes Arc-en-Ciel',
    category: 'glasses',
    emoji: '🌈',
    description: "Des lunettes magiques aux couleurs de l'arc-en-ciel",
    price: 450,
    rarity: 'legendary',
    svg: `
      <g id="rainbow-glasses">
        <!-- Verre gauche - dégradé arc-en-ciel -->
        <circle cx="28" cy="32" r="7" fill="url(#rainbow-gradient-left)"/>
        <circle cx="28" cy="32" r="7" fill="none" stroke="#ffffff" stroke-width="2"/>
        <!-- Verre droit - dégradé arc-en-ciel -->
        <circle cx="52" cy="32" r="7" fill="url(#rainbow-gradient-right)"/>
        <circle cx="52" cy="32" r="7" fill="none" stroke="#ffffff" stroke-width="2"/>
        <!-- Pont lumineux -->
        <line x1="35" y1="32" x2="45" y2="32" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
        <!-- Paillettes -->
        <circle cx="26" cy="30" r="1.5" fill="#ffff00" opacity="0.9"/>
        <circle cx="50" cy="29" r="1.5" fill="#ff00ff" opacity="0.9"/>
        <circle cx="30" cy="34" r="1" fill="#00ffff" opacity="0.9"/>
        <!-- Définitions des dégradés -->
        <defs>
          <linearGradient id="rainbow-gradient-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff0000;stop-opacity:0.6" />
            <stop offset="50%" style="stop-color:#ffff00;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#00ff00;stop-opacity:0.6" />
          </linearGradient>
          <linearGradient id="rainbow-gradient-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0.6" />
            <stop offset="50%" style="stop-color:#0000ff;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:0.6" />
          </linearGradient>
        </defs>
      </g>
    `
  },

  // ============================================================================
  // CHAUSSURES (Shoes)
  // ============================================================================
  {
    name: 'Baskets Rouges',
    category: 'shoes',
    emoji: '👟',
    description: 'Des baskets sportives pour chat actif',
    price: 40,
    rarity: 'common',
    svg: `
      <g id="sneakers">
        <!-- Basket gauche -->
        <rect x="20" y="60" width="12" height="8" rx="2" fill="#c41e3a"/>
        <rect x="22" y="62" width="8" height="4" fill="#ffffff" opacity="0.3"/>
        <line x1="24" y1="62" x2="24" y2="66" stroke="#ffffff" stroke-width="1"/>
        <!-- Semelle gauche -->
        <rect x="20" y="68" width="12" height="3" rx="1" fill="#2a2a2a"/>
        
        <!-- Basket droite -->
        <rect x="48" y="60" width="12" height="8" rx="2" fill="#c41e3a"/>
        <rect x="50" y="62" width="8" height="4" fill="#ffffff" opacity="0.3"/>
        <line x1="52" y1="62" x2="52" y2="66" stroke="#ffffff" stroke-width="1"/>
        <!-- Semelle droite -->
        <rect x="48" y="68" width="12" height="3" rx="1" fill="#2a2a2a"/>
      </g>
    `
  },
  {
    name: "Bottes d'Aventurier",
    category: 'shoes',
    emoji: '🥾',
    description: 'Des bottes robustes pour chat explorateur',
    price: 90,
    rarity: 'rare',
    svg: `
      <g id="boots">
        <!-- Botte gauche -->
        <rect x="18" y="56" width="14" height="12" fill="#654321"/>
        <rect x="18" y="68" width="14" height="4" fill="#4a3318"/>
        <!-- Lacets gauche -->
        <line x1="20" y1="58" x2="22" y2="62" stroke="#2a2a2a" stroke-width="1.5"/>
        <line x1="22" y1="58" x2="20" y2="62" stroke="#2a2a2a" stroke-width="1.5"/>
        <line x1="24" y1="60" x2="26" y2="64" stroke="#2a2a2a" stroke-width="1.5"/>
        
        <!-- Botte droite -->
        <rect x="48" y="56" width="14" height="12" fill="#654321"/>
        <rect x="48" y="68" width="14" height="4" fill="#4a3318"/>
        <!-- Lacets droite -->
        <line x1="50" y1="58" x2="52" y2="62" stroke="#2a2a2a" stroke-width="1.5"/>
        <line x1="52" y1="58" x2="50" y2="62" stroke="#2a2a2a" stroke-width="1.5"/>
        <line x1="54" y1="60" x2="56" y2="64" stroke="#2a2a2a" stroke-width="1.5"/>
        
        <!-- Semelles épaisses -->
        <rect x="18" y="72" width="14" height="4" rx="2" fill="#2a2a2a"/>
        <rect x="48" y="72" width="14" height="4" rx="2" fill="#2a2a2a"/>
      </g>
    `
  },
  {
    name: 'Chaussons de Ballet',
    category: 'shoes',
    emoji: '🩰',
    description: 'Des chaussons roses délicats pour chat danseur',
    price: 150,
    rarity: 'epic',
    svg: `
      <g id="ballet-shoes">
        <!-- Chausson gauche -->
        <ellipse cx="26" cy="68" rx="8" ry="5" fill="#ffb6c1"/>
        <path d="M 18 68 Q 26 62, 34 68" stroke="#ffb6c1" stroke-width="2" fill="none"/>
        <!-- Rubans gauche -->
        <path d="M 22 66 Q 18 62, 20 58" stroke="#ff69b4" stroke-width="1.5" fill="none"/>
        <path d="M 30 66 Q 34 62, 32 58" stroke="#ff69b4" stroke-width="1.5" fill="none"/>
        
        <!-- Chausson droit -->
        <ellipse cx="54" cy="68" rx="8" ry="5" fill="#ffb6c1"/>
        <path d="M 46 68 Q 54 62, 62 68" stroke="#ffb6c1" stroke-width="2" fill="none"/>
        <!-- Rubans droit -->
        <path d="M 50 66 Q 46 62, 48 58" stroke="#ff69b4" stroke-width="1.5" fill="none"/>
        <path d="M 58 66 Q 62 62, 60 58" stroke="#ff69b4" stroke-width="1.5" fill="none"/>
        
        <!-- Détails -->
        <ellipse cx="26" cy="68" rx="4" ry="2" fill="#ffffff" opacity="0.3"/>
        <ellipse cx="54" cy="68" rx="4" ry="2" fill="#ffffff" opacity="0.3"/>
      </g>
    `
  },
  {
    name: 'Sabots Magiques',
    category: 'shoes',
    emoji: '✨',
    description: 'Des sabots enchantés qui brillent à chaque pas',
    price: 420,
    rarity: 'legendary',
    svg: `
      <g id="magic-clogs">
        <!-- Sabot gauche -->
        <path d="M 18 68 L 18 62 Q 20 58, 26 58 L 32 58 L 32 68 Z" fill="#9400d3"/>
        <path d="M 18 68 L 32 68 L 32 72 L 18 72 Z" fill="#8b008b"/>
        <!-- Étoiles gauche -->
        <circle cx="22" cy="62" r="2" fill="#ffff00" opacity="0.8"/>
        <circle cx="28" cy="64" r="1.5" fill="#ffffff" opacity="0.9"/>
        
        <!-- Sabot droit -->
        <path d="M 48 68 L 48 62 Q 50 58, 56 58 L 62 58 L 62 68 Z" fill="#9400d3"/>
        <path d="M 48 68 L 62 68 L 62 72 L 48 72 Z" fill="#8b008b"/>
        <!-- Étoiles droite -->
        <circle cx="52" cy="62" r="2" fill="#ffff00" opacity="0.8"/>
        <circle cx="58" cy="64" r="1.5" fill="#ffffff" opacity="0.9"/>
        
        <!-- Particules magiques autour -->
        <circle cx="16" cy="64" r="1" fill="#00ffff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="34" cy="60" r="1" fill="#ff00ff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="46" cy="64" r="1" fill="#00ffff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.7s" repeatCount="indefinite"/>
        </circle>
        <circle cx="64" cy="60" r="1" fill="#ff00ff" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      </g>
    `
  }
]

/**
 * Helper pour récupérer les accessoires par catégorie
 *
 * @param {AccessoryCategory} category - Catégorie à filtrer
 * @returns {AccessoryData[]} Liste des accessoires de la catégorie
 */
export function getAccessoriesByCategory (category: string): AccessoryData[] {
  return ACCESSORIES_CATALOG.filter((acc) => acc.category === category)
}

/**
 * Helper pour récupérer un accessoire par son nom
 *
 * @param {string} name - Nom de l'accessoire
 * @returns {AccessoryData | undefined} L'accessoire trouvé ou undefined
 */
export function getAccessoryByName (name: string): AccessoryData | undefined {
  return ACCESSORIES_CATALOG.find((acc) => acc.name === name)
}

/**
 * Helper pour récupérer les accessoires par rareté
 *
 * @param {AccessoryRarity} rarity - Niveau de rareté
 * @returns {AccessoryData[]} Liste des accessoires de cette rareté
 */
export function getAccessoriesByRarity (rarity: string): AccessoryData[] {
  return ACCESSORIES_CATALOG.filter((acc) => acc.rarity === rarity)
}
