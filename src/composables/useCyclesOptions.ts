import { ref } from 'vue';

import { fetchCycles } from '@/services/cycles-select';

export const useCyclesOptions = () => {
  const cyclesOptions = ref<any[]>([]);

  const getCyclesOptions = async () => {
    const { data, error } = await fetchCycles();

    if (data) {
      cyclesOptions.value = data.map((modality: any) => ({
        label: modality.name,
        value: modality.id,
      }));
    } else {
      throw Error('Error al obtener los grados' + error);
    }
  };

  return {
    getCyclesOptions,
    cyclesOptions,
  };
};
