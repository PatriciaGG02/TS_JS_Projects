<template>
  <div class="modal-backdrop" @mousedown.self="closeModal">
    <div class="modal">
      <button
        class="close-button"
        @click="closeModal"
        aria-label="Cerrar modal"
      >
        ×
      </button>
      <h2>{{ title }}</h2>
      <main class="modal-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["close"]);
const props = defineProps({ title: String });

const closeModal = () => {
  emit("close");
};

</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  padding-right: 0.8rem;
  position: relative;
  animation: slideUp 0.4s ease-out;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.modal h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #1565c0; /* color azul profesional */
  flex-shrink: 0;
}

/* Contenido con scroll si hay mucho contenido */
.modal-content {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 2rem; /* para que no tape scrollbar */
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
