<script setup lang="ts">
  import { provide, onMounted } from 'vue';
  import { useCompany } from '@/composables/useCompany';
  import HeaderDashboard from '@/components/common/HeaderDashboard.vue';
  import CompanyDashboard from '@/components/dashboard/company-dashboard/CompanyDashboard.vue';

  const { company, getCompany } = useCompany();

  onMounted(() => {
    getCompany();
  });

  //Proporcionar la info a los hijos y nietos...
  provide('company', company);
</script>

<template>
 <div class="grid grid-rows-[auto_1fr] grid-cols-[15%_1fr] h-[100vh] bg-gray-light">
  <HeaderDashboard />
  <CompanyDashboard />
</div>
</template>
