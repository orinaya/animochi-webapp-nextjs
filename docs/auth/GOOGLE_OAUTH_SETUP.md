# Configuration Google OAuth + Fix sélection de compte

## 🔧 Configuration Google OAuth

### 1. Créer un projet Google Cloud Console

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un existant
3. Activer l'API "Google+ API" ou "People API"

### 2. Configurer l'écran de consentement OAuth

1. Aller dans **APIs & Services > OAuth consent screen**
2. Choisir **External** (pour tous les utilisateurs)
3. Remplir les informations obligatoires :
   - **App name** : Animochi
   - **User support email** : Votre email
   - **Developer contact information** : Votre email

### 3. Créer les credentials OAuth 2.0

1. Aller dans **APIs & Services > Credentials**
2. Cliquer sur **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
3. Type d'application : **Web application**
4. Nom : **Animochi OAuth**
5. **Authorized JavaScript origins** :
   ```
   http://localhost:3000
   https://votre-domaine.com (en production)
   ```
6. **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-domaine.com/api/auth/callback/google (en production)
   ```

### 4. Configurer les variables d'environnement

Ajouter dans votre `.env.local` :

```bash
# OAuth for Google
GOOGLE_CLIENT_ID=votre_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_google_client_secret
```

## 🎯 Fix sélection de compte

### Problème résolu ✅

Avant, les connexions OAuth utilisaient automatiquement le compte déjà connecté. Maintenant :

```typescript
// Dans src/lib/auth.ts
socialProviders: {
  github: {
    authorizationParams: {
      prompt: 'select_account' // ✅ Force le choix de compte
    }
  },
  google: {
    authorizationParams: {
      prompt: 'select_account' // ✅ Force le choix de compte
    }
  }
}
```

### Comportement utilisateur

**GitHub** :

- Clique "Se connecter avec GitHub"
- Redirigé vers GitHub avec sélection de compte
- Même si déjà connecté, peut choisir un autre compte

**Google** :

- Clique "Se connecter avec Google"
- Redirigé vers Google avec sélection de compte
- Interface Google pour choisir/ajouter un compte

## 🔄 Synchronisation unifiée

Les deux providers (GitHub + Google) utilisent la même logique :

```typescript
// Callback signIn unifié
if ((account?.provider === "github" || account?.provider === "google") && user.email != null) {
  await createOrUpdateUserFromOAuth(user, profile)
}
```

### Données synchronisées

| Champ    | GitHub       | Google    | Animochi User    |
| -------- | ------------ | --------- | ---------------- |
| Email    | ✅           | ✅        | `email` (unique) |
| Nom      | `name`       | `name`    | `name`           |
| Avatar   | `avatar_url` | `picture` | `avatarUrl`      |
| Username | `login`      | -         | `displayName`    |

## 🧪 Test de la configuration

### 1. Test GitHub avec sélection de compte

1. Démarrer l'app : `npm run dev`
2. Aller sur `/sign-in`
3. Cliquer "Se connecter avec GitHub"
4. **Vérifier** : Page GitHub demande quel compte utiliser
5. Choisir un compte
6. **Résultat** : Connexion + User créé/mis à jour

### 2. Test Google OAuth

1. Sur `/sign-in`
2. Cliquer "Se connecter avec Google"
3. **Vérifier** : Page Google demande quel compte utiliser
4. Choisir un compte Google
5. **Résultat** : Connexion + User créé/mis à jour

### 3. Test multi-providers

1. Se connecter avec GitHub (email: test@example.com)
2. Se déconnecter
3. Se connecter avec Google (même email: test@example.com)
4. **Résultat** : Même User, données mises à jour

## 🔍 Débogage

### Logs à surveiller

```bash
# Terminal de dev - ces logs devraient apparaître
Synchronisation réussie pour: user@example.com via github
Synchronisation réussie pour: user@example.com via google
```

### Vérification base de données

```javascript
// Dans MongoDB
db.user.find({email: "test@example.com"})
// ✅ Doit retourner 1 seul document (pas de doublon)

db.account.find({})
// ✅ Peut avoir plusieurs accounts (github + google) pour le même user
```

## 🚨 Résolution de problèmes

### Google OAuth ne fonctionne pas

- Vérifier que l'API Google+ est activée
- Vérifier les URLs de callback (http vs https)
- Vérifier que le projet Google Cloud a l'écran de consentement configuré

### GitHub ne propose pas de sélection de compte

- Vérifier que `prompt: 'select_account'` est bien configuré
- Se déconnecter de GitHub avant de tester
- Tester en navigation privée

### Erreur de synchronisation

- Vérifier les logs dans la console
- Vérifier que MongoDB est accessible
- Vérifier que le modèle User est bien importé
