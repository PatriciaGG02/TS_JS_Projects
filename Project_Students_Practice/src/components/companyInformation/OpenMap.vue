<template>
  <div
    ref="mapContainer"
    class="w-[500px] h-[500px] border-1 border-gray z-1"
  ></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick, defineEmits } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  const emit = defineEmits<{
    (e: 'update-coordinates', lat: number, lon: number): void;
  }>();

  const props = defineProps<{
    province?: string;
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

    map.value = L.map(mapContainer.value).setView([lat, lon], 15);

    if (map.value instanceof L.Map) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value);

      // Crear el marcador y hacerlo arrastrable
      marker.value = L.marker([lat, lon], { draggable: true }).addTo(map.value);

      // Evento para obtener las coordenadas cuando el marcador se arrastra
      marker.value.on('dragend', () => {
        const latLng = marker.value?.getLatLng();
        if (latLng) {
          const newLat = latLng.lat;
          const newLon = latLng.lng;
          
          emit('update-coordinates', newLat, newLon);
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
