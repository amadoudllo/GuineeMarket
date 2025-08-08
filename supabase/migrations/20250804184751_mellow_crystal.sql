/*
  # Création automatique du profil utilisateur

  1. Fonctions
    - Fonction pour créer automatiquement un profil utilisateur lors de l'inscription
    - Trigger pour exécuter cette fonction après insertion dans auth.users

  2. Sécurité
    - La fonction s'exécute avec les privilèges de sécurité définis
*/

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

-- Trigger pour créer automatiquement le profil utilisateur
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();