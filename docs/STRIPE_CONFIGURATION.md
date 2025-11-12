# Configuration requise pour activer les paiements Stripe

## ⚙️ Variables d'environnement

Ajouter dans `.env.local` :

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Optionnel : pour production
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
```

### Comment obtenir les clés ?

1. **Créer un compte Stripe** : https://dashboard.stripe.com/register
2. **Récupérer les clés API** : Dashboard → Developers → API keys

   - `STRIPE_SECRET_KEY` : Secret key (commence par `sk_test_` ou `sk_live_`)
   - `STRIPE_PUBLISHABLE_KEY` : Publishable key (commence par `pk_test_` ou `pk_live_`)

3. **Configurer le webhook** :
   - Dashboard → Developers → Webhooks → Add endpoint
   - URL : `https://votre-domaine.com/api/webhook/stripe`
   - Events à sélectionner :
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
     - ✅ `charge.refunded`
   - Copier le webhook secret (commence par `whsec_`)

## 🌐 Configuration Stripe Dashboard

### 1. Personnalisation du checkout

- Dashboard → Settings → Branding
- Ajouter le logo Animochi
- Configurer les couleurs de marque

### 2. Produits Stripe (optionnel)

Si vous souhaitez utiliser des produits Stripe prédéfinis :

1. Dashboard → Products → Add product
2. Créer les produits suivants :

   - 10 Koins - 0.99€
   - 50 Koins - 4.49€
   - 100 Koins - 8.99€
   - 500 Koins - 39.99€
   - 1000 Koins - 74.99€
   - 5000 Koins - 349.99€

3. Récupérer les `productId` et `priceId`
4. Les ajouter dans `src/config/pricing.ts` :

```typescript
export const pricingTable: Record<number, PricingPackage> = {
  10: {
    price: 0.99,
    amount: 10,
    productId: "prod_xxxxxxxxxxxxx",
    priceId: "price_xxxxxxxxxxxxx",
  },
  // ...
}
```

## 🧪 Test en développement

### Mode test Stripe

1. Utiliser les clés de test (`sk_test_...`)
2. Cartes de test disponibles :
   - **Succès** : `4242 4242 4242 4242`
   - **Échec** : `4000 0000 0000 0002`
   - Date d'expiration : n'importe quelle date future
   - CVV : n'importe quel 3 chiffres

### Tester le webhook localement

1. Installer Stripe CLI :

```bash
brew install stripe/stripe-cli/stripe
# ou
scoop install stripe
```

2. Se connecter :

```bash
stripe login
```

3. Écouter les webhooks :

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

4. Copier le webhook secret affiché et l'ajouter dans `.env.local`

## 🚀 Déploiement en production

### 1. Basculer en mode live

- Remplacer `sk_test_...` par `sk_live_...`
- Remplacer `pk_test_...` par `pk_live_...`

### 2. Activer le webhook production

- Créer un nouveau webhook endpoint avec l'URL de production
- Utiliser le nouveau webhook secret

### 3. Vérifications

- [ ] Tester un paiement réel avec une vraie carte
- [ ] Vérifier que le webhook fonctionne
- [ ] Vérifier que les Koins sont crédités
- [ ] Vérifier que l'XP est ajouté aux monstres

## 📋 Checklist de mise en production

- [ ] Variables d'environnement configurées
- [ ] Webhook Stripe configuré et testé
- [ ] Logo ajouté dans Stripe Dashboard
- [ ] Couleurs de marque configurées
- [ ] Test complet du flux d'achat Koins
- [ ] Test complet du flux d'achat boost XP
- [ ] Webhook de test validé
- [ ] Gestion des erreurs testée
- [ ] Logs de production configurés
- [ ] Monitoring des paiements en place

## 🛠️ Commandes utiles

### Démarrer le serveur de développement

```bash
npm run dev
```

### Tester le webhook localement

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### Déclencher un événement de test

```bash
stripe trigger checkout.session.completed
```

### Voir les logs des webhooks

```bash
stripe logs tail
```

## 📞 Support

- Documentation Stripe : https://stripe.com/docs
- API Reference : https://stripe.com/docs/api
- Support Stripe : https://support.stripe.com

## ⚠️ Important

- **Ne jamais commiter les clés secrètes** dans le code
- Toujours utiliser `.env.local` en développement
- Utiliser les variables d'environnement du provider en production (Vercel, etc.)
- Tester en mode test avant de passer en production
- Mettre en place un système de monitoring (erreurs, paiements échoués, etc.)
