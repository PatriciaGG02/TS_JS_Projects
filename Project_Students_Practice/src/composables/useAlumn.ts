import { reactive } from 'vue';
import type { Alumn, AlumnDB } from '@/types/alumn';
import { fetchAlumn } from '@/services/AlumnService';

export const useAlumn = () => {
  const alumn: Alumn[] = reactive([]);

  const getAlumn = async () => {
    const data = await fetchAlumn();
    if (data) {
      const alumnDataDB = data as unknown as AlumnDB[];
      alumn.length = 0;
      alumnDataDB.forEach((alumnDB) => {
        alumn.push({
          id: alumnDB.id,
          name: `${alumnDB.first_name} ${alumnDB.last_name_1} ${alumnDB.last_name_2}`.trim(),
          last_name_1: alumnDB.last_name_1,
          last_name_2: alumnDB.last_name_2,
          dni: alumnDB.dni,
          phone: alumnDB.phone,
          company_name: alumnDB.internship?.[0]?.company_id?.name ?? null,
          company_id: alumnDB.internship?.[0]?.company_id?.id ?? null,
          email: alumnDB.email,
          enrollment_center: alumnDB.enrollment_center,
          modality_id: alumnDB.modality_id,
          cycle_id: alumnDB.cycle_id,
          province_id: alumnDB.province_id,
          status: alumnDB.status,
          province_name: alumnDB.province.name,
          modality_name: alumnDB.modality.name,
          cycle_name: alumnDB.cycle.name,
        });
      });
    }
  };

  return {
    alumn,
    getAlumn,
  };
};
