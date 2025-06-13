<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { computed } from 'vue';
  import { useAuth } from '@/composables/useAuth';

  const route = useRoute();
  const router = useRouter();
  const { logout } = useAuth();

  //Comprobar en que ruta estamos
  const isAlumnActive = computed(() => route.path.includes('/dashboard/alumn'));

  const isCompanyActive = computed(() =>
    route.path.includes('/dashboard/company')
  );

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    await logout();
    router.push('/');
  };
</script>

<template>
  <header
    class="no-print col-span-2 w-full h-[100px] flex bg-primary items-center justify-between"
  >
    <img src="../../assets/logo-basic.png" alt="Logo de Medac" width="168" />
    <div
      class="relative flex justify-end w-[750px] text-center font-bold not-supports-[display:grid]:flex"
    >
      <router-link to="/dashboard/alumn">
        <button
          :class="[
            'w-[200px] h-[100px] px-4 text-[19px] hover:text-[20px] cursor-pointer hover:not-focus:bg-secondary',
            isAlumnActive
              ? 'bg-gray-light text-black'
              : 'bg-primary text-white hover:bg-orange-600',
          ]"
        >
          Alumnas/os
        </button>
      </router-link>

      <router-link to="/dashboard/company">
        <button
          :class="[
            'w-[200px] h-[100px] px-4 text-[19px] hover:text-[20px] cursor-pointer hover:not-focus:bg-secondary',
            isCompanyActive
              ? 'bg-gray-light text-black'
              : 'bg-primary text-white hover:text-black hover:bg-orange-600',
          ]"
        >
          Empresas
        </button>
      </router-link>
      <button
        class="w-[200px] h-[100px] text-white px-4 bg-gray-600 hover:bg-red-600 hover:not-focus:bg-danger hover:text-black text-[19px] hover:text-[20px] cursor-pointer"
        @click="cerrarSesion"
      >
        Cerrar sesión
      </button>
    </div>
  </header>
</template>
