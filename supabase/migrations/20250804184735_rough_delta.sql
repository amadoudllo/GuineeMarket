/*
  # Création de la table des commandes

  1. Nouvelles Tables
    - `orders`
      - `id` (uuid, clé primaire)
      - `product_id` (uuid, référence vers products)
      - `buyer_id` (uuid, référence vers users)
      - `vendor_id` (uuid, référence vers users)
      - `status` (enum, pending/confirmed/delivered/cancelled)
      - `delivery_address` (text, adresse de livraison)
      - `phone` (text, téléphone pour la livraison)
      - `notes` (text, notes optionnelles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activer RLS sur la table `orders`
    - Politique pour permettre aux acheteurs de voir leurs commandes
    - Politique pour permettre aux vendeurs de voir les commandes de leurs produits
    - Politique pour permettre aux admins de voir toutes les commandes
*/

-- Créer le type enum pour le statut des commandes
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');

-- Créer la table orders
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

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux acheteurs de voir leurs commandes
CREATE POLICY "Buyers can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

-- Politique pour permettre aux acheteurs de créer des commandes
CREATE POLICY "Buyers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Politique pour permettre aux acheteurs de mettre à jour leurs commandes
CREATE POLICY "Buyers can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Politique pour permettre aux vendeurs de voir les commandes de leurs produits
CREATE POLICY "Vendors can read orders for their products"
  ON orders
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

-- Politique pour permettre aux vendeurs de mettre à jour le statut des commandes
CREATE POLICY "Vendors can update order status"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Politique pour permettre aux admins de gérer toutes les commandes
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

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();