<template>
  <div class="pets-table-container">
    <table class="pets-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Raza</th>
          <th>Fecha de Nacimiento</th>
          <th>Número de Chip</th>
          <th>Observaciones</th>
          <th>Dueño</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pet in pets"
          :key="pet.id"
          @click="selectPet(pet)"
          class="pet-row"
          :class="{ 'selected-row': pet.id === selectedPetId }"
        >
          <td>{{ pet.name }}</td>
          <td>{{ pet.kind }}</td>
          <td>{{ pet.breed }}</td>
          <td>{{ pet.birthdate }}</td>
          <td>{{ pet.chip_number }}</td>
          <td>{{ pet.observations }}</td>
          <td>
            <router-link
              :to="{
                name: 'Clients',
                params: { clientId: pet.id_client },
              }"
            >
              {{ pet.client_DNI }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  pets: {
    type: Array,
    required: true,
  },
  selectedPetId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["select-pet"]);

const selectPet = (pet) => {
  emit("select-pet", pet);
};

console.log("PetsTable - Pets data:", props.pets); // Agrega este console.log
</script>

<style scoped>
.pets-table-container {
  width: 95%; /* Ajustar el ancho al 95% del contenedor */
  overflow-x: auto; /* Para hacer la tabla responsive horizontalmente */
}

.pets-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.pets-table th,
.pets-table td {
  padding: 0.8rem 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.pets-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.pets-table tbody tr:hover {
  cursor: pointer;
}

/* Estilo para las filas de la tabla */
.pet-row {
  transition: background-color 0.2s ease; /* Transición suave para el hover */
}

.pets-table tbody .pet-row:not(.selected-row):hover {
    background-color: #43a04842; /* Color de fondo al pasar el ratón */
}

.selected-row {
  background-color: #43a048a2
}

/* Media query para hacer la tabla responsive en pantallas pequeñas */
@media (max-width: 768px) {
  .pets-table {
    font-size: 0.9rem;
  }

  .pets-table th,
  .pets-table td {
    padding: 0.6rem 0.7rem;
  }
}
</style>