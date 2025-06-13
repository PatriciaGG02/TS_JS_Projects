import { ref } from 'vue';
import { supabase } from '@/services/DatabaseConnection';
import type { Session } from '@supabase/supabase-js';

const session = ref<Session | null>(null);

export function useAuth() {
  const fetchSession = async (): Promise<void> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error al obtener la sesión:', error.message);
    }
    session.value = data.session;
  };

  const isLoggedIn = async (): Promise<boolean> => {
    if (!session.value) await fetchSession();
    return !!session.value;
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      session.value = null;
    }
  };

  return {
    session,
    isLoggedIn,
    fetchSession,
    logout,
  };
}
