# 📋 Checklist Projet Animochi - Évaluation Tamagotcho

## 🎨 Feature 1 : Système d'Accessoires et Arrière-plans

### 1.1 Accessoires

#### ✅ Catégories d'accessoires (3/3)

- [x] **Chapeaux (hats)** : 4 accessoires créés (Haut-de-Forme, Béret, Couronne, Auréole)
- [x] **Lunettes (glasses)** : 4 accessoires créés (Rondes, Soleil, Monocle, Arc-en-Ciel)
- [x] **Chaussures (shoes)** : 4 accessoires créés (Baskets, Bottes, Chaussons, Sabots)

#### ✅ Actions disponibles (Interface créée, Backend à finaliser)

- [x] **Interface boutique** : Modal créé (`accessory-shop-modal.tsx`)
- [x] **Interface inventaire** : Modal créé (`accessory-inventory-modal.tsx`)
- [ ] **Backend - Acheter un accessoire** : API route à créer (`/api/accessories/purchase`)
- [ ] **Backend - Équiper un accessoire** : API route à créer (`/api/accessories/equip`)
- [ ] **Backend - Retirer un accessoire** : API route à créer (`/api/accessories/unequip`)
- [ ] **Backend - Visualiser accessoires possédés** : API route à créer (`/api/accessories/owned`)
- [ ] **Base de données** : Schema Prisma/MongoDB à créer pour les accessoires

#### ✅ Affichage

- [x] **Dans le détail du monstre** : Composant modifié (`monster-detail-avatar.tsx` avec superposition SVG)
- [ ] **Dans la liste du dashboard** : À implémenter sur les cartes de monstres

#### ✅ BONUS - Système de rareté

- [x] **4 niveaux de rareté** : Commun, Rare, Épique, Légendaire
- [x] **Badges colorés** : Implémentés dans les modals
- [x] **Prix ajustés selon rareté** : Système de multiplicateur (x1, x2, x4, x10)

#### 📚 Documentation

- [x] Documentation complète créée (`docs/ACCESSORIES_*.md`)
- [x] Catalogue d'accessoires (`src/data/accessories-catalog.ts` - 12 accessoires SVG)

---

### 1.2 Arrière-plans

#### ❌ Achat d'arrière-plans (0/3)

- [ ] **Catalogue d'arrière-plans** : Fichier de configuration à créer (`src/config/backgrounds.config.ts`)
- [ ] **Achat depuis la boutique** : Interface et API à créer
- [ ] **Gestion de la possession** : Schema DB et logique backend

#### ❌ Application sur un monstre (0/3)

- [x] **Champ DB existant** : `equippedBackground` déjà présent dans le code
- [ ] **Interface de sélection** : Composant à créer
- [ ] **Retrait/réinitialisation** : Logique à implémenter

#### ❌ Affichage (0/3)

- [ ] **Prévisualisation dans la boutique** : À créer
- [ ] **Aperçu avant application** : À créer
- [ ] **Affichage réel sur le monstre** : À implémenter

---

## 🔧 Feature 2 : Finalisation de la Base

### 2.1 Redirections

#### ⚠️ Routes à finaliser (Partiellement fait)

- [ ] **Route `/`** : Redirection intelligente (landing page si non connecté, `/app` si connecté)
- [x] **Routes protégées** : Redirections vers `/sign-in` si non authentifié (déjà implémenté sur `/dashboard`, `/monstres`, `/monster/[id]`, `/wallet`)
- [ ] **Routes `/sign-in` et `/sign-up`** : Redirection après connexion vers `/app` (à vérifier)

#### ⚠️ Navigation

- [ ] Vérifier toutes les redirections
- [ ] Gérer les cas d'erreur (session expirée)

---

### 2.2 Personnalisation Stripe

#### ❌ Page de paiement Stripe (0/4)

- [ ] **Branding Stripe Checkout** : Personnaliser le thème
- [ ] **Logo de l'application** : Ajouter dans Stripe Dashboard
- [ ] **Couleurs et style** : Adapter à la charte graphique Animochi
- [ ] **Messages personnalisés** : Ajouter des messages custom

---

### 2.3 Design de l'Application

#### ⚠️ Ajustements de design (À évaluer)

- [ ] **Cohérence visuelle** : Audit complet de toutes les pages
- [x] **Palette de couleurs** : Déjà définie (blueberry, strawberry, peach, latte)
- [ ] **Typographie cohérente** : Vérifier l'usage des fonts Geist
- [ ] **Espacements et marges** : Standardiser
- [ ] **Animations et transitions** : Audit et amélioration
- [ ] **Responsive design** : Tester sur mobile/tablette

---

### 2.4 Gains de Koins pour les Actions

#### ❌ Système de récompenses (0/3)

- [ ] **Créer fichier de configuration** : `src/config/rewards.ts` (montants par action)
- [ ] **Implémenter le gain de Koins** : Modifier les actions pour ajouter des Koins
  - [ ] Nourrir le monstre → +X Koins
  - [ ] Jouer avec le monstre → +X Koins
  - [ ] Soigner le monstre → +X Koins
  - [ ] Autres actions
- [ ] **Affichage notification** : Toast/notification de gain
- [ ] **Mise à jour du solde** : Mise à jour immédiate dans l'UI

---

### 2.5 Extraction des Configurations

#### ❌ Fichiers de configuration à créer (1/5)

- [x] **`src/config/monster-actions-map.ts`** : Déjà existant
- [x] **`src/config/pricing.ts`** : Déjà existant
- [ ] **`src/config/rewards.ts`** : À créer (montants de Koins par action)
- [ ] **`src/config/accessories.config.ts`** : À créer ou utiliser `accessories-catalog.ts`
- [ ] **`src/config/backgrounds.config.ts`** : À créer (catalogue d'arrière-plans)
- [ ] **`src/config/quests.config.ts`** : À créer (configuration des quêtes journalières)

#### 📝 Principe

- [ ] Vérifier qu'il n'y a plus de "valeurs magiques" dans le code
- [ ] Extraire toutes les constantes dans des fichiers de config

---

### 2.6 Connexions Tierces

#### ✅ Obligatoire - GitHub OAuth

- [x] **Configuration Better Auth** : GitHub OAuth activé dans `src/lib/auth/auth.ts`
- [x] **Documentation** : Guide complet créé (`docs/auth/GITHUB_AUTH_SETUP.md`)
- [x] **Variables d'environnement** : `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`
- [ ] **Bouton UI** : Vérifier la présence du bouton "Se connecter avec GitHub"
- [ ] **Tests de redirection** : Tester le flux complet

#### ✅ BONUS - Google OAuth

- [x] **Configuration Better Auth** : Google OAuth activé dans `src/lib/auth/auth.ts`
- [x] **Documentation** : Guide complet créé (`docs/auth/GOOGLE_OAUTH_SETUP.md`)
- [x] **Variables d'environnement** : `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
- [ ] **Bouton UI** : Vérifier la présence du bouton "Se connecter avec Google"
- [ ] **Tests de redirection** : Tester le flux complet

---

### 2.7 Optimisation de la Base de Code

#### ❌ Plan d'optimisation (0/2)

- [ ] **Créer `OPTIMIZATION_PLAN.md`** : Document listant toutes les optimisations prévues
- [ ] **Identifier les optimisations** :
  - [ ] Composants à optimiser avec `useMemo`
  - [ ] Fonctions à mémoriser avec `useCallback`
  - [ ] Données à mettre en cache
  - [ ] Chargements à optimiser (lazy loading, code splitting)

#### ⚠️ Implémentation (Quelques optimisations existantes)

- [x] `useMemo` dans `monster-detail-avatar.tsx` pour les accessoires équipés
- [x] `useCallback` dans `use-user-avatar.ts` et `use-auth.ts`
- [ ] **5 optimisations concrètes supplémentaires minimum** :
  - [ ] Optimisation #3 : À définir
  - [ ] Optimisation #4 : À définir
  - [ ] Optimisation #5 : À définir
  - [ ] Optimisation #6 : À définir
  - [ ] Optimisation #7 : À définir
- [ ] **Lazy loading** : Composants lourds à charger dynamiquement
- [ ] **Index DB** : Optimiser les requêtes si nécessaire

---

## 📸 Feature 3 : Système de Galerie

### 3.1 Mode Public des Monstres

#### ❌ Fonctionnalités (0/4)

- [ ] **Champ DB** : Ajouter `isPublic: boolean` au modèle Monster (schema Prisma/MongoDB)
- [ ] **Interface toggle** : Bouton pour activer/désactiver le mode public
- [ ] **Emplacement** : Dans le détail du monstre (`/app/creatures/[id]`)
- [ ] **Indicateur visuel** : Badge/icône montrant que le monstre est public

---

### 3.2 Page Galerie Communautaire

#### ❌ Page dédiée (0/1)

- [ ] **Route** : Créer `/app/gallery` ou `/gallery`

#### ❌ Fonctionnalités (0/6)

- [ ] **Affichage monstres publics** : Tous les monstres publics de tous les utilisateurs
- [ ] **Design galerie** : Style galerie d'art/photos
- [ ] **Filtres** :
  - [ ] Par niveau
  - [ ] Par humeur/état
  - [ ] Par date de création
- [ ] **Pagination ou scroll infini**
- [ ] **Affichage créateur** : Nom anonymisé ou username

#### ❌ Affichage (0/3)

- [ ] **Grille/liste de cartes** : Layout des monstres
- [ ] **Preview accessoires et arrière-plans**
- [ ] **Informations essentielles** : Niveau, nom, créateur

---

### 3.3 Respect de la Vie Privée

#### ❌ Gestion des données (0/3)

- [ ] **Toggle privé/public** : Peut être changé à tout moment
- [ ] **Filtrage** : Les monstres privés n'apparaissent JAMAIS dans la galerie
- [ ] **Gestion permissions** : Vérifications backend

---

## 🎮 Feature 4 : Système de Quêtes Journalières

### 4.1 Quêtes du Jour

#### ❌ Fonctionnalités (0/4)

- [ ] **3 quêtes journalières** : Uniques par utilisateur
- [ ] **Renouvellement automatique** : À minuit (heure serveur ou locale)
- [ ] **Récompenses en Koins** : Chaque quête complétée rapporte des Koins
- [ ] **Système de progression** : Suivi de l'avancement en temps réel

---

### 4.2 Types de Quêtes

#### ❌ Configuration et exemples (0/2)

- [ ] **Fichier de configuration** : `src/config/quests.config.ts`
- [ ] **Exemples de quêtes** :
  - [ ] "Nourris 5 fois ton monstre aujourd'hui" → +20 Koins
  - [ ] "Fais évoluer un monstre d'un niveau" → +50 Koins
  - [ ] "Interagis avec 3 monstres différents" → +30 Koins
  - [ ] "Achète un accessoire dans la boutique" → +40 Koins
  - [ ] "Rends un monstre public" → +15 Koins

#### ❌ Système flexible (0/3)

- [ ] **Configuration centralisée** : Dans `quests.config.ts`
- [ ] **Types extensibles** : Architecture permettant d'ajouter facilement de nouvelles quêtes
- [ ] **Suivi temps réel** : Progression mise à jour en direct

---

### 4.3 Renouvellement à Minuit

#### ❌ Mécanisme de renouvellement (0/1)

- [ ] **Choisir une option** :
  - [ ] Option 1 : Utiliser le système de cron existant
  - [ ] Option 2 : Utiliser Vercel Cron Jobs
  - [ ] Option 3 : Hook/scheduler côté client avec vérification serveur

#### ❌ Base de données (0/1)

- [ ] **Schema DB** : Collection `daily_quests` ou champs dans `users`
  - [ ] Date du jour
  - [ ] Quêtes actives
  - [ ] Progression de chaque quête
  - [ ] Quêtes complétées

---

### 4.4 Interface Utilisateur

#### ❌ Affichage (0/5)

- [ ] **Section dans le dashboard** : Peut remplacer/enrichir la section existante
- [ ] **Progress bars** : Pour chaque quête
- [ ] **Badges "Complété"** : Indicateur visuel ✅
- [ ] **Animation de complétion** : Animation lors de la validation
- [ ] **Notification gain Koins** : Toast/notification

---

## 📊 Résumé Global

### ✅ Complété

- Système d'accessoires (Interface et catalogue) : **~60%**
- OAuth GitHub et Google (Backend) : **90%**
- Quelques optimisations React : **~20%**

### ⚠️ Partiellement fait

- Redirections : **~50%**
- Fichiers de configuration : **~30%**

### ❌ À faire

- **Backend Accessoires** : API routes et base de données
- **Système d'Arrière-plans** : 0%
- **Système de Galerie** : 0%
- **Quêtes Journalières** : 0%
- **Gains de Koins pour actions** : 0%
- **Personnalisation Stripe** : 0%
- **Plan d'optimisation** : 0%
- **Design audit complet** : À évaluer

---

## 🎯 Priorités Recommandées

### 🔥 Urgent (Bloquant)

1. **Backend Accessoires** : Finaliser les API routes pour débloquer la feature
2. **Gains de Koins** : Créer `rewards.ts` et implémenter les récompenses
3. **Redirections** : Finaliser la route `/` et les redirections post-auth

### ⚡ Important (Core Features)

4. **Système d'Arrière-plans** : Feature complète à implémenter
5. **Quêtes Journalières** : Feature complète à implémenter
6. **Galerie Publique** : Feature complète à implémenter

### 💎 Améliorations

7. **Plan d'optimisation** : Créer le document et implémenter 5 optimisations
8. **Personnalisation Stripe** : Branding
9. **Design audit** : Cohérence visuelle globale

---

## 📝 Notes

- **Documentation** : Excellente (accessoires, auth)
- **Architecture** : Bonne base (Clean Architecture respectée)
- **Configuration** : Certains fichiers manquants mais structure en place
- **Tests** : Aucun test mentionné dans les specs (à considérer ?)

---

**Dernière mise à jour** : 12 novembre 2025
