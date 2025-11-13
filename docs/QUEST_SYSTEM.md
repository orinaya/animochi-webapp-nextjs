# Système de Quêtes Journalières - Animochi

## Vue d'ensemble

Le système de quêtes journalières permet aux utilisateurs de compléter des défis quotidiens pour gagner des Animoneys. Chaque utilisateur reçoit 3 quêtes aléatoires par jour, qui se renouvellent automatiquement à minuit.

## Architecture

Le système suit les principes **Clean Architecture** et **SOLID** :

```
src/
├── domain/                       # Couche Domain (Logique métier pure)
│   ├── entities/
│   │   ├── quest.entity.ts       # Entité Quest + QuestFactory
│   │   └── quest-progress.entity.ts  # Entité QuestProgress + Factory
│   ├── repositories/
│   │   └── quest.repository.ts   # Interface QuestRepository (abstraction)
│   └── usecases/
│       ├── get-daily-quests.usecase.ts     # Récupération des quêtes
│       ├── update-quest-progress.usecase.ts # Mise à jour progression
│       └── reset-daily-quests.usecase.ts    # Réinitialisation

├── config/
│   └── quests.config.ts          # Configuration des quêtes (templates, récompenses)

├── infrastructure/               # Couche Infrastructure (Implémentation DB)
│   └── repositories/
│       └── quest.repository.ts   # MongooseQuestRepository (implémentation)

├── db/
│   └── models/
│       └── quest-progress.model.ts  # Modèle Mongoose

├── actions/
│   └── quests.actions.ts         # Server Actions (orchestration)

├── components/
│   └── quests/
│       ├── quest-card.tsx        # Carte d'affichage d'une quête
│       ├── quest-progress-bar.tsx # Barre de progression
│       └── quest-list.tsx        # Liste des quêtes

└── app/
    ├── quetes/
    │   └── page.tsx              # Page principale des quêtes
    └── api/
        └── cron/
            └── reset-daily-quests/
                └── route.ts      # API route pour le cron job
```

## Flux de dépendances

```
Presentation (UI) → Actions → Use Cases → Repository Interface
                                              ↑
                            Repository Implementation (Mongoose)
```

## Types de quêtes disponibles

Le système supporte 8 types de quêtes configurés dans `src/config/quests.config.ts` :

1. **FEED_MONSTER** - Nourrir ses monstres (5-10 fois)
2. **EVOLVE_MONSTER** - Faire évoluer un monstre (1 fois)
3. **INTERACT_WITH_MONSTERS** - Interagir avec différents monstres (3-5 fois)
4. **BUY_ACCESSORY** - Acheter un accessoire (1 fois)
5. **CUSTOMIZE_MONSTER** - Équiper un accessoire (1 fois)
6. **MAKE_MONSTER_PUBLIC** - Rendre un monstre public (1 fois)
7. **VISIT_GALLERY** - Visiter la galerie (1 fois)
8. **LOGIN_STREAK** - Se connecter plusieurs jours consécutifs (3 jours)

## Configuration des quêtes

### Ajouter une nouvelle quête

1. Définir un nouveau `QuestTemplate` dans `src/config/quests.config.ts` :

```typescript
{
  type: QuestType.NEW_TYPE,
  title: 'Titre de la quête',
  description: 'Description détaillée',
  targetCount: 5,
  reward: 30,
  icon: '🎯',
  weight: 3  // Probabilité de sélection (1-5)
}
```

2. Ajouter le type dans l'enum `QuestType` (`src/domain/entities/quest.entity.ts`)

3. Implémenter le tracking dans le code métier avec `trackQuestProgress()`

### Modifier les récompenses

Les récompenses sont définies dans chaque template de quête. Pour les modifier globalement :

```typescript
// src/config/quests.config.ts
export const QUEST_CONFIG = {
  DAILY_QUESTS_COUNT: 3, // Nombre de quêtes par jour
  RESET_HOUR: 0, // Heure de renouvellement (minuit)
  QUEST_VALIDITY_HOURS: 24, // Durée de validité
  COMPLETION_BONUS: 20, // Bonus si toutes complétées
  MAX_ARCHIVED_QUESTS: 30, // Historique conservé
}
```

## Utilisation dans le code

### Tracker automatiquement une progression

Appelez `trackQuestProgress()` dans vos actions métier :

```typescript
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"

// Exemple : après avoir nourri un monstre
await trackQuestProgress(QuestType.FEED_MONSTER, 1)

// Exemple : après avoir équipé un accessoire
await trackQuestProgress(QuestType.CUSTOMIZE_MONSTER, 1)
```

La fonction :

- Cherche automatiquement les quêtes actives correspondantes
- Incrémente la progression
- Récompense l'utilisateur si la quête est complétée

### Récupérer les quêtes d'un utilisateur

```typescript
import {getDailyQuests} from "@/actions/quests.actions"

const quests = await getDailyQuests()
// Retourne : QuestProgress[] | null
```

### Mise à jour manuelle

```typescript
import {updateQuestProgress} from "@/actions/quests.actions"

const result = await updateQuestProgress(questId, incrementAmount)
// Retourne : { success: boolean, data?: { progress, justCompleted, reward } }
```

## Renouvellement automatique

### Configuration Vercel Cron

Le fichier `vercel.json` contient la configuration du cron job :

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-daily-quests",
      "schedule": "0 0 * * *" // Tous les jours à minuit UTC
    }
  ]
}
```

### Variables d'environnement

Ajouter dans `.env.local` :

```bash
CRON_SECRET=your-secret-key-here
```

### Endpoint de cron

`GET /api/cron/reset-daily-quests?secret=YOUR_SECRET`

Headers alternatif : `Authorization: Bearer YOUR_SECRET`

## Schéma de base de données

### Collection `questprogresses`

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Référence vers users
  questId: string,            // ID unique de la quête
  questType: string,          // Type de quête (enum)
  questTitle: string,         // Titre affiché
  questDescription: string,   // Description affichée
  questIcon: string,          // Emoji/icône
  currentCount: number,       // Progression actuelle
  targetCount: number,        // Objectif à atteindre
  reward: number,             // Animoneys à gagner
  status: string,             // NOT_STARTED | IN_PROGRESS | COMPLETED | EXPIRED
  completedAt?: Date,         // Date de complétion
  expiresAt: Date,           // Date d'expiration
  createdAt: Date,
  updatedAt: Date
}
```

### Index

- `{ userId: 1, expiresAt: -1 }` - Requêtes des quêtes actives
- `{ userId: 1, status: 1 }` - Filtrage par statut
- `{ userId: 1, questId: 1 }` - Unique, recherche spécifique

## Tests et débogage

### Tester le cron job localement

```bash
# Avec curl
curl -X GET "http://localhost:3000/api/cron/reset-daily-quests?secret=YOUR_SECRET"

# Ou dans le navigateur
http://localhost:3000/api/cron/reset-daily-quests?secret=YOUR_SECRET
```

### Forcer le renouvellement pour un utilisateur

```typescript
import {resetUserDailyQuests} from "@/actions/quests.actions"

await resetUserDailyQuests()
```

## Principes SOLID appliqués

1. **Single Responsibility Principle (SRP)**

   - Chaque use case ne gère qu'une seule responsabilité
   - Les entités contiennent uniquement la logique de validation

2. **Open/Closed Principle (OCP)**

   - Nouvelles quêtes ajoutables via configuration sans modifier le code
   - Factory pattern pour créer des instances valides

3. **Liskov Substitution Principle (LSP)**

   - Le repository Mongoose peut être remplacé par une autre implémentation

4. **Interface Segregation Principle (ISP)**

   - Interface `QuestRepository` ciblée sur les opérations de quêtes uniquement

5. **Dependency Inversion Principle (DIP)**
   - Les use cases dépendent de l'abstraction `QuestRepository`
   - L'implémentation Mongoose est injectée dans les couches externes

## Améliorations futures

- [ ] Ajout de quêtes hebdomadaires/mensuelles
- [ ] Système de streaks (bonus consécutifs)
- [ ] Quêtes spéciales/événementielles
- [ ] Historique complet des quêtes
- [ ] Notifications push pour les nouvelles quêtes
- [ ] Analytics et statistiques de complétion
