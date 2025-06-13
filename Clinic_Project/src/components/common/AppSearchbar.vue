<template>
  <div class="searchbar">
    <!-- Icono lupa -->
    <span class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </span>

    <!-- Input búsqueda -->
    <input
      :value="modelValue"
      @input="procesarInput($event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="input"
    />

    <!-- Desplegable de filtros -->
    <div class="dropdown-container" @click="toggleDropdown">
      <span class="selected">{{ selectedLabel }}</span>
      <svg
        class="arrow"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
      <ul v-if="dropdownOpen" class="dropdown-menu">
        <li
          v-for="filtro in filtros"
          :key="filtro.value"
          @click.stop="seleccionarFiltro(filtro)"
        >
          {{ filtro.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  modelValue: String,
  filtros: {
    type: Array,
    default: () => [
      { label: "Nombre", value: "nombre" },
      { label: "Ciudad", value: "ciudad" },
      { label: "Especialidad", value: "especialidad" },
      { label: "Dirección", value: "direccion" },
    ],
  },
  modelFiltro: String,
  placeholder: {
    type: String,
    default: "Buscar...",
  },
});

const emit = defineEmits(["update:modelValue", "update:modelFiltro"]);

const dropdownOpen = ref(false);
const selectedLabel = ref("");

watchEffect(() => {
  const selected = props.filtros.find((f) => f.value === props.modelFiltro);
  selectedLabel.value = selected?.label || props.filtros[0].label;
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function seleccionarFiltro(filtro) {
  emit("update:modelFiltro", filtro.value);
  dropdownOpen.value = false;
}

function procesarInput(valor) {
  const normalizado = valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  emit("update:modelValue", normalizado);
}
</script>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  padding: 0.7rem 1rem;
  border: 2px solid #ccc;
  border-radius: 12px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  width: 92%;
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.searchbar:focus-within {
  border-color: #1565c0;
  box-shadow: 0 0 0 4px rgba(21, 101, 192, 0.2);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: transform 0.2s ease;
}

.searchbar:focus-within .icon {
  transform: scale(1.2);
  color: #1565c0;
}

.icon-svg {
  width: 20px;
  height: 20px;
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #333;
  background: transparent;
}

.input::placeholder {
  color: #aaa;
  font-style: italic;
}

.dropdown-container {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  user-select: none;
}
.dropdown-container:hover {
  background-color: #e3f2fd;
}

.arrow {
  transition: transform 0.3s ease;
  color: var(--azul-profesional, #1565c0);
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: max-content;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-menu li:hover {
  background-color: #e3f2fd;
  color: #1565c0;
}
</style>
