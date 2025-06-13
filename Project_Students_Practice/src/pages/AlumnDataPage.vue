<template>
  <div class="bg-gray-light grid grid-cols-[1fr] grid-rows-[auto_1fr] h-[100%] min-h-[100vh]">
    <HeaderDashboard class="no-print"/>
    <AlumnData />
  </div>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { onMounted, provide, watch } from 'vue';
  import AlumnData from '@/components/alumn-data/AlumnData.vue';
  import { useAlumnData } from '@/composables/useAlumnData';
  import { useCurrentCompanyData } from '@/composables/useCurrentCompanyData';
  import HeaderDashboard from '@/components/common/HeaderDashboard.vue';
  // Id del alumno de la URL
  const route = useRoute();
  const id = route.params.id as string;
  

  // Información del alumno
  const { alumnData, getAlumnData } = useAlumnData(id);

  // Información de la empresa
  const { currentCompanyData, getCurrentCompanyData } =
    useCurrentCompanyData(id);

  // Proporcionar la info a los hijos y nietos
  provide('currentCompanyData', currentCompanyData);
  provide('alumnData', alumnData);

  // Llamamos a las funciones cuando el componente se monta
  onMounted(() => {
    getAlumnData();
  });

  // Esperar a los datos del alumno y ver si tiene una empresa
  watch(
    () => alumnData.status,
    async () => {
      const hasCompany = await getCurrentCompanyData();
      if (hasCompany) {
        alumnData.has_company = true;
      }
    }
  );
</script>
