<template>
  <div
    ref="mapContainer"
    class="w-[500px] h-[500px] border-1 border-gray z-1"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  const props = defineProps<{
    lat: number;
    lon: number;
    name: string;
  }>();

  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<L.Map | null>(null);
  const marker = ref<L.Marker | null>(null);

  defineExpose({
    map,
  });

  // Función para crear el mapa
  const createMap = (lat: number, lon: number, name: string) => {
    if (!mapContainer.value) return;

    // Si ya existe un mapa, lo removemos
    if (map.value) {
      map.value.remove();
    }

    // Creamos el mapa centrado en las coordenadas proporcionadas
    map.value = L.map(mapContainer.value).setView([lat, lon], 15);

    if (map.value instanceof L.Map) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value);

      // Crear el marcador y hacerlo fijo (no arrastrable)
      marker.value = L.marker([lat, lon]).addTo(map.value);

      // Agregar un popup con el nombre sobre el marcador
      marker.value.bindPopup(name).openPopup();
    }
  };

  onMounted(() => {
    // Creamos el mapa con las coordenadas y el nombre recibido como props
    if (props.lat && props.lon && props.name) {
      createMap(props.lat, props.lon, props.name);
    }

    watch(
      () => [props.lat, props.lon, props.name],
      ([newLat, newLon, newName]) => {
        if (newLat && newLon && newName) {
          nextTick(() => {
            createMap(Number(newLat), Number(newLon), String(newName)); // Convertimos a number para asegurarnos de que sean númerosnewLat, newLon, newName);
          });
        }
      }
    );
  });
</script>
