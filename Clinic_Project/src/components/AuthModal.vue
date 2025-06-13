<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="tabs">
        <button
          :class="{ active: currentTab === 'login' }"
          @click="currentTab = 'login'"
        >
          Iniciar Sesión
        </button>
        
      </div>
      <transition name="fade" mode="out-in">
        <component :is="currentTabComponent" :key="currentTab" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Login from '../views/Login.vue'

const currentTab = ref('login')

const currentTabComponent = computed(() =>
  currentTab.value === 'login' ? Login : Register
)
</script>

<style scoped>
:root {
  --azul-profesional: #1565c0;
  --verde-confianza: #43a047;
  --gris-claro: #f5f5f5;
  --blanco-puro: #ffffff;
  --rojo-controlado: #ef5350;
  --texto: #263238;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--blanco-puro);
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.3s ease-out;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--gris-claro);
  gap: 0.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.8rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  font-size: 1rem;
  color: var(--texto);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button:hover {
  color: var(--verde-confianza);
}

.tabs button.active {
  color: var(--verde-confianza);
  border-bottom: 3px solid var(--verde-confianza);
  font-weight: bold;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animaciones */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>
