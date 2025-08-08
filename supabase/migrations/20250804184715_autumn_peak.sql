/*
  # Création de la table des utilisateurs

  1. Nouvelles Tables
    - `users`
      - `id` (uuid, clé primaire, lié à auth.users)
      - `name` (text, nom complet)
      - `email` (text, unique)
      - `phone` (text, numéro de téléphone)
      - `role` (enum, client/vendor/admin)
      - `avatar` (text, URL de l'avatar optionnel)
      - `location` (text, ville/région)
      - `verified` (boolean, statut de vérification)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activer RLS sur la table `users`
    - Politique pour permettre aux utilisateurs de lire leur propre profil
    - Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
    - Politique pour permettre aux admins de gérer tous les utilisateurs
*/

-- Créer le type enum pour les rôles
CREATE TYPE user_role AS ENUM ('client', 'vendor', 'admin');

-- Créer la table users
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

-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de lire leur propre profil
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Politique pour permettre aux admins de lire tous les profils
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

-- Politique pour permettre aux admins de gérer tous les utilisateurs
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

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();