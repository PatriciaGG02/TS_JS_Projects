import { supabase } from './DatabaseConnection';

export async function fetchCompany() {
  const { data, error } = await supabase.from('company').select(`
      id,
      name,
      cif,
      address,
      active,
      phone,
      email,
      modality_id,
      modality ( name ),
      province_id,
      province ( name ),
      company_cycle (
        cycle_id ( id, name )
      )
    `);

  if (error) {
    console.error('Error fetching company data:', error);
    return null;
  }

  return data;
}
