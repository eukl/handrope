# Deploiement HandRope Paris

Ce document decrit le workflow de mise en ligne du site HandRope Paris via GitHub et Vercel.

## 1. Verifier le projet en local

Depuis le dossier du projet :

```bash
cd "C:\Users\louis\Documents\Site HandRope 2\handrope"
```

Installer les dependances :

```bash
npm install
```

Version recommandee :

```txt
Node.js 20.19 ou plus recent
npm 10 ou plus recent
```

Creer un fichier `.env.local` pour tester la synchronisation Etsy en local :

```bash
ETSY_KEYSTRING="..."
ETSY_SHARED_SECRET="..."
ETSY_SHOP_ID="..."
```

Important :

- Ne jamais prefixer ces variables avec `NEXT_PUBLIC_`.
- Ne jamais commiter `.env.local`.
- Si les variables manquent, `/api/etsy/products` utilise `data/products-fallback.json`.

Lancer le site en developpement :

```bash
npm run dev
```

Ouvrir :

```txt
http://localhost:3000
```

Tester l'API produits :

```txt
http://localhost:3000/api/etsy/products
```

Verifier le build production :

```bash
npm run build
```

Verifier ESLint :

```bash
npm run lint
```

Le build doit passer sans erreur TypeScript, Next.js, ESLint ou Tailwind.

## 2. Creer un repository GitHub

Sur GitHub :

1. Creer un nouveau repository.
2. Choisir un nom, par exemple `handrope`.
3. Ne pas initialiser avec README si le fichier existe deja localement.
4. Copier l'URL du repository GitHub.

## 3. Pousser le projet sur GitHub

Depuis le dossier `handrope` :

```bash
git init
git add .
git commit -m "Initial HandRope website"
git branch -M main
git remote add origin <URL_DU_REPO_GITHUB>
git push -u origin main
```

Remplacer `<URL_DU_REPO_GITHUB>` par l'URL reelle du repository GitHub.

Exemple :

```bash
git remote add origin https://github.com/TON-COMPTE/handrope.git
```

## 4. Connecter GitHub a Vercel

Dans Vercel :

1. Cliquer sur `Add New...`.
2. Choisir `Project`.
3. Importer le repository GitHub du site HandRope.
4. Laisser Vercel detecter automatiquement Next.js.

Verifier les parametres :

```txt
Framework Preset: Next.js
Build Command: npm run build
Output Directory: laisser vide / defaut Next.js
Install Command: npm install
```

## 5. Ajouter les variables d'environnement Etsy dans Vercel

Dans le projet Vercel :

1. Aller dans `Settings`.
2. Ouvrir `Environment Variables`.
3. Ajouter ces variables pour `Production`, et aussi `Preview` si besoin :

```txt
ETSY_KEYSTRING
ETSY_SHARED_SECRET
ETSY_SHOP_ID
```

Ne pas creer de variables `NEXT_PUBLIC_ETSY_*`. Les cles doivent rester serveur uniquement.

Apres modification des variables d'environnement, redeployer le projet pour que Vercel les prenne en compte.

## 6. Deployer

Cliquer sur `Deploy`.

Vercel va :

1. Installer les dependances avec `npm install`.
2. Lancer `npm run build`.
3. Publier le site.

Si le build echoue, lire les logs Vercel, corriger localement, relancer :

```bash
npm run build
git add .
git commit -m "Fix production build"
git push
```

Vercel redeploiera automatiquement apres le `git push`.

## 7. Ajouter le domaine handrope.fr

Le domaine est deja relie a Vercel dans la configuration actuelle.

Pour verifier ou refaire la configuration :

1. Ouvrir le projet dans Vercel.
2. Aller dans `Settings`.
3. Aller dans `Domains`.
4. Ajouter :

```txt
handrope.fr
```

5. Ajouter aussi :

```txt
www.handrope.fr
```

## 8. Configurer les DNS

Configuration observee :

```txt
handrope.fr       Valid Configuration
www.handrope.fr   Valid Configuration
```

Le domaine `handrope.fr` a ete achete chez Squarespace et les serveurs de noms configures cote Squarespace sont :

```txt
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Avec cette configuration, Vercel gere les DNS du domaine. Pour une modification future, verifier d'abord dans Vercel, puis ajuster chez Squarespace uniquement si Vercel demande un changement.

## 9. Points a verifier apres deploiement

Verifier sur l'URL Vercel puis sur `handrope.fr` :

- La homepage s'affiche correctement.
- Le fond, le logo et les couleurs sont conformes.
- La page collection affiche les listings actifs Etsy.
- `/api/etsy/products` renvoie un tableau JSON sans aucune cle Etsy.
- Les images produits Etsy chargent bien.
- Le fallback reste propre si Etsy est indisponible.
- Les boutons `Commander sur Etsy` ouvrent les bonnes fiches Etsy.
- Les liens Instagram ouvrent `https://www.instagram.com/handrope_craft/`.
- La page contact reste claire.
- Le site est lisible sur mobile.
- Aucun panier, paiement, Stripe ou base de donnees n'a ete ajoute.

## 10. Mises a jour futures

Pour modifier le site :

```bash
npm run build
git add .
git commit -m "Update HandRope website"
git push
```

Vercel redeploiera automatiquement apres chaque push sur `main`.
