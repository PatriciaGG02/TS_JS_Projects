import { reactive } from 'vue';
import { fetchAlumnData } from '@/services/alumn-data';
import type { AlumnData, AlumnDataDB } from '@/types/alumnData';

export const useAlumnData = (id: string) => {
  const alumnData: AlumnData = reactive({
    id: '',
    full_name: '',
    first_name: '',
    last_name_1: '',
    last_name_2: '',
    enrollment_center: '',
    dni: '',
    phone: '',
    email: '',
    cycle_name: '',
    modality_name: '',
    province_name: '',
    status: '',
    province_id: '',
    cycle_id: '',
    modality_id: '',
    has_company: false,
    gender: '',
  });

  //Función para obtener los datos del alumno de Supabase e insertalos en el objeto
  const getAlumnData = async () => {
    const { data, error } = await fetchAlumnData(id);

    if (error) {
      console.log(error);
    } else {
      //Guardamos los datos en el reactive
      const alumn: AlumnDataDB = data[0];
      alumnData.id = id;
      alumnData.full_name =
        `${alumn.first_name} ${alumn.last_name_1} ${alumn.last_name_2 ? alumn.last_name_2 : ''}`.trim();
      alumnData.first_name = alumn.first_name;
      alumnData.last_name_1 = alumn.last_name_1;
      alumnData.last_name_2 = alumn.last_name_2;
      alumnData.enrollment_center = alumn.enrollment_center;
      alumnData.dni = alumn.dni;
      alumnData.phone = alumn.phone;
      alumnData.email = alumn.email;
      alumnData.status = alumn.status;
      alumnData.province_name = alumn.province?.name;
      alumnData.cycle_name = alumn.cycle?.name;
      alumnData.modality_name = alumn.modality?.name;
      alumnData.province_id = alumn.province_id;
      alumnData.cycle_id = alumn.cycle_id;
      alumnData.modality_id = alumn.modality_id;
      alumnData.gender = alumn.gender;
      
    }
  };

  return {
    alumnData,
    getAlumnData,
  };
};
