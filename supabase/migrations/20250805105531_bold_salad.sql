/*
  # Fonction pour incrémenter les vues des produits

  1. Fonctions
    - Fonction pour incrémenter le nombre de vues d'un produit de manière sécurisée
*/

-- Fonction pour incrémenter les vues d'un produit
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