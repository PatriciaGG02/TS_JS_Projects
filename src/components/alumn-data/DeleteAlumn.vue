<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { deleteAlumn } from '@/services/alumn-data';
  import type { AlumnData } from '@/types/alumnData';
  import { useRouter } from 'vue-router';

  const emit = defineEmits(['close', 'dataSaved']);
  //Carga
  const isLoading = ref<boolean>(false);

  const alumnData = inject('alumnData') as AlumnData;

  const router = useRouter();

  async function handleDelete() {
    isLoading.value = true;

    try {
      const isDeleted = await deleteAlumn(alumnData.id as string);
      if (isDeleted) {
        emit('close');
        emit('dataSaved', 'Alumn@ eliminado correctamente');
        router.push('/dashboard/alumn');
      }
    } finally {
      isLoading.value = false;
    }
  }
</script>
<template>
  <section class="flex gap-4 justify-center mt-4">
    <button
      :disabled="isLoading"
      :class="{
        'px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-danger transition hover:cursor-pointer w-[80px]':
          !isLoading,
        'px-4 py-2 bg-gray-500 text-white rounded-lg transition w-[80px] cursor-wait':
          isLoading,
      }"
      @click="handleDelete"
    >
      Sí
    </button>
    <button
      class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-primary transition hover:cursor-pointer w-[80px]"
      @click="emit('close')"
    >
      No
    </button>
  </section>
</template>
