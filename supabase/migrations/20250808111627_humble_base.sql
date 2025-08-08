-- 🇬🇳 SCRIPT COMPLET POUR GUINEAMARKET - SUPABASE
-- Exécutez ce script dans l'éditeur SQL de votre dashboard Supabase

-- ========================================
-- 1. CRÉATION DES TYPES ENUM
-- ========================================

-- Type pour les rôles utilisateurs
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('client', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type pour les catégories de produits
DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('electronics', 'clothing', 'vehicles', 'furniture', 'services');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type pour l'état des produits
DO $$ BEGIN
    CREATE TYPE product_condition AS ENUM ('new', 'used');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type pour le statut des produits
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type pour le statut des commandes
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ========================================
-- 2. CRÉATION DE LA TABLE USERS
-- ========================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  avatar text,
  location text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- 3. CRÉATION DE LA TABLE PRODUCTS
-- ========================================

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price > 0),
  images text[] NOT NULL DEFAULT '{}',
  category product_category NOT NULL,
  condition product_condition NOT NULL,
  status product_status NOT NULL DEFAULT 'pending',
  vendor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location text NOT NULL,
  views integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- 4. CRÉATION DE LA TABLE ORDERS
-- ========================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  delivery_address text NOT NULL,
  phone text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- 5. CRÉATION DE LA TABLE MESSAGES
-- ========================================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ========================================
-- 6. CRÉATION DES INDEX POUR LES PERFORMANCES
-- ========================================

-- Index pour la table products
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Index pour la table orders
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Index pour la table messages
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_product_id ON messages(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ========================================
-- 7. ACTIVATION DE LA SÉCURITÉ RLS
-- ========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 8. POLITIQUES RLS POUR LA TABLE USERS
-- ========================================

-- Les utilisateurs peuvent lire leur propre profil
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Les admins peuvent lire tous les profils
DROP POLICY IF EXISTS "Admins can read all profiles" ON users;
CREATE POLICY "Admins can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Les admins peuvent gérer tous les utilisateurs
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 9. POLITIQUES RLS POUR LA TABLE PRODUCTS
-- ========================================

-- Tout le monde peut lire les produits approuvés
DROP POLICY IF EXISTS "Anyone can read approved products" ON products;
CREATE POLICY "Anyone can read approved products"
  ON products
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

-- Les vendeurs peuvent lire leurs propres produits
DROP POLICY IF EXISTS "Vendors can read own products" ON products;
CREATE POLICY "Vendors can read own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

-- Les vendeurs peuvent créer des produits
DROP POLICY IF EXISTS "Vendors can create products" ON products;
CREATE POLICY "Vendors can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    vendor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('vendor', 'admin')
    )
  );

-- Les vendeurs peuvent mettre à jour leurs propres produits
DROP POLICY IF EXISTS "Vendors can update own products" ON products;
CREATE POLICY "Vendors can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Les vendeurs peuvent supprimer leurs propres produits
DROP POLICY IF EXISTS "Vendors can delete own products" ON products;
CREATE POLICY "Vendors can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (vendor_id = auth.uid());

-- Les admins peuvent gérer tous les produits
DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 10. POLITIQUES RLS POUR LA TABLE ORDERS
-- ========================================

-- Les acheteurs peuvent lire leurs commandes
DROP POLICY IF EXISTS "Buyers can read own orders" ON orders;
CREATE POLICY "Buyers can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

-- Les acheteurs peuvent créer des commandes
DROP POLICY IF EXISTS "Buyers can create orders" ON orders;
CREATE POLICY "Buyers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Les acheteurs peuvent mettre à jour leurs commandes
DROP POLICY IF EXISTS "Buyers can update own orders" ON orders;
CREATE POLICY "Buyers can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Les vendeurs peuvent lire les commandes de leurs produits
DROP POLICY IF EXISTS "Vendors can read orders for their products" ON orders;
CREATE POLICY "Vendors can read orders for their products"
  ON orders
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

-- Les vendeurs peuvent mettre à jour le statut des commandes
DROP POLICY IF EXISTS "Vendors can update order status" ON orders;
CREATE POLICY "Vendors can update order status"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Les admins peuvent gérer toutes les commandes
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 11. POLITIQUES RLS POUR LA TABLE MESSAGES
-- ========================================

-- Les utilisateurs peuvent lire leurs messages
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Les utilisateurs peuvent envoyer des messages
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Les utilisateurs peuvent marquer leurs messages comme lus
DROP POLICY IF EXISTS "Users can update message read status" ON messages;
CREATE POLICY "Users can update message read status"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- Les admins peuvent lire tous les messages
DROP POLICY IF EXISTS "Admins can read all messages" ON messages;
CREATE POLICY "Admins can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- 12. FONCTIONS UTILITAIRES
-- ========================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, role, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Conakry')
  );
  RETURN NEW;
END;
$$;

-- Fonction pour incrémenter les vues des produits
CREATE OR REPLACE FUNCTION increment_product_views(product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products 
  SET views = views + 1 
  WHERE id = product_id;
END;
$$;

-- ========================================
-- 13. CRÉATION DES TRIGGERS
-- ========================================

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer automatiquement le profil utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 14. MESSAGE DE CONFIRMATION
-- ========================================

SELECT 
  '🎉 BASE DE DONNÉES GUINEAMARKET CRÉÉE AVEC SUCCÈS!' as "STATUT",
  '✅ Toutes les tables ont été créées' as "TABLES",
  '🔐 Sécurité RLS activée sur toutes les tables' as "SÉCURITÉ",
  '🚀 Votre marketplace est prête à fonctionner!' as "RÉSULTAT";

-- Afficher les tables créées
SELECT 
  schemaname as "SCHÉMA",
  tablename as "TABLE CRÉÉE",
  hasindexes as "INDEX",
  hasrules as "RÈGLES"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'products', 'orders', 'messages')
ORDER BY tablename;