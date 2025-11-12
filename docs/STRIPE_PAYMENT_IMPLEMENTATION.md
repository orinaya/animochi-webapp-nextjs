# Système de Paiement Stripe - Animochi

## Architecture Clean & SOLID

Cette implémentation suit rigoureusement les principes **SOLID** et **Clean Architecture**.

## Structure

```
src/
├── domain/                          # Couche Domaine (Business Logic)
│   ├── entities/
│   │   └── purchase.ts             # Entité Purchase + DTOs
│   ├── value-objects/
│   │   ├── payment-status.ts       # Statuts de paiement
│   │   └── purchase-type.ts        # Types d'achat
│   ├── repositories/               # Interfaces (DIP)
│   │   ├── payment-repository.ts   # Abstraction paiement
│   │   └── purchase-repository.ts  # Abstraction purchases
│   └── usecases/
│       ├── create-checkout-session.usecase.ts
│       └── handle-payment-success.usecase.ts
│
├── infrastructure/                  # Couche Infrastructure
│   └── repositories/
│       ├── stripe-payment.repository.ts    # Implémentation Stripe
│       ├── mongo-purchase.repository.ts    # Persistance MongoDB
│       ├── mongo-wallet.repository.ts      # Gestion wallet
│       └── mongo-monster.repository.ts     # Gestion monstres
│
├── db/models/
│   └── purchase.model.ts           # Schéma Mongoose
│
├── actions/
│   └── shop.actions.ts             # Server Actions Next.js
│
├── api/webhook/stripe/
│   └── route.ts                    # Webhook Stripe
│
└── config/
    ├── shop.config.ts              # Configuration boosts XP
    └── pricing.ts                  # Configuration packages Koins

```

## Principes appliqués

### 1. Single Responsibility Principle (SRP)

- **CreateCheckoutSessionUseCase** : Crée uniquement des sessions de paiement
- **HandlePaymentSuccessUseCase** : Traite uniquement les paiements réussis
- Chaque repository gère une seule entité

### 2. Open/Closed Principle (OCP)

- Types extensibles via enum (`PaymentStatus`, `PurchaseType`)
- Ajout de nouveaux types d'achats sans modifier le code existant

### 3. Liskov Substitution Principle (LSP)

- Toutes les implémentations de `PaymentRepository` sont interchangeables
- `StripePaymentRepository` peut être remplacée par `PayPalPaymentRepository` sans casser le code

### 4. Interface Segregation Principle (ISP)

- `PaymentRepository` : uniquement opérations de paiement
- `PurchaseRepository` : uniquement persistance des achats
- `WalletRepository` : uniquement gestion du wallet
- `MonsterRepository` : uniquement gestion des monstres

### 5. Dependency Inversion Principle (DIP)

- Les use cases dépendent d'**abstractions** (`PaymentRepository`, `PurchaseRepository`)
- Les implémentations concrètes (`StripePaymentRepository`) sont injectées
- Le domaine ne connaît pas Stripe, MongoDB ou Next.js

## Flux de paiement

### Option 1 : Achat de Koins avec Stripe

```
Utilisateur → createKoinsCheckoutSession()
            → CreateCheckoutSessionUseCase
            → StripePaymentRepository.createCheckoutSession()
            → Redirect vers Stripe Checkout
            → Paiement validé
            → Webhook Stripe
            → HandlePaymentSuccessUseCase
            → MongoWalletRepository.addBalance()
            ✓ Koins crédités
```

### Option 2 : Achat direct de boost XP avec Stripe

```
Utilisateur → createXpBoostCheckoutSession()
            → CreateCheckoutSessionUseCase
            → StripePaymentRepository.createCheckoutSession()
            → Redirect vers Stripe Checkout
            → Paiement validé
            → Webhook Stripe
            → HandlePaymentSuccessUseCase
            → MongoMonsterRepository.addXp()
            ✓ XP ajouté au monstre
```

### Option 3 : Achat de boost XP avec Koins (pas de Stripe)

```
Utilisateur → buyXpBoost()
            → MongoWalletRepository.deductBalance()
            → MongoMonsterRepository.addXp()
            ✓ Transaction instantanée
```

## Configuration requise

### Variables d'environnement

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# MongoDB
MONGODB_URI=mongodb://...
```

### Webhook Stripe

1. Configurer l'URL du webhook : `https://votre-domaine.com/api/webhook/stripe`
2. Sélectionner les événements :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

## Utilisation

### Créer une session de paiement pour des Koins

```typescript
import {createKoinsCheckoutSession} from "@/actions/shop.actions"

const result = await createKoinsCheckoutSession(100) // 100 Koins

if ("error" in result) {
  console.error(result.error)
} else {
  window.location.href = result.url // Redirection vers Stripe
}
```

### Créer une session pour un boost XP direct

```typescript
import {createXpBoostCheckoutSession} from "@/actions/shop.actions"

const result = await createXpBoostCheckoutSession("monster-id-123", "xp-boost-medium")

if ("error" in result) {
  console.error(result.error)
} else {
  window.location.href = result.url
}
```

### Acheter un boost avec des Koins (sans Stripe)

```typescript
import {buyXpBoost} from "@/actions/shop.actions"

await buyXpBoost("monster-id-123", "xp-boost-small")
// ✓ Transaction instantanée
```

## Tests

### Tester le use case (unit test)

```typescript
import { CreateCheckoutSessionUseCase } from '@/domain/usecases/create-checkout-session.usecase'

// Mock repositories
const mockPaymentRepo = {
  createCheckoutSession: jest.fn()
}
const mockPurchaseRepo = {
  create: jest.fn()
}

const useCase = new CreateCheckoutSessionUseCase(
  mockPaymentRepo,
  mockPurchaseRepo
)

const result = await useCase.execute({...})
expect(result.ok).toBe(true)
```

## Sécurité

- ✅ Vérification de la signature webhook Stripe
- ✅ Vérification de propriété du monstre
- ✅ Validation des montants
- ✅ Transactions atomiques MongoDB
- ✅ Pas de logique métier côté client

## Extensibilité

### Ajouter un nouveau type d'achat

1. Ajouter dans `PurchaseType` :

```typescript
export type PurchaseType = "xp-boost" | "koins-package" | "food" | "new-item" // ← Nouveau
```

2. Gérer dans `HandlePaymentSuccessUseCase` :

```typescript
case 'new-item': {
  // Logique pour le nouvel item
  break
}
```

### Remplacer Stripe par PayPal

1. Créer `PayPalPaymentRepository` implémentant `PaymentRepository`
2. Injecter dans les use cases
3. Aucun changement dans le domaine ou les use cases !

## Performance

- Index MongoDB sur `stripeSessionId`, `userId`, `paymentStatus`
- Requêtes optimisées avec `findOne` + index
- Pas de N+1 queries

## Monitoring

Logs disponibles pour :

- Création de session Stripe
- Webhooks reçus
- Paiements réussis/échoués
- Erreurs de traitement

## Prochaines étapes

- [ ] Tests unitaires des use cases
- [ ] Tests d'intégration Stripe
- [ ] Gestion des remboursements complets
- [ ] Retry mechanism pour les webhooks
- [ ] Dashboard admin pour visualiser les purchases
