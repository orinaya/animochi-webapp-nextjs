# 🚀 Actions à faire maintenant - Système de Quêtes

## 📋 Liste des tâches

### 1️⃣ Configuration initiale (5 min)

#### A. Ajouter la variable d'environnement

```bash
# Dans .env.local
CRON_SECRET=votre-secret-ici
```

💡 **Générer un secret sécurisé** :

```bash
openssl rand -hex 32
```

Ou utilisez un générateur en ligne : https://randomkeygen.com/

---

### 2️⃣ Intégration dans le code existant (30 min)

Vous devez ajouter `trackQuestProgress()` dans vos actions existantes pour tracker automatiquement les quêtes.

#### A. Dans `src/actions/monsters.action.ts`

**1. Importer les dépendances** (en haut du fichier) :

```typescript
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"
```

**2. Nourrir un monstre** (dans la fonction `feedMonster` ou équivalent) :

```typescript
export async function feedMonster(monsterId: string) {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE
  await trackQuestProgress(QuestType.FEED_MONSTER, 1)

  return {success: true}
}
```

**3. Faire évoluer un monstre** :

```typescript
export async function evolveMonster(monsterId: string) {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE
  await trackQuestProgress(QuestType.EVOLVE_MONSTER, 1)

  return {success: true}
}
```

**4. Interagir avec un monstre** :

```typescript
export async function interactWithMonster(monsterId: string) {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE
  await trackQuestProgress(QuestType.INTERACT_WITH_MONSTERS, 1)

  return {success: true}
}
```

**5. Équiper un accessoire** :

```typescript
export async function equipAccessory(monsterId: string, accessoryId: string) {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE
  await trackQuestProgress(QuestType.CUSTOMIZE_MONSTER, 1)

  return {success: true}
}
```

**6. Rendre un monstre public** :

```typescript
export async function makeMonsterPublic(monsterId: string) {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE
  await trackQuestProgress(QuestType.MAKE_MONSTER_PUBLIC, 1)

  return {success: true}
}
```

---

#### B. Dans `src/actions/shop.actions.ts`

**1. Importer les dépendances** (en haut du fichier) :

```typescript
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"
```

**2. Acheter un accessoire** :

```typescript
export async function buyAccessory(accessoryId: string) {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE
  await trackQuestProgress(QuestType.BUY_ACCESSORY, 1)

  return {success: true}
}
```

---

#### C. Dans `src/actions/gallery.actions.ts`

**1. Importer les dépendances** (en haut du fichier) :

```typescript
import {trackQuestProgress} from "@/actions/quests.actions"
import {QuestType} from "@/domain/entities/quest.entity"
```

**2. Visiter la galerie** (dans la fonction qui charge la galerie) :

```typescript
export async function loadGallery() {
  // ... votre logique existante ...

  // ✨ AJOUTER CETTE LIGNE (une seule fois par visite)
  await trackQuestProgress(QuestType.VISIT_GALLERY, 1)

  return { success: true, data: [...] }
}
```

---

### 3️⃣ Test local (10 min)

#### A. Démarrer l'application

```bash
npm run dev
```

#### B. Tester la page des quêtes

1. Aller sur http://localhost:3000/quetes
2. Vérifier que 3 quêtes apparaissent
3. Noter les quêtes affichées

#### C. Tester la progression

1. Accomplir une action (ex: nourrir un monstre)
2. Retourner sur `/quetes`
3. Actualiser la page
4. Vérifier que la progression a augmenté

#### D. Tester la complétion

1. Accomplir une quête complètement
2. Vérifier le statut "Complété" ✅
3. Vérifier que les Animoneys ont été ajoutés au wallet

---

### 4️⃣ Déploiement sur Vercel (10 min)

#### A. Commit et push

```bash
git add .
git commit -m "feat: add daily quests system"
git push
```

#### B. Configurer sur Vercel

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. **Settings** → **Environment Variables**
4. Ajouter `CRON_SECRET` avec la même valeur que `.env.local`
5. Sélectionner : **Production**, **Preview**, **Development**
6. Save

#### C. Vérifier le déploiement

1. Attendre la fin du déploiement
2. Visiter `https://votre-app.vercel.app/quetes`
3. Tester comme en local

---

### 5️⃣ Vérifier le cron job (optionnel)

#### Tester manuellement (en local)

```bash
curl "http://localhost:3000/api/cron/reset-daily-quests?secret=VOTRE_SECRET"
```

#### Vérifier les logs Vercel

1. Vercel Dashboard → Votre projet
2. **Logs** (dans le menu de gauche)
3. Attendre minuit pour voir l'exécution automatique
4. Chercher "Daily quests reset successfully"

---

## ✅ Checklist finale

- [ ] Variable `CRON_SECRET` ajoutée dans `.env.local`
- [ ] `trackQuestProgress()` ajouté dans `feedMonster`
- [ ] `trackQuestProgress()` ajouté dans `evolveMonster`
- [ ] `trackQuestProgress()` ajouté dans `interactWithMonster`
- [ ] `trackQuestProgress()` ajouté dans `equipAccessory`
- [ ] `trackQuestProgress()` ajouté dans `makeMonsterPublic`
- [ ] `trackQuestProgress()` ajouté dans `buyAccessory`
- [ ] `trackQuestProgress()` ajouté dans `loadGallery`
- [ ] Test local : page `/quetes` accessible
- [ ] Test local : quêtes se génèrent automatiquement
- [ ] Test local : progression fonctionne
- [ ] Test local : complétion donne des Animoneys
- [ ] Déployé sur Vercel
- [ ] Variable `CRON_SECRET` configurée sur Vercel
- [ ] Test production : tout fonctionne

---

## 🎯 Résumé rapide

**Ce qui a été fait automatiquement** :
✅ Architecture complète (Domain, Infrastructure, Application, Presentation)
✅ 8 types de quêtes configurés
✅ Interface UI avec animations
✅ Système de renouvellement automatique
✅ Page `/quetes` intégrée au dashboard
✅ Documentation complète

**Ce que VOUS devez faire** :

1. Ajouter `CRON_SECRET` dans `.env.local`
2. Intégrer `trackQuestProgress()` dans vos actions (8 endroits)
3. Tester localement
4. Déployer sur Vercel avec la variable d'environnement

**Temps estimé total** : 1 heure

---

## 📞 Aide

### Où ajouter exactement `trackQuestProgress()` ?

Cherchez dans votre code les fonctions qui :

- Nourrissent un monstre → `FEED_MONSTER`
- Font évoluer un monstre → `EVOLVE_MONSTER`
- Interagissent avec un monstre → `INTERACT_WITH_MONSTERS`
- Achètent un accessoire → `BUY_ACCESSORY`
- Équipent un accessoire → `CUSTOMIZE_MONSTER`
- Rendent un monstre public → `MAKE_MONSTER_PUBLIC`
- Chargent la galerie → `VISIT_GALLERY`

Ajoutez **une seule ligne** après le succès de l'action :

```typescript
await trackQuestProgress(QuestType.XXX, 1)
```

### Problèmes courants

**"Les quêtes ne se génèrent pas"**
→ Vérifier que MongoDB est connecté et que l'utilisateur est authentifié

**"La progression ne s'incrémente pas"**
→ Vérifier que `trackQuestProgress()` est bien appelé après l'action

**"Erreur de type TypeScript"**
→ Vérifier que les imports sont corrects

---

## 🚀 Une fois terminé

Vous aurez un système de quêtes journalières complètement fonctionnel qui :

- Génère 3 quêtes aléatoires par jour
- Track automatiquement les actions des joueurs
- Récompense avec des Animoneys
- Se renouvelle automatiquement à minuit
- Est extensible pour ajouter de nouvelles quêtes

**Bon courage ! 🎮**
