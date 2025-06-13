import { ref } from 'vue';
import { fetchSelectOptions } from '@/services/select-alumn-options';

export const useSelectOptions = () => {
  const provincesData = ref<any[]>([]);
  const cyclesData = ref<any[]>([]);
  const modalitiesData = ref<any[]>([]);

  const getSelectOptions = async () => {
    const { provinces, cycles, modalities } = await fetchSelectOptions();

    if (provinces && cycles && modalities) {
      provincesData.value = provinces.map((province: any) => ({
        label: province.name,
        value: province.id,
      }));

      cyclesData.value = cycles.map((cycle: any) => ({
        label: cycle.name,
        value: cycle.id,
      }));

      modalitiesData.value = modalities.map((modality: any) => ({
        label: modality.name,
        value: modality.id,
      }));
    } else {
      throw Error('Error al obtener las opciones del select');
    }
  };

  return {
    getSelectOptions,
    provincesData,
    cyclesData,
    modalitiesData,
  };
};
