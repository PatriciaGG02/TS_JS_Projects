<script setup lang="ts">
  import { provide } from 'vue';
  import { useAlumn } from '@/composables/useAlumn';
  import AlumnDashboard from '@/components/dashboard/alumn-dashboard/AlumnDashboard.vue';
  import HeaderDashboard from '@/components/common/HeaderDashboard.vue';

  const { alumn, getAlumn } = useAlumn();

  // Proporcionar la referencia reactiva
  provide('alumn', alumn);

  // Cargar los datos inmediatamente
  getAlumn();
</script>

<template>
  <div
    class="grid grid-rows-[auto_1fr] grid-cols-[15%_1fr] h-[100vh] bg-gray-light"
  >
    <HeaderDashboard />
    <AlumnDashboard />
  </div>
</template>
