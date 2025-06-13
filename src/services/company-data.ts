import { supabase } from './DatabaseConnection';

export async function fetchAllCompanyData(): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('company')
      .select(
        'id, name, cif, province(name), active'
      )

    return { data, error };
  } catch (error) {
    console.error('Error al obtener los datos:', error);

    return error;
  }
}