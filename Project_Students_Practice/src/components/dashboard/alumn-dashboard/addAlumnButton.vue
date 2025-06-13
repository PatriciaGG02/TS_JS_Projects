<script setup lang="ts">
  import Modal from '@/components/common/Modal.vue';
  import { ref } from 'vue';
  import addAlumn from './addAlumn.vue';

  const modalAddAlumn = ref();

  function openAddAlumnModal() {
    // Open the modal when the button is clicked
    modalAddAlumn.value?.openModal();
  }
</script>

<template>
  <Modal ref="modalAddAlumn" title="Añadir alumnos"
    ><addAlumn @close="modalAddAlumn?.closeModal()"
  /></Modal>
  <button
    class="self-end font-bold text-center text-xl w-[10vW] bg-white cursor-pointer hover:bg-gray-300 ring-2 ring-primary p-2 rounded-2xl shadow-2xl"
    @click="openAddAlumnModal"
  >
    Insertar alumna/o
  </button>
</template>
