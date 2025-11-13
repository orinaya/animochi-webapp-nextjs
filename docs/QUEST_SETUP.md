# Guide de Mise en Place - Système de Quêtes Journalières

## ✅ Étapes d'installation

### 1. Variables d'environnement

Ajouter dans `.env.local` :

```bash
# Secret pour le cron job de renouvellement des quêtes
CRON_SECRET=votre-secret-securise-ici
```

**Important** : Générez un secret sécurisé (ex: avec `openssl rand -hex 32`)

### 2. Déploiement sur Vercel

Le système de quêtes utilise **Vercel Cron Jobs** pour le renouvellement automatique à minuit.

#### Configuration automatique

Le fichier `vercel.json` contient déjà la configuration :

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-daily-quests",
      "schedule": "0 0 * * *"
    }
  ]
}
```

#### Variables d'environnement Vercel

1. Aller dans **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Ajouter : `CRON_SECRET` avec la même valeur que `.env.local`
3. Sélectionner : **Production**, **Preview**, **Development**

### 3. Test local

#### Démarrer l'application

```bash
npm run dev
```

#### Tester le endpoint de cron

```bash
# Avec curl
curl "http://localhost:3000/api/cron/reset-daily-quests?secret=VOTRE_SECRET"

# Ou dans un navigateur
http://localhost:3000/api/cron/reset-daily-quests?secret=VOTRE_SECRET
```

Réponse attendue :

```json
{
  "success": true,
  "message": "Daily quests reset successfully",
  "timestamp": "2024-01-15T00:00:00.000Z"
}
```

#### Accéder à la page des quêtes

```
http://localhost:3000/quetes
```

### 4. Intégration dans le code existant

Pour tracker automatiquement les quêtes, ajoutez `trackQuestProgress()` dans vos actions :

#### Exemple : Nourrir un monstre

```typescript
// Dans src/actions/monsters.action.ts ou similaire
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"

export async function feedMonster(monsterId: string) {
  // ... logique de nourrissage ...

  // Tracker la progression de la quête
  await trackQuestProgress(QuestType.FEED_MONSTER, 1)

  return {success: true}
}
```

#### Exemple : Acheter un accessoire

```typescript
// Dans src/actions/shop.actions.ts ou similaire
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"

export async function buyAccessory(accessoryId: string) {
  // ... logique d'achat ...

  // Tracker la progression de la quête
  await trackQuestProgress(QuestType.BUY_ACCESSORY, 1)

  return {success: true}
}
```

### 5. Points d'intégration recommandés

Voici où ajouter le tracking des quêtes dans le code existant :

| Action utilisateur        | Fichier                          | Type de quête            |
| ------------------------- | -------------------------------- | ------------------------ |
| Nourrir un monstre        | `src/actions/monsters.action.ts` | `FEED_MONSTER`           |
| Faire évoluer un monstre  | `src/actions/monsters.action.ts` | `EVOLVE_MONSTER`         |
| Interagir avec un monstre | `src/actions/monsters.action.ts` | `INTERACT_WITH_MONSTERS` |
| Acheter un accessoire     | `src/actions/shop.actions.ts`    | `BUY_ACCESSORY`          |
| Équiper un accessoire     | `src/actions/monsters.action.ts` | `CUSTOMIZE_MONSTER`      |
| Rendre un monstre public  | `src/actions/monsters.action.ts` | `MAKE_MONSTER_PUBLIC`    |
| Visiter la galerie        | `src/actions/gallery.actions.ts` | `VISIT_GALLERY`          |

### 6. Vérification du bon fonctionnement

#### A. Créer des quêtes pour un utilisateur

1. Se connecter à l'application
2. Naviguer vers `/quetes`
3. Les quêtes devraient se générer automatiquement

#### B. Tester la progression

1. Accomplir une action (ex: nourrir un monstre)
2. Retourner sur `/quetes`
3. La progression devrait s'être mise à jour

#### C. Tester la complétion

1. Accomplir une quête complètement
2. Vérifier que le statut passe à "Complété"
3. Vérifier que les Animoneys ont été crédités dans le wallet

#### D. Tester le renouvellement

Option 1 - Attendre minuit (production)
Option 2 - Appeler manuellement le endpoint de cron
Option 3 - Modifier temporairement la date d'expiration en DB

### 7. Monitoring et logs

Les logs sont disponibles dans :

- Console serveur (local)
- Vercel Dashboard → Logs (production)

Messages importants à surveiller :

```
✅ "Daily quests reset successfully"
✅ "Quest completed: +XX Animoneys"
⚠️  "Quest progress not found"
❌ "Error updating quest progress"
```

## 🎯 Utilisation

### Pour les utilisateurs

1. Accéder à la page "Quêtes" dans la sidebar
2. Voir les 3 quêtes du jour
3. Accomplir les actions demandées
4. Recevoir automatiquement les Animoneys

### Pour les développeurs

#### Ajouter une nouvelle quête

1. Définir le template dans `src/config/quests.config.ts`
2. Ajouter le type dans `QuestType` enum
3. Implémenter le tracking avec `trackQuestProgress()`

#### Modifier les récompenses

Éditer directement les valeurs dans `src/config/quests.config.ts`

## 🐛 Dépannage

### Les quêtes ne se génèrent pas

- Vérifier la connexion à MongoDB
- Vérifier que l'utilisateur est bien authentifié
- Checker les logs serveur pour des erreurs

### La progression ne se met pas à jour

- Vérifier que `trackQuestProgress()` est bien appelé
- Vérifier que le type de quête correspond
- Vérifier que la quête n'est pas expirée

### Le cron ne s'exécute pas

- Vérifier que `CRON_SECRET` est défini
- Vérifier la configuration dans `vercel.json`
- Checker les logs Vercel

### Les récompenses ne sont pas créditées

- Vérifier que le wallet existe
- Vérifier les logs de la fonction `addFunds`
- Vérifier que la quête est bien marquée comme complétée

## 📚 Documentation complète

Voir `docs/QUEST_SYSTEM.md` pour :

- Architecture détaillée
- Flux de données
- Principes SOLID appliqués
- Guide d'extension

## ✨ Prochaines étapes

Une fois le système en place, vous pouvez :

- Ajouter plus de types de quêtes
- Implémenter des quêtes hebdomadaires
- Créer un système de streaks
- Ajouter des notifications pour les nouvelles quêtes
