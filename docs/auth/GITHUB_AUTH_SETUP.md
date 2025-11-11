# Configuration de l'authentification GitHub avec Better Auth

## Vue d'ensemble

Ce document décrit l'implémentation de l'authentification GitHub dans l'application Animochi en utilisant Better Auth.

## Configuration GitHub OAuth

### 1. Créer une application GitHub OAuth

1. Aller sur [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Créer une nouvelle OAuth App avec les paramètres suivants :
   - **Application name** : Animochi
   - **Homepage URL** : `http://localhost:3000` (développement) ou votre URL de production
   - **Authorization callback URL** : `http://localhost:3000/api/auth/callback/github`

3. Copier le **Client ID** et générer un **Client Secret**

### 2. Variables d'environnement

Ajouter dans `.env.local` :

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

## Architecture de l'authentification

### Fichiers implémentés

1. **`src/lib/auth.ts`** : Configuration Better Auth avec GitHub provider
2. **`src/lib/auth-client.ts`** : Client d'authentification côté frontend
3. **`src/app/api/auth/[...all]/route.ts`** : Route API pour l'authentification
4. **`src/middleware.ts`** : Middleware de protection des routes
5. **`src/hooks/use-session.ts`** : Hook React pour la gestion de session

### Composants mis à jour

1. **`src/components/common/forms/signin-form.tsx`** : Implémentation OAuth
2. **`src/components/common/forms/signup-form.tsx`** : Implémentation OAuth
3. **`src/app/dashboard/page.tsx`** : Page protégée avec gestion de session

## Flux d'authentification

### 1. Connexion avec GitHub

```typescript
// Dans signin-form.tsx ou signup-form.tsx
await authClient.signIn.social({
  provider: 'github',
  callbackURL: '/dashboard'
})
```

### 2. Middleware de protection

Le middleware `src/middleware.ts` :
- Protège les routes `/dashboard` (redirection vers `/sign-in`)
- Évite l'accès aux pages d'auth si déjà connecté
- Utilise le cookie `better-auth.session_token`

### 3. Gestion de session

Le hook `useSession` fournit :
- `user` : Informations utilisateur ou `null`
- `isLoading` : État de chargement
- `isAuthenticated` : Booléen d'authentification
- `error` : Erreurs éventuelles

## Routes disponibles

- **`/sign-in`** : Page de connexion avec bouton GitHub
- **`/sign-up`** : Page d'inscription avec bouton GitHub
- **`/dashboard`** : Page protégée affichant les informations utilisateur
- **`/api/auth/[...all]`** : Endpoints d'authentification Better Auth

## Tests

### Test manuel du flux complet

1. Démarrer l'application : `npm run dev`
2. Aller sur `http://localhost:3000/sign-in`
3. Cliquer sur "Se connecter avec GitHub"
4. Autoriser l'application sur GitHub
5. Être redirigé vers `/dashboard`
6. Vérifier les informations utilisateur
7. Se déconnecter et être redirigé vers `/sign-in`

### Vérifications

- [ ] Variables d'environnement configurées
- [ ] Application GitHub OAuth créée
- [ ] Bouton GitHub fonctionnel sur sign-in
- [ ] Bouton GitHub fonctionnel sur sign-up
- [ ] Redirection après connexion
- [ ] Page dashboard affiche les infos utilisateur
- [ ] Déconnexion fonctionne
- [ ] Middleware protège les routes

## Dépannage

### Erreurs communes

1. **"Client ID not found"** : Vérifier les variables d'environnement
2. **"Redirect URI mismatch"** : Vérifier l'URL de callback dans GitHub
3. **"Session not found"** : Vérifier la configuration de la base de données
4. **CORS errors** : Vérifier la configuration `BETTER_AUTH_URL`

### Logs utiles

```javascript
// Dans les composants
console.log('OAuth sign-in initiated')
console.log('Session data:', session)
console.log('Auth error:', error)
```

## Sécurité

### Bonnes pratiques implémentées

- Clés secrètes dans variables d'environnement
- Middleware de protection des routes
- Gestion des erreurs d'authentification
- Validation des sessions
- URLs de callback sécurisées

### Recommandations production

- Utiliser HTTPS en production
- Configurer des domaines autorisés
- Mettre en place un monitoring des erreurs
- Implémenter une rotation des secrets
- Ajouter des logs d'audit

## Extension

Pour ajouter d'autres providers (Google, etc.) :

1. Ajouter la configuration dans `src/lib/auth.ts`
2. Mettre à jour les variables d'environnement
3. Modifier les formulaires pour supporter le nouveau provider
4. Tester le nouveau flux d'authentification