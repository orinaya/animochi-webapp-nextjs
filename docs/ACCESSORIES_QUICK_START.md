# 🎩 Système d'Accessoires - Guide Rapide

## ✨ Fonctionnalités Actuelles

### Interface Complète ✅

- **Boutique** : 12 accessoires en pixel art (chapeaux, lunettes, chaussures)
- **Inventaire** : Gestion des accessoires possédés
- **Affichage** : Les accessoires apparaissent sur les monstres
- **Système de rareté** : 4 niveaux (Commun → Légendaire)

## 🚀 Comment Tester

### 1. Accéder à un monstre

```
/app/creatures/[id]
```

### 2. Cliquer sur les nouveaux boutons

- **🛍️ Boutique** : Voir le catalogue complet
- **🎒 Inventaire** : Gérer vos accessoires

### 3. Explorer la boutique

- Filtrer par catégorie (Chapeaux, Lunettes, Chaussures)
- Filtrer par rareté (Commun, Rare, Épique, Légendaire)
- Voir les prix et prévisualisations SVG

## 📝 État Actuel

### ✅ Implémenté

- [x] Catalogue de 12 accessoires pixel art
- [x] Modal boutique avec filtres
- [x] Modal inventaire avec gestion
- [x] Affichage des accessoires sur les monstres
- [x] Boutons d'accès dans les actions du monstre
- [x] Design responsive et animations
- [x] Système de rareté avec badges colorés

### 🚧 À Implémenter (Backend)

- [ ] API `/api/accessories/purchase` (achat)
- [ ] API `/api/accessories/equip` (équiper)
- [ ] API `/api/accessories/unequip` (retirer)
- [ ] API `/api/accessories/inventory/:monsterId` (liste)
- [ ] Modèle Mongoose `AccessoryInventory`
- [ ] Système de Koins (monnaie virtuelle)

## 🎨 Accessoires Disponibles

### 🎩 Chapeaux

| Nom                   | Rareté     | Prix | Emoji |
| --------------------- | ---------- | ---- | ----- |
| Chapeau Haut-de-Forme | Commun     | 50   | 🎩    |
| Béret Français        | Rare       | 75   | 🧢    |
| Couronne Dorée        | Épique     | 200  | 👑    |
| Auréole Céleste       | Légendaire | 500  | 😇    |

### 👓 Lunettes

| Nom                  | Rareté     | Prix | Emoji |
| -------------------- | ---------- | ---- | ----- |
| Lunettes Rondes      | Commun     | 60   | 🤓    |
| Lunettes de Soleil   | Rare       | 100  | 😎    |
| Monocle Chic         | Épique     | 180  | 🧐    |
| Lunettes Arc-en-Ciel | Légendaire | 450  | 🌈    |

### 👟 Chaussures

| Nom                 | Rareté     | Prix | Emoji |
| ------------------- | ---------- | ---- | ----- |
| Baskets Rouges      | Commun     | 40   | 👟    |
| Bottes d'Aventurier | Rare       | 90   | 🥾    |
| Chaussons de Ballet | Épique     | 150  | 🩰    |
| Sabots Magiques     | Légendaire | 420  | ✨    |

## 🔧 Fichiers Clés

### Composants

```
src/components/accessories/
  - accessory-shop-modal.tsx      (Boutique)
  - accessory-inventory-modal.tsx (Inventaire)

src/components/monsters/
  - monster-actions-section.tsx   (Boutons + modales)
  - monster-detail-avatar.tsx     (Rendu avec accessoires)
```

### Données

```
src/data/
  - accessories-catalog.ts        (12 accessoires SVG)

src/types/
  - monster-accessories.ts        (Types TypeScript)
```

### Documentation

```
docs/
  - ACCESSORIES_SYSTEM_IMPLEMENTATION.md (Doc complète)
  - ACCESSORIES_QUICK_START.md           (Ce fichier)
```

## 🎯 Prochaines Étapes pour Backend

### 1. Créer les API Routes

```typescript
// src/app/api/accessories/purchase/route.ts
export async function POST(request: Request) {
  // Vérifier solde, débiter, créer OwnedAccessory
}

// src/app/api/accessories/equip/route.ts
export async function POST(request: Request) {
  // Équiper l'accessoire, mettre à jour monster.equippedAccessories
}

// src/app/api/accessories/unequip/route.ts
export async function POST(request: Request) {
  // Retirer l'accessoire de la catégorie
}

// src/app/api/accessories/inventory/[monsterId]/route.ts
export async function GET(request: Request) {
  // Récupérer tous les accessoires possédés
}
```

### 2. Créer le Modèle Mongoose

```typescript
// src/db/models/AccessoryInventory.ts
const AccessoryInventorySchema = new Schema({
  accessoryName: {type: String, required: true},
  ownerId: {type: String, required: true},
  equippedOnMonsterId: {type: String, default: null},
  purchasedAt: {type: Date, default: Date.now},
  isEquipped: {type: Boolean, default: false},
})
```

### 3. Ajouter les Koins aux Users

```typescript
// Ajouter au modèle User existant
koins: { type: Number, default: 1000 }
```

### 4. Connecter aux Handlers

Décommenter les appels API dans `monster-actions-section.tsx` :

- `handlePurchaseAccessory`
- `handleEquipAccessory`
- `handleUnequipAccessory`

## 💡 Conseils de Développement

1. **Tester l'interface d'abord** : Tout est fonctionnel visuellement
2. **Implémenter les API progressivement** : Purchase → Equip → Unequip
3. **Utiliser les types existants** : Tout est défini dans `monster-accessories.ts`
4. **Suivre Clean Architecture** : Domain → Application → Infrastructure
5. **Gérer les erreurs** : Solde insuffisant, accessoire déjà possédé, etc.

## 🐛 Debug

Si les accessoires ne s'affichent pas :

1. Vérifier `monster.equippedAccessories` dans la DB
2. Vérifier que les noms correspondent au catalogue
3. Vérifier la console pour les erreurs SVG
4. Vérifier le viewBox (0 0 80 80) des SVG

---

**Auteur** : GitHub Copilot  
**Date** : 12 novembre 2025  
**Version** : 1.0 - Interface complète
