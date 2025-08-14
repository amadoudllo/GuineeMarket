-- Script de configuration de la base de données GuinéeMarket
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
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

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
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

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
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

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction de mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction d'incrémentation des vues
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET views = views + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour la mise à jour automatique
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SÉCURITÉ RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Activation de RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES DE SÉCURITÉ
-- =====================================================

-- Politiques pour la table users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour la table products
DROP POLICY IF EXISTS "Anyone can view approved products" ON products;
CREATE POLICY "Anyone can view approved products" ON products
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Vendors can view their own products" ON products;
CREATE POLICY "Vendors can view their own products" ON products
  FOR SELECT USING (vendor_id = auth.uid());

DROP POLICY IF EXISTS "Vendors can insert their own products" ON products;
CREATE POLICY "Vendors can insert their own products" ON products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

DROP POLICY IF EXISTS "Vendors can update their own products" ON products;
CREATE POLICY "Vendors can update their own products" ON products
  FOR UPDATE USING (vendor_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all products" ON products;
CREATE POLICY "Admins can view all products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour la table orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (buyer_id = auth.uid() OR vendor_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert orders" ON orders;
CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Vendors can update their orders" ON orders;
CREATE POLICY "Vendors can update their orders" ON orders
  FOR UPDATE USING (vendor_id = auth.uid());

-- Politiques pour la table messages
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert messages" ON messages;
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Création d'un utilisateur admin de test (si nécessaire)
-- Note: L'ID doit correspondre à un utilisateur authentifié existant
-- INSERT INTO users (id, name, email, phone, role, location, verified) 
-- VALUES ('votre-uuid-admin', 'Admin Test', 'admin@test.com', '+224000000000', 'admin', 'Conakry', true);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index sur les colonnes fréquemment utilisées
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_product_id ON messages(product_id);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que les tables sont créées
SELECT 'Tables créées:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Vérifier que RLS est activé
SELECT 'RLS activé:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Vérifier les politiques créées
SELECT 'Politiques RLS:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Message de succès
SELECT '✅ Configuration de la base de données terminée avec succès!' as message;
