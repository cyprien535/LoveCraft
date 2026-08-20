# LoveCraft

LoveCraft est une application Next.js conçue pour être déployée sur Vercel.

## Développement local

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Renseignez ensuite les variables Supabase dans `.env.local` :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Vérification avant déploiement

```bash
pnpm build
```

## Déploiement sur Vercel

Importez le dépôt GitHub `cyprien535/LoveCraft` dans [Vercel](https://vercel.com/new). Vercel détectera automatiquement Next.js. Utilisez `pnpm install` comme installation et `pnpm build` comme commande de build si ces valeurs ne sont pas détectées automatiquement.

Dans **Project Settings → Environment Variables**, ajoutez les trois variables présentes dans `.env.example` pour les environnements Preview et Production. Après le premier déploiement, remplacez `NEXT_PUBLIC_SITE_URL` par l’URL Vercel définitive, puis relancez un déploiement.
