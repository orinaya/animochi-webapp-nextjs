# Configuration Stripe Webhook - Guide complet

## 🎯 Problème identifié

Le webhook était dans `src/api/webhook/stripe/route.ts` au lieu de `src/app/api/webhook/stripe/route.ts`.
Avec Next.js 15 App Router, tous les endpoints API doivent être dans `src/app/api/`.

## ✅ Solution appliquée

- ✅ Webhook déplacé vers `src/app/api/webhook/stripe/route.ts`
- ✅ Logs détaillés ajoutés pour déboguer
- ✅ URL correcte : `http://localhost:3000/api/webhook/stripe`

## 🔧 Configuration Stripe (Mode développement)

### Option 1 : Stripe CLI (RECOMMANDÉ pour le développement)

1. **Installer Stripe CLI** :

   ```bash
   # Windows (Scoop)
   scoop install stripe

   # macOS (Homebrew)
   brew install stripe/stripe-cli/stripe

   # Linux
   # Voir https://stripe.com/docs/stripe-cli
   ```

2. **Se connecter à Stripe** :

   ```bash
   stripe login
   ```

3. **Lancer le forwarding** :

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

4. **Copier le webhook secret** :

   - Stripe CLI affichera : `whsec_xxxxx`
   - Ajoutez-le dans `.env.local` :
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_xxxxx
     ```

5. **Redémarrer le serveur Next.js** :
   ```bash
   npm run dev
   ```

### Option 2 : Tester sans Stripe CLI (mode simplifié)

Si vous ne voulez pas installer Stripe CLI, vous pouvez tester le flux complet en production ou utiliser ngrok :

1. **Installer ngrok** :

   ```bash
   # Téléchargez depuis https://ngrok.com/download
   ```

2. **Exposer votre serveur local** :

   ```bash
   ngrok http 3000
   ```

3. **Configurer le webhook dans Stripe Dashboard** :
   - Allez sur https://dashboard.stripe.com/webhooks
   - Cliquez "Add endpoint"
   - URL : `https://xxxxx.ngrok.io/api/webhook/stripe`
   - Événements : Sélectionnez `checkout.session.completed`

## 📋 Vérification étape par étape

### 1. Vérifier que le serveur est lancé

```bash
npm run dev
```

Vous devriez voir :

```
✓ Ready in XXms
○ Local:        http://localhost:3000
```

### 2. Vérifier que le webhook est accessible

```bash
curl -X POST http://localhost:3000/api/webhook/stripe
```

Vous devriez obtenir :

```
Missing stripe-signature header
```

C'est normal ! Cela prouve que le webhook répond.

### 3. Lancer Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Vous devriez voir :

```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

### 4. Faire un test de paiement

**Option A : Test avec Stripe CLI**

```bash
stripe trigger checkout.session.completed
```

**Option B : Vrai paiement de test**

1. Allez sur http://localhost:3000/wallet
2. Cliquez sur "Acheter des Animoneys"
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. Date : n'importe quelle date future
5. CVC : 123

### 5. Vérifier les logs

Dans la **console du serveur Next.js**, vous devriez voir :

```
[WEBHOOK] POST /api/webhook/stripe called
[WEBHOOK] Signature present: true
[WEBHOOK] Verifying webhook signature...
[WEBHOOK] Event type: checkout.session.completed
[WEBHOOK] Checkout session completed: cs_test_xxxxx
[WEBHOOK] Metadata: { userId: '...', purchaseId: '...', animoneysAmount: '100' }
[WEBHOOK] Extracted data: { userId: '...', purchaseId: '...' }
[WEBHOOK] Repositories initialized, executing use case
[HandlePaymentSuccessUseCase] Applying purchase effects: ...
[MongoWalletRepository] addBalance called with: { userId: '...', amount: 100 }
[MongoWalletRepository] Wallet found, current balance: 3000
[MongoWalletRepository] Balance updated from 3000 to 3100
[WEBHOOK] Payment processed successfully ✅
```

## 🐛 Problèmes fréquents

### Problème 1 : "404 Not Found" sur le webhook

**Cause** : Le fichier n'est pas au bon endroit
**Solution** : Vérifiez que le fichier est bien dans `src/app/api/webhook/stripe/route.ts`

### Problème 2 : "Invalid webhook signature"

**Cause** : Le secret webhook ne correspond pas
**Solution** :

1. Copiez le secret affiché par `stripe listen`
2. Mettez-le dans `.env.local` : `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`
3. Redémarrez le serveur (`npm run dev`)

### Problème 3 : Aucun log `[WEBHOOK]` dans la console

**Cause** : Stripe CLI n'est pas lancé ou pointe vers la mauvaise URL
**Solution** :

1. Vérifiez que `stripe listen` est en cours d'exécution
2. Vérifiez l'URL : `--forward-to localhost:3000/api/webhook/stripe`

### Problème 4 : Le wallet ne se met pas à jour

**Cause** : Les métadonnées ne sont pas passées correctement
**Solution** : Vérifiez les logs pour voir si `animoneysAmount` est présent dans les métadonnées

## 🎯 Checklist finale

- [ ] Serveur Next.js lancé (`npm run dev`)
- [ ] Stripe CLI installé
- [ ] `stripe listen` en cours d'exécution
- [ ] `STRIPE_WEBHOOK_SECRET` configuré dans `.env.local`
- [ ] Test manuel marche (bouton jaune sur `/wallet`)
- [ ] Webhook accessible (`curl` retourne "Missing stripe-signature header")
- [ ] Logs `[WEBHOOK]` apparaissent lors d'un paiement
- [ ] Le solde se met à jour après paiement

## 📝 Variables d'environnement requises

Dans `.env.local` :

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## 🚀 Prochaines étapes

1. **Lancez Stripe CLI** avec la commande ci-dessus
2. **Faites un test de paiement** et surveillez les logs
3. **Partagez les logs** si le problème persiste

Le webhook est maintenant au bon endroit et devrait fonctionner ! 🎉
