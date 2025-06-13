<template>
  <div
    ref="mapContainer"
    class="w-[500px] h-[500px] border-1 border-gray z-1"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  const props = defineProps<{
    province?: string;
    company?: string;
  }>();

  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<L.Map | null>(null);
  const marker = ref<L.Marker | null>(null);

  defineExpose({
    map,
  });

  // Función para buscar las coordenadas
  const buscarCoordenadas = async (province: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(province)}&countrycodes=es`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      await nextTick();
      createMap(lat, lon);
    } else {
      alert('Dirección no encontrada');
    }
  };

  // Función para crear el mapa
  const createMap = (lat: number, lon: number) => {
    if (!mapContainer.value) return;

    if (map.value) {
      map.value.remove();
    }

    // Inicializa el mapa con el centro en las coordenadas dadas
    map.value = L.map(mapContainer.value).setView([lat, lon], 15);

    if (map.value instanceof L.Map) {
      // Cargar las capas de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value);

      // Crear el marcador arrastrable en las coordenadas proporcionadas
      marker.value = L.marker([lat, lon], { draggable: true }).addTo(map.value);
      marker.value.bindPopup(props.company || '').openPopup();

      // Configurar el evento 'dragend' para capturar las nuevas coordenadas
      marker.value.on('dragend', () => {
        const latLng = marker.value?.getLatLng();
        if (latLng) {
          const newLat = latLng.lat;
          const newLon = latLng.lng;
          console.log('Nuevas coordenadas:', newLat, newLon); // Guardar las coordenadas si es necesario
          // Aquí puedes hacer lo que necesites con las nuevas coordenadas
        }
      });
    }
  };

  onMounted(() => {
    if (props.province) {
      buscarCoordenadas(props.province);
    }
  });
</script>
