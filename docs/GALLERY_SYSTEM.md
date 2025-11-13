# Système de Galerie Communautaire - Documentation

## Vue d'ensemble

Le système de galerie communautaire permet aux utilisateurs de partager leurs monstres avec la communauté Animochi en les rendant publics. Les monstres publics sont affichés dans une galerie accessible à tous les utilisateurs.

## Architecture

### Modèle de données

**Champ ajouté au modèle Monster :**

- `isPublic: Boolean` (default: `false`) - Indique si le monstre est visible publiquement

### Structure des fichiers

```
src/
├── actions/
│   └── gallery.actions.ts          # Server Actions pour la galerie
├── components/
│   └── monsters/
│       ├── public-toggle.tsx        # Composant toggle public/privé
│       ├── gallery-filters.tsx      # Filtres de la galerie
│       └── monster-gallery-card.tsx # Carte monstre pour galerie
├── app/
│   └── galerie/
│       ├── page.tsx                 # Point d'entrée
│       └── galerie-page.tsx         # Page principale
└── types/
    └── gallery.ts                   # Types TypeScript
```

## Fonctionnalités

### 1. Mode Public des Monstres

#### Toggle de visibilité

- **Composant :** `PublicToggle`
- **Variantes :** `compact` | `full`
- **Emplacement :** Page de détail du monstre
- **Fonctionnalités :**
  - Switch interactif pour basculer public/privé
  - Indicateur visuel de l'état (🌍 Public / 🔒 Privé)
  - Toast de confirmation
  - État de chargement pendant la transition

#### Respect de la vie privée

- Par défaut, tous les monstres sont privés (`isPublic: false`)
- Seul le propriétaire peut modifier la visibilité
- Les monstres privés n'apparaissent jamais dans la galerie
- Possibilité de rendre un monstre privé à tout moment

### 2. Page Galerie Communautaire

#### URL

- `/galerie` - Accessible sans authentification

#### Affichage

- **Grille responsive** : 1 colonne (mobile) → 3 colonnes (desktop)
- **Carte monstre** avec :
  - Preview du dessin avec accessoires et arrière-plan
  - Badge "🌍 Public"
  - Nom et niveau
  - État/humeur
  - Créateur (nom d'utilisateur, email anonymisé)

#### Filtres disponibles

- **Par état :** Tous, Joyeux, Triste, En colère, Affamé, Endormi
- **Par niveau :** Niveau minimum et maximum
- **Tri :** Plus récents, Plus anciens, Niveau croissant/décroissant

#### Pagination

- 12 monstres par page
- Navigation précédent/suivant
- Indicateur de page actuelle

## API

### Server Actions

#### `getPublicMonsters(filters?: GalleryFilters): Promise<GalleryResult>`

Récupère les monstres publics avec filtrage et pagination.

**Paramètres :**

```typescript
interface GalleryFilters {
  minLevel?: number
  maxLevel?: number
  state?: MonsterState | "all"
  sortBy?: "newest" | "oldest" | "level-asc" | "level-desc"
  limit?: number
  page?: number
}
```

**Retour :**

```typescript
interface GalleryResult {
  monsters: MonsterWithOwner[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
```

**Exemple :**

```typescript
const result = await getPublicMonsters({
  minLevel: 5,
  state: "happy",
  sortBy: "newest",
  page: 1,
  limit: 12,
})
```

#### `toggleMonsterVisibility(monsterId: string, isPublic: boolean): Promise<Result>`

Active ou désactive le mode public d'un monstre.

**Sécurité :**

- Vérifie l'authentification
- Vérifie que le monstre appartient à l'utilisateur
- Retourne un message d'erreur si non autorisé

**Retour :**

```typescript
{
  success: boolean
  message: string
}
```

**Exemple :**

```typescript
const result = await toggleMonsterVisibility("507f1f77bcf86cd799439011", true)
if (result.success) {
  console.log(result.message) // "Monstre rendu public !"
}
```

## Types TypeScript

### `MonsterWithOwner`

Monstre avec informations du propriétaire pour la galerie.

```typescript
interface MonsterWithOwner extends Monster {
  isPublic: boolean
  owner?: {
    id: string
    username?: string
    email?: string // Anonymisé
  }
}
```

### `GalleryFilters`

Options de filtrage pour la galerie.

### `GalleryResult`

Résultat paginé de la galerie.

## Principes SOLID appliqués

### Single Responsibility Principle (SRP)

- `PublicToggle` : Gère uniquement l'interface du toggle
- `GalleryFilters` : Gère uniquement l'interface des filtres
- `MonsterGalleryCard` : Affiche uniquement une carte de monstre
- `getPublicMonsters` : Récupère uniquement les monstres publics
- `toggleMonsterVisibility` : Modifie uniquement la visibilité

### Open/Closed Principle (OCP)

- Filtres extensibles via l'interface `GalleryFilters`
- Variants du `PublicToggle` (`compact` | `full`)
- Tri extensible sans modifier la fonction de récupération

### Dependency Inversion Principle (DIP)

- Server Actions dépendent de l'abstraction MongoDB via Mongoose
- Composants dépendent des types TypeScript, pas des implémentations

## Sécurité et vie privée

### Anonymisation des emails

```typescript
function anonymizeEmail(email: string): string {
  // "john.doe@example.com" → "j***@example.com"
  const [local, domain] = email.split("@")
  if (local.length <= 1) return `${local}***@${domain}`
  return `${local[0]}***@${domain}`
}
```

### Vérifications

- Authentification requise pour modifier la visibilité
- Vérification de propriété avant modification
- Filtrage strict des monstres publics (`isPublic: true`)

## Utilisation

### Rendre un monstre public

1. Accéder à la page de détail du monstre
2. Utiliser le toggle "🔒 Privé / 🌍 Public" dans le header
3. Confirmation par toast

### Consulter la galerie

1. Accéder à `/galerie` via le menu "Communauté"
2. Utiliser les filtres pour affiner la recherche
3. Cliquer sur une carte pour voir les détails (redirige vers la page du monstre)

### Navigation

La galerie est accessible :

- Via le menu latéral : **Communauté → Galerie**
- Via l'URL directe : `/galerie`
- Sans authentification requise

## Performance

### Optimisations

- Pagination pour limiter le nombre de monstres chargés
- Index MongoDB sur `isPublic` pour requêtes rapides
- `useMemo` pour éviter recalculs inutiles
- Lazy loading des images

### Requêtes MongoDB

```javascript
// Requête optimisée avec index et pagination
const monsters = await monsterModel
  .find({isPublic: true, level: {$gte: 5}})
  .sort({createdAt: -1})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean()
```

## Tests recommandés

1. **Visibilité**

   - Vérifier qu'un monstre privé n'apparaît pas dans la galerie
   - Vérifier qu'un monstre public apparaît immédiatement

2. **Filtres**

   - Tester chaque combinaison de filtres
   - Vérifier que "Tous" affiche tous les états

3. **Pagination**

   - Naviguer entre les pages
   - Vérifier les boutons désactivés aux extrémités

4. **Sécurité**
   - Tenter de modifier la visibilité d'un monstre non possédé
   - Vérifier l'anonymisation des emails

## Maintenance

### Ajout d'un nouveau filtre

1. Ajouter le champ dans `GalleryFilters` (`src/types/gallery.ts`)
2. Mettre à jour `GalleryFilters` component
3. Ajouter la logique de filtrage dans `getPublicMonsters`

### Modification de l'affichage

- **Carte monstre :** Modifier `MonsterGalleryCard`
- **Filtres :** Modifier `GalleryFilters`
- **Layout :** Modifier `galerie-page.tsx`

## Évolutions futures

- [ ] Système de likes/favoris
- [ ] Commentaires sur les monstres publics
- [ ] Partage sur réseaux sociaux
- [ ] Statistiques de popularité
- [ ] Filtres avancés (rareté, accessoires)
- [ ] Recherche par nom de monstre ou créateur
