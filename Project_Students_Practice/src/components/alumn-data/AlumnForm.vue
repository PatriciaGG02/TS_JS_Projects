<script lang="ts" setup>
  import { inject, onMounted, reactive, ref, watch } from 'vue';
  import type { AlumnData } from '@/types/alumnData';
  import VueSelect, { type Option } from 'vue3-select-component';
  import { normalize } from '@/composables/useCommon';
  import { useSelectOptions } from '@/composables/useSelectOptions';
  import { useValidation } from '@/composables/useValidation';
  import {
    checkEmailExists,
    checkPhoneExists,
    updateAlumnData,
  } from '@/services/alumn-data';

  const { provincesData, modalitiesData, cyclesData, getSelectOptions } =
    useSelectOptions();

  const statusData = [
    { label: 'Cursando', value: 'cursando' },
    { label: 'Finalizado', value: 'finalizado' },
    { label: 'A la espera', value: 'a la espera' },
    { label: 'Sin empresa', value: 'sin empresa' },
  ];

  const emit = defineEmits(['close', 'dataSaved']);

  const alumnData = inject('alumnData') as AlumnData;

  const { validateAlumnForm, validateAlumnField } = useValidation();

  const errors = reactive<Record<string, string>>({});

  const alumnDataForm = reactive({
    ...alumnData,
  });

  //Carga
  const isLoading = ref<boolean>(false);

  onMounted(() => {
    getSelectOptions();
  });

  // Función para eliminar tildes y mayus en el filtro en el select
  //Extraer lógica?
  const customFilter = (
    _option: Option<string>,
    label: string,
    search: string
  ) => {
    return normalize(label).includes(normalize(search));
  };

  const handleSubmit = async () => {
    isLoading.value = true;
    try {
      const validationErrors = validateAlumnForm(alumnDataForm);
      Object.assign(errors, validationErrors);

      if (alumnDataForm.id) {
        const emailExists = await checkEmailExists(
          alumnDataForm.email,
          alumnDataForm.id
        );
        
        //Chequear si el email o el teléfono ya estan registrados
        if (emailExists) {
          errors.email = 'Este email ya está registrado por otro alumno.';
          return;
        }

        const phoneExists = await checkPhoneExists(
          alumnDataForm.phone,
          alumnDataForm.id
        );
        if (phoneExists) {
          errors.phone = 'Este teléfono ya está registrado por otro alumno.';
          return;
        }
      }

      //Comprobar si no hay errores
      if (Object.keys(errors).length === 0) {
        // Eliminar datos inncesarios para guardar en la DB y guardarlo
        const {
          cycle_name,
          full_name,
          modality_name,
          province_name,
          has_company,
          ...validAlumnData
        } = alumnDataForm;
        const response = await updateAlumnData(validAlumnData);
        if (response.success) {
          alumnDataForm.full_name =
            alumnDataForm.first_name +
            ' ' +
            alumnDataForm.last_name_1 +
            alumnDataForm.last_name_2;
          Object.assign(alumnData, alumnDataForm);
          emit('close');
          emit('dataSaved', 'Datos guardados correctamente');
        }
      } else {
        console.log('Errores:', errors);
      }
    } finally {
      isLoading.value = false;
    }
  };

  //Chequear errores cuando se escribe
  const handleInputChange = (
    field: keyof AlumnData,
    value: string | number | null
  ) => {
    const error = validateAlumnField(field, value);
    if (error) {
      errors[field] = error;
    } else {
      delete errors[field];
    }
  };

  // Cambiar los campos "_name" de modality, province y cycle.
  watch(
    () => [
      alumnDataForm.modality_id,
      alumnDataForm.province_id,
      alumnDataForm.cycle_id,
    ],
    ([newModalityId, newProvinceId, newCycleId]) => {
      if (newModalityId) {
        const selectedModality = modalitiesData.value.find(
          (modality) => modality.value === newModalityId
        );
        if (selectedModality) {
          alumnDataForm.modality_name = selectedModality.label;
        }
      }

      if (newProvinceId) {
        const selectedProvince = provincesData.value.find(
          (province) => province.value === newProvinceId
        );
        if (selectedProvince) {
          alumnDataForm.province_name = selectedProvince.label;
        }
      }

      if (newCycleId) {
        const selectedCycle = cyclesData.value.find(
          (cycle) => cycle.value === newCycleId
        );
        if (selectedCycle) {
          alumnDataForm.cycle_name = selectedCycle.label;
        }
      }
    },
    { immediate: true }
  );
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 min-w-[60vw]">
    <fieldset class="synoptic_table border-1 p-5 pb-8 rounded-2xl border-gray-700">
      <legend class="font-semibold px-2 bg-gray-100 rounded-lg border-2 border-gray-500">Datos personales</legend>
      <div class="flex gap-5">
        <div class="basis-1/3">
          <label for="name" class="block font-semibold"
            >Nombre <span class="text-secondary">*</span></label
          >
          <input
            v-model="alumnDataForm.first_name"
            id="name"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.first_name }"
            @input="handleInputChange('first_name', alumnDataForm.first_name)"
          />
          <p v-if="errors.first_name" class="text-red-500 text-sm mt-1">
            {{ errors.first_name }}
          </p>
        </div>
        <div class="basis-1/3">
          <label for="last_name" class="block font-semibold"
            >Primer apellido <span class="text-secondary">*</span></label
          >
          <input
            v-model="alumnDataForm.last_name_1"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.last_name_1 }"
            @input="handleInputChange('last_name_1', alumnDataForm.last_name_1)"
            id="last_name"
          />
          <p v-if="errors.last_name_1" class="text-red-500 text-sm mt-1">
            {{ errors.last_name_1 }}
          </p>
        </div>
        <div class="basis-1/3">
          <label name="last_name_2" class="block font-semibold"
            >Segundo apellido</label
          >
          <input
            v-model="alumnDataForm.last_name_2"
            class="w-full border rounded px-4 py-2 border-gray-400"
            placeholder="Opcional"
            id="last_name_2"
          />
        </div>
      </div>
      <div class="flex gap-5 mt-8">
        <div class="basis-1/4">
          <label name="dni" class="block font-semibold"
            >DNI <span class="text-secondary">*</span></label
          >
          <input
            v-model="alumnDataForm.dni"
            id="dni"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.dni }"
            @input="handleInputChange('dni', alumnDataForm.dni)"
          />
          <p v-if="errors.dni" class="text-red-500 text-sm mt-1">
            {{ errors.dni }}
          </p>
        </div>
        <div class="basis-1/4">
          <label class="block font-semibold"
            >Género <span class="text-secondary">*</span></label
          >
          <label>Hombre
          <input type="radio" name="gender" value="Hombre"
            v-model="alumnDataForm.gender"
            class=" border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.gender }"
            @change="handleInputChange('gender', alumnDataForm.gender)"
          /></label><br />
          <label>Mujer 
          <input type="radio" name="gender" value="Mujer"
            v-model="alumnDataForm.gender"
            class="ml-4 border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.gender }"
            @change="handleInputChange('gender', alumnDataForm.gender)"
          /></label>
          
          <p v-if="errors.gender" class="text-red-500 text-sm mt-1">
            {{ errors.gender }}
          </p>
        </div>
        <div class="basis-1/4">
          <label for="phone" class="block font-semibold"
            >Teléfono <span class="text-secondary">*</span></label
          >
          <input
            v-model="alumnDataForm.phone"
            id="phone"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.phone }"
            @input="handleInputChange('phone', alumnDataForm.phone)"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
            {{ errors.phone }}
          </p>
        </div>
        <div class="basis-2/4">
          <label class="block font-semibold" for="email"
            >Email <span class="text-secondary">*</span></label
          >
          <input
            v-model="alumnDataForm.email"
            id="email"
            type="email"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.email }"
            @input="handleInputChange('email', alumnDataForm.email)"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>
      </div>
    </fieldset>
    <fieldset class="synoptic_table border-1 p-5 pb-8 rounded-2xl border-gray-700">
      <legend class="font-semibold px-2 bg-gray-100 rounded-lg border-2 border-gray-500">Datos académicos</legend>
      <div class="flex gap-5">
        <div class="basis-1/3">
          <label class="block font-semibold" for="enrollment_center"
            >Centro <span class="text-secondary">*</span></label
          >
          <input
            v-model="alumnDataForm.enrollment_center"
            id="enrollment_center"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.enrollment_center }"
            @input="
              handleInputChange(
                'enrollment_center',
                alumnDataForm.enrollment_center
              )
            "
          />
          <p v-if="errors.enrollment_center" class="text-red-500 text-sm mt-1">
            {{ errors.enrollment_center }}
          </p>
        </div>
        <div class="basis-1/3">
          <label class="block font-semibold"
            >Provincia <span class="text-secondary">*</span></label
          >
          <VueSelect
            v-model="alumnDataForm.province_id"
            :options="provincesData"
            :filter-by="customFilter"
            placeholder="Selecciona una provincia"
            class="custom-select"
            :class="{ 'select-error': errors.province_id }"
            @option-selected="
              handleInputChange('province_id', alumnDataForm.province_id)
            "
          />
          <p v-if="errors.province_id" class="text-red-500 text-sm mt-1">
            {{ errors.province_id }}
          </p>
        </div>
        <div class="basis-1/3">
          <label class="block font-semibold"
            >Modalidad <span class="text-secondary">*</span></label
          >
          <VueSelect
            v-model="alumnDataForm.modality_id"
            :options="modalitiesData"
            :filter-by="customFilter"
            placeholder="Selecciona una modalidad"
            class="custom-select"
            :class="{ 'select-error': errors.modality_id }"
            @option-selected="
              handleInputChange('modality_id', alumnDataForm.modality_id)
            "
          />
          <p v-if="errors.modality_id" class="text-red-500 text-sm mt-1">
            {{ errors.modality_id }}
          </p>
        </div>
      </div>
      <div class="mt-8 flex gap-5">
        <div class="basis-2/3">
          <label class="block font-semibold"
            >Ciclo <span class="text-secondary">*</span></label
          >
          <VueSelect
            v-model="alumnDataForm.cycle_id"
            :options="cyclesData"
            :filter-by="customFilter"
            placeholder="Selecciona una ciclo"
            class="custom-select"
            :class="{ 'select-error': errors.cycle_id }"
            @option-selected="
              handleInputChange('cycle_id', alumnDataForm.cycle_id)
            "
          />
          <p v-if="errors.cycle_id" class="text-red-500 text-sm mt-1">
            {{ errors.cycle_id }}
          </p>
        </div>
        <div class="basis-1/3">
          <label class="block font-semibold"
            >Estado actual <span class="text-secondary">*</span></label
          >
          <VueSelect
            v-model="alumnDataForm.status"
            :options="statusData"
            :filter-by="customFilter"
            placeholder="Selecciona un estado"
            class="custom-select"
            :class="{ 'select-error': errors.status }"
            @option-selected="handleInputChange('status', alumnDataForm.status)"
          />
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">
            {{ errors.status }}
          </p>
        </div>
      </div>
    </fieldset>
    <div class="mt-6 gap-5 flex justify-center">
      <button
        type="submit"
        :disabled="isLoading"
        :class="{
          'bg-primary text-white px-4 py-2 cursor-pointer hover:outline-2 hover:outline-black rounded-xl w-[250px]':
            !isLoading,
          'bg-gray-400 text-white px-4 py-2 cursor-not-allowed rounded-xl w-[250px]':
            isLoading,
        }"
      >
        Guardar cambios
      </button>
      <button
        type="button"
        @click="emit('close')"
        class="bg-gray-600 text-white px-4 py-2 rounded-xl hover:outline-2 hover:outline-black cursor-pointer hover:bg-danger w-[250px]"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped>
  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f66e;
  }

  .custom-select {
    --vs-border: 1px solid oklch(70.7% 0.022 261.325);
    --vs-border-radius: 0.375rem;
    --vs-padding: 0.5rem 1rem;
    --vs-font-size: 1rem;
    --vs-text-color: #000000;
    --vs-placeholder-color: #6b7280;
  }

  .custom-select.select-error {
    --vs-border: 1px solid oklch(63.7% 0.237 25.331);
  }

  :deep(.single-value) {
    max-width: 50px;
  }
</style>
