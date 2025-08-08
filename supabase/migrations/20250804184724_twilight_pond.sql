/*
  # Création de la table des produits

  1. Nouvelles Tables
    - `products`
      - `id` (uuid, clé primaire)
      - `title` (text, titre du produit)
      - `description` (text, description détaillée)
      - `price` (numeric, prix en GNF)
      - `images` (text[], tableau d'URLs d'images)
      - `category` (enum, catégorie du produit)
      - `condition` (enum, neuf/occasion)
      - `status` (enum, pending/approved/rejected)
      - `vendor_id` (uuid, référence vers users)
      - `location` (text, localisation)
      - `views` (integer, nombre de vues)
      - `featured` (boolean, produit en vedette)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activer RLS sur la table `products`
    - Politique pour permettre à tous de lire les produits approuvés
    - Politique pour permettre aux vendeurs de gérer leurs propres produits
    - Politique pour permettre aux admins de gérer tous les produits
*/

-- Créer les types enum
CREATE TYPE product_category AS ENUM ('electronics', 'clothing', 'vehicles', 'furniture', 'services');
CREATE TYPE product_condition AS ENUM ('new', 'used');
CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');

-- Créer la table products
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

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Activer RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les produits approuvés
CREATE POLICY "Anyone can read approved products"
  ON products
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

-- Politique pour permettre aux vendeurs de lire leurs propres produits
CREATE POLICY "Vendors can read own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

-- Politique pour permettre aux vendeurs de créer des produits
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

-- Politique pour permettre aux vendeurs de mettre à jour leurs propres produits
CREATE POLICY "Vendors can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Politique pour permettre aux vendeurs de supprimer leurs propres produits
CREATE POLICY "Vendors can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (vendor_id = auth.uid());

-- Politique pour permettre aux admins de gérer tous les produits
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

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();