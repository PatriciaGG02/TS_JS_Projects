
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">×</button>
      <h2>Coordinadores de la Sede {{ sedeId }}</h2>
      <div class="coordinadores-grid">
        <div class="coordinador-card" v-for="i in 2" :key="i">
          <h3>Coordinador {{ i }}</h3>
          <p>Nombre: India {{ i }}</p>
          <p>Email: coordinador{{ i }}@sede.com</p>
          <p>Teléfono: 6666666{{ i }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['sedeId'])
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(68, 64, 64, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border: #62aaf1 solid 2px;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #0c0c0c;
}

.coordinadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.coordinador-card {
  background-color: #62aaf1;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
