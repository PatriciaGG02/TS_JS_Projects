<script lang="ts" setup>
  import AlumnInfo from './AlumnInfo.vue';
  import { computed, inject, provide, ref, } from 'vue';
  import CurrentCompany from './CurrentCompany.vue';
  import ActionButton from '@/components/common/ActionButton.vue';
  import type { AlumnData } from '@/types/alumnData';
  import Modal from '@/components/common/Modal.vue';
  import DeleteAlumn from './DeleteAlumn.vue';
  import CompanyForm from './CompanyForm.vue';

  const modalCurrentCompany = ref();

  function openCurrentCompanyModal() {
    modalCurrentCompany.value?.openModal();
  }

  const alumnData = inject('alumnData') as AlumnData;

  // Computed para manejar la reactividad de has_company
  const hasCompany = computed(() => alumnData.has_company);

  const modalDelete = ref();

  function openDeleteModal() {
    modalDelete.value?.openModal();
  }

  // Función para actualizar has_company
  const updateHasCompany = (newValue: boolean) => {
    alumnData.has_company = newValue;
  };

  provide('updateHasCompany', updateHasCompany);
</script>

<template>
  <main
    class="w-full p-10 grid grid-cols-[auto_auto] grid-rows-[auto_auto_auto_auto] align-center gap-x-10 gap-y-5"
  >
    <section class="flex h-fit gap-6 items-center">
      <div
        @click="$router.back"
        class="bg-white rounded-full no-print relative w-[45px] h-[45px] cursor-pointer hover:bg-gray-300 border-2 border-gray-400 transition-all"
      >
        <img
          class="absolute top-[2px] left-[3px]"
          src="../../assets/return.png"
          alt="icono de volver atrás"
          width="40"
        />
      </div>
      <div>
        <p class="bg-primary py-4 px-6 rounded-2xl text-2xl text-white">
          {{ alumnData.full_name }}
        </p>
      </div>
    </section>
    <section class="no-print flex gap-4 h-fit justify-end">
      <ActionButton @click="openDeleteModal"> Eliminar alumn@ </ActionButton>
    </section>
    <AlumnInfo />
    <section
      class="page-break text-xl synoptic_table w-full max-w-full overflow-hidden"
    >
      <CurrentCompany v-if="hasCompany" />
      <div v-else>
        <h1 class="text-2xl font-bold text-gray-800">🏢 Empresa actual</h1>
        <p class="mt-4 mb-10">
          {{ alumnData.full_name }} no tiene una empresa asignada en este
          momento
        </p>
        <div
          @click="openCurrentCompanyModal"
          class="flex items-center justify-center p-2 rounded-2xl bg-gray-200 gap-2 cursor-pointer font-semibold hover:bg-gray-300"
        >
          <img
            src="../../assets/add-icon.png"
            alt="icono de editar"
            class="size-6 cursor-pointer"
          />
          <button class="text-[0.9rem] cursor-pointer">Añadir empresa</button>
        </div>
      </div>
    </section>
    <Modal ref="modalDelete" title="¿Seguro que quieres borrar este alumn@?">
      <DeleteAlumn @close="modalDelete?.closeModal()" />
    </Modal>
    <Modal ref="modalCurrentCompany" title="Modificar empresa del alumn@">
      <CompanyForm @close="modalCurrentCompany?.closeModal()" />
    </Modal>
    <section
      class="no-print col-span-full flex h-fit justify-center items-center"
    >
      <div>
        <button
          class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-2xl hover:font-bold hover:bg-blue-600 min-w-[20vw] font-semibold"
        >
          Descargar PDF
        </button>
      </div>
    </section>
  </main>
</template>

<style>
  @media print {
    .no-print {
      display: none;
    }

    .page-break {
      page-break-after: always;
    }
  }
</style>
