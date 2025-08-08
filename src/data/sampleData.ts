// Données d'exemple pour tester l'application
// Ces données peuvent être insérées manuellement dans Supabase pour les tests

export const sampleUsers = `
-- Insérer des utilisateurs de test dans Supabase
-- Exécutez ces requêtes dans l'éditeur SQL après avoir créé les tables

-- Admin de test
INSERT INTO users (id, name, email, phone, role, location, verified) VALUES
(gen_random_uuid(), 'Admin GuinéeMarket', 'admin@guineamarket.com', '+224 600 000 000', 'admin', 'Conakry', true);

-- Vendeur de test
INSERT INTO users (id, name, email, phone, role, location, verified) VALUES
(gen_random_uuid(), 'Mamadou Diallo', 'mamadou@email.com', '+224 628 123 456', 'vendor', 'Conakry', true);

-- Client de test
INSERT INTO users (id, name, email, phone, role, location, verified) VALUES
(gen_random_uuid(), 'Aissatou Barry', 'aissatou@email.com', '+224 654 789 123', 'client', 'Kankan', true);
`;

export const sampleProducts = `
-- Produits d'exemple
-- Remplacez 'VENDOR_ID_HERE' par l'ID réel d'un vendeur de votre base

INSERT INTO products (title, description, price, images, category, condition, status, vendor_id, location, views, featured) VALUES
(
  'iPhone 14 Pro Max',
  'iPhone 14 Pro Max 256GB, couleur violet, état impeccable avec boîte et accessoires d''origine.',
  8500000,
  ARRAY['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
  'electronics',
  'used',
  'approved',
  'VENDOR_ID_HERE',
  'Conakry',
  45,
  true
),
(
  'Toyota Camry 2019',
  'Toyota Camry 2019, automatique, climatisée, en très bon état. Véhicule entretenu régulièrement.',
  185000000,
  ARRAY['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'],
  'vehicles',
  'used',
  'approved',
  'VENDOR_ID_HERE',
  'Conakry',
  89,
  false
),
(
  'Robe traditionnelle guinéenne',
  'Belle robe traditionnelle faite main, parfaite pour les occasions spéciales.',
  750000,
  ARRAY['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'],
  'clothing',
  'new',
  'pending',
  'VENDOR_ID_HERE',
  'Labé',
  12,
  false
);
`;