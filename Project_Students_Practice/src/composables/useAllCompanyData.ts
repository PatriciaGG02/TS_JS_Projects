import { ref } from 'vue';
import { fetchAllCompanyData } from '@/services/company-data';

export const useAllCompanyData = () => {
  const allCompanyOptions = ref<any[]>([]);

  //Función para obtener los datos del alumno de Supabase e insertalos en el objeto
  const getAllCompanyData = async () => {
    const { data, error } = await fetchAllCompanyData();

    if (error) {
      console.log(error);
    } else {
      allCompanyOptions.value = data.map((company: any) => ({
        name: company.name,
        value: company.id,
        active: company.active,
        cif: company.cif,
        province: company.province.name,
        label:
          company.name + ' - ' + company.province.name + ' - ' + company.cif,
      }));
    }
  };

  return {
    allCompanyOptions,
    getAllCompanyData,
  };
};
