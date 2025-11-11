# 🎨 Système d'Avatars Animaux - Animochi

## Vue d'ensemble

Système de sélection d'avatars basé sur les images d'animaux avec couleurs pastels personnalisées pour la sidebar de l'application Animochi.

## Fonctionnalités

### ✨ Avatar Sélectionnable

- **17 animaux disponibles** : blaireau, cerf, corbeau, esquimau, hérisson, hibou, lapin, lion, morse, panda roux (2 variants), pingouin, raton laveur, renard, requin, souris, tapir
- **Couleurs pastels coordonnées** : Chaque animal a sa propre couleur de fond pastel
- **Modal de sélection** : Interface intuitive avec aperçu en temps réel

### 🎨 Design System

- **Couleurs cohérentes** : Utilise les couleurs du thème Animochi (strawberry, blueberry, peach, latte)
- **Interface responsive** : Grille 4 colonnes adaptative
- **Transitions fluides** : Animations CSS pour une expérience utilisateur optimale

### 🔧 Architecture

- **Clean Architecture** : Respect des principes SOLID
- **Composants modulaires** : `ProfileAvatarModal`, `useUserAvatar` hook
- **Utilitaires centralisés** : `animal-avatar-utils.ts`

## Structure des fichiers

```
src/
├── components/
│   ├── profile/
│   │   ├── profile-avatar-modal.tsx    # Modal de sélection d'avatar
│   │   └── index.ts                    # Export des composants profil
│   └── web/layout/
│       └── sidebar.tsx                 # Sidebar modifiée avec avatars
├── hooks/
│   └── use-user-avatar.ts             # Hook de gestion d'avatar
└── lib/
    └── animal-avatar-utils.ts         # Utilitaires avatars animaux
```

## Utilisation

### 1. Sélection d'avatar

L'utilisateur peut cliquer sur le bouton crayon (✏️) à côté de son avatar dans la sidebar pour ouvrir la modal de sélection.

### 2. Couleurs automatiques

| Animal          | Couleur de fond | Couleur de texte  |
| --------------- | --------------- | ----------------- |
| 🦡 Blaireau     | `bg-slate-200`  | `text-slate-800`  |
| 🦌 Cerf         | `bg-amber-200`  | `text-amber-800`  |
| 🐦‍⬛ Corbeau   | `bg-gray-200`   | `text-gray-800`   |
| 🧊 Esquimau     | `bg-cyan-200`   | `text-cyan-800`   |
| 🦔 Hérisson     | `bg-orange-200` | `text-orange-800` |
| 🦉 Hibou        | `bg-indigo-200` | `text-indigo-800` |
| 🐰 Lapin        | `bg-pink-200`   | `text-pink-800`   |
| 🦁 Lion         | `bg-yellow-200` | `text-yellow-800` |
| 🦭 Morse        | `bg-blue-200`   | `text-blue-800`   |
| 🐼 Panda Roux   | `bg-red-200`    | `text-red-800`    |
| 🐧 Pingouin     | `bg-slate-100`  | `text-slate-700`  |
| 🦝 Raton Laveur | `bg-gray-300`   | `text-gray-800`   |
| 🦊 Renard       | `bg-orange-100` | `text-orange-700` |
| 🦈 Requin       | `bg-teal-200`   | `text-teal-800`   |
| 🐭 Souris       | `bg-rose-200`   | `text-rose-800`   |
| 🦏 Tapir        | `bg-purple-200` | `text-purple-800` |

### 3. Persistance

Le système est prêt pour la sauvegarde en base de données ou localStorage (TODO dans `useUserAvatar`).

## Code Examples

### Utilisation du hook

```tsx
const {selectedAvatar, setSelectedAvatar, isModalOpen, openModal, closeModal} = useUserAvatar()
```

### Récupération des informations d'avatar

```tsx
import {getAnimalAvatarByFilename, getAnimalImageUrl} from "@/lib/animal-avatar-utils"

const avatarInfo = getAnimalAvatarByFilename("lapin.png")
const imageUrl = getAnimalImageUrl("lapin.png")
```

## Évolutivité

### Ajout d'un nouvel animal

1. Ajouter l'image dans `public/assets/images/animochi/animals/`
2. Ajouter l'entrée dans `ANIMAL_AVATARS` avec sa couleur pastel
3. L'animal apparaît automatiquement dans la modal

### Personnalisation des couleurs

Modifier le fichier `animal-avatar-utils.ts` pour ajuster les couleurs pastels :

```typescript
{
  filename: 'nouveau-animal.png',
  displayName: 'Nouveau Animal',
  backgroundColor: 'bg-purple-200',
  textColor: 'text-purple-800'
}
```

## Principes appliqués

### SOLID

- **SRP** : Chaque composant a une responsabilité unique
- **OCP** : Extensible via ajout d'animaux sans modification du code existant
- **DIP** : Dépendance vers les abstractions (hooks, utilitaires)

### Clean Code

- **Nommage explicite** : `ProfileAvatarModal`, `useUserAvatar`
- **Fonctions pures** : Utilitaires sans effets de bord
- **Séparation des responsabilités** : UI, logique métier, données

## TODO

- [ ] Intégration avec la base de données utilisateur
- [ ] Sauvegarde de l'avatar sélectionné
- [ ] Animation de transition lors du changement d'avatar
- [ ] Prévisualisation dans d'autres parties de l'app
- [ ] Support de l'upload d'avatars personnalisés
