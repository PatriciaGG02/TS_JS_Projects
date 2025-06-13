<template>
  <div class="client-searchbar">
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Buscar cliente..."
      @input="emitSearch"
    />
    <select v-model="filterBy" @change="emitSearch">
      <option value="name">Nombre</option>
      <option value="first_surname">Primer Apellido</option>
      <option value="second_surname">Segundo Apellido</option>
      <option value="DNI">DNI</option>
      <option value="phone">Teléfono</option>
      <option value="email">Email</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchTerm = ref('');
const filterBy = ref('name');

const emit = defineEmits(['search']);

const emitSearch = () => {
  emit('search', { term: searchTerm.value, filter: filterBy.value });
};
</script>

<style scoped>
.client-searchbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%; /* Make the search bar take up the full width */
}

.client-searchbar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.client-searchbar select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>