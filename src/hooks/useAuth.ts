import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Si la table n'existe pas encore, créer un profil temporaire
        if (error.code === 'PGRST106' || error.message.includes('relation "users" does not exist')) {
          console.log('Users table does not exist, creating temporary profile');
          await createTemporaryProfile(userId);
          return;
        }
        throw error;
      }

      if (data) {
        console.log('User profile found:', data);
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          avatar: data.avatar,
          location: data.location,
          verified: data.verified,
          createdAt: new Date(data.created_at)
        });
      } else {
        // Si aucun profil n'existe, créer un profil par défaut
        console.log('No user profile found, creating default profile');
        await createDefaultProfile(userId);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const createTemporaryProfile = async (userId: string) => {
    try {
      // Récupérer les informations de l'utilisateur authentifié
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser.user) {
        setUser(null);
        return;
      }

      // Créer un profil temporaire en mémoire (sans base de données)
      const tempUser: User = {
        id: userId,
        name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'Utilisateur',
        email: authUser.user.email || '',
        phone: authUser.user.user_metadata?.phone || '',
        role: 'client',
        location: 'Conakry',
        verified: false,
        createdAt: new Date()
      };

      setUser(tempUser);
    } catch (error) {
      console.error('Error creating temporary profile:', error);
      setUser(null);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      // Récupérer les informations de l'utilisateur authentifié
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser.user) {
        setUser(null);
        return;
      }

      // Créer un profil par défaut
      console.log('Creating default profile for user:', userId);
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name: authUser.user.user_metadata?.name || 'Utilisateur',
          email: authUser.user.email || '',
          phone: authUser.user.user_metadata?.phone || '',
          role: authUser.user.user_metadata?.role || 'client',
          location: authUser.user.user_metadata?.location || 'Conakry',
          verified: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        // Si on ne peut pas créer le profil en base, utiliser un profil temporaire
        if (error.code === 'PGRST106' || error.message.includes('relation "users" does not exist')) {
          console.log('Cannot create profile in database, using temporary profile');
          await createTemporaryProfile(userId);
          return;
        }
        console.error('Error creating user profile:', error);
        setUser(null);
        return;
      }

      // Définir l'utilisateur avec le nouveau profil
      console.log('Default profile created successfully:', data);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: data.avatar,
        location: data.location,
        verified: data.verified,
        createdAt: new Date(data.created_at)
      });
    } catch (error) {
      console.error('Error creating default profile:', error);
      setUser(null);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    phone: string;
    location: string;
    role?: 'client' | 'vendor';
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};