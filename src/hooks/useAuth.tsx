import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { hasSupabase, supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, nickname: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<any>;
  updateProfile: (data: { nickname?: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, nickname: string) => {
    if (!hasSupabase) throw new Error('Supabase не подключён');
    
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }
      }
    });
  };

  const signIn = async (email: string, password: string) => {
    if (!hasSupabase) throw new Error('Supabase не подключён');
    
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  const signOut = async () => {
    if (!hasSupabase) throw new Error('Supabase не подключён');
    
    await supabase.auth.signOut();
  };

  const updatePassword = async (password: string) => {
    if (!hasSupabase) throw new Error('Supabase не подключён');
    
    return await supabase.auth.updateUser({ password });
  };

  const updateProfile = async (data: { nickname?: string }) => {
    if (!hasSupabase || !user) throw new Error('Не авторизован');
    
    // Update auth metadata
    const authResult = await supabase.auth.updateUser({
      data: { nickname: data.nickname }
    });

    // Update profile table
    if (data.nickname) {
      const profileResult = await supabase
        .from('user_profiles')
        .update({ nickname: data.nickname })
        .eq('user_id', user.id);
      
      return { authResult, profileResult };
    }

    return { authResult };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updatePassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}