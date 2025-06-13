import { reactive } from 'vue';
import type { CompanyWithCycles } from '@/types/company';
import { fetchCompany } from '@/services/CompanyService';

export const useCompany = () => {
  const company: CompanyWithCycles[] = reactive([]);

  const getCompany = async () => {
    try {
      const data = await fetchCompany();
      if (data) {
        const companyDataDB = data as any[];

        companyDataDB.forEach((companyDB) => {
          company.push({
            id: companyDB.id,
            name: companyDB.name,
            cif: companyDB.cif,
            address: companyDB.address,
            active: companyDB.active,
            phone: companyDB.phone,
            email: companyDB.email,
            modality_id: companyDB.modality_id,
            province_id: companyDB.province_id,
            modality: { name: companyDB.modality.name },
            province: { name: companyDB.province.name },
            cycles:
              companyDB.company_cycle?.map((c: any) => ({
                id: c.cycle_id.id,
                name: c.cycle_id.name,
              })) ?? [],
          });
        });

        console.log('Company data with cycles fetched:', company);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  return {
    company,
    getCompany,
  };
};
