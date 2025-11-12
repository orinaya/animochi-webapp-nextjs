# Système d'Accessoires Animochi

## 📋 Vue d'ensemble

Le système d'accessoires permet aux utilisateurs d'acheter, équiper et visualiser des accessoires pour personnaliser leurs monstres (chats). Les accessoires sont dessinés en style pixel art SVG et superposés sur le rendu du monstre.

## 🎨 Catégories d'Accessoires

### 1. Chapeaux (hats) 🎩

- **Chapeau Haut-de-Forme** - Commun (50 Koins)
- **Béret Français** - Rare (75 Koins)
- **Couronne Dorée** - Épique (200 Koins)
- **Auréole Céleste** - Légendaire (500 Koins)

### 2. Lunettes (glasses) 👓

- **Lunettes Rondes** - Commun (60 Koins)
- **Lunettes de Soleil** - Rare (100 Koins)
- **Monocle Chic** - Épique (180 Koins)
- **Lunettes Arc-en-Ciel** - Légendaire (450 Koins)

### 3. Chaussures (shoes) 👟

- **Baskets Rouges** - Commun (40 Koins)
- **Bottes d'Aventurier** - Rare (90 Koins)
- **Chaussons de Ballet** - Épique (150 Koins)
- **Sabots Magiques** - Légendaire (420 Koins)

## 🌟 Système de Rareté

| Rareté         | Multiplicateur | Couleur Badge      | Exemples                              |
| -------------- | -------------- | ------------------ | ------------------------------------- |
| **Commun**     | x1             | Latte (beige)      | Chapeau Haut-de-Forme, Baskets Rouges |
| **Rare**       | x2             | Blueberry (bleu)   | Béret, Lunettes de Soleil             |
| **Épique**     | x4             | Peach (pêche)      | Couronne, Monocle                     |
| **Légendaire** | x10            | Strawberry (rouge) | Auréole, Lunettes Arc-en-Ciel         |

## 🏗️ Architecture (Clean Architecture)

### Domain Layer (`src/domain/`)

```
domain/
  entities/
    - Accessory (données de base)
    - OwnedAccessory (accessoire possédé)
    - EquippedAccessories (accessoires équipés)
  repositories/
    - AccessoryRepository (interface)
  use-cases/
    - PurchaseAccessoryUseCase
    - EquipAccessoryUseCase
    - UnequipAccessoryUseCase
```

### Data Layer (`src/data/`)

- **accessories-catalog.ts** : Catalogue statique des 12 accessoires avec SVG pixel art

### Presentation Layer (`src/components/`)

```
components/
  accessories/
    - accessory-shop-modal.tsx (Boutique)
    - accessory-inventory-modal.tsx (Inventaire)
  monsters/
    - monster-detail-avatar.tsx (Affichage avec accessoires)
    - monster-actions-section.tsx (Boutons Boutique/Inventaire)
```

## 🎮 Fonctionnalités Implémentées

### ✅ Phase 1 - Interface Utilisateur

#### 1. Boutique d'Accessoires (`AccessoryShopModal`)

- [x] Affichage du catalogue complet (12 accessoires)
- [x] Filtrage par catégorie (Tout, Chapeaux, Lunettes, Chaussures)
- [x] Filtrage par rareté (Tout, Commun, Rare, Épique, Légendaire)
- [x] Affichage du solde en Koins
- [x] Prévisualisation SVG de chaque accessoire
- [x] Badge de rareté coloré
- [x] Bouton d'achat avec vérification du solde
- [x] Design responsive (grid 1/2/3 colonnes)

**Interface :**

```typescript
<AccessoryShopModal
  isOpen={boolean}
  onClose={() => void}
  koinsBalance={number}
  onPurchase={(accessory: AccessoryData) => Promise<void>}
/>
```

#### 2. Inventaire d'Accessoires (`AccessoryInventoryModal`)

- [x] Affichage des accessoires possédés
- [x] Statistiques par catégorie
- [x] Section "Actuellement équipé" (3 slots)
- [x] Filtrage par catégorie
- [x] Boutons Équiper/Retirer
- [x] Indicateur visuel des accessoires équipés
- [x] Design responsive (grid 2/3/4 colonnes)

**Interface :**

```typescript
<AccessoryInventoryModal
  isOpen={boolean}
  onClose={() => void}
  ownedAccessories={Array<OwnedAccessory & { details: AccessoryData }>}
  equippedAccessories={EquippedAccessories}
  monsterId={string}
  onEquip={(accessoryId: string, category: AccessoryCategory) => Promise<void>}
  onUnequip={(category: AccessoryCategory) => Promise<void>}
/>
```

#### 3. Affichage des Accessoires sur le Monstre

- [x] Superposition des accessoires équipés sur le SVG du monstre
- [x] Utilisation de `useMemo` pour optimiser le rendu
- [x] Support de plusieurs accessoires simultanément
- [x] Système de layers (monstre + accessoires)

#### 4. Boutons d'Accès

- [x] Bouton "🛍️ Boutique" dans `MonsterActionsSection`
- [x] Bouton "🎒 Inventaire" dans `MonsterActionsSection`
- [x] Design cohérent avec le theme Animochi
- [x] Animations hover et scale

### 🚧 Phase 2 - Backend (À Implémenter)

Les handlers suivants sont prêts mais marqués TODO :

```typescript
// Dans monster-actions-section.tsx
handlePurchaseAccessory(accessory: AccessoryData)
handleEquipAccessory(accessoryId: string, category: AccessoryCategory)
handleUnequipAccessory(category: AccessoryCategory)
```

#### API Routes à créer :

**1. POST `/api/accessories/purchase`**

```typescript
Body: { accessoryName: string, monsterId: string }
Response: { success: boolean, newBalance: number, ownedAccessory: OwnedAccessory }
```

- Vérifie le solde de Koins
- Débite le prix
- Crée un OwnedAccessory
- Retourne le nouveau solde

**2. POST `/api/accessories/equip`**

```typescript
Body: { accessoryId: string, monsterId: string, category: AccessoryCategory }
Response: { success: boolean, equippedAccessories: EquippedAccessories }
```

- Retire l'accessoire équipé précédent (même catégorie)
- Équipe le nouvel accessoire
- Met à jour `monster.equippedAccessories`

**3. POST `/api/accessories/unequip`**

```typescript
Body: { monsterId: string, category: AccessoryCategory }
Response: { success: boolean, equippedAccessories: EquippedAccessories }
```

- Retire l'accessoire de la catégorie
- Met à jour `monster.equippedAccessories`

**4. GET `/api/accessories/inventory/:monsterId`**

```typescript
Response: {
  ownedAccessories: Array<OwnedAccessory & {details: AccessoryData}>
}
```

- Récupère tous les accessoires possédés
- Joint les détails depuis le catalogue

## 🗄️ Base de Données

### Collection `accessories_inventory`

```typescript
{
  _id: ObjectId,
  accessoryName: string,        // Référence vers ACCESSORIES_CATALOG
  ownerId: string,               // ID utilisateur
  equippedOnMonsterId?: string,  // ID monstre si équipé
  purchasedAt: Date,
  isEquipped: boolean
}
```

### Champ ajouté à `monsters`

```typescript
{
  // ... autres champs
  equippedAccessories: {
    hat?: string,      // nom de l'accessoire
    glasses?: string,
    shoes?: string
  }
}
```

### Collection `users` (pour Koins)

```typescript
{
  // ... autres champs
  koins: number // Monnaie virtuelle
}
```

## 🎨 SVG Pixel Art

Chaque accessoire est dessiné avec :

- **ViewBox** : `0 0 80 80`
- **Style** : Carrés de 8x8px (style rétro)
- **Positionnement** :
  - Chapeaux : y < 16 (haut de la tête)
  - Lunettes : y ≈ 28-36 (yeux)
  - Chaussures : y > 56 (pieds)

Exemple (Chapeau Haut-de-Forme) :

```svg
<g id="top-hat">
  <rect x="20" y="8" width="8" height="8" fill="#1a1a1a"/>
  <rect x="28" y="0" width="8" height="8" fill="#2a2a2a"/>
  <!-- ... -->
</g>
```

## 🔄 Flux d'Utilisation

### Scénario 1 : Achat d'un accessoire

1. Utilisateur clique sur "🛍️ Boutique"
2. Filtre par catégorie/rareté (optionnel)
3. Clique sur "Acheter"
4. → API `/api/accessories/purchase`
5. → Débit des Koins
6. → Toast de confirmation
7. → Refresh pour mettre à jour l'inventaire

### Scénario 2 : Équiper un accessoire

1. Utilisateur clique sur "🎒 Inventaire"
2. Sélectionne un accessoire
3. Clique sur "Équiper"
4. → API `/api/accessories/equip`
5. → Mise à jour de `monster.equippedAccessories`
6. → Toast de confirmation
7. → Refresh → L'accessoire apparaît sur le monstre

### Scénario 3 : Retirer un accessoire

1. Dans l'inventaire, section "Actuellement équipé"
2. Clique sur "Retirer" sous l'accessoire
3. → API `/api/accessories/unequip`
4. → Mise à jour de `monster.equippedAccessories`
5. → Toast de confirmation
6. → Refresh → L'accessoire disparaît du monstre

## 📝 Types TypeScript

```typescript
// src/types/monster-accessories.ts
export type AccessoryCategory = "hat" | "glasses" | "shoes"
export type AccessoryRarity = "common" | "rare" | "epic" | "legendary"

export interface AccessoryData {
  name: string
  category: AccessoryCategory
  emoji: string
  description: string
  price: number
  rarity: AccessoryRarity
  svg?: string
}

export interface OwnedAccessory {
  _id?: string
  accessoryId: string
  ownerId: string
  equippedOnMonsterId?: string | null
  purchasedAt: string
  isEquipped: boolean
}

export interface EquippedAccessories {
  hat?: string | null
  glasses?: string | null
  shoes?: string | null
}
```

## 🎯 Prochaines Étapes

### Priorité Haute

1. [ ] Implémenter les API routes (`/api/accessories/*`)
2. [ ] Créer le modèle Mongoose `AccessoryInventory`
3. [ ] Ajouter le champ `koins` au modèle `User`
4. [ ] Tester les flux complets d'achat/équipement
5. [ ] Gérer les cas d'erreur (solde insuffisant, accessoire déjà possédé)

### Priorité Moyenne

6. [ ] Ajouter une animation lors de l'équipement
7. [ ] Système de récompenses (gagner des Koins via actions)
8. [ ] Boutique avec offres spéciales/promotions
9. [ ] Historique des achats

### Bonus

10. [ ] Accessoires combinables (effets spéciaux)
11. [ ] Système d'échange entre utilisateurs
12. [ ] Accessoires exclusifs/événementiels
13. [ ] Prévisualisation 3D avant achat

## 🧪 Tests à Effectuer

- [ ] Achat avec solde suffisant
- [ ] Achat avec solde insuffisant
- [ ] Équipement d'un accessoire
- [ ] Remplacement d'un accessoire (même catégorie)
- [ ] Retrait d'un accessoire
- [ ] Affichage de plusieurs accessoires simultanément
- [ ] Responsive design (mobile/tablette/desktop)
- [ ] Filtres boutique (tous les cas)
- [ ] Filtres inventaire

## 📦 Fichiers Créés

```
src/
  components/
    accessories/
      ✅ accessory-shop-modal.tsx
      ✅ accessory-inventory-modal.tsx
  data/
    ✅ accessories-catalog.ts
  types/
    ✅ monster-accessories.ts (existant, étendu)
  components/monsters/
    ✅ monster-detail-avatar.tsx (modifié)
    ✅ monster-actions-section.tsx (modifié)
docs/
  ✅ ACCESSORIES_SYSTEM_IMPLEMENTATION.md (ce fichier)
```

## 🎨 Design System

### Couleurs de Rareté

```css
Common:     bg-latte-200 text-latte-800
Rare:       bg-blueberry-200 text-blueberry-800
Epic:       bg-peach-200 text-peach-800
Legendary:  bg-strawberry-200 text-strawberry-800
```

### Boutons

- Boutique: `from-strawberry-500 to-peach-500`
- Inventaire: `from-blueberry-500 to-latte-500`
- Acheter: `bg-strawberry-500`
- Équiper: `bg-blueberry-500`
- Retirer: `bg-strawberry-500`

---

**Version** : 1.0  
**Date** : 12 novembre 2025  
**Status** : Interface complète, API à implémenter
