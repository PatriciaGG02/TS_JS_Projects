<script setup lang="ts">
  import { defineProps } from 'vue';
  import type { CompanyWithCycles } from '@/types/company';

  const props = defineProps<{
    companyData: CompanyWithCycles[];
  }>();
</script>

<template>
  <div
    class="border-2 border-primary shadow-md bg-white mt-5 rounded-2xl overflow-hidden h-full pb-15"
  >
    <div>
      <table class="w-full divide-y divide-gray-200 table-fixed">
        <thead
          class="bg-primary text-white uppercase text-2xs font-bold tracking-wider text-left"
        >
          <tr>
            <th class="px-6 py-3 w-1/5">Nombre</th>
            <th class="px-6 py-3 w-1/5">CIF</th>
            <th class="px-6 py-3 w-1/5">Dirección</th>
            <th class="px-6 py-3 w-1/5">Contacto</th>
            <th class="px-6 py-3 w-1/5">Estado</th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="overflow-y-auto h-full">
      <table class="w-full table-fixed divide-y divide-gray-200">
        <tr
          v-for="(companyItem, index) in props.companyData"
          :key="index"
          class="hover:bg-gray-100"
        >
          <td class="px-6 py-4 whitespace-nowrap w-1/5">
            <router-link
              :to="`/company/${companyItem.id}`"
              class="text-blue-600 hover:underline"
            >
              {{ companyItem.name }}
            </router-link>
          </td>
          <td class="px-6 py-4 w-1/5">{{ companyItem.cif }}</td>
          <td class="px-6 py-4 w-1/5">
            {{ companyItem.address || 'Sin dirección' }}
          </td>
          <td class="px-6 py-4 w-1/5">
            <a
                :href="'mailto:' + companyItem.email"
                class="text-blue-500 hover:underline"
                >{{ companyItem.email }}</a
              ><br />
            {{ companyItem.phone }}
          </td>
          <td class="px-6 py-4 w-1/5">
            <span
              :class="
                companyItem.active
                  ? 'text-green-600 font-semibold'
                  : 'text-red-500 font-semibold'
              "
            >
              {{ companyItem.active ? 'Disponible' : 'No disponible' }}
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
