# 📋 Checklist Projet Animochi - Évaluation Tamagotcho

## 🎨 Feature 1 : Système d'Accessoires et Arrière-plans

### 1.1 Accessoires

#### ✅ Catégories d'accessoires (3/3)

- [x] **Chapeaux (hats)** : 4 accessoires créés (Haut-de-Forme, Béret, Couronne, Auréole)
- [x] **Lunettes (glasses)** : 4 accessoires créés (Rondes, Soleil, Monocle, Arc-en-Ciel)
- [x] **Chaussures (shoes)** : 4 accessoires créés (Baskets, Bottes, Chaussons, Sabots)

#### ✅ Actions disponibles (Interface et Backend complets)

- [x] **Interface boutique** : Modal créé (`accessory-shop-modal.tsx`)
- [x] **Interface inventaire** : Modal créé (`accessory-inventory-modal.tsx`)
- [x] **Backend - Acheter un accessoire** : API route créée (`/api/accessories/purchase`)
- [x] **Backend - Équiper un accessoire** : API route créée (`/api/accessories/equip`)
- [x] **Backend - Retirer un accessoire** : API route créée (`/api/accessories/unequip`)
- [x] **Backend - Visualiser accessoires possédés** : API route créée (`/api/accessories/owned`)
- [x] **Base de données** : Schema MongoDB créé pour les accessoires

#### ✅ Affichage

- [x] **Dans le détail du monstre** : Composant modifié (`monster-detail-avatar.tsx` avec superposition SVG)
- [x] **Dans la liste du dashboard** : Affichage sur les cartes de monstres (`monster-card.tsx` avec useMemo)

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

- [ ] **Route `/`** : Redirection intelligente (actuellement landing page statique, ajouter logique session)
- [x] **Routes protégées** : Redirections vers `/sign-in` si non authentifié (déjà implémenté sur `/dashboard`, `/monstres`, `/monster/[id]`, `/wallet`)
- [ ] **Routes `/sign-in` et `/sign-up`** : Redirection après connexion vers `/dashboard` (à vérifier dans `auth-form-content.tsx`)

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

#### ✅ Infrastructure existante (Base solide)

- [x] **Fichier wallet.actions.ts** : `addFunds()` avec raisons prédéfinies existant
- [x] **Types de récompenses** : DAILY_REWARD, QUEST_REWARD, LEVEL_UP déjà définis
- [x] **Système de transactions** : TransactionModel et WalletModel opérationnels

#### ❌ Système de récompenses (0/3 à finaliser)

- [ ] **Créer fichier de configuration** : `src/config/rewards.ts` (montants par action monstre)
- [ ] **Implémenter le gain de Koins** : Intégrer `addFunds()` dans les actions monstre
  - [ ] Nourrir le monstre → +X Koins (intégrer dans `applyMonsterAction`)
  - [ ] Jouer avec le monstre → +X Koins
  - [ ] Soigner le monstre → +X Koins
  - [ ] Autres actions
- [ ] **Affichage notification** : Toast/notification de gain
- [ ] **Mise à jour du solde** : Mise à jour immédiate dans l'UI

---

### 2.5 Extraction des Configurations

#### ✅ Fichiers de configuration existants (4/5)

- [x] **`src/config/monster-actions-map.ts`** : Déjà existant
- [x] **`src/config/pricing.ts`** : Déjà existant
- [x] **`src/config/shop.config.ts`** : Configuration boutique créée
- [x] **`src/config/wallet.constants.ts`** : Constantes wallet créées
- [ ] **`src/config/rewards.ts`** : À créer (montants de Koins par action monstre)

#### ❌ Fichiers additionnels à créer (0/2)

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
- [x] **Bouton UI** : Bouton "Se connecter avec GitHub" présent dans formulaire auth
- [ ] **Tests de redirection** : Tester le flux complet en production

#### ✅ BONUS - Google OAuth

- [x] **Configuration Better Auth** : Google OAuth activé dans `src/lib/auth/auth.ts`
- [x] **Documentation** : Guide complet créé (`docs/auth/GOOGLE_OAUTH_SETUP.md`)
- [x] **Variables d'environnement** : `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
- [x] **Bouton UI** : Bouton "Se connecter avec Google" présent dans formulaire auth
- [ ] **Tests de redirection** : Tester le flux complet en production

---

### 2.7 Optimisation de la Base de Code

#### ❌ Plan d'optimisation (0/2)

- [ ] **Créer `OPTIMIZATION_PLAN.md`** : Document listant toutes les optimisations prévues
- [ ] **Identifier les optimisations** :
  - [ ] Composants à optimiser avec `useMemo`
  - [ ] Fonctions à mémoriser avec `useCallback`
  - [ ] Données à mettre en cache
  - [ ] Chargements à optimiser (lazy loading, code splitting)

#### ✅ Implémentation (Plusieurs optimisations existantes)

- [x] `useMemo` dans `monster-detail-avatar.tsx` pour les accessoires équipés
- [x] `useMemo` dans `monster-card.tsx` pour les accessoires équipés
- [x] `useCallback` dans `use-user-avatar.ts` et `use-auth.ts`
- [x] `.lean()` dans les queries Mongoose pour optimiser les performances (monsters.action.ts)
- [ ] **3 optimisations concrètes supplémentaires minimum** :
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

- **Système d'accessoires** : **100%** ✅
  - Interface (boutique + inventaire)
  - Backend complet (4 API routes)
  - Base de données
  - Affichage (détail + cartes)
  - Système de rareté
  - Documentation complète
- **OAuth GitHub et Google** : **95%** ✅ (tests prod à faire)
- **Fichiers de configuration** : **80%** ✅ (4/5 créés)
- **Optimisations React** : **40%** ⚡ (4 optimisations actives)

### ⚠️ Partiellement fait

- **Redirections** : **50%** (routes protégées ✅, route `/` à améliorer)
- **Design audit** : **À évaluer** (palette OK, cohérence à vérifier)

### ❌ À faire

- **Backend Actions → Koins** : Infrastructure prête, intégration à faire
- **Système d'Arrière-plans** : 0%
- **Système de Galerie** : 0%
- **Quêtes Journalières** : 0%
- **Personnalisation Stripe** : 0%
- **Plan d'optimisation** : Document à créer

---

## 🎯 Priorités Recommandées

### 🔥 Urgent (Quick Wins)

1. **Gains de Koins pour actions** : Infrastructure prête, créer `rewards.ts` et intégrer dans `applyMonsterAction`
2. **Redirections** : Finaliser la route `/` avec logique de session
3. **Tests OAuth** : Valider GitHub et Google en production

### ⚡ Important (Core Features manquantes)

4. **Système d'Arrière-plans** : Feature complète à implémenter (catalogue, achat, application, affichage)
5. **Quêtes Journalières** : Feature complète à implémenter (système de renouvellement, UI, récompenses)
6. **Galerie Publique** : Feature complète à implémenter (champ isPublic, page galerie, filtres)

### 💎 Améliorations

7. **Plan d'optimisation** : Créer le document et implémenter 3 optimisations supplémentaires
8. **Personnalisation Stripe** : Branding et customisation checkout
9. **Design audit** : Cohérence visuelle globale et responsive

---

## 📝 Notes

- **Documentation** : Excellente (accessoires, auth)
- **Architecture** : Bonne base (Clean Architecture respectée)
- **Configuration** : Certains fichiers manquants mais structure en place
- **Tests** : Aucun test mentionné dans les specs (à considérer ?)

---

**Dernière mise à jour** : 13 novembre 2025

**Progression globale estimée** : **~45%**

### 📈 Évolution depuis dernière update

- ✅ **Système d'accessoires** : Passé de 60% à 100% (API routes, DB, affichage cartes)
- ✅ **OAuth** : Passé de 90% à 95% (boutons UI ajoutés)
- ✅ **Configuration** : Passé de 30% à 80% (shop.config, wallet.constants ajoutés)
- ✅ **Optimisations** : Passé de 20% à 40% (monster-card optimisé, .lean() queries)

### 🎯 Prochaines étapes prioritaires

1. Implémenter gains de Koins pour actions monstres (Quick Win)
2. Créer système d'arrière-plans complet
3. Implémenter quêtes journalières avec cron jobs
