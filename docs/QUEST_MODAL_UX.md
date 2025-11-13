# 🎯 Système de Quêtes - Modal & Notifications UX

## ✅ Implémentation complétée

### 📦 Composants créés

#### 1. **QuestsModal** (`src/components/quests/quests-modal.tsx`)

Modal moderne pour afficher les quêtes journalières :

- ✅ Affichage des 3 quêtes du jour
- ✅ Séparation visuelle : Complétées / En cours
- ✅ Boutons "Récupérer" pour les récompenses
- ✅ Barre de progression pour chaque quête
- ✅ Animation d'entrée avec scale
- ✅ Badge avec nombre complété
- ✅ Bouton actualiser
- ✅ Footer avec info renouvellement

#### 2. **QuestsButton** (`src/components/quests/quests-button.tsx`)

Bouton dans la navbar avec badge de notification :

- ✅ Icône 🎯 avec animation bounce si quêtes complétées
- ✅ Badge rouge avec nombre de quêtes à récupérer
- ✅ Animation pulse sur le badge
- ✅ Effet glow au survol
- ✅ Refresh automatique toutes les 30 secondes
- ✅ Responsive (texte caché sur mobile)

#### 3. **QuestToast** (`src/components/quests/quest-toast.tsx`)

Toast de notification lors de complétion :

- ✅ Apparition slide-in depuis la droite
- ✅ Icône animée (bounce)
- ✅ Affichage de la récompense
- ✅ Bouton "Récupérer maintenant"
- ✅ Auto-fermeture après 10 secondes
- ✅ Animation de confettis
- ✅ Hook `useQuestToast` pour faciliter l'utilisation

#### 4. **Server Action** : `claimQuestReward`

Action serveur pour récupérer les récompenses :

- ✅ Vérification d'authentification
- ✅ Validation du statut de la quête
- ✅ Retour de confirmation

### 🎨 Intégrations UI

#### Navbar (`src/components/layout/top-navbar.tsx`)

- ✅ Ajout du `QuestsButton` à côté du Wallet
- ✅ Ordre : Wallet → Quêtes → Notifications → Profil

#### Sidebar (`src/components/layout/sidebar.tsx`)

- ✅ Suppression du lien "Quêtes" de la sidebar
- ✅ Nettoyage de l'import `FiAward` inutilisé

#### CSS Global (`src/app/globals.css`)

- ✅ Animation `scale-in` pour le modal

### 📊 Architecture

```
┌─────────────────────────────────────────┐
│  TopNavbar                              │
│  [🏠] [💰 Wallet] [🎯 Quêtes ●2] [🔔] │ <- Badge dynamique
└─────────────────────────────────────────┘
                    ↓ Clic
        ┌───────────────────────┐
        │   QuestsModal         │
        │   ─────────────────   │
        │   ✅ Quêtes complétées│
        │   [Récupérer] 🎉      │
        │                       │
        │   ⏳ Quêtes en cours  │
        │   ████░░ 3/5          │
        └───────────────────────┘

Quand action effectuée :
        ┌───────────────────────┐
        │  QuestToast (top-right)│
        │  🎉 Quête complétée !  │
        │  +20 Ⱥ                 │
        │  [Récupérer maintenant]│
        └───────────────────────┘
```

## 🎮 Flow utilisateur

### 1. **État initial**

- Navbar affiche `🎯 Quêtes`
- Pas de badge si aucune quête complétée

### 2. **Après avoir complété une quête**

- Badge apparaît : `🎯 Quêtes ●1`
- Animation bounce sur l'icône
- Animation pulse sur le badge
- _(Optionnel : Toast notification)_

### 3. **Clic sur le bouton Quêtes**

- Modal s'ouvre avec animation scale
- Section "Complétées" en haut avec boutons verts
- Section "En cours" en dessous avec barres de progression

### 4. **Récupération de récompense**

- Clic sur "Récupérer"
- Animation de chargement
- Récompense créditée
- Modal se rafraîchit
- Badge se met à jour

### 5. **Toutes les quêtes récupérées**

- Badge disparaît
- Icône arrête de bouger
- Modal reste accessible pour voir la progression

## 🔧 Utilisation

### Dans un composant :

```tsx
import {QuestsButton} from "@/components/quests"

// Déjà intégré dans TopNavbar
;<QuestsButton />
```

### Pour les notifications toast (à venir) :

```tsx
import {useQuestToast} from "@/components/quests"

function MyComponent() {
  const {showToast, ToastComponent} = useQuestToast()

  const handleAction = async () => {
    // ... après complétion d'une quête
    showToast({
      id: "quest-123",
      title: "Nourrir 3 monstres",
      reward: 20,
      icon: "🍖",
    })
  }

  return (
    <>
      {ToastComponent}
      <button onClick={handleAction}>Action</button>
    </>
  )
}
```

## 📝 Configuration

### Nombre de quêtes par jour

`src/config/quests.config.ts`

```typescript
export const QUEST_CONFIG = {
  DAILY_QUESTS_COUNT: 3, // Modifier ici
  // ...
}
```

### Durée d'affichage du toast

`src/components/quests/quest-toast.tsx` ligne 30

```typescript
const timer = setTimeout(() => {
  handleClose()
}, 10000) // 10 secondes - modifier ici
```

### Fréquence de refresh du badge

`src/components/quests/quests-button.tsx` ligne 34

```typescript
const interval = setInterval(() => {
  void updateCompletedCount()
}, 30000) // 30 secondes - modifier ici
```

## 🎨 Personnalisation

### Couleurs

Toutes les couleurs utilisent le design system Animochi :

- `success-*` : Vert pour les quêtes complétées
- `blueberry-*` : Bleu pour les actions principales
- `strawberry-*` : Rose/Rouge pour les accents
- `latte-*` : Beige pour les backgrounds subtils

### Animations

Toutes définies dans `globals.css` :

- `animate-scale-in` : Modal
- `animate-bounce` : Icônes
- `animate-pulse` : Badges
- `animate-ping` : Confettis

## 🚀 Prochaines améliorations possibles

1. **Notifications automatiques**

   - Déclencher le toast automatiquement via WebSocket
   - Notification push navigateur

2. **Sons**

   - Son de célébration à la complétion
   - Son de récupération de récompense

3. **Statistiques**

   - Historique des quêtes complétées
   - Taux de complétion
   - Streak de jours consécutifs

4. **Gamification avancée**
   - Confettis CSS animés
   - Effet de particules
   - Animation de level up

## 📊 Compatibilité

- ✅ Desktop
- ✅ Tablette
- ✅ Mobile (responsive avec texte caché)
- ✅ Dark mode ready (si implémenté plus tard)
- ✅ Accessibilité (aria-labels, keyboard navigation)

## 🐛 Debugging

### Le badge ne s'affiche pas

- Vérifier que `getDailyQuests()` retourne bien des données
- Vérifier que des quêtes ont le statut `COMPLETED`
- Ouvrir la console pour voir les erreurs

### Le modal ne s'ouvre pas

- Vérifier l'import de `QuestsButton`
- Vérifier que le z-index n'est pas masqué
- Vérifier les erreurs dans la console

### Les récompenses ne se créditent pas

- Vérifier `claimQuestReward` dans les actions
- Vérifier la connexion MongoDB
- Vérifier l'authentification utilisateur

## 📚 Fichiers modifiés/créés

### Nouveaux fichiers

- `src/components/quests/quests-modal.tsx`
- `src/components/quests/quests-button.tsx`
- `src/components/quests/quest-toast.tsx`
- `src/components/quests/index.ts`
- `docs/QUEST_MODAL_UX.md` (ce fichier)

### Fichiers modifiés

- `src/actions/quests.actions.ts` - Ajout `claimQuestReward`
- `src/components/layout/top-navbar.tsx` - Ajout `QuestsButton`
- `src/components/layout/sidebar.tsx` - Retrait lien Quêtes
- `src/app/globals.css` - Ajout animation `scale-in`

## ✨ Résultat final

Un système de quêtes moderne, gaming-oriented, avec :

- ✅ Accès rapide sans quitter le contexte
- ✅ Notifications visuelles claires
- ✅ Gamification avec badges et animations
- ✅ UX inspirée des meilleurs jeux mobiles
- ✅ Performance optimisée
- ✅ Code propre suivant SOLID

**Le système est prêt à l'emploi !** 🎉
