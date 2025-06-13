<!-- src/components/GridSedes.vue -->
<template>
  <div class="grid">
    <div class="sede-card" v-for="n in 9" :key="n" @click="abrirModal(n)">
      Sede {{ n }}
    </div>
    <ModalCoordinadores
      v-if="modalVisible"
      :sedeId="sedeSeleccionada"
      @close="modalVisible = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModalCoordinadores from './ModalCoordinadores.vue'

const modalVisible = ref(false)
const sedeSeleccionada = ref(null)

const abrirModal = (id) => {
  sedeSeleccionada.value = id
  modalVisible.value = true
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.sede-card {
    display: flex;
    flex-direction: column;
  justify-content: center;
  background-color: white;
  padding: 1.5rem;
  height: 150px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  font-weight: bold;
  color: var(--azul-profesional, #1565c0);
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.sede-card:hover {
  transform: translateY(-5px);
}
</style>
