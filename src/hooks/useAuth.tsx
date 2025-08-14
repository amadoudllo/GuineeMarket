import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Création du contexte avec le bon type
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook interne pour gérer la logique d'authentification
function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session actuelle
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          avatar: data.avatar,
          location: data.location,
          verified: data.verified,
          createdAt: new Date(data.created_at),
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            location: userData.location,
            role: userData.role,
          },
        },
      });

      if (!error && data.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          role: userData.role || "client",
          verified: false,
        });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}

// Fournisseur de contexte
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
