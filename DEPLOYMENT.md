# Déploiement HandRope Paris

Ce document décrit le workflow de mise en ligne propre du site HandRope Paris via GitHub et Vercel.

## 1. Vérifier le projet en local

Depuis le dossier du projet :

```bash
cd "C:\Users\louis\Documents\Site HandRope 2\handrope"
```

Installer les dépendances :

```bash
npm install
```

Version recommandée :

```txt
Node.js 20.19 ou plus récent
npm 10 ou plus récent
```

Lancer le site en développement :

```bash
npm run dev
```

Ouvrir :

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

Le build doit passer sans erreur TypeScript, Next.js, ESLint ou Tailwind.

## 2. Créer un repository GitHub

Sur GitHub :

1. Créer un nouveau repository.
2. Choisir un nom, par exemple `handrope`.
3. Ne pas initialiser avec README si le fichier existe déjà localement.
4. Copier l’URL du repository GitHub.

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

Remplacer `<URL_DU_REPO_GITHUB>` par l’URL réelle du repository GitHub.

Exemple :

```bash
git remote add origin https://github.com/TON-COMPTE/handrope.git
```

## 4. Connecter GitHub à Vercel

Dans Vercel :

1. Cliquer sur `Add New...`.
2. Choisir `Project`.
3. Importer le repository GitHub du site HandRope.
4. Laisser Vercel détecter automatiquement Next.js.

Vérifier les paramètres :

```txt
Framework Preset: Next.js
Build Command: npm run build
Output Directory: laisser vide / défaut Next.js
Install Command: npm install
```

Ne pas ajouter de backend, de panier, de Stripe ou de base de données.

## 5. Déployer

Cliquer sur `Deploy`.

Vercel va :

1. Installer les dépendances avec `npm install`.
2. Lancer `npm run build`.
3. Publier le site.

Si le build échoue, lire les logs Vercel, corriger localement, relancer :

```bash
npm run build
git add .
git commit -m "Fix production build"
git push
```

Vercel redéploiera automatiquement après le `git push`.

## 6. Ajouter le domaine handrope.fr

Après le premier déploiement :

1. Ouvrir le projet dans Vercel.
2. Aller dans `Settings`.
3. Aller dans `Domains`.
4. Ajouter :

```txt
handrope.fr
```

5. Ajouter aussi si souhaité :

```txt
www.handrope.fr
```

## 7. Configurer les DNS

Vercel affichera les enregistrements DNS à configurer chez le registrar.

Chez le registrar du domaine :

1. Ouvrir la gestion DNS de `handrope.fr`.
2. Ajouter ou modifier les entrées demandées par Vercel.
3. Attendre la propagation DNS.
4. Revenir dans Vercel et vérifier que le domaine est validé.

Les valeurs exactes doivent être copiées depuis Vercel, car elles peuvent dépendre de la configuration du projet.

## 8. Points à vérifier après déploiement

Vérifier sur l’URL Vercel puis sur `handrope.fr` :

- La homepage s’affiche correctement.
- Le logo HandRope est lisible.
- Les images produits chargent bien.
- Les placeholders restent propres si une image manque.
- La page collection affiche les 5 produits.
- Chaque fiche produit fonctionne.
- Les boutons `Commander sur Etsy` ouvrent les bonnes fiches Etsy.
- Les liens Instagram ouvrent `https://www.instagram.com/handrope_craft/`.
- La page contact indique clairement que les messages passent par Etsy ou Instagram.
- Le site est lisible sur mobile.
- Aucun panier, paiement, Stripe, backend ou base de données n’a été ajouté.

## 9. Mises à jour futures

Pour modifier le site :

```bash
npm run build
git add .
git commit -m "Update HandRope website"
git push
```

Vercel redéploiera automatiquement après chaque push sur `main`.
