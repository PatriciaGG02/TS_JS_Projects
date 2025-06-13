//DATOS
export type Company = {
  id: string;
  name: string;
  cif: string;
  address: string;
  active: boolean;
  phone: string;
  email: string;
  modality_id: string;
  modality: { name: string };
  province_id: string;
  province: { name: string };
};

export type CompanyDB = Company & {
  company_cycle?: {
    cycle_id: {
      id: string;
      name: string;
    };
  }[];
};

export type CompanyWithCycles = Company & {
  cycles: { id: string; name: string }[];
};

interface Company {
  name: string;
  cif: string;
  address: string;
  active: boolean;
  phone: string;
  email: string;
  province: {
    name: string;
  };
  modality: {
    name: string;
  };
}

interface CyclesCompany {
  name: string;
  education_level: string;
  modality: {
    name: string;
  };
}

interface AlumnCompany {
  id: string;
  first_name: string;
  last_name_1: string;
  last_name_2: string;
  dni: string;
  enrollment_center: string;
  modality_id: string;
  modality: {
    name: string;
  };
  cycle_id: string;
  cycle: {
    name: string;
  };
  address: string;
  province_id: string;
  province: {
    name: string;
  };
  phone: string;
  email: string;
  start_date: Date;
  end_date: Date;
  status: string;
  result: string;
}

interface CompanyData {
  id: string;
  name: string;
  cif: string;
  address: string;
  active: boolean;
  phone: string;
  email: string;
  province: {
    id: string;
    name: string;
  };
  modality: {
    id: string;
    name: string;
  };
  postal_code: string;
  latitude: number;
  longitude: number;
  cycles: {
    cycle_id: string;
    cycle_name: string;
    education_level: string;
    modality: {
      id: string;
      name: string;
    };
  }[];
}
