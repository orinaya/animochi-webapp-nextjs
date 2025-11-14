/**
 * Service de génération de chats en pixel art
 *
 * Responsabilité unique : Générer des chats 20x20 pixels selon un pattern défini
 * - Gère les palettes de couleurs prédéfinies
 * - Applique les règles de coloration selon le pattern
 * - Génère du SVG optimisé pour l'affichage
 *
 * Respecte le principe SRP : Uniquement la génération de chats
 * Respecte le principe OCP : Extensible via nouvelles palettes/patterns
 */

/**
 * Type représentant une palette de couleurs pour un chat
 */
export interface CatPalette {
  /** Couleur de base du chat */
  base: string
  /** Couleur claire pour les variations */
  light: string
  /** Couleur moyenne */
  medium: string
  /** Couleur foncée pour les rayures */
  dark: string
  /** Couleur très foncée pour les contrastes */
  darkest: string
}

/**
 * Types d'éléments dans le pattern
 */
type ElementType =
  | "empty" // Cercles oranges - pas de couleur
  | "base" // Cercles verts - couleur de base
  | "contour" // Coeurs rouges - contour fixe #5E174F
  | "eyes" // Coeurs verts - yeux fixes #5E174F
  | "eyes_outer" // Parties extérieures des yeux (G6/G12) - animées
  | "eyes_white" // Parties blanches des yeux ouverts (F7/F11)
  | "ears_tongue" // Coeurs jaunes - oreilles/langue fixes #FF9994
  | "whiskers" // Etoiles rouges - moustaches (variables)
  | "paws" // Etoiles roses - pattes (variables)
  | "stripes" // Etoiles noires - rayures (variables/optionnelles)
  | "ear_stripes" // Etoiles vertes - rayures oreilles (variables/optionnelles)
  | "light_contour" // Coeurs roses - contour clair (calculé)
  | "nose_mouth" // Coeurs bleus - nez/bouche (calculé)
  | "cheeks" // Carrés noirs - joues (variables)
  | "tail" // Cercles bleus - queue (variables)
  | "body_accent" // Etoiles bleues - accent corps (calculé)
  | "muzzle" // Carrés roses - museau (variables)

/**
 * Palettes de couleurs prédéfinies (les 15 exemples + génération automatique)
 */
const PREDEFINED_PALETTES: CatPalette[] = [
  // Chat 1 - Blanc/Rose
  {base: "#FFFFFF", light: "#F5E6F0", medium: "#E8D4E8", dark: "#FFB3D9", darkest: "#FF99CC"},
  // Chat 2 - Orange clair
  {base: "#FFFFFF", light: "#FFD4A3", medium: "#FFB366", dark: "#FF9933", darkest: "#E67300"},
  // Chat 3 - Orange/Jaune
  {base: "#FFEAA3", light: "#FFD699", medium: "#FFBB66", dark: "#FF9933", darkest: "#E68A2E"},
  // Chat 4 - Orange foncé
  {base: "#FFD699", light: "#FFBB66", medium: "#FF9933", dark: "#CC7A29", darkest: "#A66121"},
  // Chat 5 - Blanc/Marron
  {base: "#FFFFFF", light: "#FFD4A3", medium: "#FFB366", dark: "#8C7A6B", darkest: "#665544"},
  // Chat 6 - Crème
  {base: "#FFF5E6", light: "#FFE6CC", medium: "#FFCCAA", dark: "#E6B899", darkest: "#CC9966"},
  // Chat 7 - Marron clair
  {base: "#E6CCB3", light: "#D4B299", medium: "#C19A7A", dark: "#A67C5C", darkest: "#8C6647"},
  // Chat 8 - Marron gris
  {base: "#D9B3A3", light: "#BF9999", medium: "#A68080", dark: "#8C6666", darkest: "#735252"},
  // Chat 9 - Gris bleu clair
  {base: "#EEEEFF", light: "#D9D9F2", medium: "#C4C4E6", dark: "#9999CC", darkest: "#7A7AB3"},
  // Chat 10 - Bleu gris
  {base: "#99AACC", light: "#7A8CB3", medium: "#5C6E99", dark: "#475580", darkest: "#334166"},
  // Chat 11 - Gris clair
  {base: "#FFFFFF", light: "#E6E6F2", medium: "#CCCCCC", dark: "#7A8CB3", darkest: "#5C6E99"},
  // Chat 12 - Gris foncé
  {base: "#4D5C73", light: "#3D4D5C", medium: "#2E3D4D", dark: "#1F2E3D", darkest: "#14202E"},
  // Chat 13 - Jaune
  {base: "#FFE680", light: "#FFDD66", medium: "#FFCC33", dark: "#F2B829", darkest: "#E6A31F"},
  // Chat 14 - Jaune/Turquoise
  {base: "#FFE680", light: "#CCFF99", medium: "#99FFCC", dark: "#66E6CC", darkest: "#33CCB3"},
  // Chat 15 - Bleu/Violet
  {base: "#B3B3FF", light: "#9999E6", medium: "#8080CC", dark: "#6666B3", darkest: "#4D4D99"},
]

/**
 * Couleurs fixes du pattern
 */
const FIXED_COLORS = {
  contour: "#5E174F",
  eyes: "#5E174F",
  ears_tongue: "#FF9994",
} as const

/**
 * Pattern de base du chat 20x20
 */
class CatPatternService {
  /**
   * Définit le pattern complet du chat avec tous les éléments
   */
  private getCatPattern(): Map<string, ElementType> {
    const pattern = new Map<string, ElementType>()

    // Cercles oranges / fond = vide (positions où il n'y a pas de couleur)
    const emptyPositions: string[] = [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "A9",
      "A10",
      "A11",
      "A12",
      "A13",
      "A14",
      "A15",
      "A16",
      "A17",
      "A18",
      "A19",
      "A20",
      "B1",
      "B2",
      "B6",
      "B7",
      "B8",
      "B9",
      "B10",
      "B11",
      "B12",
      "B16",
      "B17",
      "B18",
      "B19",
      "B20",
      "C1",
      "C2",
      "C16",
      "C17",
      "C18",
      "C19",
      "C20",
      "D1",
      "D2",
      "D16",
      "D17",
      "D18",
      "D19",
      "D20",
      "E1",
      "E2",
      "E16",
      "E17",
      "E18",
      "E19",
      "E20",
      "F1",
      "F2",
      "F16",
      "F17",
      "F18",
      "F19",
      "F20",
      "G1",
      "G17",
      "G18",
      "G19",
      "G20",
      "H1",
      "H2",
      "H16",
      "H19",
      "H20",
      "I1",
      "I20",
      "J1",
      "J2",
      "J20",
      "K1",
      "K2",
      "K19",
      "K20",
      "L1",
      "L2",
      "L19",
      "L20",
      "M1",
      "M19",
      "M20",
      "N1",
      "N20",
      "O1",
      "O20",
      "P1",
      "P19",
      "P20",
      "Q1",
      "Q2",
      "Q18",
      "Q19",
      "Q20",
      "R1",
      "R2",
      "R3",
      "R15",
      "R16",
      "R17",
      "R18",
      "R19",
      "R20",
      "S1",
      "S2",
      "S3",
      "S4",
      "S5",
      "S6",
      "S9",
      "S12",
      "S13",
      "S14",
      "S15",
      "S16",
      "S17",
      "S18",
      "S19",
      "S20",
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
      "T13",
      "T14",
      "T15",
      "T16",
      "T17",
      "T18",
      "T19",
      "T20",
    ]

    // Cercles verts / couleur de base du chat
    const basePositions: string[] = [
      "D6",
      "D8",
      "D10",
      "D12",
      "E5",
      "E6",
      "E7",
      "E8",
      "E10",
      "E11",
      "E12",
      "E13",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
      "F13",
      "F14",
      "G5",
      "G13",
      "H4",
      "H14",
      "I5",
      "I13",
      "J5",
      "J6",
      "J12",
      "J13",
      "K6",
      "K7",
      "K8",
      "K9",
      "K10",
      "K11",
      "K12",
      "L5",
      "L6",
      "L7",
      "L8",
      "L9",
      "L10",
      "L11",
      "L12",
      "L13",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
      "M11",
      "M12",
      "M13",
      "N5",
      "N6",
      "N7",
      "N8",
      "N9",
      "N10",
      "N11",
      "N12",
      "N13",
      "O5",
      "O6",
      "O7",
      "O11",
      "O12",
      "O13",
      "P6",
      "P7",
      "P8",
      "P10",
      "P11",
      "P12",
      "Q6",
      "Q12",
    ]

    // Coeurs rouges / contours du chat
    const contourPositions: string[] = [
      "B3",
      "B4",
      "B5",
      "B13",
      "B14",
      "B15",
      "C3",
      "C6",
      "C7",
      "C8",
      "C9",
      "C10",
      "C11",
      "C12",
      "C15",
      "D3",
      "D15",
      "E3",
      "E15",
      "F3",
      "F15",
      "G2",
      "G16",
      "H3",
      "H15",
      "H17",
      "H18",
      "I2",
      "I16",
      "I19",
      "J3",
      "J19",
      "K3",
      "K18",
      "L3",
      "L18",
      "M2",
      "M18",
      "N2",
      "N19",
      "O2",
      "O19",
      "P2",
      "P18",
      "Q3",
      "Q15",
      "Q16",
      "Q17",
      "R4",
      "R5",
      "R6",
      "R9",
      "R12",
      "R13",
      "R14",
      "S7",
      "S8",
      "S10",
      "S11",
    ]

    // Ajouter les positions de base
    emptyPositions.forEach((pos) => {
      pattern.set(pos, "empty")
    })
    basePositions.forEach((pos) => {
      pattern.set(pos, "base")
    })
    contourPositions.forEach((pos) => {
      pattern.set(pos, "contour")
    })

    // Éléments avec positions spécifiques
    // Yeux : G7 et G11 sont toujours la couleur des yeux
    pattern.set("G7", "eyes")
    pattern.set("G11", "eyes")
    // G6 et G12 alternent entre couleur des yeux (fermés) et couleur de base (ouverts)
    pattern.set("G6", "eyes_outer")
    pattern.set("G12", "eyes_outer")
    // F7 et F11 sont blancs quand les yeux sont ouverts
    pattern.set("F7", "eyes_white")
    pattern.set("F11", "eyes_white")

    pattern.set("D4", "ears_tongue")
    pattern.set("D14", "ears_tongue")
    pattern.set("E4", "ears_tongue")
    pattern.set("E14", "ears_tongue")
    pattern.set("I9", "ears_tongue")
    pattern.set("J9", "ears_tongue")

    // Moustaches
    pattern.set("G3", "whiskers")
    pattern.set("G4", "whiskers")
    pattern.set("G14", "whiskers")
    pattern.set("G15", "whiskers")
    pattern.set("I3", "whiskers")
    pattern.set("I4", "whiskers")
    pattern.set("I14", "whiskers")
    pattern.set("I15", "whiskers")

    // Pattes
    pattern.set("Q7", "paws")
    pattern.set("Q8", "paws")
    pattern.set("Q10", "paws")
    pattern.set("Q11", "paws")
    pattern.set("R7", "paws")
    pattern.set("R8", "paws")
    pattern.set("R10", "paws")
    pattern.set("R11", "paws")

    // Rayures
    pattern.set("D7", "stripes")
    pattern.set("D9", "stripes")
    pattern.set("D11", "stripes")
    pattern.set("E9", "stripes")
    pattern.set("N3", "stripes")
    pattern.set("P3", "stripes")
    pattern.set("N15", "stripes")
    pattern.set("P15", "stripes")

    // Rayures oreilles
    pattern.set("C5", "ear_stripes")
    pattern.set("C13", "ear_stripes")

    // Contour clair
    pattern.set("J15", "light_contour")
    pattern.set("K15", "light_contour")
    pattern.set("L15", "light_contour")
    pattern.set("M16", "light_contour")
    pattern.set("N16", "light_contour")
    pattern.set("O16", "light_contour")
    pattern.set("P16", "light_contour")

    // Nez et bouche
    pattern.set("H9", "nose_mouth")
    pattern.set("I8", "nose_mouth")
    pattern.set("I10", "nose_mouth")

    // Joues
    pattern.set("H5", "cheeks")
    pattern.set("H6", "cheeks")
    pattern.set("H12", "cheeks")
    pattern.set("H13", "cheeks")

    // Queue
    pattern.set("I17", "tail")
    pattern.set("I18", "tail")
    pattern.set("J17", "tail")
    pattern.set("J18", "tail")
    pattern.set("K4", "tail")
    pattern.set("K14", "tail")
    pattern.set("K17", "tail")

    // Accents corps (étoiles bleues)
    const bodyAccentPositions: string[] = [
      "C4",
      "C14",
      "D5",
      "D13",
      "J4",
      "J14",
      "J16",
      "K5",
      "K13",
      "K16",
      "L4",
      "L14",
      "L16",
      "L17",
      "M3",
      "M4",
      "M14",
      "M15",
      "M17",
      "N4",
      "N14",
      "N17",
      "N18",
      "O3",
      "O4",
      "O8",
      "O9",
      "O10",
      "O14",
      "O15",
      "O17",
      "O18",
      "P4",
      "P5",
      "P9",
      "P13",
      "P14",
      "P17",
      "Q4",
      "Q5",
      "Q9",
      "Q13",
      "Q14",
    ]
    bodyAccentPositions.forEach((pos) => {
      pattern.set(pos, "body_accent")
    })

    // Museau
    const muzzlePositions: string[] = [
      "G8",
      "G9",
      "G10",
      "H7",
      "H8",
      "H10",
      "H11",
      "I6",
      "I7",
      "I11",
      "I12",
      "J7",
      "J8",
      "J10",
      "J11",
    ]
    muzzlePositions.forEach((pos) => {
      pattern.set(pos, "muzzle")
    })

    return pattern
  }

  /**
   * Génère une palette aléatoire dans le style des chats
   */
  private generateRandomPalette(): CatPalette {
    // Choisir une base colorée aléatoire
    const baseHues = [0, 30, 45, 60, 210, 240, 270, 300] // Rouge, orange, jaune, vert, bleu, violet
    const hue = baseHues[Math.floor(Math.random() * baseHues.length)]

    // Variations de saturation et luminosité pour créer une palette harmonieuse
    const baseSaturation = 20 + Math.random() * 60 // 20-80%
    const baseLightness = 70 + Math.random() * 20 // 70-90%

    return {
      base: `hsl(${hue}, ${baseSaturation}%, ${baseLightness}%)`,
      light: `hsl(${hue}, ${baseSaturation * 0.7}%, ${Math.min(95, baseLightness + 15)}%)`,
      medium: `hsl(${hue}, ${baseSaturation * 0.9}%, ${baseLightness - 10}%)`,
      dark: `hsl(${hue}, ${baseSaturation * 1.2}%, ${baseLightness - 25}%)`,
      darkest: `hsl(${hue}, ${baseSaturation * 1.4}%, ${baseLightness - 40}%)`,
    }
  }

  /**
   * Calcule la couleur appropriée pour un élément selon la palette et les règles
   */
  private getElementColor(
    elementType: ElementType,
    palette: CatPalette,
    hasStripes: boolean,
    variableColors?: {cheeks: string; muzzle: string}
  ): string {
    switch (elementType) {
      case "base":
        return palette.base
      case "contour":
        return FIXED_COLORS.contour
      case "eyes":
        return FIXED_COLORS.eyes
      case "ears_tongue":
        return FIXED_COLORS.ears_tongue
      case "stripes":
        return hasStripes ? palette.dark : palette.base
      case "ear_stripes":
        return hasStripes ? palette.darkest : palette.base
      case "light_contour":
        return palette.light
      case "nose_mouth":
        return palette.darkest
      case "cheeks":
        return variableColors?.cheeks ?? palette.light
      case "tail":
        return palette.medium
      case "body_accent":
        return palette.medium
      case "muzzle":
        return variableColors?.muzzle ?? palette.base
      case "eyes_outer":
        return palette.base
      case "eyes_white":
        return "#fff"
      case "whiskers":
        return palette.darkest
      case "paws":
        return palette.light
      default:
        return palette.base
    }
  }

  /**
   * Génère un chat SVG complet avec animations
   */
  public generateCat(): string {
    // Choisir une palette (70% prédéfinie, 30% générée)
    try {
      const palette =
        Math.random() > 0.3
          ? PREDEFINED_PALETTES[Math.floor(Math.random() * PREDEFINED_PALETTES.length)]
          : this.generateRandomPalette()

      // Décider s'il y aura des rayures (50% de chance)
      const hasStripes = Math.random() > 0.5

      // Pré-générer les couleurs variables pour assurer la cohérence
      const variableColors = {
        cheeks: Math.random() > 0.5 ? "#FFCCCB" : palette.light,
        muzzle: (() => {
          const variation = Math.random()
          if (variation < 0.33) return palette.light
          if (variation < 0.66) return palette.medium
          return palette.base
        })(),
      }

      // Obtenir le pattern complet
      const pattern = this.getCatPattern()

      // Définir les positions exactes pour chaque partie animée
      const tailPositions = new Set([
        "H17",
        "H18",
        "I16",
        "I19",
        "J19",
        "K18",
        "L18",
        "M18",
        "N19",
        "O19",
        "P18",
        "Q16",
        "Q17",
        "J15",
        "K15",
        "L15",
        "M16",
        "N16",
        "O16",
        "P16",
        "J16",
        "K16",
        "L16",
        "L17",
        "M17",
        "N17",
        "N18",
        "O17",
        "O18",
        "P17",
        "I17",
        "I18",
        "J17",
        "J18",
      ])

      const pawPositions = new Set([
        "P7",
        "P8",
        "Q7",
        "Q8",
        "R7",
        "R8",
        "S7",
        "S8",
        "P10",
        "P11",
        "Q10",
        "Q11",
        "R10",
        "R11",
        "S10",
        "S11",
      ])

      const whiskerPositions = new Set([
        "G2",
        "G3",
        "G4",
        "I2",
        "I3",
        "I4",
        "G14",
        "G15",
        "G16",
        "I14",
        "I15",
        "I16",
      ])

      // Générer le SVG avec animations CSS
      const pixels: string[] = []
      const animationId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Parcourir chaque position de la grille 20x20
      for (let row = 1; row <= 20; row++) {
        for (let col = 1; col <= 20; col++) {
          const posKey = String.fromCharCode(64 + row) + col.toString() // A1, A2, etc.
          const elementType = pattern.get(posKey)

          if (elementType !== undefined && elementType !== "empty") {
            const color = this.getElementColor(elementType, palette, hasStripes, variableColors)
            const x = (col - 1) * 10 // Chaque pixel fait 10x10 unités SVG
            const y = (row - 1) * 10

            // Déterminer si ce pixel fait partie d'une zone animée
            const isTail = tailPositions.has(posKey)
            const isPaw = pawPositions.has(posKey)
            const isWhisker = whiskerPositions.has(posKey)

            // Gérer les animations pour différents éléments
            if (elementType === "eyes_outer") {
              // G6 et G12 : alternent entre #5E174F (fermés) et couleur de base (ouverts)
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="eye-outer-${animationId}"/>`
              )
            } else if (elementType === "eyes_white") {
              // F7 et F11 : transparents (fermés) ou blancs (ouverts)
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="eye-white-${animationId} shine-${animationId}"/>`
              )
            } else if (elementType === "eyes") {
              // Yeux avec effet de brillance
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="shine-${animationId}"/>`
              )
            } else if (elementType === "cheeks") {
              // Joues avec effet blush
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="cheek-${animationId}"/>`
              )
            } else if (isTail) {
              // Tous les pixels de la queue
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="tail-${animationId}"/>`
              )
            } else if (isPaw) {
              // Tous les pixels des pattes
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="paw-${animationId}"/>`
              )
            } else if (isWhisker) {
              // Tous les pixels des moustaches
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="whisker-${animationId}"/>`
              )
            } else if (
              elementType === "base" ||
              elementType === "body_accent" ||
              elementType === "muzzle"
            ) {
              // Corps avec respiration
              pixels.push(
                `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}" class="body-${animationId}"/>`
              )
            } else {
              pixels.push(`<rect x="${x}" y="${y}" width="10" height="10" fill="${color}"/>`)
            }
          }
        }
      }

      // Durée aléatoire entre clignements (2-5 secondes)
      const blinkDuration = 2 + Math.random() * 3
      const blinkDelay = Math.random() * 2 // Délai initial aléatoire

      // Couleur de blush plus rose
      const blushColor = "#FFB3D9"

      return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <style>
          /* Animation des yeux - clignement */
          @keyframes blink-outer-${animationId} {
            0%, 50%, 100% {
              fill: ${palette.base};
            }
            52%, 62% {
              fill: ${FIXED_COLORS.eyes};
            }
          }

          @keyframes blink-white-${animationId} {
            0%, 50%, 100% {
              fill: white;
            }
            52%, 62% {
              fill: transparent;
            }
          }

          /* Animation de blush */
          @keyframes blush-${animationId} {
            0%, 100% {
              fill: ${variableColors.cheeks};
            }
            50% {
              fill: ${blushColor};
            }
          }

          /* Animation de brillance sur les yeux */
          @keyframes shine-${animationId} {
            0%, 80%, 100% {
              opacity: 1;
            }
            85%, 95% {
              opacity: 0.7;
            }
          }

          /* Animation de respiration (idle) */
          @keyframes breathe-${animationId} {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.01);
            }
          }

          /* Animation des moustaches - vibration légère */
          @keyframes whisker-wiggle-${animationId} {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            15% {
              transform: translate(0.5px, -0.3px) rotate(1deg);
            }
            30% {
              transform: translate(0.8px, -0.2px) rotate(1.5deg);
            }
            50% {
              transform: translate(0, 0) rotate(0deg);
            }
            65% {
              transform: translate(-0.5px, 0.3px) rotate(-1deg);
            }
            80% {
              transform: translate(-0.8px, 0.2px) rotate(-1.5deg);
            }
          }

          /* Animation de la queue qui remue - plus naturelle */
          @keyframes tail-wag-${animationId} {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            15% {
              transform: translate(1px, -0.5px) rotate(3deg);
            }
            30% {
              transform: translate(2px, -0.3px) rotate(5deg);
            }
            50% {
              transform: translate(0, 0) rotate(0deg);
            }
            65% {
              transform: translate(-1px, -0.5px) rotate(-3deg);
            }
            80% {
              transform: translate(-2px, -0.3px) rotate(-5deg);
            }
          }

          /* Animation des pattes qui tapotent - alternance gauche/droite */
          @keyframes paw-tap-${animationId} {
            0%, 100% {
              transform: translateY(0);
            }
            12% {
              transform: translateY(-4px);
            }
            24% {
              transform: translateY(-2px);
            }
            36% {
              transform: translateY(0);
            }
            62% {
              transform: translateY(-5px);
            }
            74% {
              transform: translateY(-3px);
            }
            86% {
              transform: translateY(0);
            }
          }

          .eye-outer-${animationId} {
            animation: blink-outer-${animationId} ${blinkDuration}s ease-in-out infinite;
            animation-delay: ${blinkDelay}s;
          }

          .eye-white-${animationId} {
            animation: blink-white-${animationId} ${blinkDuration}s ease-in-out infinite;
            animation-delay: ${blinkDelay}s;
          }

          .cheek-${animationId} {
            animation: blush-${animationId} 3s ease-in-out infinite;
            animation-delay: ${blinkDelay + 0.5}s;
          }

          .shine-${animationId} {
            animation: shine-${animationId} 4s ease-in-out infinite;
            animation-delay: ${blinkDelay + 1}s;
          }

          .body-${animationId} {
            transform-origin: center;
            animation: breathe-${animationId} 3s ease-in-out infinite;
          }

          .whisker-${animationId} {
            transform-origin: center;
            animation: whisker-wiggle-${animationId} 2.5s ease-in-out infinite;
            animation-delay: ${Math.random() * 0.8}s;
          }

          .tail-${animationId} {
            transform-origin: center;
            animation: tail-wag-${animationId} 2.2s ease-in-out infinite;
          }

          .paw-${animationId} {
            animation: paw-tap-${animationId} 3.5s ease-in-out infinite;
            animation-delay: ${Math.random() * 1.5}s;
          }
        </style>
        <rect width="200" height="200" fill="transparent"/>
        ${pixels.join("\n        ")}
      </svg>
    `.trim()
    } catch (err) {
      console.error("[catGeneratorService] Erreur lors de la génération du chat :", err)
      // SVG vide en cas d’erreur
      return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"></svg>'
    }
  }
}

/**
 * Instance singleton du service de génération de chats
 */
export const catGeneratorService = new CatPatternService()

/**
 * Fonction utilitaire pour générer un chat (interface publique)
 * Retourne le SVG brut
 */
export function generatePixelCat(): string {
  try {
    return catGeneratorService.generateCat()
  } catch (err) {
    console.error("[generatePixelCat] Erreur lors de la génération du chat :", err)
    return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"></svg>'
  }
}

/**
 * Fonction utilitaire pour générer un chat en data URI
 * Compatible avec les balises <img> et permet les animations CSS
 */
export function generatePixelCatDataUri(): string {
  try {
    const svg = catGeneratorService.generateCat()
    const encoded = encodeURIComponent(svg)
    return `data:image/svg+xml,${encoded}`
  } catch (err) {
    console.error("[generatePixelCatDataUri] Erreur lors de la génération du data URI :", err)

    return "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22200%22%20height%3D%22200%22%3E%3C/svg%3E"
  }
}
