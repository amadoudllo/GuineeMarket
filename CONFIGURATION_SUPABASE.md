# Configuration Supabase - GuinéeMarket

## 🗄️ Structure de la Base de Données

### Tables Principales

#### 1. Table `users`

```sql
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
```

#### 2. Table `products`

```sql
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
```

#### 3. Table `orders`

```sql
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
```

#### 4. Table `messages`

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Sécurité et Politiques RLS

### Activation RLS

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### Politiques Utilisateurs

```sql
-- Lecture de son propre profil
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Modification de son propre profil
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Création de son propre profil
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Politiques Produits

```sql
-- Tout le monde peut voir les produits approuvés
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (status = 'approved');

-- Les vendeurs peuvent voir leurs propres produits
CREATE POLICY "Vendors can view their own products" ON products
  FOR SELECT USING (vendor_id = auth.uid());

-- Les vendeurs peuvent créer leurs produits
CREATE POLICY "Vendors can insert their own products" ON products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

-- Les vendeurs peuvent modifier leurs produits
CREATE POLICY "Vendors can update their own products" ON products
  FOR UPDATE USING (vendor_id = auth.uid());

-- Les admins ont accès complet
CREATE POLICY "Admins can view all products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Politiques Commandes

```sql
-- Les utilisateurs voient leurs propres commandes
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (buyer_id = auth.uid() OR vendor_id = auth.uid());

-- Les utilisateurs peuvent créer des commandes
CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Les vendeurs peuvent modifier leurs commandes
CREATE POLICY "Vendors can update their orders" ON orders
  FOR UPDATE USING (vendor_id = auth.uid());
```

### Politiques Messages

```sql
-- Les utilisateurs voient leurs propres messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Les utilisateurs peuvent envoyer des messages
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
```

## ⚙️ Fonctions et Triggers

### Fonction de mise à jour automatique

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Fonction d'incrémentation des vues

```sql
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET views = views + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
```

## 🔧 Configuration de l'Authentification

### 1. Activer l'Authentification

- Allez dans **Authentication > Settings**
- Activez **Enable email confirmations**
- Configurez les **Site URL** et **Redirect URLs**

### 2. Configuration des Rôles

- Les rôles sont gérés automatiquement lors de l'inscription
- Les utilisateurs commencent avec le rôle `client`
- Seuls les admins peuvent changer les rôles

### 3. Politiques de Mots de Passe

- Longueur minimale : 6 caractères
- Pas de restrictions spéciales par défaut
- Configurable dans **Authentication > Settings**

## 📊 Monitoring et Logs

### 1. Logs d'Authentification

- **Authentication > Logs** : Voir les tentatives de connexion
- **Database > Logs** : Voir les requêtes SQL

### 2. Métriques

- **Dashboard** : Vue d'ensemble du projet
- **Usage** : Consommation des ressources

## 🚨 Dépannage

### Erreurs Courantes

#### 1. "Row Level Security policy violation"

- Vérifiez que les politiques RLS sont créées
- Vérifiez que l'utilisateur est authentifié
- Vérifiez les permissions de l'utilisateur

#### 2. "Foreign key violation"

- Vérifiez que les références existent
- Vérifiez l'ordre de création des tables

#### 3. "Permission denied"

- Vérifiez les politiques RLS
- Vérifiez le rôle de l'utilisateur
- Vérifiez les permissions Supabase

### Vérification de la Configuration

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Vérifier les contraintes
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass;
```

## 📚 Ressources Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Community](https://github.com/supabase/supabase/discussions)
