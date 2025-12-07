import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, nickname: string, referrerData?: { referred_by: string; referral_code: string }) => Promise<any>;
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, nickname: string, referrerData?: { referred_by: string; referral_code: string }) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { 
          nickname,
          // Передаём данные реферера в метаданные - триггер handle_new_user их обработает
          ...(referrerData && {
            referred_by: referrerData.referred_by,
            referral_code: referrerData.referral_code
          })
        }
      }
    });

    // Если регистрация успешна, генерируем реферальный код
    if (result.data?.user && !result.error) {
      try {
        // Генерируем реферальный код
        const { data: referralCode, error: codeError } = await supabase
          .rpc('generate_referral_code');

        if (!codeError && referralCode) {
          // Обновляем профиль с реферальным кодом
          await supabase
            .from('profiles')
            .update({ referral_code: referralCode })
            .eq('user_id', result.data.user.id);
          
          console.log('✅ Referral code generated for new user:', referralCode);
        }
      } catch (error) {
        console.error('❌ Error generating referral code for new user:', error);
      }
    }

    return result;
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  const signOut = async () => {
    // Очищаем все localStorage перед выходом
    localStorage.clear();
    await supabase.auth.signOut();
  };

  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  const updateProfile = async (data: { nickname?: string }) => {
    if (!user) throw new Error('Не авторизован');
    
    // Update auth metadata
    const authResult = await supabase.auth.updateUser({
      data: { nickname: data.nickname }
    });

    // Update profile table
    if (data.nickname) {
      const profileResult = await supabase
        .from('profiles')
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