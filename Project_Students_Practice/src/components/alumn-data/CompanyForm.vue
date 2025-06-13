<script lang="ts" setup>
  import { inject, onMounted, reactive, ref, watch } from 'vue';
  import { normalize } from '@/composables/useCommon';
  import type { Option } from 'vue3-select-component';
  import VueSelect from 'vue3-select-component';
  import type { AlumnData, CurrentCompany } from '@/types/alumnData';
  import { useAllCompanyData } from '@/composables/useAllCompanyData';
  import { useCyclesOptions } from '@/composables/useCyclesOptions';
  import { useValidation } from '@/composables/useValidation';
  import {
    deleteCurrentCompany,
    updateCurrentCompanyData,
  } from '@/services/alumn-data';

  const emit = defineEmits(['close', 'dataSaved']);

  const errors = reactive<Record<string, string>>({});

  //Carga
  const isLoading = ref<boolean>(false);

  //Datos del formulario
  const currentCompanyData = inject('currentCompanyData') as CurrentCompany;
  const currentCompanyForm = reactive({
    ...currentCompanyData,
  });

  const alumnData = inject('alumnData') as AlumnData;

  const alumn_id = ref(alumnData.id);

  const updateHasCompany = inject('updateHasCompany') as (
    newValue: boolean
  ) => void;

  // Datos de las compañías
  const { allCompanyOptions, getAllCompanyData } = useAllCompanyData();

  //Datos de los grados
  const { getCyclesOptions, cyclesOptions } = useCyclesOptions();

  //Validación
  const { validateCurrentCompanyForm, validateCurrentCompanyField } =
    useValidation();

  onMounted(async () => {
    getCyclesOptions();
    await getAllCompanyData();

    allCompanyOptions.value = allCompanyOptions.value
      .filter((company: any) => company.active)
      .map((company: any) => ({
        label: `${company.name} - ${company.province} - ${company.cif}`,
        value: company.value,
        name: `${company.name}`,
      }));

    allCompanyOptions.value.unshift({
      label: 'Sin empresa',
      value: null,
    });
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
    console.log(allCompanyOptions);
    isLoading.value = true;
    try {
      if (currentCompanyForm.company_id) {
        const validationErrors = validateCurrentCompanyForm(currentCompanyForm);
        Object.assign(errors, validationErrors);

        if (Object.keys(errors).length === 0) {
          console.log(alumn_id.value);
          // Eliminar datos inncesarios para guardar en la DB y guardarlo
          const { cycle, company, ...validCurrentCompanyData } =
            currentCompanyForm as any;
          validCurrentCompanyData.alumn_id = alumn_id.value;
          const response = await updateCurrentCompanyData(
            validCurrentCompanyData
          );
          if (response.success) {
            console.log(currentCompanyForm);
            Object.assign(currentCompanyData, currentCompanyForm);
            currentCompanyData.id = String(response.id);
            updateHasCompany(true);
            emit('close');
            emit('dataSaved', 'Datos guardados correctamente');
          }
        } else {
          console.log('Errores:', errors);
        }
      } else {
        try {
          const isDeleted = await deleteCurrentCompany(currentCompanyForm.id);
          if (isDeleted) {
            updateHasCompany(false);
            currentCompanyData.id = '';
            currentCompanyData.company = '';
            currentCompanyData.cycle = '';
            currentCompanyData.company_id = '';
            currentCompanyData.cycle_id = '';
            currentCompanyData.end_date = '';
            currentCompanyData.start_date = '';
            currentCompanyData.result = '';
            emit('dataSaved', 'La empresa ha sido eliminada.');
            emit('close');
          }
        } catch (error) {
          console.error('Error al eliminar la empresa:', error);
        }
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleInputChange = (
    field: keyof CurrentCompany,
    value: string | number | null
  ) => {
    const error = validateCurrentCompanyField(field, value);
    if (error) {
      errors[field] = error;
    } else {
      delete errors[field];
    }
  };

  // Cambiar los campos "_name" de modality, province y cycle.
  watch(
    () => [currentCompanyForm.company_id, currentCompanyForm.cycle_id],
    ([newCompanyId, newCycleId]) => {
      if (newCompanyId) {
        const selectedCompany = allCompanyOptions.value.find(
          (company) => company.value === newCompanyId
        );
        if (selectedCompany) {
          currentCompanyForm.company = selectedCompany.name;
        }
        if (newCycleId) {
          const selectedCycle = cyclesOptions.value.find(
            (cycle) => cycle.value === newCycleId
          );
          if (selectedCycle) {
            currentCompanyForm.cycle = selectedCycle.label;
          }
        }
      }
    },
    { immediate: true }
  );

  const isMenuOpen  = ref(false);

  function handleMenuOpen() {
    isMenuOpen .value = true;
  }

  function handleMenuClose() {
    isMenuOpen .value = false;
  }
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-4 min-w-[50vw] synoptic_table"
    :class="{ 'min-h-[35vh]': isMenuOpen  }"
  >
    <div>
      <label class="block font-semibold"
        >Empresa <span class="text-secondary">*</span></label
      >
      <VueSelect
        v-model="currentCompanyForm.company_id"
        :options="allCompanyOptions"
        :filter-by="customFilter"
        placeholder="Selecciona una empresa (Nombre - Provincia - NIF)"
        class="custom-select"
        @menu-opened="handleMenuOpen()"
        @menu-closed="handleMenuClose()"
      />
    </div>
    <fieldset
      v-if="currentCompanyForm.company_id"
      class="border-1 p-5 pb-8 rounded-2xl border-gray-700 mt-10"
    >
      <legend class="block font-semibold px-2">Datos de la práctica</legend>
      <div>
        <label class="block font-semibold"
          >Ciclo <span class="text-secondary">*</span></label
        >
        <VueSelect
          v-model="currentCompanyForm.cycle_id"
          :options="cyclesOptions"
          :filter-by="customFilter"
          placeholder="Selecciona un grado"
          class="custom-select"
          :class="{ 'select-error': errors.cycle_id }"
          @option-selected="
            handleInputChange('cycle_id', currentCompanyForm.cycle_id)
          "
        />
        <p v-if="errors.cycle_id" class="text-red-500 text-sm mt-1">
          {{ errors.cycle_id }}
        </p>
      </div>
      <div class="mt-8 flex gap-10">
        <div class="basis-1/3">
          <label class="block font-semibold"
            >Fecha de inicio <span class="text-secondary">*</span></label
          >
          <input
            v-model="currentCompanyForm.start_date"
            type="date"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.start_date }"
            @input="
              handleInputChange('start_date', currentCompanyForm.start_date)
            "
          />
          <p v-if="errors.start_date" class="text-red-500 text-sm mt-1">
            {{ errors.start_date }}
          </p>
        </div>
        <div class="basis-1/3">
          <label class="block font-semibold"
            >Fecha de fin <span class="text-secondary">*</span></label
          >
          <input
            v-model="currentCompanyForm.end_date"
            type="date"
            class="w-full border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.end_date }"
            @input="handleInputChange('end_date', currentCompanyForm.end_date)"
          />
          <p v-if="errors.end_date" class="text-red-500 text-sm mt-1">
            {{ errors.end_date }}
          </p>
        </div>
        <div class="basis-1/3">
          <label for="result" class="block font-semibold"
            >Resultado <span class="text-secondary">*</span></label
          >
          <select
            v-model="currentCompanyForm.result"
            class="w-fit border rounded px-4 py-2 border-gray-400"
            :class="{ 'border-red-500': errors.result }"
            id="result"
            @change="handleInputChange('result', currentCompanyForm.result)"
          >
            <option value="apto">Apto</option>
            <option value="no apto">No apto</option>
            <option value="pendiente">Pendiente</option>
          </select>
          <p v-if="errors.result" class="text-red-500 text-sm mt-1">
            {{ errors.result }}
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
