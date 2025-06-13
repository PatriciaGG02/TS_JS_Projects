<script lang="ts" setup>
  import { inject, ref, watch } from 'vue';
  import type { CurrentCompany } from '@/types/alumnData';
  import { useStatusColor } from '@/composables/useCommon';
  import Modal from '@/components/common/Modal.vue';
  import CompanyForm from './CompanyForm.vue';


  const modalCurrentCompany = ref();

  function openCurrentCompanyModal() {
    modalCurrentCompany.value?.openModal();
  }

  const currentCompany = inject('currentCompanyData') as CurrentCompany;

  // Variable para manejar el color
  const statusColor = ref('bg-gray-500');

  const { colorByStatusResult } = useStatusColor(currentCompany.result);
  statusColor.value = colorByStatusResult.value;

  watch(
    () => currentCompany.result,
    (newStatus) => {
      if (newStatus) {
        const { colorByStatusResult } = useStatusColor(newStatus);
        statusColor.value = colorByStatusResult.value;
      }
    }
  );
</script>
<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-800">🏢 Empresa actual</h1>
    <div
      @click="openCurrentCompanyModal"
      class="flex items-center justify-center p-2 rounded-2xl bg-gray-200 gap-2 cursor-pointer font-semibold hover:bg-gray-300"
    >
      <img
        src="../../assets/edit-icon.png"
        alt="icono de editar"
        class="size-5 cursor-pointer"
      />
      <button class="text-[0.9rem] cursor-pointer">Editar</button>
    </div>
  </div>
  <ul class="text-gray-700 space-y-2 mt-3">
    <li>
      <div class="flex items-center cursor-pointer">
        <img
          src="../../assets/external-link-icon.png"
          alt="icono de enlace externo"
          width="15"
          class="h-fit inline mr-3"
        />
        <router-link :to="`/company/${currentCompany.company_id}`"
          ><strong class="underline truncate">{{
            currentCompany.company
          }}</strong></router-link
        >
      </div>
    </li>
    <li><strong>Ciclo:</strong> {{ currentCompany.cycle }}</li>
    <li><strong>Fecha de inicio:</strong> {{ currentCompany.start_date }}</li>
    <li><strong>Fecha fin:</strong> {{ currentCompany.end_date }}</li>
    <li>
      <strong>Resultado:</strong>
      <span
        class="ml-2 px-3 py-1 text-sm font-semibold text-white rounded-full"
        :class="statusColor"
        >{{
          currentCompany.result
            ? currentCompany.result.charAt(0).toUpperCase() +
              currentCompany.result.slice(1)
            : 'NULL'
        }}</span
      >
    </li>
  </ul>
  <Modal ref="modalCurrentCompany" title="Modificar empresa del alumn@">
    <CompanyForm @close="modalCurrentCompany?.closeModal()" />
  </Modal>
</template>
