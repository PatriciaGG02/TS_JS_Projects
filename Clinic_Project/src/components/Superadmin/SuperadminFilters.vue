<script lang="js" setup>
import {computed, watchEffect, ref} from 'vue'
import { useHeadquartersStore } from '../../stores/useHeadquartersStore'
import filter from '../../assets/filter.svg'


const store = useHeadquartersStore()
const selectCity = ref('');
const selectName = ref('');
const filterHeadquarters = ref('');

// NO DIFERENCIAR ENTRE ACENTOS Y MAYUSCULAS
const normalizeText = (text) =>
     text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
// FILTRO DE BUSQUEDA DE INPUTS

const filterHeadquartersComputed = computed(() => {
  const textFilter = normalizeText(filterHeadquarters.value.trim());
  const city = selectCity.value;
  const name = selectName.value;

  return store.headquarters.filter((hq) => {
     const matchText = (
      normalizeText(hq.name || '').includes(textFilter) ||
      normalizeText(hq.city || '').includes(textFilter) ||
      normalizeText(hq.address || '').includes(textFilter) ||
      normalizeText(hq.phone || '').includes(textFilter)
    );

    const matchCity = city === '' || hq.city === city;
    const matchName = name === '' || hq.name === name;
    
    return matchText && matchCity && matchName;
  });
})

// OBTENER LISTAS DE CIUDADES Y NOMBRES
const cities = computed(() => {
  const setCity = new Set();
  store.headquarters.forEach(hq => hq.city && setCity.add(hq.city));
  return Array.from(setCity);
});

const names = computed(() => {
  const setName = new Set();
  store.headquarters.forEach(hq => hq.name && setName.add(hq.name));
  return Array.from(setName);
});

// OBTENER LISTA FILTRADA
const emit = defineEmits(['update:filters']);

watchEffect(() => {
    emit('update:filters', filterHeadquartersComputed.value )
})
</script>

<template>
  <div class="filtersWrapper">
    <div name="containerFilters" class="searchbar">
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
            <input
              v-model="filterHeadquarters"
              type="text"
              placeholder="Buscar por su nombre, ciudad, dirección..."
              class="filterInputHeadquarters input"
            >

    <details class="filtersSelect"> 
            <summary class="filtersSelectSummary">
              <img :src="filter" class="folder">
            </summary>
    <div name="containerFilertsSelect">             
            <select
              v-model="selectCity"
              class="selectHalf">
                  <option value="">Todas las ciudades</option>
                  <option v-for="(city, index) in cities" :key="index" :value="city">{{ city }}</option>
            </select>

            <select
              v-model="selectName"
              class="selectHalf">
                <option value="">Nombre de la sede</option>
                <option v-for="(name, index) in names" :key="index" :value="name">{{ name }}</option>
            </select>
    </div>       
    </details>
  </div> 
  </div>
</template>

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
  width: 100%;
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
  margin-right: 0;
}

.input::placeholder {
  color: #aaa;
  font-style: italic;
}

.folder {
  position: absolute;
  top: 0.5rem;
  right: 0.7rem;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}


.searchbar:focus-within .folder {
  transform: scale(1.2);
  filter: brightness(0) saturate(100%) invert(26%) sepia(78%) saturate(2115%) hue-rotate(199deg) brightness(94%) contrast(92%);
}


details[open] .folder {
  transform: scale(1.2);
  filter: brightness(0) saturate(100%) invert(26%) sepia(78%) saturate(2115%) hue-rotate(199deg) brightness(94%) contrast(92%);
}

.filtersSelectSummary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 0;
}

details > summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

details > summary::-webkit-details-marker {
  display: none;
}

.filtersWrapper {
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  background-color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.filtersSelect {
  width: 100%;
}

.containerFiltersSelect {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.selectHalf {
  width: calc(50% - 0.5rem);
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 10px;
}



</style>
