<template>
  <!-- Este es el botón "Crear cita". 
       Solo se activa (habilita) si hay un día seleccionado (props.selectedDay).
       Al hacer clic, se abre el modal para crear la cita -->
  <div>
    <button
      class="btn"
      :disabled="!props.selectedDay"       
      @click="showModal = true"             
    >
      Crear cita
    </button>

    <!-- Modal para crear nueva cita, solo se muestra si showModal es true -->
    <MakeDateModal
      v-if="showModal"
      :selectedDay="props.selectedDay"      
      @close="showModal = false"             
      @save="handleSave"  
                          
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MakeDateModal from './MakeDateForm.vue'

// Recibimos el día seleccionado desde el componente padre
const props = defineProps({
  selectedDay: Number,
})

// Definimos el evento que emitiremos al crear una cita
const emit = defineEmits(['create-date'])

// Estado local para controlar la visibilidad del modal
const showModal = ref(false)

// Si el día seleccionado cambia a null o undefined, cerramos el modal automáticamente
watch(() => props.selectedDay, (newVal) => {
  if (!newVal) showModal.value = false
})

// Función que maneja el evento de guardar la cita desde el modal
function handleSave(cita) {
  emit('create-date', cita)    // Emitimos la cita creada hacia el padre
  showModal.value = false      // Cerramos el modal
}
</script>


<style scoped>
.btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  font-weight: bold;
  font-size: large;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}


.btn:hover:not(:disabled),
.btn:focus:not(:disabled) {
  background-color: #145ea8; 
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.6); 
  outline: none; 
}

/* Estilo para botón deshabilitado */
.btn:disabled {
  background-color: #9dbbd8;
  cursor: not-allowed;  /*Importante  */
  box-shadow: none;
  opacity: 0.7; 
}

</style>
