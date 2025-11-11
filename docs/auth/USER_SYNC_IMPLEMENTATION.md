# Synchronisation Auth.js - User Model

## Vue d'ensemble

Ce système synchronise automatiquement les données d'authentification OAuth (GitHub) vers le modèle User d'Animochi, évitant ainsi les doublons d'email et centralisant toutes les données utilisateur.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Better Auth   │────▶│  Auth Helpers   │────▶│   User Model    │
│   (GitHub)      │     │ (Synchronisation│     │   (Animochi)    │
│                 │     │    Logic)       │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                                │
        │                                                │
        ▼                                                ▼
┌─────────────────┐                              ┌─────────────────┐
│ Account Table   │                              │ Wallet Model    │
│ (OAuth Data)    │                              │ (Game Data)     │
└─────────────────┘                              └─────────────────┘
```

## Flux de fonctionnement

### 1. Connexion GitHub (première fois)

1. L'utilisateur clique sur "Se connecter avec GitHub"
2. Better Auth redirige vers GitHub OAuth
3. GitHub retourne les données : `{ email, name, avatar_url }`
4. **Callback `signIn`** intercepte et appelle `createOrUpdateUserFromOAuth()`
5. Un nouvel `User` est créé avec les données GitHub
6. Un `Wallet` initial est créé automatiquement (100 Animoney)

### 2. Connexion GitHub (utilisateur existant)

1. L'utilisateur se connecte avec GitHub
2. **Callback `signIn`** trouve l'utilisateur par email
3. Met à jour `name`, `avatarUrl`, `lastLoginAt` si nécessaire
4. Marque `isEmailVerified = true`

### 3. Session enrichie

1. **Callback `session`** enrichit la session avec :
   - `user.id` (ID MongoDB d'Animochi)
   - `user.displayName`
   - `user.level`

## Avantages

✅ **Point de vérité unique** : Tous les users dans `User` model
✅ **Pas de doublons** : Email unique contrainte
✅ **Synchronisation automatique** : GitHub → User seamless
✅ **Wallet automatique** : Créé lors de l'inscription
✅ **Session riche** : Données Animochi disponibles

## Tables impliquées

### `user` (Collection MongoDB - Animochi)

- Point de vérité unique pour tous les utilisateurs
- Données métier : `level`, `totalExperience`, `preferences`
- Relation 1:1 avec `Wallet`

### `account` (Collection MongoDB - Better Auth)

- Données OAuth : `provider`, `tokens`, `providerAccountId`
- Relation N:1 avec `user` (un user peut avoir plusieurs providers)

### `session` (Collection MongoDB - Better Auth)

- Sessions actives
- Enrichie avec données Animochi

## Utilisation

### Récupérer tous les utilisateurs

```typescript
// ✅ Simple - un seul point de récupération
const allUsers = await UserModel.find()

// ❌ Avant - fallait merger account + user
const githubUsers = await AccountModel.find({provider: "github"})
const manualUsers = await UserModel.find()
// Logic complexe de merge...
```

### Dans les composants

```typescript
// Session enrichie automatiquement
const session = await auth.api.getSession({headers})
if (session?.user) {
  console.log(session.user.id) // ID MongoDB Animochi
  console.log(session.user.level) // Niveau de jeu
  console.log(session.user.displayName) // Nom d'affichage
}
```

## Fichiers modifiés

- ✅ `src/db/models/user.model.ts` - Modèle utilisateur Animochi
- ✅ `src/lib/auth-helpers.ts` - Logique de synchronisation
- ✅ `src/lib/auth.ts` - Callbacks Better Auth

## Tests recommandés

1. **Première connexion GitHub** : Vérifier création User + Wallet
2. **Connexion répétée** : Vérifier mise à jour (pas duplication)
3. **Email existant** : Tester collision email manuelle vs GitHub
4. **Session** : Vérifier enrichissement des données

## Sécurité

- Email normalisé (lowercase, trim)
- Gestion d'erreurs : continuer même si sync échoue
- Validation des données OAuth avant insertion
- Transactions isolées pour chaque opération
