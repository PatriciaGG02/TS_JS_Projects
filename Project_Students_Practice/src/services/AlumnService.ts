//Here we define the AlumnService, which is responsible for fetching data from the 'alumn' table in the database.
// This service uses Supabase as the database connection and fetches data from the 'alumn' table.
import { supabase } from './DatabaseConnection';

export async function fetchAlumn() {
  const { data, error } = await supabase
    .from('alumn')
    .select(
      'first_name, last_name_1, last_name_2, dni, phone, email, enrollment_center, modality_id, cycle_id, province_id, status, id, internship(company_id: company(name, id)), cycle(name), province(name), modality(name)'
    );
  console.log(data);
  if (data) {
    return data;
  }
  if (error) {
    console.error('Error fetching alumn data:', error);
  }
  return data;
}
