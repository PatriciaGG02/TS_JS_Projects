<script setup lang="ts">
  import { inject, computed, ref, onMounted } from 'vue';
  import type { CompanyWithCycles } from '@/types/company';
  import CompanySidebarFilters from './CompanySidebarFilters.vue';
  import tableCompanyDashboard from './tableCompanyDashboard.vue';
  import { useSelectOptions } from '@/composables/useSelectOptions';
  import AddCompanyButton from './AddCompanyButton.vue';

  const company = (inject('company') as CompanyWithCycles[]) ?? [];

  const selectedModality = ref('');
  const selectedCycle = ref<string[]>([]);
  const selectedProvince = ref('');
  const selectedStatus = ref<boolean | ''>('');
  const searchTerm = ref('');

  const { getSelectOptions, provincesData, cyclesData, modalitiesData } =
    useSelectOptions();

  onMounted(() => {
    getSelectOptions();
  });

  const updateFilter = (type: string, value: any) => {
    switch (type) {
      case 'modality':
        selectedModality.value = value;
        break;
      case 'cycle':
        selectedCycle.value = value;
        break;
      case 'province':
        selectedProvince.value = value;
        break;
      case 'status':
        selectedStatus.value = value;
        break;
      case 'search':
        searchTerm.value = value;
        break;
    }
  };

  const resetFilters = () => {
    selectedModality.value = '';
    selectedCycle.value = [];
    selectedProvince.value = '';
    selectedStatus.value = '';
    searchTerm.value = '';
  };

  const modalities = computed(() =>
    (modalitiesData.value || []).map((a) => ({ id: a.value, name: a.label }))
  );

  const cycles = computed(() =>
    (cyclesData.value || []).map((a) => ({ id: a.value, name: a.label }))
  );

  const provinces = computed(() =>
    (provincesData.value || []).map((a) => ({ id: a.value, name: a.label }))
  );

  const filteredCompanies = computed(() => {
    const normalizedSearch = searchTerm.value.toLowerCase().trim();

    return company.filter((c) => {
      const matchModality =
        !selectedModality.value || c.modality_id === selectedModality.value;

      const matchCycle =
        selectedCycle.value.length === 0 ||
        c.cycles.some((cycle) => selectedCycle.value.includes(cycle.id));

      const matchProvince =
        !selectedProvince.value || c.province_id === selectedProvince.value;

      const matchStatus =
        selectedStatus.value === '' || c.active === selectedStatus.value;

      const matchSearch =
        !normalizedSearch ||
        [c.name, c.cif, c.address, c.phone, c.email]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedSearch));

      return (
        matchModality &&
        matchCycle &&
        matchProvince &&
        matchStatus &&
        matchSearch
      );
    });
  });
</script>

<template>
  <CompanySidebarFilters
    :modalities="modalities"
    :cycles="cycles"
    :provinces="provinces"
    :selectedModality="selectedModality"
    :selectedCycle="selectedCycle"
    :selectedProvince="selectedProvince"
    :searchTerm="searchTerm"
    @filterModality="updateFilter('modality', $event)"
    @filterCycle="updateFilter('cycle', $event)"
    @filterProvince="updateFilter('province', $event)"
    @filterStatus="updateFilter('status', $event)"
    @filterSearch="updateFilter('search', $event)"
    @resetFilters="resetFilters"
  />
  <div class="flex flex-col p-3 h-full overflow-hidden">
    <AddCompanyButton />
    <tableCompanyDashboard :companyData="filteredCompanies" />
  </div>
</template>
