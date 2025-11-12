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
    price: 150,
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
    price: 250,
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
    price: 600,
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
    price: 1500,
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
    price: 180,
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
    price: 300,
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
    price: 540,
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
    price: 1350,
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
    price: 120,
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
    price: 270,
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
    price: 450,
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
    price: 1260,
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
  },

  // ============================================================================
  // NOUVEAUX CHAPEAUX
  // ============================================================================
  {
    name: 'Casquette de Baseball',
    category: 'hat',
    emoji: '🧢',
    description: 'Casquette sportive pour chat cool',
    price: 120,
    rarity: 'common',
    svg: `
      <g id="baseball-cap">
        <!-- Visière -->
        <rect x="28" y="12" width="8" height="4" fill="#1a1a1a"/>
        <rect x="36" y="12" width="8" height="4" fill="#2a2a2a"/>
        <rect x="44" y="12" width="8" height="4" fill="#1a1a1a"/>
        <!-- Corps de la casquette -->
        <rect x="28" y="4" width="8" height="8" fill="#ff0000"/>
        <rect x="36" y="4" width="8" height="8" fill="#ff0000"/>
        <rect x="44" y="4" width="8" height="8" fill="#ff0000"/>
        <rect x="32" y="0" width="8" height="4" fill="#cc0000"/>
        <rect x="40" y="0" width="8" height="4" fill="#cc0000"/>
        <!-- Logo -->
        <rect x="38" y="6" width="4" height="4" fill="#ffffff"/>
      </g>
    `
  },
  {
    name: 'Chapeau de Cowboy',
    category: 'hat',
    emoji: '🤠',
    description: "Yee-haw ! Pour le chat de l'Ouest",
    price: 180,
    rarity: 'rare',
    svg: `
      <g id="cowboy-hat">
        <!-- Bord large -->
        <rect x="16" y="12" width="8" height="4" fill="#8b4513"/>
        <rect x="24" y="12" width="8" height="4" fill="#a0522d"/>
        <rect x="32" y="12" width="8" height="4" fill="#8b4513"/>
        <rect x="40" y="12" width="8" height="4" fill="#a0522d"/>
        <rect x="48" y="12" width="8" height="4" fill="#8b4513"/>
        <rect x="56" y="12" width="8" height="4" fill="#a0522d"/>
        <!-- Couronne -->
        <rect x="28" y="4" width="8" height="8" fill="#8b4513"/>
        <rect x="36" y="0" width="8" height="12" fill="#a0522d"/>
        <rect x="44" y="4" width="8" height="8" fill="#8b4513"/>
        <!-- Ruban décoratif -->
        <rect x="30" y="10" width="20" height="2" fill="#000000"/>
      </g>
    `
  },
  {
    name: 'Bonnet à Pompon',
    category: 'hat',
    emoji: '🧶',
    description: "Bonnet chaud pour l'hiver",
    price: 100,
    rarity: 'common',
    svg: `
      <g id="winter-beanie">
        <!-- Pompon -->
        <rect x="36" y="-4" width="8" height="4" fill="#ff6b9d"/>
        <rect x="32" y="0" width="4" height="4" fill="#ff6b9d"/>
        <rect x="44" y="0" width="4" height="4" fill="#ff6b9d"/>
        <!-- Corps du bonnet -->
        <rect x="24" y="4" width="8" height="8" fill="#ff1493"/>
        <rect x="32" y="4" width="8" height="8" fill="#ff69b4"/>
        <rect x="40" y="4" width="8" height="8" fill="#ff1493"/>
        <rect x="48" y="4" width="8" height="8" fill="#ff69b4"/>
        <!-- Bord replié -->
        <rect x="24" y="12" width="8" height="4" fill="#c71585"/>
        <rect x="32" y="12" width="8" height="4" fill="#c71585"/>
        <rect x="40" y="12" width="8" height="4" fill="#c71585"/>
        <rect x="48" y="12" width="8" height="4" fill="#c71585"/>
      </g>
    `
  },
  {
    name: 'Casque de Chevalier',
    category: 'hat',
    emoji: '⚔️',
    description: 'Casque médiéval pour chat valeureux',
    price: 250,
    rarity: 'epic',
    svg: `
      <g id="knight-helmet">
        <!-- Base du casque -->
        <rect x="28" y="4" width="8" height="12" fill="#c0c0c0"/>
        <rect x="36" y="0" width="8" height="16" fill="#d3d3d3"/>
        <rect x="44" y="4" width="8" height="12" fill="#c0c0c0"/>
        <!-- Visière -->
        <rect x="32" y="10" width="4" height="2" fill="#1a1a1a"/>
        <rect x="38" y="10" width="4" height="2" fill="#1a1a1a"/>
        <rect x="44" y="10" width="4" height="2" fill="#1a1a1a"/>
        <!-- Crête -->
        <rect x="38" y="-4" width="4" height="4" fill="#ff0000"/>
        <rect x="38" y="-8" width="4" height="4" fill="#cc0000"/>
        <!-- Reflets métalliques -->
        <rect x="37" y="2" width="2" height="4" fill="#ffffff" opacity="0.6"/>
      </g>
    `
  },
  {
    name: 'Chapeau de Sorcier',
    category: 'hat',
    emoji: '🧙',
    description: 'Chapeau pointu magique avec étoiles',
    price: 200,
    rarity: 'rare',
    svg: `
      <g id="wizard-hat">
        <!-- Bord -->
        <rect x="20" y="12" width="8" height="4" fill="#1a0a4a"/>
        <rect x="28" y="12" width="8" height="4" fill="#2a1a5a"/>
        <rect x="36" y="12" width="8" height="4" fill="#1a0a4a"/>
        <rect x="44" y="12" width="8" height="4" fill="#2a1a5a"/>
        <rect x="52" y="12" width="8" height="4" fill="#1a0a4a"/>
        <!-- Cône pointu -->
        <rect x="32" y="8" width="16" height="4" fill="#2a1a5a"/>
        <rect x="34" y="4" width="12" height="4" fill="#3a2a6a"/>
        <rect x="36" y="0" width="8" height="4" fill="#2a1a5a"/>
        <rect x="38" y="-4" width="4" height="4" fill="#3a2a6a"/>
        <!-- Étoiles dorées -->
        <rect x="36" y="6" width="2" height="2" fill="#ffd700"/>
        <rect x="42" y="9" width="2" height="2" fill="#ffd700"/>
        <circle cx="40" cy="-2" r="1" fill="#ffd700">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
    `
  },
  {
    name: 'Bandeau de Ninja',
    category: 'hat',
    emoji: '🥷',
    description: 'Bandeau noir des ninjas furtifs',
    price: 140,
    rarity: 'common',
    svg: `
      <g id="ninja-headband">
        <!-- Bandeau principal -->
        <rect x="24" y="8" width="32" height="6" fill="#1a1a1a"/>
        <!-- Nœud derrière -->
        <rect x="56" y="6" width="8" height="4" fill="#2a2a2a"/>
        <rect x="60" y="10" width="8" height="6" fill="#1a1a1a"/>
        <rect x="56" y="16" width="6" height="8" fill="#2a2a2a"/>
        <!-- Plaque métallique -->
        <rect x="34" y="9" width="12" height="4" fill="#808080"/>
        <rect x="36" y="10" width="2" height="2" fill="#ffffff" opacity="0.5"/>
      </g>
    `
  },
  {
    name: 'Couronne de Fleurs',
    category: 'hat',
    emoji: '🌸',
    description: 'Couronne romantique avec fleurs colorées',
    price: 130,
    rarity: 'common',
    svg: `
      <g id="flower-crown">
        <!-- Base verte -->
        <rect x="24" y="10" width="32" height="4" fill="#228b22"/>
        <!-- Fleurs roses -->
        <rect x="26" y="6" width="4" height="4" fill="#ff69b4"/>
        <rect x="34" y="6" width="4" height="4" fill="#ff1493"/>
        <rect x="42" y="6" width="4" height="4" fill="#ff69b4"/>
        <rect x="50" y="6" width="4" height="4" fill="#ff1493"/>
        <!-- Centres jaunes des fleurs -->
        <rect x="27" y="7" width="2" height="2" fill="#ffd700"/>
        <rect x="35" y="7" width="2" height="2" fill="#ffd700"/>
        <rect x="43" y="7" width="2" height="2" fill="#ffd700"/>
        <rect x="51" y="7" width="2" height="2" fill="#ffd700"/>
        <!-- Feuilles -->
        <rect x="30" y="9" width="3" height="2" fill="#32cd32"/>
        <rect x="46" y="9" width="3" height="2" fill="#32cd32"/>
      </g>
    `
  },

  // ============================================================================
  // NOUVELLES LUNETTES
  // ============================================================================
  {
    name: 'Lunettes Aviateur',
    category: 'glasses',
    emoji: '😎',
    description: 'Lunettes de pilote ultra cool',
    price: 150,
    rarity: 'common',
    svg: `
      <g id="aviator-glasses">
        <!-- Monture dorée -->
        <rect x="20" y="32" width="16" height="2" fill="#ffd700"/>
        <rect x="44" y="32" width="16" height="2" fill="#ffd700"/>
        <rect x="36" y="32" width="8" height="2" fill="#ffd700"/>
        <!-- Verres gauche -->
        <rect x="20" y="28" width="16" height="8" fill="#1a5f7a" opacity="0.7"/>
        <rect x="22" y="30" width="4" height="2" fill="#ffffff" opacity="0.4"/>
        <!-- Verres droite -->
        <rect x="44" y="28" width="16" height="8" fill="#1a5f7a" opacity="0.7"/>
        <rect x="46" y="30" width="4" height="2" fill="#ffffff" opacity="0.4"/>
        <!-- Branches -->
        <rect x="16" y="32" width="4" height="2" fill="#ffd700"/>
        <rect x="60" y="32" width="4" height="2" fill="#ffd700"/>
      </g>
    `
  },
  {
    name: 'Lunettes Cœur',
    category: 'glasses',
    emoji: '❤️',
    description: 'Lunettes en forme de cœur pour chat romantique',
    price: 140,
    rarity: 'rare',
    svg: `
      <g id="heart-glasses">
        <!-- Cœur gauche -->
        <rect x="22" y="30" width="4" height="4" fill="#ff1493"/>
        <rect x="26" y="30" width="4" height="4" fill="#ff69b4"/>
        <rect x="30" y="30" width="4" height="4" fill="#ff1493"/>
        <rect x="24" y="34" width="8" height="4" fill="#ff69b4"/>
        <rect x="26" y="38" width="4" height="4" fill="#ff1493"/>
        <!-- Cœur droit -->
        <rect x="46" y="30" width="4" height="4" fill="#ff1493"/>
        <rect x="50" y="30" width="4" height="4" fill="#ff69b4"/>
        <rect x="54" y="30" width="4" height="4" fill="#ff1493"/>
        <rect x="48" y="34" width="8" height="4" fill="#ff69b4"/>
        <rect x="50" y="38" width="4" height="4" fill="#ff1493"/>
        <!-- Pont -->
        <rect x="36" y="32" width="8" height="2" fill="#ff1493"/>
        <!-- Reflets -->
        <rect x="24" y="31" width="2" height="2" fill="#ffffff" opacity="0.6"/>
        <rect x="48" y="31" width="2" height="2" fill="#ffffff" opacity="0.6"/>
      </g>
    `
  },
  {
    name: 'Lunettes Pixel',
    category: 'glasses',
    emoji: '😏',
    description: 'Deal with it - Lunettes de mème légendaires',
    price: 300,
    rarity: 'legendary',
    svg: `
      <g id="pixel-glasses">
        <!-- Verres noirs épais -->
        <rect x="20" y="30" width="18" height="8" fill="#000000"/>
        <rect x="42" y="30" width="18" height="8" fill="#000000"/>
        <!-- Pont -->
        <rect x="38" y="32" width="4" height="4" fill="#000000"/>
        <!-- Reflets blancs stylés -->
        <rect x="22" y="31" width="6" height="2" fill="#ffffff"/>
        <rect x="44" y="31" width="6" height="2" fill="#ffffff"/>
        <!-- Glow effect -->
        <rect x="19" y="29" width="20" height="1" fill="#00ff00" opacity="0.3"/>
        <rect x="41" y="29" width="20" height="1" fill="#00ff00" opacity="0.3"/>
      </g>
    `
  },
  {
    name: 'Monocle',
    category: 'glasses',
    emoji: '🧐',
    description: 'Monocle distingué pour chat gentleman',
    price: 180,
    rarity: 'rare',
    svg: `
      <g id="monocle">
        <!-- Cercle doré -->
        <rect x="42" y="28" width="16" height="2" fill="#ffd700"/>
        <rect x="42" y="38" width="16" height="2" fill="#ffd700"/>
        <rect x="40" y="30" width="2" height="8" fill="#ffd700"/>
        <rect x="58" y="30" width="2" height="8" fill="#ffd700"/>
        <!-- Verre -->
        <rect x="44" y="30" width="12" height="8" fill="#87ceeb" opacity="0.5"/>
        <!-- Reflet -->
        <rect x="46" y="31" width="4" height="3" fill="#ffffff" opacity="0.6"/>
        <!-- Chaînette -->
        <rect x="60" y="34" width="4" height="1" fill="#ffd700"/>
        <rect x="64" y="35" width="2" height="2" fill="#ffd700"/>
      </g>
    `
  },
  {
    name: 'Lunettes Steampunk',
    category: 'glasses',
    emoji: '⚙️',
    description: 'Lunettes rétro-futuristes avec engrenages',
    price: 220,
    rarity: 'epic',
    svg: `
      <g id="steampunk-goggles">
        <!-- Monture cuivre -->
        <rect x="20" y="28" width="16" height="12" fill="#b87333"/>
        <rect x="44" y="28" width="16" height="12" fill="#b87333"/>
        <!-- Verres verts -->
        <rect x="22" y="30" width="12" height="8" fill="#228b22" opacity="0.7"/>
        <rect x="46" y="30" width="12" height="8" fill="#228b22" opacity="0.7"/>
        <!-- Engrenages décoratifs -->
        <rect x="26" y="26" width="4" height="4" fill="#8b7355"/>
        <rect x="50" y="26" width="4" height="4" fill="#8b7355"/>
        <circle cx="28" cy="28" r="1" fill="#ffd700"/>
        <circle cx="52" cy="28" r="1" fill="#ffd700"/>
        <!-- Pont en cuir -->
        <rect x="36" y="32" width="8" height="4" fill="#654321"/>
        <!-- Rivets -->
        <circle cx="21" cy="29" r="1" fill="#696969"/>
        <circle cx="33" cy="29" r="1" fill="#696969"/>
        <circle cx="45" cy="29" r="1" fill="#696969"/>
        <circle cx="59" cy="29" r="1" fill="#696969"/>
      </g>
    `
  },

  // ============================================================================
  // NOUVELLES CHAUSSURES
  // ============================================================================
  {
    name: 'Baskets Colorées',
    category: 'shoes',
    emoji: '👟',
    description: 'Baskets arc-en-ciel pour chat sportif',
    price: 160,
    rarity: 'common',
    svg: `
      <g id="colorful-sneakers">
        <!-- Chaussure gauche -->
        <rect x="20" y="64" width="12" height="8" fill="#ff0000"/>
        <rect x="22" y="62" width="8" height="2" fill="#ffa500"/>
        <rect x="24" y="60" width="6" height="2" fill="#ffff00"/>
        <rect x="26" y="66" width="4" height="2" fill="#ffffff"/>
        <!-- Chaussure droite -->
        <rect x="48" y="64" width="12" height="8" fill="#0000ff"/>
        <rect x="50" y="62" width="8" height="2" fill="#00ff00"/>
        <rect x="52" y="60" width="6" height="2" fill="#00ffff"/>
        <rect x="54" y="66" width="4" height="2" fill="#ffffff"/>
        <!-- Lacets -->
        <rect x="24" y="64" width="1" height="6" fill="#ffffff" opacity="0.8"/>
        <rect x="52" y="64" width="1" height="6" fill="#ffffff" opacity="0.8"/>
      </g>
    `
  },
  {
    name: 'Bottes de Pluie',
    category: 'shoes',
    emoji: '🥾',
    description: 'Bottes imperméables pour les jours pluvieux',
    price: 140,
    rarity: 'common',
    svg: `
      <g id="rain-boots">
        <!-- Botte gauche -->
        <rect x="22" y="60" width="10" height="12" fill="#ffff00"/>
        <rect x="20" y="66" width="2" height="6" fill="#ffd700"/>
        <rect x="24" y="62" width="4" height="2" fill="#ffffff" opacity="0.4"/>
        <!-- Botte droite -->
        <rect x="48" y="60" width="10" height="12" fill="#ffff00"/>
        <rect x="58" y="66" width="2" height="6" fill="#ffd700"/>
        <rect x="50" y="62" width="4" height="2" fill="#ffffff" opacity="0.4"/>
        <!-- Reflets brillants -->
        <rect x="26" y="64" width="2" height="4" fill="#ffffff" opacity="0.5"/>
        <rect x="52" y="64" width="2" height="4" fill="#ffffff" opacity="0.5"/>
      </g>
    `
  },
  {
    name: 'Bottes de Cowboy',
    category: 'shoes',
    emoji: '🤠',
    description: 'Bottes western avec éperons',
    price: 190,
    rarity: 'rare',
    svg: `
      <g id="cowboy-boots">
        <!-- Botte gauche -->
        <rect x="20" y="58" width="12" height="14" fill="#8b4513"/>
        <rect x="22" y="60" width="8" height="2" fill="#a0522d"/>
        <rect x="24" y="64" width="6" height="2" fill="#654321"/>
        <!-- Éperon gauche -->
        <circle cx="18" cy="70" r="2" fill="#c0c0c0"/>
        <rect x="16" y="70" width="4" height="1" fill="#808080"/>
        <!-- Botte droite -->
        <rect x="48" y="58" width="12" height="14" fill="#8b4513"/>
        <rect x="50" y="60" width="8" height="2" fill="#a0522d"/>
        <rect x="52" y="64" width="6" height="2" fill="#654321"/>
        <!-- Éperon droit -->
        <circle cx="62" cy="70" r="2" fill="#c0c0c0"/>
        <rect x="60" y="70" width="4" height="1" fill="#808080"/>
        <!-- Motifs décoratifs -->
        <rect x="24" y="66" width="4" height="1" fill="#ffd700"/>
        <rect x="52" y="66" width="4" height="1" fill="#ffd700"/>
      </g>
    `
  },
  {
    name: "Pantoufles Patte d'Ours",
    category: 'shoes',
    emoji: '🐾',
    description: 'Pantoufles douillettes en forme de pattes',
    price: 120,
    rarity: 'common',
    svg: `
      <g id="bear-slippers">
        <!-- Pantoufle gauche -->
        <rect x="20" y="64" width="14" height="8" fill="#8b4513"/>
        <rect x="22" y="66" width="10" height="4" fill="#deb887"/>
        <!-- Coussinets gauche -->
        <rect x="24" y="68" width="2" height="2" fill="#654321"/>
        <rect x="27" y="68" width="2" height="2" fill="#654321"/>
        <rect x="25" y="70" width="3" height="2" fill="#654321"/>
        <!-- Pantoufle droite -->
        <rect x="46" y="64" width="14" height="8" fill="#8b4513"/>
        <rect x="48" y="66" width="10" height="4" fill="#deb887"/>
        <!-- Coussinets droit -->
        <rect x="50" y="68" width="2" height="2" fill="#654321"/>
        <rect x="53" y="68" width="2" height="2" fill="#654321"/>
        <rect x="51" y="70" width="3" height="2" fill="#654321"/>
      </g>
    `
  },
  {
    name: 'Sneakers LED',
    category: 'shoes',
    emoji: '✨',
    description: "Baskets futuristes qui s'illuminent",
    price: 250,
    rarity: 'epic',
    svg: `
      <g id="led-sneakers">
        <!-- Chaussure gauche noire -->
        <rect x="20" y="64" width="12" height="8" fill="#1a1a1a"/>
        <rect x="22" y="62" width="8" height="2" fill="#2a2a2a"/>
        <!-- LED gauche -->
        <rect x="22" y="70" width="8" height="2" fill="#00ff00">
          <animate attributeName="fill" values="#00ff00;#00ffff;#ff00ff;#00ff00" dur="2s" repeatCount="indefinite"/>
        </rect>
        <!-- Chaussure droite noire -->
        <rect x="48" y="64" width="12" height="8" fill="#1a1a1a"/>
        <rect x="50" y="62" width="8" height="2" fill="#2a2a2a"/>
        <!-- LED droite -->
        <rect x="50" y="70" width="8" height="2" fill="#ff00ff">
          <animate attributeName="fill" values="#ff00ff;#00ff00;#00ffff;#ff00ff" dur="2s" repeatCount="indefinite"/>
        </rect>
        <!-- Reflets -->
        <rect x="24" y="64" width="3" height="2" fill="#ffffff" opacity="0.3"/>
        <rect x="52" y="64" width="3" height="2" fill="#ffffff" opacity="0.3"/>
      </g>
    `
  },
  {
    name: 'Chaussures Ailées',
    category: 'shoes',
    emoji: '🪽',
    description: "Sandales mythologiques d'Hermès",
    price: 300,
    rarity: 'legendary',
    svg: `
      <g id="winged-sandals">
        <!-- Sandale gauche -->
        <rect x="22" y="68" width="10" height="4" fill="#ffd700"/>
        <rect x="24" y="66" width="6" height="2" fill="#daa520"/>
        <!-- Aile gauche -->
        <rect x="18" y="66" width="4" height="2" fill="#ffffff"/>
        <rect x="16" y="67" width="4" height="3" fill="#f0f0f0"/>
        <rect x="14" y="68" width="4" height="2" fill="#e0e0e0"/>
        <animate attributeName="transform" values="translate(0,0);translate(0,-2);translate(0,0)" dur="1.5s" repeatCount="indefinite"/>
        <!-- Sandale droite -->
        <rect x="48" y="68" width="10" height="4" fill="#ffd700"/>
        <rect x="50" y="66" width="6" height="2" fill="#daa520"/>
        <!-- Aile droite -->
        <rect x="58" y="66" width="4" height="2" fill="#ffffff"/>
        <rect x="60" y="67" width="4" height="3" fill="#f0f0f0"/>
        <rect x="62" y="68" width="4" height="2" fill="#e0e0e0"/>
        <!-- Particules magiques -->
        <circle cx="20" cy="68" r="1" fill="#ffd700" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="68" r="1" fill="#ffd700" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite"/>
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
