import { reactive } from 'vue';
import { fetchCurrentCompanyData } from '@/services/alumn-data';
import type { CurrentCompany, CurrentCompanyDB } from '@/types/alumnData';

export const useCurrentCompanyData = (id: string) => {
  const currentCompanyData: CurrentCompany = reactive({
    id: '',
    company_id: '',
    company: '',
    cycle: '',
    cycle_id: '',
    end_date: '',
    start_date: '',
    result: '',
  });

  const getCurrentCompanyData = async () => {
    const { data, error } = await fetchCurrentCompanyData(id);

    if (error) {
      console.log(error);
      return false;
    } else if (Array.isArray(data) && data.length > 0) {
      const currentCompany: CurrentCompanyDB = data[0];
      currentCompanyData.id = currentCompany.id;
      currentCompanyData.company_id = currentCompany.company_id;
      currentCompanyData.company = currentCompany.company.name;
      currentCompanyData.cycle_id = currentCompany.cycle_id;
      currentCompanyData.cycle = currentCompany.cycle.name;
      currentCompanyData.end_date = currentCompany.end_date;
      currentCompanyData.start_date = currentCompany.start_date;
      currentCompanyData.result = currentCompany.result;
      return true;
    } else {
      return false;
    }
  };

  return {
    currentCompanyData,
    getCurrentCompanyData,
  };
};
