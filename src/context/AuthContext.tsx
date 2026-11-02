import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { localQuizStore } from '../lib/localQuizStore';
import { Profile } from '../types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isSupabase: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (displayName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isSupabase = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile);
            } else {
              // Fallback user profile
              const fallback: Profile = {
                id: session.user.id,
                display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Quiz Creator',
                avatar_url: session.user.user_metadata?.avatar_url || null,
                created_at: session.user.created_at || new Date().toISOString(),
              };
              setUser(fallback);
            }
          }
        } catch (err) {
          console.error('Supabase auth session error:', err);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile);
            } else {
              setUser({
                id: session.user.id,
                display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Quiz Creator',
                avatar_url: session.user.user_metadata?.avatar_url || null,
                created_at: session.user.created_at || new Date().toISOString(),
              });
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        if (mounted) setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Local simulation auth
        const localUser = localQuizStore.getCurrentUser();
        if (localUser && mounted) {
          setUser(localUser);
        }
        if (mounted) setLoading(false);
      }
    }

    initAuth();
    return () => {
      mounted = false;
    };
  }, [isSupabase]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred during login.' };
      }
    } else {
      // Local Auth
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }
      const existingProfiles = localQuizStore.getProfiles();
      const match = existingProfiles.find((p) => p.display_name.toLowerCase() === email.split('@')[0].toLowerCase());
      
      const loggedInUser: Profile = match || {
        id: `user-${Date.now()}`,
        display_name: email.split('@')[0],
        avatar_url: null,
        created_at: new Date().toISOString(),
      };

      localQuizStore.saveProfile(loggedInUser);
      localQuizStore.setCurrentUser(loggedInUser);
      setUser(loggedInUser);
      return { success: true };
    }
  };

  const signUp = async (
    displayName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });
        if (error) return { success: false, error: error.message };

        // If email confirmation is required or auto-confirmed
        if (data.user) {
          const newProfile: Profile = {
            id: data.user.id,
            display_name: displayName,
            avatar_url: null,
            created_at: new Date().toISOString(),
          };
          setUser(newProfile);
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Signup failed' };
      }
    } else {
      // Local Auth
      const newUser: Profile = {
        id: `user-${Date.now()}`,
        display_name: displayName,
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      localQuizStore.saveProfile(newUser);
      localQuizStore.setCurrentUser(newUser);
      setUser(newUser);
      return { success: true };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out of Supabase:', err);
      }
    } else {
      localQuizStore.setCurrentUser(null);
    }
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Password reset failed' };
      }
    } else {
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSupabase, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
