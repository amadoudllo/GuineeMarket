# 🚀 Instructions de configuration de la base de données Supabase

## Étapes pour créer toutes les tables :

### 1. **Accédez à votre dashboard Supabase**
- Allez sur https://supabase.com/dashboard
- Sélectionnez votre projet

### 2. **Ouvrez l'éditeur SQL**
- Dans le menu de gauche, cliquez sur "SQL Editor"
- Cliquez sur "New query"

### 3. **Exécutez le script de création**
- Copiez tout le contenu du fichier `setup-database.sql`
- Collez-le dans l'éditeur SQL
- Cliquez sur "Run" pour exécuter le script

### 4. **Vérifiez la création des tables**
- Allez dans "Table Editor" dans le menu de gauche
- Vous devriez voir les tables suivantes :
  - ✅ `users` (utilisateurs)
  - ✅ `products` (produits)
  - ✅ `orders` (commandes)
  - ✅ `messages` (messages)

### 5. **Configurez vos clés dans le fichier .env**
- Dans "Settings" > "API", copiez :
  - **URL** : Votre URL de projet
  - **anon key** : Votre clé publique anonyme
- Remplacez les valeurs dans le fichier `.env`

## 🔐 Sécurité configurée :

- ✅ **Row Level Security (RLS)** activée sur toutes les tables
- ✅ **Politiques de sécurité** pour chaque rôle (client, vendeur, admin)
- ✅ **Authentification** obligatoire pour accéder aux données
- ✅ **Triggers** pour la mise à jour automatique des timestamps

## 📊 Fonctionnalités incluses :

- ✅ **Gestion des utilisateurs** avec rôles
- ✅ **Système de produits** avec validation
- ✅ **Commandes** et suivi
- ✅ **Messagerie** entre utilisateurs
- ✅ **Compteur de vues** pour les produits
- ✅ **Création automatique** du profil utilisateur

## 🎯 Après l'exécution :

Votre site sera entièrement fonctionnel avec :
- Inscription/Connexion des utilisateurs
- Publication et gestion des produits
- Interface d'administration
- Système de commandes
- Messagerie intégrée

---

**Note** : Le script est sécurisé et utilise `IF NOT EXISTS` pour éviter les erreurs si certaines tables existent déjà.