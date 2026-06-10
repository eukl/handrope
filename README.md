# HandRope Paris

Site vitrine Next.js pour HandRope Paris, marque de bracelets artisanaux en paracorde faits main à Paris.

Le site présente la marque, la collection, les fiches produits, les avis clients Etsy et redirige les achats vers Etsy. Il ne contient pas de panier, pas de paiement, pas de backend et pas de base de données.

## Stack

- Next.js 14 avec App Router
- TypeScript
- Tailwind CSS v3
- Framer Motion
- Données produits et avis en dur
- Déploiement prévu sur Vercel

## Lancer le projet en local

Version recommandée :

```txt
Node.js 20.19 ou plus récent
npm 10 ou plus récent
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir ensuite :

```txt
http://localhost:3000
```

Vérifier le build production :

```bash
npm run build
```

Vérifier ESLint :

```bash
npm run lint
```

Lancer la version production après build :

```bash
npm run start
```

## Structure utile

```txt
app/
  page.tsx                 Homepage
  collection/page.tsx      Page collection
  products/[slug]/page.tsx Fiches produits statiques
  about/page.tsx           Page à propos
  contact/page.tsx         Page contact
components/
  BrandLogo.tsx            Logo texte HandRope
  ProductCard.tsx          Carte produit
  ProductGallery.tsx       Galerie fiche produit
  ProductImage.tsx         Image produit avec fallback
  ReviewCard.tsx           Carte avis client
lib/
  products.ts              Données produits
  reviews.ts               Avis clients Etsy
public/products/           Images produits
```

## Ajouter un produit

Les produits sont déclarés dans :

```txt
lib/products.ts
```

Ajouter un objet dans le tableau `products` avec cette structure :

```ts
{
  slug: "nom-du-produit",
  name: "Nom du produit",
  price: 24.9,
  etsyUrl: "https://www.etsy.com/fr/listing/...",
  shortDescription: "Description courte.",
  description: "Description affichée sur la fiche produit.",
  story: "Inspiration du modèle.",
  specs: commonSpecs,
  images: productImages("nom-du-produit"),
  colors: ["Couleur 1", "Couleur 2"],
  inStock: true
}
```

Pour afficher ce produit dans le hero de la homepage, ajouter :

```ts
featured: true
```

Le site génère automatiquement les pages produits avec `generateStaticParams()`.

## Ajouter les images produits

Les images doivent être placées dans :

```txt
public/products/[slug]/
```

Exemple pour un produit `dune` :

```txt
public/products/dune/dune-1.jpg
public/products/dune/dune-2.jpg
public/products/dune/dune-3.jpg
```

Les chemins sont générés depuis `productImages(slug)` dans `lib/products.ts`.

Si une image manque, le composant `ProductImage` affiche un placeholder propre au lieu de casser l’interface.

## Remplacer un lien Etsy

Dans `lib/products.ts`, modifier la propriété `etsyUrl` du produit concerné :

```ts
etsyUrl: "https://www.etsy.com/fr/listing/..."
```

Le bouton `Commander sur Etsy` utilisera automatiquement ce lien.

Le lien général de la boutique Etsy est défini ici :

```ts
export const ETSY_SHOP_URL = "https://www.etsy.com/fr/shop/HandRopeParis";
```

Le lien Instagram est défini ici :

```ts
export const INSTAGRAM_URL = "https://www.instagram.com/handrope_craft/";
```

## Avis clients

Les avis affichés sur la homepage sont dans :

```txt
lib/reviews.ts
```

Garder uniquement des avis réels ou explicitement assumés comme exemples.

## Déployer sur Vercel

Résumé rapide :

1. Créer un repository GitHub.
2. Pousser le projet sur GitHub.
3. Importer le repository dans Vercel.
4. Laisser Vercel détecter Next.js.
5. Vérifier que la commande de build est `npm run build`.
6. Déployer.
7. Ajouter le domaine `handrope.fr` dans Vercel.
8. Configurer les DNS chez le registrar selon les instructions Vercel.

Le workflow détaillé est documenté dans `DEPLOYMENT.md`.
