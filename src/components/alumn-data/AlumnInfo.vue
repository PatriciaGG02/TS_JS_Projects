<script lang="ts" setup>
  import { inject, ref, watch } from 'vue';
  import type { AlumnData } from '@/types/alumnData';
  import { useStatusColor } from '@/composables/useCommon';
  import Modal from '@/components/common/Modal.vue';
  import AlumnForm from './AlumnForm.vue';

  const alumnData = inject('alumnData') as AlumnData;

  const modalAlumn = ref();

  function openAlumnModal() {
    modalAlumn.value?.openModal();
  }

  // Variable para manejar el color
  const statusColor = ref('bg-gray-500');

  // Observar los cambios en alumnData.status
  watch(
    () => alumnData.status,
    (newStatus) => {
      if (newStatus) {
        const { colorByStatusResult } = useStatusColor(newStatus);
        statusColor.value = colorByStatusResult.value;
      }
    }
  );
</script>

<template>
  <section class="synoptic_table text-xl w-full max-w-full overflow-hidden">
    <div class="flex items-start justify-between mb-4 flex-wrap gap-y-2">
      <div class="flex items-center gap-5 flex-wrap w-fit max-w-[80%]">
        <h2 class="text-2xl font-bold text-gray-800 truncate">
          👤
          {{ alumnData.full_name }}
        </h2>
        <span
          class="px-3 py-1 text-sm font-semibold h-fit w-fit text-white not-first:rounded-full"
          :class="statusColor"
        >
          {{
            alumnData.status.charAt(0).toUpperCase() + alumnData.status.slice(1)
          }}
        </span>
      </div>
      <div
        @click="openAlumnModal"
        class="flex justify-self-end items-center justify-center p-2 rounded-2xl bg-gray-200 gap-2 cursor-pointer font-semibold hover:bg-gray-300"
      >
        <img
          src="../../assets/edit-icon.png"
          alt="icono de editar"
          class="size-5 cursor-pointer"
        />
        <button class="text-[0.9rem] cursor-pointer">Editar</button>
      </div>
    </div>

    <ul class="text-gray-700 space-y-2 break-words">
      <li><strong>DNI:</strong> {{ alumnData.dni }}</li>
      <li>
        <strong>Email: </strong>
        <a
          :href="'mailto:' + alumnData.email"
          class="text-blue-500 hover:underline"
          >{{ alumnData.email }}</a
        >
      </li>
      <li><strong>Teléfono:</strong> {{ alumnData.phone }}</li>
      <li><strong>Centro:</strong> {{ alumnData.enrollment_center }}</li>
      <li><strong>Ciclo:</strong> {{ alumnData.cycle_name }}</li>
      <li><strong>Modalidad:</strong> {{ alumnData.modality_name }}</li>
      <li><strong>Provincia:</strong> {{ alumnData.province_name }}</li>
    </ul>
  </section>
  <Modal ref="modalAlumn" title="Modificar datos del alumn@">
    <AlumnForm @close="modalAlumn?.closeModal()" />
  </Modal>
</template>
