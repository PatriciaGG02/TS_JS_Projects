<template>
  <div>
    <!-- Barra de busqueda y tabla de datos-->
    <AppSearchBar
      v-model="busqueda"
      v-model:modelFiltro="filtroActivo"
      :filtros="filtrosDisponibles"
      placeholder="Buscar sede..."
    />

    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Ciudad</th>
          <th>Especialidad</th>
          <th>Dirección</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sede in sedesFiltradas" :key="sede.id">
          <td>{{ sede.nombre }}</td>
          <td>{{ sede.ciudad }}</td>
          <td>{{ sede.especialidad }}</td>
          <td>{{ sede.direccion }}</td>
        </tr>
        <tr v-if="sedesFiltradas.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AppSearchBar from "@/components/common/AppSearchbar.vue";

const busqueda = ref("");
const filtroActivo = ref("nombre");

const filtrosDisponibles = [
  { label: "Nombre", value: "nombre" },
  { label: "Ciudad", value: "ciudad" },
  { label: "Especialidad", value: "especialidad" },
  { label: "Dirección", value: "direccion" },
];

const sedes = ref([
  {
    id: 1,
    nombre: "Clínica Centro",
    ciudad: "Madrid",
    especialidad: "Cardiología",
    direccion: "Calle Mayor 12",
  },
  {
    id: 2,
    nombre: "Salud Norte",
    ciudad: "Barcelona",
    especialidad: "Dermatología",
    direccion: "Av. Diagonal 45",
  },
  {
    id: 3,
    nombre: "Vida Sana",
    ciudad: "Valencia",
    especialidad: "Pediatría",
    direccion: "Calle Colón 89",
  },
  {
    id: 4,
    nombre: "Bienestar Sur",
    ciudad: "Sevilla",
    especialidad: "Neurología",
    direccion: "Paseo de las Delicias 101",
  },
]);

const sedesFiltradas = computed(() => {
  if (!busqueda.value.trim()) return sedes.value;

  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  return sedes.value.filter((sede) => {
    const campo = filtroActivo.value;
    const valorCampo = sede[campo];
    if (!valorCampo) return false;
    return normalizar(valorCampo).includes(busqueda.value);
  });
});
</script>

<style scoped>
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
thead {
  background-color: #f0f0f0;
}
</style>
