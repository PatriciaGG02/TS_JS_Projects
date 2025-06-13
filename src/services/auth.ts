import type { DataUser } from '@/types/auth';
import { supabase } from './DatabaseConnection';

export const signUpNewUser = async (dataUser: DataUser): Promise<any> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: dataUser.email,
      password: dataUser.password,
    });

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export async function signInWithEmail(dataUser: DataUser): Promise<any> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataUser.email,
      password: dataUser.password,
    });

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}
