<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import MultiSelect from '../company-dashboard/MultiSelect.vue';

  const emit = defineEmits<{
    (e: 'filterCompany', value: string): void;
    (e: 'filterModality', value: string): void;
    (e: 'filterCycle', value: string[]): void;
    (e: 'filterProvince', value: string): void;
    (e: 'filterSearch', value: string): void;
    (e: 'resetFilters'): void;
  }>();

  const props = defineProps<{
    companies: { id: string; name: string }[];
    modalities: { id: string; name: string }[];
    cycles: { id: string; name: string }[];
    provinces: { id: string; name: string }[];
    selectedCompany: string;
    selectedModality: string;
    selectedCycles: string[];
    selectedProvince: string;
    searchTerm: string;
  }>();

  const resetFilters = () => {
    emit('resetFilters');
  };
</script>

<template>
  <aside class="bg-white border-r shadow p-6 flex flex-col gap-4">
    <h2 class="text-xl font-bold">Filtros</h2>

    <div>
      <label for="search" class="block font-medium text-gray-700 mb-1"

        >Buscar</label
      >
      <input
        :value="props.searchTerm"
        id="search"
        type="text"
        placeholder="Buscar por nombre, email o dni"
        class="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        @input="
          (e) =>
            emit('filterSearch', (e.target as HTMLInputElement)?.value ?? '')
        "
      />
    </div>

    <div>
      <label
        for="company-select"
        class="block font-medium text-gray-700 mb-1"
        >Empresa</label
      >
      <select
        :value="props.selectedCompany"
        id="company-select"
        class="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        @change="
          (e) =>
            emit('filterCompany', (e.target as HTMLSelectElement)?.value ?? '')
        "
      >
        <option value="">Todas</option>
        <option
          v-for="company in props.companies"
          :key="company.id"
          :value="company.id"
        >
          {{ company.name }}
        </option>
      </select>
    </div>

    <div>
      <label
        for="modality-select"
        class="block font-medium text-gray-700 mb-1"
        >Modalidad</label
      >
      <select
        :value="props.selectedModality"
        id="modality-select"
        class="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        @change="
          (e) =>
            emit('filterModality', (e.target as HTMLSelectElement)?.value ?? '')
        "
      >
        <option value="">Todas</option>
        <option
          v-for="modality in props.modalities"
          :key="modality.id"
          :value="modality.id"
        >
          {{ modality.name }}
        </option>
      </select>
    </div>

    <div>
      <MultiSelect
        :options="props.cycles"
        :modelValue="props.selectedCycles"
        label="Ciclos"
        placeholder="Todas"
        @update:modelValue="(val) => emit('filterCycle', val)"
      />
    </div>

    <div>
      <label
        for="province-select"
        class="block font-medium text-gray-700 mb-1"
        >Provincia</label
      >
      <select
        :value="props.selectedProvince"
        id="province-select"
        class="w-full border border-gray-300 rounded px-3 py-1 text-sm"
        @change="
          (e) =>
            emit('filterProvince', (e.target as HTMLSelectElement)?.value ?? '')
        "
      >
        <option value="">Todas</option>
        <option
          v-for="province in props.provinces"
          :key="province.id"
          :value="province.id"
        >
          {{ province.name }}
        </option>
      </select>
    </div>

    <button
      @click="resetFilters"
      class="mt-auto bg-gray-200 hover:cursor-pointer hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl text-2xs"
    >
      Reiniciar filtros
    </button>
  </aside>
</template>
