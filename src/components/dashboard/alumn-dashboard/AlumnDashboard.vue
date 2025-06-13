<script setup lang="ts">
  import { inject, computed, ref, onMounted } from 'vue';
  import type { Alumn } from '@/types/alumn.d.ts';
  import AlumnSidebarFilters from './AlumnSidebarFilters.vue';
  import tableDashboard from './tableDashboard.vue';
  import { useAllCompanyData } from '@/composables/useAllCompanyData';
  import { useSelectOptions } from '@/composables/useSelectOptions';
  import AddAlumnButton from './addAlumnButton.vue';

  const alumnData = inject('alumn') as Alumn[];

  const selectedCompany = ref('');
  const selectedModality = ref('');
  const selectedCycles = ref<string[]>([]);
  const selectedProvince = ref('');
  const searchTerm = ref('');

  const { allCompanyOptions, getAllCompanyData } = useAllCompanyData();
  const { getSelectOptions, provincesData, cyclesData, modalitiesData } =
    useSelectOptions();

  onMounted(() => {
    getAllCompanyData();
    getSelectOptions();
  });

  const updateFilter = (type: string, value: any) => {
    switch (type) {
      case 'company':
        selectedCompany.value = value;
        break;
      case 'modality':
        selectedModality.value = value;
        break;
      case 'cycle':
        selectedCycles.value = value;
        break;
      case 'province':
        selectedProvince.value = value;
        break;
      case 'search':
        searchTerm.value = value;
        break;
    }
  };

  const resetAllFilters = () => {
    selectedCompany.value = '';
    selectedModality.value = '';
    selectedCycles.value = [];
    selectedProvince.value = '';
    searchTerm.value = '';
  };

  const companies = computed(() => [
    { id: 'null', name: 'Sin empresa' },
    ...allCompanyOptions.value.map((a) => ({ id: a.value, name: a.name })),
  ]);

  const modalities = computed(() =>
    modalitiesData.value
      .filter((a) => a.value && a.label)
      .map((a) => ({ id: a.value, name: a.label }))
  );

  const cycles = computed(() =>
    cyclesData.value
      .filter((a) => a.value && a.label)
      .map((a) => ({ id: a.value, name: a.label }))
  );

  const provinces = computed(() =>
    provincesData.value
      .filter((a) => a.value && a.label)
      .map((a) => ({ id: a.value, name: a.label }))
  );

  const filteredAlumns = computed(() => {
    const normalizedSearch = searchTerm.value.toLowerCase().trim();

    return alumnData.filter((alumn) => {
      const matchCompany =
        !selectedCompany.value ||
        (selectedCompany.value === 'null' && !alumn.company_id) ||
        alumn.company_id === selectedCompany.value;

      const matchModality =
        !selectedModality.value || alumn.modality_id === selectedModality.value;

      const matchCycle =
        selectedCycles.value.length === 0 ||
        selectedCycles.value.includes(alumn.cycle_id ?? '');

      const matchProvince =
        !selectedProvince.value || alumn.province_id === selectedProvince.value;

      const matchSearch =
        !normalizedSearch ||
        alumn.name?.toLowerCase().includes(normalizedSearch) ||
        alumn.email?.toLowerCase().includes(normalizedSearch) ||
        alumn.dni?.toLowerCase().includes(normalizedSearch) ||
        alumn.phone?.toLowerCase().includes(normalizedSearch) ||
        alumn.company_name?.toLowerCase().includes(normalizedSearch);

      return (
        matchCompany &&
        matchModality &&
        matchCycle &&
        matchProvince &&
        matchSearch
      );
    });
  });
</script>

<template>
  <AlumnSidebarFilters
    :companies="companies"
    :modalities="modalities"
    :cycles="cycles"
    :provinces="provinces"
    :selectedCompany="selectedCompany"
    :selectedModality="selectedModality"
    :selectedCycles="selectedCycles"
    :selectedProvince="selectedProvince"
    :searchTerm="searchTerm"
    @filterCompany="(val) => updateFilter('company', val)"
    @filterModality="(val) => updateFilter('modality', val)"
    @filterCycle="(val) => updateFilter('cycle', val)"
    @filterProvince="(val) => updateFilter('province', val)"
    @filterSearch="(val) => updateFilter('search', val)"
    @resetFilters="resetAllFilters"
  />
  <div class="flex flex-col p-3 h-full overflow-hidden">
    <AddAlumnButton
      :alumnData="filteredAlumns"
      @alumnAdded="(nuevo) => filteredAlumns.push(nuevo)"
    />
    <tableDashboard :alumnData="filteredAlumns" />
  </div>
</template>
