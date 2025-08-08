# GuinéeMarket - E-commerce Marketplace

Une marketplace moderne pour la Guinée, construite avec React, TypeScript, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

- **Authentification complète** - Inscription, connexion, gestion des profils
- **Gestion des produits** - Publication, modification, suppression d'annonces
- **Système de rôles** - Client, Vendeur, Administrateur
- **Interface responsive** - Optimisée pour mobile et desktop
- **Validation d'annonces** - Modération par les administrateurs
- **Recherche et filtres** - Trouvez facilement ce que vous cherchez

## 🛠️ Technologies utilisées

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Build**: Vite

## 📋 Configuration

### 1. Cloner le projet
```bash
git clone [votre-repo]
cd ecommerce-guinee
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **Settings > API**
4. Copiez votre **URL** et votre **anon key**
5. Remplacez les valeurs dans le fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### 4. Base de données

Les migrations Supabase sont déjà configurées dans le dossier `supabase/migrations/`. 
Elles créent automatiquement :

- Table `users` (utilisateurs)
- Table `products` (produits)
- Table `orders` (commandes)
- Table `messages` (messages)
- Politiques RLS (sécurité)
- Fonctions utilitaires

### 5. Lancer le projet

```bash
npm run dev
```

## 👥 Rôles utilisateurs

### Client
- Parcourir les produits
- Contacter les vendeurs
- Passer des commandes

### Vendeur
- Publier des annonces
- Gérer ses produits
- Recevoir des commandes

### Administrateur
- Valider les annonces
- Gérer les utilisateurs
- Modérer le contenu

## 🎨 Design

Le design s'inspire des couleurs du drapeau guinéen :
- **Rouge** : Couleur principale
- **Jaune** : Couleur secondaire  
- **Vert** : Couleur d'accent

Interface moderne avec :
- Animations fluides
- Micro-interactions
- Design responsive
- Thème cohérent

## 📱 Responsive Design

- **Mobile First** - Optimisé pour les smartphones
- **Navigation mobile** - Barre de navigation en bas
- **Sidebar** - Menu latéral sur desktop
- **Grilles adaptatives** - Affichage optimal sur tous les écrans

## 🔒 Sécurité

- **Row Level Security (RLS)** activée sur toutes les tables
- **Authentification** obligatoire
- **Validation des données** côté client et serveur
- **Politiques de sécurité** strictes

## 🚀 Déploiement

Le projet peut être déployé sur :
- Netlify
- Vercel
- Supabase Hosting

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**GuinéeMarket** - La marketplace de référence en Guinée 🇬🇳