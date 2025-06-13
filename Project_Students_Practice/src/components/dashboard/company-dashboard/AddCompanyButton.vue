<script setup lang="ts">
  import Modal from '@/components/common/Modal.vue';
  import { ref } from 'vue';
  import AddCompany from './AddCompany.vue';

  const modalAddCompany = ref();

  function openAddCompanyModal() {
    modalAddCompany.value?.openModal();
  }
</script>

<template>
  <Modal ref="modalAddCompany" title="Añadir nueva empresa">
    <AddCompany @close="modalAddCompany?.closeModal()" />
  </Modal>
  <button
    @click="openAddCompanyModal"
    class="w-[10vW] self-end font-bold text-center text-xl bg-white cursor-pointer hover:bg-gray-300 ring-2 ring-primary p-2 rounded-2xl shadow-2xl"
  >
    Insertar empresa
  </button>
</template>
