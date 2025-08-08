/*
  # Création de la table des messages

  1. Nouvelles Tables
    - `messages`
      - `id` (uuid, clé primaire)
      - `sender_id` (uuid, référence vers users)
      - `receiver_id` (uuid, référence vers users)
      - `product_id` (uuid, référence vers products)
      - `content` (text, contenu du message)
      - `read` (boolean, message lu ou non)
      - `created_at` (timestamp)

  2. Sécurité
    - Activer RLS sur la table `messages`
    - Politique pour permettre aux utilisateurs de voir leurs messages
    - Politique pour permettre aux utilisateurs d'envoyer des messages
    - Politique pour permettre aux admins de voir tous les messages
*/

-- Créer la table messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_product_id ON messages(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Activer RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de lire leurs messages (envoyés ou reçus)
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Politique pour permettre aux utilisateurs d'envoyer des messages
CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Politique pour permettre aux utilisateurs de marquer leurs messages comme lus
CREATE POLICY "Users can update message read status"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- Politique pour permettre aux admins de voir tous les messages
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