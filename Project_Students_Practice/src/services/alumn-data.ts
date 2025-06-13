import { supabase } from './DatabaseConnection';

export async function fetchAlumnData(id: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('alumn')
      .select(
        'first_name, last_name_1, last_name_2, dni, enrollment_center, phone, email, status, modality_id, cycle_id, province_id,' +
          'modality(name), cycle(name), province(name), gender'
      )
      .eq('id', id);

    return { data, error };
  } catch (error) {
    console.error('Error al obtener los datos:', error);

    return error;
  }
}

export async function fetchCurrentCompanyData(id: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('internship')
      .select(
        'id, company_id ,company(name), start_date, end_date, cycle_id, cycle(name), result'
      )
      .eq('alumn_id', id);
    return { data, error };
  } catch (error) {
    console.error('Error al obtener los datos:', error);

    return error;
  }
}

export async function updateAlumnData(alumnData: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('alumn')
      .upsert([alumnData], { onConflict: 'id' })
      .select('*');

    if (error) {
      console.error('Error al actualizar los datos:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Datos actualizados con éxito:' + data);
    return { success: true, data: data[0] };
  } catch (err: any) {
    console.error('Error al conectar con Supabase:', err);
    return { success: false, error: err.message };
  }
}

export const checkEmailExists = async (email: string, id: string) => {
  const { data, error } = await supabase
    .from('alumn')
    .select('id')
    .eq('email', email)
    .neq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error comprobando email:', error);
    return false;
  }

  return !!data;
};

export const checkPhoneExists = async (
  phone: string,
  id: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('alumn')
    .select('id')
    .eq('phone', phone)
    .neq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error comprobando phone:', error);
    return false;
  }
  return !!data;
};

export const deleteCurrentCompany = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('internship').delete().eq('id', id);

  if (error) {
    console.error('Error al eliminar:', error);
    return false;
  } else {
    return true;
  }
};

export const deleteAlumn = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('alumn').delete().eq('id', id);

  if (error) {
    console.error('Error al eliminar:', error);
    return false;
  } else {
    return true;
  }
};

export async function updateCurrentCompanyData(
  currentCompany: any
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!currentCompany.id) {
      currentCompany.id = crypto.randomUUID();
    }

    const { data, error } = await supabase
      .from('internship')
      .upsert([currentCompany], { onConflict: 'id' });

    if (error) {
      console.error('Error al actualizar los datos:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Datos actualizados con éxito:', data);
    return { success: true, id: currentCompany.id };
  } catch (err: any) {
    console.error('Error al conectar con Supabase:', err);
    return { success: false, error: err.message };
  }
}
export const checkAllEmailExists = async (email: string) => {
  const { data } = await supabase.from('alumn').select('id').eq('email', email);

  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const checkAllPhoneExists = async (phone: string): Promise<boolean> => {
  const { data } = await supabase.from('alumn').select('id').eq('phone', phone);

  console.log('data', data);
  if (data && data.length > 0) {
    return true;
  } else {
    return false;
  }
};

// export async function updateCurrenteCompany(alumnData: any): Promise<any> {
//   try {
//     const { data, error } = await supabase
//       .from('alumn')
//       .upsert([alumnData], { onConflict: 'id' });

//     if (error) {
//       console.error('Error al actualizar los datos:', error.message);
//       return { success: false, error: error.message };
//     }

//     console.log('Datos actualizados con éxito:' + data);
//     return { success: true };
//   } catch (err: any) {
//     console.error('Error al conectar con Supabase:', err);
//     return { success: false, error: err.message };
//   }
// }
