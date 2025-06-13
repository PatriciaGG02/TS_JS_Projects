<script lang="ts" setup>
  import { ref } from 'vue';

  // Definir un emit para cerrar el modal
  const emit = defineEmits(['close']);

  //Props
  defineProps({
    title: String,
  });

  // Definir si el modal está visible
  const isVisible = ref(false);

  // Función para abrir el modal
  const openModal = () => {
    isVisible.value = true;
  };

  // Función para cerrar el modal
  const closeModal = () => {
    isVisible.value = false;
    emit('close');
  };

  // Exponer funciones accesibles desde fuera del componente
  defineExpose({
    openModal,
    closeModal,
  });
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50 transition-all"
    @mousedown.self="closeModal"
  >
    <div class="bg-gray-light p-6 rounded-xl shadow-lg transition-all opacity-100">
      <header class="flex justify-between items-center mb-4">
        <div class="flex flex-1 justify-center">
          <h3 class="text-2xl font-bold pr-3">{{ title }}</h3>
        </div>

        <button
          @click="closeModal"
          class="text-black text-3xl hover:text-secondary cursor-pointer ml-5"
        >
          &times;
        </button>
      </header>
      <main class="overflow-y-auto max-h-[77vh] pr-8 pl-1 pb-1 ">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
  .transition-all {
    transition: all 0.3s ease-in-out;
  }
</style>
