# 🚀 Configuration de votre nouvelle organisation Supabase

## Étape 1: Récupérer vos clés Supabase

1. **Allez sur votre dashboard Supabase** : https://supabase.com/dashboard
2. **Sélectionnez votre nouveau projet**
3. **Cliquez sur "Settings" dans le menu de gauche**
4. **Cliquez sur "API"**
5. **Copiez les informations suivantes :**
   - **Project URL** (commence par `https://`)
   - **anon public key** (clé publique anonyme)

## Étape 2: Configurer le fichier .env

1. **Ouvrez le fichier `.env`** dans votre projet
2. **Remplacez les valeurs** :
   ```env
   VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
   ```
3. **Sauvegardez le fichier**

## Étape 3: Créer toutes les tables

1. **Retournez sur votre dashboard Supabase**
2. **Cliquez sur "SQL Editor" dans le menu de gauche**
3. **Cliquez sur "New query"**
4. **Copiez tout le contenu du fichier `SCRIPT_CREATION_TABLES.sql` ci-dessous**
5. **Collez-le dans l'éditeur SQL**
6. **Cliquez sur "Run" pour exécuter le script**

## Étape 4: Vérifier la création

Après l'exécution du script, vérifiez dans **"Table Editor"** que vous avez bien :
- ✅ Table `users`
- ✅ Table `products` 
- ✅ Table `orders`
- ✅ Table `messages`

## Étape 5: Redémarrer le serveur

```bash
npm run dev
```

Votre application sera maintenant connectée à votre base Supabase ! 🎉