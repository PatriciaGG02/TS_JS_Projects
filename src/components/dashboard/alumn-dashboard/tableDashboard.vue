<script setup lang="ts">
  import type { Alumn } from '@/types/alumn';
  import { computed } from 'vue';

  // Definimos los props y los hacemos required
  const props = defineProps<{
    alumnData: Alumn[];
  }>();

  // Creamos una referencia directa a los datos
  const alumn = computed(() => props.alumnData);
</script>

<template>
  <div
    class="border-2 border-primary shadow-md bg-white mt-5 rounded-2xl overflow-hidden h-full pb-15"
  >
    <div>
      <table class="w-full divide-y divide-gray-200 table-fixed">
        <thead
          class="bg-primary text-white uppercase tracking-wider font-bold text-2xs text-left"
        >
          <tr>
            <th class="px-6 py-3">Nombre</th>
            <th class="px-6 py-3">DNI</th>
            <th class="px-6 py-3">Contacto</th>
            <th class="px-6 py-3">Empresa</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="overflow-y-auto h-full">
      <table class="w-full divide-y divide-gray-200 table-fixed">
        <tbody class="bg-white divide-y divide-gray-200 text-left">
          <tr
            v-for="alumno in alumn"
            :key="alumno.id"
            class="hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <router-link
                :to="`/alumn/${alumno.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ alumno.name }}
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ alumno.dni }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <a
                :href="'mailto:' + alumno.email"
                class="text-blue-500 hover:underline"
                >{{ alumno.email }}</a
              > <br />
              {{ alumno.phone }}
            </td>
            <td
              id="company_id"
              class="px-6 py-4 whitespace-nowrap"
            >
              <router-link
              class="text-blue-600 hover:underline cursor-pointer"
                :to="`/company/${alumno.company_id}`"
                v-if="alumno.company_id"
              >
                {{ alumno.company_name }}
              </router-link>
              <span v-else class="text-gray-600">Sin empresa</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
