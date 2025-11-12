# Système Économique Animochi

## Vue d'ensemble

Animochi utilise une monnaie virtuelle appelée **Animochi** (symbole : **Ⱥ**) pour permettre aux utilisateurs d'acheter des accessoires, personnaliser leurs monstres et débloquer du contenu premium.

## La Monnaie : Animochi (Ⱥ)

### Nom et Symbole

- **Nom** : Animochi
- **Symbole** : Ⱥ (U+023A - Latin Capital Letter A with Stroke)
- **Format d'affichage** : `7 680Ⱥ` (avec espace insécable avant le symbole)
- **Unité minimale** : 1Ⱥ (nombre entier uniquement)

### Valeur de Référence

| Quantité Animochi | Prix EUR (TTC) | Bonus | Prix Unitaire |
| ----------------- | -------------- | ----- | ------------- |
| 10Ⱥ               | 0,99€          | -     | 0,099€/Ⱥ      |
| 50Ⱥ               | 4,49€          | -     | 0,090€/Ⱥ      |
| 100Ⱥ              | 8,99€          | -     | 0,090€/Ⱥ      |
| 500Ⱥ              | 39,99€         | +10%  | 0,073€/Ⱥ      |
| 1000Ⱥ             | 74,99€         | +15%  | 0,065€/Ⱥ      |
| 5000Ⱥ             | 349,99€        | +20%  | 0,058€/Ⱥ      |

**Valeur de référence moyenne** : 1Ⱥ ≈ 0,075€

### Bonus de Bienvenue

- **100Ⱥ** offerts à la création du compte
- Ajoutés automatiquement lors de la première initialisation du wallet

## Modalités d'Échange

### Ce que vous pouvez acheter avec des Animochi

1. **Accessoires pour Monstres**

   - Chapeaux : 50Ⱥ - 500Ⱥ
   - Vêtements : 100Ⱥ - 800Ⱥ
   - Accessoires : 30Ⱥ - 300Ⱥ
   - Sets complets : 500Ⱥ - 2000Ⱥ

2. **Personnalisation**

   - Couleurs spéciales : 200Ⱥ
   - Motifs uniques : 300Ⱥ
   - Animations personnalisées : 500Ⱥ

3. **Contenu Premium**

   - Monstres rares : 1000Ⱥ - 5000Ⱥ
   - Backgrounds exclusifs : 200Ⱥ - 800Ⱥ
   - Pack d'évolution : 1500Ⱥ

4. **Boost et Avantages**
   - XP Boost x2 (24h) : 150Ⱥ
   - XP Boost x2 (7j) : 800Ⱥ
   - Coffre mystère : 250Ⱥ

### Comment obtenir des Animochi

1. **Achat direct** (via Stripe)

   - Carte bancaire
   - PayPal
   - Apple Pay / Google Pay
   - Paiements instantanés et sécurisés

2. **Récompenses in-game**

   - Objectifs quotidiens : +10Ⱥ/jour
   - Missions hebdomadaires : +50Ⱥ/semaine
   - Événements spéciaux : jusqu'à 500Ⱥ
   - Parrainage : 100Ⱥ par ami inscrit

3. **Programme de fidélité**
   - Connexion quotidienne : +5Ⱥ
   - Série de 7 jours : +50Ⱥ bonus
   - Série de 30 jours : +200Ⱥ bonus

## Système de Transactions

### Types de Transactions

1. **Crédit** (Ajout de fonds)

   - Achat via Stripe
   - Récompenses in-game
   - Bonus système
   - Remboursements

2. **Débit** (Dépense)
   - Achat d'accessoires
   - Achat de monstres
   - Achats premium
   - Achats de boost

### Sécurité des Transactions

- ✅ Transactions atomiques (MongoDB)
- ✅ Validation du solde avant débit
- ✅ Historique complet et immuable
- ✅ Impossible d'avoir un solde négatif
- ✅ Logs de toutes les opérations
- ✅ Système de rollback en cas d'erreur

### Workflow d'une Transaction

```
1. Utilisateur initie une action (achat accessoire)
   ↓
2. Vérification du solde disponible
   ↓
3. Création de la transaction (status: PENDING)
   ↓
4. Débit du wallet
   ↓
5. Livraison de l'article
   ↓
6. Transaction validée (status: COMPLETED)
```

En cas d'échec à l'étape 5, la transaction est annulée (status: FAILED) et le montant est recrédité automatiquement.

## Format d'Affichage

### Dans l'Interface

```typescript
// Fonction utilitaire pour formater les Animochi
function formatAnimochi(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} Ⱥ`
}

// Exemples
formatAnimochi(100) // "100 Ⱥ"
formatAnimochi(1500) // "1 500 Ⱥ"
formatAnimochi(10000) // "10 000 Ⱥ"
```

### Conventions UI

- **Header** : Affichage compact avec fond coloré
- **Page Wallet** : Grand affichage avec détails
- **Transactions** : `+50Ⱥ` (vert) ou `-200Ⱥ` (rouge)
- **Prix articles** : Badge avec fond semi-transparent

## Politique Anti-Fraude

1. **Limites de Transactions**

   - Max 10 000Ⱥ par transaction
   - Max 50 000Ⱥ par jour d'achat
   - Délai de 1 minute entre 2 achats

2. **Monitoring**

   - Détection de patterns suspects
   - Alertes administrateur
   - Blocage automatique si nécessaire

3. **Remboursements**
   - Possibles dans les 14 jours
   - Validation manuelle par l'équipe
   - Restitution en Ⱥ ou en € selon le cas

## Roadmap Future

- [ ] Échange entre joueurs (P2P)
- [ ] Marketplace communautaire
- [ ] Abonnement premium (500Ⱥ/mois)
- [ ] Coffres aléatoires avec garantie de gain
- [ ] Programme de partenariat (cashback Ⱥ)
