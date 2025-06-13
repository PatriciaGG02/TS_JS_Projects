// src/composables/useValidation.ts

import type { AlumnData, CurrentCompany } from '@/types/alumnData';

export function useValidation() {
  const validateAlumnForm = (form: AlumnData) => {
    const errors: Record<string, string> = {};

    if (!form.first_name.trim()) {
      errors.first_name = 'El nombre es obligatorio';
    }

    if (!form.last_name_1.trim()) {
      errors.last_name_1 = 'El primer apellido es obligatorio';
    }

    if (!form.dni.trim()) {
      errors.dni = 'El DNI es obligatorio.';
    } else if (!/^\d{8}[A-Za-z]$/.test(form.dni)) {
      errors.dni = 'El DNI no es válido';
    }

    if(!form.gender){
      errors.gender = 'El género es obligatorio';
    } 

    if (!form.phone) {
      errors.phone = 'El teléfono es obligatorio.';
    } else if (!/^\d{9}$/.test(form.phone)) {
      errors.phone = 'Debe tener 9 dígitos';
    }

    if (!form.email) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      errors.email = 'El email no es válido.';
    }

    if (!form.enrollment_center.trim()) {
      errors.enrollment_center = 'El centro es obligatorio';
    }

    if (!form.province_id) {
      errors.province_id = 'Selecciona una provincia';
    }

    if (!form.cycle_id) {
      errors.cycle_id = 'Selecciona un ciclo';
    }

    if (!form.modality_id) {
      errors.modality_id = 'Selecciona una modalidad';
    }

    if (!form.status) {
      errors.status = 'Selecciona un estado';
    }

    return errors;
  };

  const validateAlumnField = (
    field: keyof AlumnData,
    value: string | number | null
  ) => {
    switch (field) {
      case 'first_name':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'El nombre es obligatorio';
        }
        break;
      case 'last_name_1':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'El primer apellido es obligatorio';
        }
        break;
      case 'dni':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'El DNI es obligatorio.';
        } else if (!/^\d{8}[A-Za-z]$/.test(value)) {
          return 'El DNI no es válido';
        }
        break;
        case 'gender':
          console.log(value);
        if (!value || (typeof value !== 'string' || !value.trim())) {
          return 'El género es obligatorio';
        } 
        break;
      case 'phone':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'El teléfono es obligatorio.';
        } else if (!/^\d{9}$/.test(value)) {
          return 'Debe tener 9 dígitos';
        }
        break;
      case 'email':
        if (!value || typeof value !== 'string' || !value.trim()) {
          return 'El email es obligatorio';
        } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
          return 'El email no es válido.';
        }
        break;
      case 'enrollment_center':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'El centro es obligatorio';
        }
        break;
      case 'province_id':
        if (!value) return 'Selecciona una provincia';
        break;
      case 'cycle_id':
        if (!value) return 'Selecciona un ciclo';
        break;
      case 'modality_id':
        if (!value) return 'Selecciona una modalidad';
        break;
      case 'status':
        if (!value) return 'Selecciona un estado';
        break;
    }

    return '';
  };

  const validateCurrentCompanyForm = (form: CurrentCompany) => {
    const errors: Record<string, string> = {};

    if (form.company_id) {
      if (!form.cycle_id) {
        errors.cycle_id = 'Selecciona un ciclo';
      }
      if (!form.start_date) {
        errors.start_date = 'Selecciona una fecha de inicio';
      }
      if (!form.end_date) {
        errors.end_date = 'Selecciona una fecha de finalización';
      }
      if (!form.result) {
        errors.result = 'Selecciona un resultado';
      }
    }

    return errors;
  };

  const validateCurrentCompanyField = (
    field: keyof CurrentCompany,
    value: string | number | null
  ) => {
    switch (field) {
      case 'cycle_id':
        if (!value) return 'Selecciona un ciclo';
        break;
      case 'start_date':
        if (!value) return 'Selecciona una fecha de inicio';
        break;
      case 'end_date':
        if (!value) return 'Selecciona una fecha de finalización';
        break;
      case 'result':
        if (!value) return 'Selecciona un resultado';
        break;
    }

    return '';
  };

  return {
    validateAlumnForm,
    validateAlumnField,
    validateCurrentCompanyForm,
    validateCurrentCompanyField,
  };
}
