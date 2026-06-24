# HandRope Paris

Site vitrine Next.js pour HandRope Paris, marque de bracelets artisanaux en paracorde faits main a Paris.

Le site presente la marque, la collection, les fiches produits historiques, les avis clients Etsy et redirige les achats vers Etsy. Il ne contient pas de panier, pas de paiement, pas de Stripe et pas de base de donnees.

Les produits affiches sur la homepage et la page collection sont synchronises depuis Etsy via `/api/etsy/products`. Si l'API Etsy est indisponible ou si les variables d'environnement manquent en local, le site utilise le fallback `data/products-fallback.json`.

## Stack

- Next.js 14 avec App Router
- TypeScript strict
- Tailwind CSS v3
- Framer Motion
- Route API serveur pour lire Etsy Open API v3
- Deploiement sur Vercel

## Lancer le projet en local

Version recommandee :

```txt
Node.js 20.19 ou plus recent
npm 10 ou plus recent
```

Installer les dependances :

```bash
npm install
```

Creer un fichier `.env.local` a la racine du projet :

```bash
ETSY_KEYSTRING="..."
ETSY_SHARED_SECRET="..."
ETSY_SHOP_ID="..."
CONTACT_TO_EMAIL="adresse_email_destinataire"
CONTACT_FROM_EMAIL="contact@handrope.fr"
RESEND_API_KEY="cle_api_resend"
```

Ces variables restent cote serveur. Ne pas les prefixer avec `NEXT_PUBLIC_`.
Ne jamais commiter `.env.local`.

Si les variables Resend manquent, le site continue de builder et le formulaire
affiche un message indiquant que le contact est temporairement indisponible.

Lancer le serveur de developpement :

```bash
npm run dev
```

Ouvrir ensuite :

```txt
http://localhost:3000
```

Verifier le build production :

```bash
npm run build
```

Verifier ESLint :

```bash
npm run lint
```

Lancer la version production apres build :

```bash
npm run start
```

## Structure utile

```txt
app/
  api/etsy/products/route.ts   API serveur de synchronisation Etsy
  api/contact/route.ts         API serveur du formulaire de contact
  page.tsx                     Homepage
  collection/page.tsx          Page collection
  products/[slug]/page.tsx     Fiches produits statiques historiques
  about/page.tsx               Page a propos
  contact/page.tsx             Page contact
components/
  ContactForm.tsx              Formulaire de contact client
  EtsyHeroProducts.tsx         Produits Etsy affiches dans le hero
  EtsyProductCard.tsx          Carte produit Etsy
  EtsyProductsGrid.tsx         Grille collection Etsy
  ProductImage.tsx             Image produit avec fallback
  ReviewCard.tsx               Carte avis client
data/
  products-fallback.json       Fallback local si Etsy est indisponible
lib/
  etsy-products.ts             Types et helpers des produits Etsy
  products.ts                  Donnees locales des fiches historiques et liens globaux
  reviews.ts                   Avis clients Etsy
public/products/               Images produits fallback/locales
```

## Synchronisation Etsy

La route suivante expose les produits normalises au frontend :

```txt
/api/etsy/products
```

Elle lit les listings actifs de la boutique Etsy avec les variables serveur :

```txt
ETSY_KEYSTRING
ETSY_SHARED_SECRET
ETSY_SHOP_ID
```

La reponse renvoyee au frontend contient uniquement :

```ts
{
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  shortDescription: string;
  image: string;
  images: string[];
  etsyUrl: string;
}
```

Le header Etsy est construit cote serveur sous la forme
`ETSY_KEYSTRING:ETSY_SHARED_SECRET`. Les cles Etsy ne sont jamais envoyees au
navigateur. Le cache serveur dure 15 minutes.

## Formulaire de contact

La page `/contact` envoie les messages via l'API serveur :

```txt
/api/contact
```

L'envoi d'email passe par Resend et utilise uniquement des variables
d'environnement serveur :

```txt
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
RESEND_API_KEY
```

`CONTACT_TO_EMAIL` est l'adresse qui recoit les messages. Elle ne doit jamais
apparaitre dans le code GitHub. `CONTACT_FROM_EMAIL` doit correspondre a une
adresse autorisee cote Resend, par exemple `contact@handrope.fr`.

En local, ajouter ces variables dans `.env.local`. Sur Vercel, les ajouter dans
`Settings` -> `Environment Variables`, au minimum pour `Production`.

Si `RESEND_API_KEY` ou `CONTACT_TO_EMAIL` manque, l'API renvoie une erreur
controlee et l'utilisateur voit :

```txt
Le formulaire est temporairement indisponible. Vous pouvez nous contacter via Etsy ou Instagram.
```

## Ajouter ou modifier un produit

Etsy est la source de verite pour la homepage et la collection.

Pour ajouter un produit :

1. Creer ou activer le listing dans Etsy.
2. Ajouter une image principale au listing Etsy.
3. Verifier que le listing est actif.
4. Attendre jusqu'a 15 minutes ou redeployer/redemarrer le serveur local pour vider le cache.

Pour modifier un titre, un prix, une image ou une URL d'achat, faire la modification dans Etsy.

## Mettre a jour le fallback local

Le fallback est utilise si Etsy ne repond pas, si les variables manquent ou pendant certains tests locaux.

Modifier :

```txt
data/products-fallback.json
```

Chaque entree doit respecter ce format :

```json
{
  "id": "4517031306",
  "slug": "dune",
  "title": "Dune",
  "price": 24.9,
  "currency": "EUR",
  "shortDescription": "Bracelet en paracorde fait main.",
  "image": "/products/dune/dune-1.jpg",
  "images": [
    "/products/dune/dune-1.jpg",
    "/products/dune/dune-2.jpg",
    "/products/dune/dune-3.jpg"
  ],
  "etsyUrl": "https://www.etsy.com/fr/listing/..."
}
```

## Images produits

En production, les images principales viennent d'Etsy.

Les images locales restent utiles pour le fallback et les fiches statiques historiques :

```txt
public/products/[slug]/
```

Exemple :

```txt
public/products/dune/dune-1.jpg
public/products/dune/dune-2.jpg
public/products/dune/dune-3.jpg
```

Si une image manque, `ProductImage` affiche un placeholder propre au lieu de casser l'interface.

## Remplacer les liens Etsy

Pour les produits synchronises, remplacer le lien dans Etsy directement.

Pour le fallback local, modifier `etsyUrl` dans :

```txt
data/products-fallback.json
```

Le lien general de la boutique Etsy est defini dans :

```ts
export const ETSY_SHOP_URL = "https://www.etsy.com/shop/HandRope";
```

Le lien Instagram est defini dans :

```ts
export const INSTAGRAM_URL = "https://www.instagram.com/handrope_craft/";
```

## Avis clients

Les avis affiches sur la homepage sont dans :

```txt
lib/reviews.ts
```

Garder uniquement des avis reels ou explicitement assumes comme exemples.

## Deployer sur Vercel

Resume rapide :

1. Pousser le projet sur GitHub.
2. Importer le repository dans Vercel.
3. Laisser Vercel detecter Next.js.
4. Ajouter les variables d'environnement Etsy et Resend dans Vercel.
5. Verifier que la commande de build est `npm run build`.
6. Deployer.
7. Ajouter le domaine `handrope.fr` dans Vercel.
8. Configurer les DNS chez le registrar selon les instructions Vercel.

Le workflow detaille est documente dans `DEPLOYMENT.md`.
