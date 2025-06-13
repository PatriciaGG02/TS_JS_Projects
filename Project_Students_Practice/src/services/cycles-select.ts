import { supabase } from './DatabaseConnection';

export async function fetchCycles(): Promise<any> {
  try {
    const { data, error } = await supabase.from('cycle').select('*');

    return { data, error };
  } catch (error) {
    console.error('Error al obtener los datos:', error);

    return error;
  }
}
