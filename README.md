# GuinéeMarket 🛍️

Une marketplace moderne et sécurisée pour la Guinée, permettant aux utilisateurs d'acheter et de vendre des produits en toute sécurité.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec Supabase
- 👥 **Gestion des rôles** : Client, Vendeur, Administrateur
- 📱 **Interface responsive** optimisée mobile et desktop
- 🔍 **Recherche et filtres** avancés
- 📸 **Gestion des images** pour les produits
- ✅ **Système de validation** des annonces
- 💬 **Messagerie** entre acheteurs et vendeurs
- 📊 **Tableau de bord** pour les vendeurs
- 🛡️ **Panel d'administration** complet

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd GuineeMarket
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Allez dans **Settings > API**
3. Copiez votre **URL** et votre **clé anon**
4. Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

### 4. Configuration de la base de données

Exécutez le script SQL suivant dans l'éditeur SQL de Supabase :

```sql
-- Création des tables
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'vendor', 'admin')),
  avatar TEXT,
  location TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('electronics', 'clothing', 'vehicles', 'furniture', 'services')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET views = views + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- RPC pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET views = views + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Politiques de sécurité RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour les produits
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Vendors can view their own products" ON products
  FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own products" ON products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own products" ON products
  FOR UPDATE USING (vendor_id = auth.uid());

CREATE POLICY "Admins can view all products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les commandes
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (buyer_id = auth.uid() OR vendor_id = auth.uid());

CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Vendors can update their orders" ON orders
  FOR UPDATE USING (vendor_id = auth.uid());

-- Politiques pour les messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Déclencheur pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Lancer le projet

```bash
npm run dev
```

Le projet sera accessible sur `http://localhost:5173`

## 🏗️ Structure du projet

```
src/
├── components/          # Composants React
│   ├── Auth/           # Composants d'authentification
│   ├── Filters/        # Composants de filtrage
│   ├── Layout/         # Composants de mise en page
│   ├── Product/        # Composants de produits
│   ├── Search/         # Composants de recherche
│   └── Views/          # Vues principales
├── hooks/              # Hooks personnalisés
├── lib/                # Configuration des bibliothèques
├── types/              # Types TypeScript
├── utils/              # Utilitaires
├── App.tsx             # Composant principal
└── main.tsx            # Point d'entrée
```

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit le projet pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint

## 🎨 Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Build** : Vite
- **Icons** : Lucide React
- **Linting** : ESLint + TypeScript ESLint

## 📱 Fonctionnalités par rôle

### 👤 Client

- Parcourir les produits
- Rechercher et filtrer
- Contacter les vendeurs
- Passer des commandes

### 🏪 Vendeur

- Publier des annonces
- Gérer ses produits
- Voir les statistiques
- Gérer les commandes

### 👑 Administrateur

- Gérer tous les utilisateurs
- Valider les annonces
- Surveiller l'activité
- Accès complet au système

## 🚨 Dépannage

### Erreur de configuration Supabase

Si vous voyez "Configuration Supabase requise" :

1. Vérifiez que le fichier `.env` existe
2. Vérifiez que les clés sont correctes
3. Redémarrez le serveur de développement

### Erreur de base de données

1. Vérifiez que les tables sont créées
2. Vérifiez les politiques RLS
3. Vérifiez les permissions Supabase

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

---

**GuinéeMarket** - La marketplace de référence en Guinée 🇬🇳
