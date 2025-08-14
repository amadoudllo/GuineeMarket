# Instructions de Configuration - GuinéeMarket

## 🚀 Configuration Rapide

### 1. Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

**⚠️ IMPORTANT** : Remplacez `votre_url_supabase` et `votre_cle_anonyme_supabase` par vos vraies clés Supabase.

### 2. Où trouver vos clés Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings > API**
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 3. Base de Données

Exécutez le script SQL fourni dans le README principal dans l'éditeur SQL de Supabase.

### 4. Redémarrage

Après avoir créé le fichier `.env`, redémarrez le serveur de développement :

```bash
npm run dev
```

## 🔧 Vérification

Si la configuration est correcte, vous devriez voir dans la console :

```
✅ Client Supabase initialisé avec succès
```

Si vous voyez des avertissements, vérifiez vos clés dans le fichier `.env`.

## 🆘 Problèmes Courants

### "Configuration Supabase requise"

- Vérifiez que le fichier `.env` existe
- Vérifiez que les clés ne sont pas vides
- Redémarrez le serveur

### Erreurs de base de données

- Vérifiez que les tables sont créées
- Vérifiez les politiques RLS
- Vérifiez les permissions

### Erreurs d'authentification

- Vérifiez que l'authentification est activée dans Supabase
- Vérifiez les paramètres d'authentification
