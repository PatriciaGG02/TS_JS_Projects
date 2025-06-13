import { supabase } from './DatabaseConnection';

export async function fetchSelectOptions() {
  const [provincesRes, cyclesRes, modalitiesRes] = await Promise.all([
    supabase.from('province').select('*'),
    supabase.from('cycle').select('*'),
    supabase.from('modality').select('*'),
  ]);

  if (provincesRes.error || cyclesRes.error || modalitiesRes.error) {
    throw new Error(
      provincesRes.error?.message ||
        cyclesRes.error?.message ||
        modalitiesRes.error?.message ||
        'Unknown error fetching select options'
    );
  }

  return {
    provinces: provincesRes.data,
    cycles: cyclesRes.data,
    modalities: modalitiesRes.data,
  };
}
