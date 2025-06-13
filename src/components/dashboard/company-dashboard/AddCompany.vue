<template>
  <form
    @submit.prevent="submitFormCompanies"
    class="relative space-y-4 min-w-[50vW]"
  >
    <fieldset class="synoptic_table">
      <legend
        class="font-semibold px-2 bg-gray-100 rounded-lg border-2 border-gray-500"
      >
        Información de la empresa
      </legend>
      <div class="flex gap-5 mb-4">
        <div class="basis-1/2">
          <label for="name">Nombre</label>
          <input
            id="name"
            v-model="newCompany.name"
            type="text"
            placeholder="Nombre"
            class="w-full border rounded-md p-2"
            :class="errorTitle.name ? 'border-red-500' : 'border-gray-300'"
            @input="validateTitles"
          />
          <p v-if="errorTitle.name" class="text-red-500 text-sm mt-1">
            Debe ser un nombre válido
          </p>
        </div>
        <div class="basis-1/2">
          <label for="cif">CIF</label>
          <input
            id="cif"
            v-model="newCompany.cif"
            type="text"
            placeholder="CIF"
            class="w-full border rounded-md p-2"
            :class="errorTitle.cif ? 'border-red-500' : 'border-gray-300'"
            @input="validateTitles"
          />
          <p v-if="errorTitle.cif" class="text-red-500 text-sm mt-1">
            Debe ser un CIF válido y con mayúsculas
          </p>
        </div>
      </div>
      <div class="flex gap-5">
        <div class="basis-1/2">
          <label for="phone">Teléfono</label>
          <input
            id="phone"
            v-model="newCompany.phone"
            type="text"
            placeholder="Teléfono"
            class="w-full border rounded-md p-2"
            :class="errorTitle.phone ? 'border-red-500' : 'border-gray-300'"
            @input="validateTitles"
          />
          <p v-if="errorTitle.phone" class="text-red-500 text-sm mt-1">
            Debe ser un número de teléfono válido
          </p>
        </div>
        <div class="basis-1/2">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="newCompany.email"
            type="text"
            placeholder="Email"
            class="w-full border rounded-md p-2"
            :class="errorTitle.email ? 'border-red-500' : 'border-gray-300'"
            @input="validateTitles"
          />
          <p v-if="errorTitle.email" class="text-red-500 text-sm mt-1">
            Debe ser un email válido
          </p>
        </div>
      </div>
    </fieldset>
    <fieldset class="synoptic_table">
      <legend
        class="font-semibold px-2 bg-gray-100 rounded-lg border-2 border-gray-500"
      >
        Localización
      </legend>
      <label for="address">Dirección</label>
      <input
        :readonly="isReadOnly"
        id="address"
        v-model="newCompany.address"
        type="text"
        placeholder="Dirección"
        class="w-full border rounded-md p-2"
        :class="errorTitle.address ? 'border-red-500' : 'border-gray-300'"
        @input="validateTitles"
      />
      <p v-if="errorTitle.address" class="text-red-500 text-sm mt-1">
        Debe ser una dirección válida
      </p>
      <div class="flex gap-5 mt-4">
        <div class="basis-1/2">
          <label for="postal-code">Código postal</label>
          <input
            :readonly="isReadOnly"
            id="postal-code"
            v-model="newCompany.postal_code"
            type="text"
            class="w-full border rounded-md p-2"
            :class="
              errorTitle.postal_code ? 'border-red-500' : 'border-gray-300'
            "
            @input="validateTitles"
          />
          <p v-if="errorTitle.postal_code" class="text-red-500 text-sm mt-1">
            Debe ser codigo postal válido
          </p>
        </div>
        <div class="basis-1/2">
          <label for="province" class="block font-semibold"
            >Provincia <span class="text-secondary">*</span></label
          >
          <VueSelect
            :isDisabled="isReadOnly"
            id="province"
            v-model="newCompany.province.id"
            :options="province"
            :filter-by="customFilter"
            placeholder="Selecciona una provincia"
            class="custom-select"
            @optionSelected="handleOptionSelected"
          />
          <p v-if="errorTitle.province" class="text-red-500 text-sm mt-1">
            Introduce una provincia
          </p>
        </div>
      </div>
      <p
        v-if="errorAdressNotFound || showMap"
        class="text-red-500 text-sm mt-1"
      >
        Error al encontrar la ubicación, inténtalo de nuevo o
        <span class="text-blue-600 cursor-pointer" @click="toggleMap"
          >selecciona la dirección manualmente</span
        >
      </p>
      <div v-if="showMap" class="w-[500px] h-[500px] mt-5">
        <OpenMap
          :province="newCompany.province.name"
          :company="newCompany.name"
          @update-coordinates="handleUpdateCoordinates"
          ref="mapRef"
        />
      </div>
    </fieldset>
    <fieldset class="synoptic_table">
      <legend
        class="font-semibold px-2 bg-gray-100 rounded-lg border-2 border-gray-500"
      >
        Datos sobre prácticas
      </legend>

      <label for="modality">Modalidad</label>
      <select
        id="modality"
        v-model="newCompany.modality"
        class="w-full border rounded-md p-2 mb-5"
      >
        <option
          v-for="modality in modalities"
          :key="modality.id"
          :value="modality"
        >
          {{ modality.name }}
        </option>
      </select>

      <MultiSelect
        v-model="selectedCycleIds"
        :options="cycles"
        placeholder="Selecciona ciclos"
        label="Añadir ciclos"
        :hideSelected="false"
      />
      <p>
        ¿Falta algún ciclo?
        <span class="text-blue-600 cursor-pointer" @click="toggleVisibility"
          >Añádelo</span
        >
      </p>

      <div v-if="isNewCycleVisible">
        <label>Nombre del ciclo</label><input v-model="newCycle" />
        <label>Nivel</label
        ><select v-model="newCycleLevel">
          <option value="Superior">Superior</option>
          <option value="Medio">Medio</option>
        </select>
        <label for="modality">Modalidad</label
        ><select id="modality" v-model="newCycleModality">
          <option
            v-for="modality in modalities"
            :key="modality.id"
            :value="modality.id"
          >
            {{ modality.name }}
          </option>
        </select>
        <button class="bg-blue-600 text-white p-2" @click="addCycle">
          Añadir
        </button>
      </div>

      <div class="mt-5">
        <label>¿Esta empresa busca alumnos en este momento? </label>
        <input type="checkbox" v-model="newCompany.active" />
      </div>
    </fieldset>

    <div class="flex justify-end mt-4">
      <button
        type="submit"
        :disabled="isLoading"
        :class="{
          'bg-primary text-white px-4 py-2 rounded cursor-pointer hover:outline-2 hover:outline-black':
            !isLoading,
          'bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed':
            isLoading,
        }"
      >
        Actualizar
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive, watch, nextTick } from 'vue';
  import { supabase } from '@/services/DatabaseConnection';
  import MultiSelect from './MultiSelect.vue';
  import type { CompanyData } from '@/types/company';
  import type OpenMap from '@/components/companyInformation/OpenMap.vue';
  import { normalize } from '@/composables/useCommon';
  import { useRouter } from 'vue-router';
  import searchAddress from '@/composables/useSearchAddress';
import VueSelect from 'vue3-select-component';

  const province = ref<any[]>([]);
  const modalities = ref<any[]>([]);
  const cycles = ref<any[]>([]);
  const isLoading = ref(false);

  const errorTitle = ref({
    name: false,
    address: false,
    cif: false,
    phone: false,
    email: false,
    postal_code: false,
    province: false,
  });

  const validateTitles = () => {
    errorTitle.value.name = !/^[\p{L}0-9\s.'-]{2,60}$/u.test(newCompany.name);
    errorTitle.value.address = !/^[\p{L}0-9\s,.\-ºª/]{2,100}$/u.test(
      newCompany.address
    );

    errorTitle.value.cif = !/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/.test(
      newCompany.cif
    );

    errorTitle.value.phone = !/^\+?\d{9,15}$/.test(newCompany.phone);
    errorTitle.value.email = !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
      newCompany.email
    );

    errorTitle.value.postal_code = !/^[A-Za-z0-9\s\-]{3,10}$/.test(
      newCompany.postal_code
    );

    errorTitle.value.province = !newCompany.province?.id;

    console.log(errorTitle.value);
    return !Object.values(errorTitle.value).includes(true);

    return !Object.values(errorTitle.value).includes(true);
  };

  //NUEVO CICLO
  const newCycle = ref('');
  const newCycleLevel = ref('');
  const newCycleModality = ref('');
  const isNewCycleVisible = ref(false);

  const newCompany: CompanyData = reactive({
    id: '',
    name: '',
    cif: '',
    address: '',
    active: false,
    phone: '',
    email: '',
    latitude: 0,
    longitude: 0,
    province: {
      id: '',
      name: '',
    },
    modality: {
      id: '',
      name: '',
    },
    postal_code: '',
    cycles: [],
  });

  const emit = defineEmits(['close']);

  const selectedCycleIds = ref<string[]>([]);
  selectedCycleIds.value = newCompany.cycles.map((cycle) => cycle.cycle_id);

  const submitFormCompanies = async () => {
    isLoading.value = true;

    try {
      await handleAddressChange();

      if (!validateTitles()) return;

      if (errorAdressNotFound.value) return;


      const { data: insertCompany, error: insertCompanyError } = await supabase
        .from('company')
        .insert([
          {
            name: newCompany.name,
            cif: newCompany.cif,
            address: newCompany.address,
            phone: newCompany.phone,
            email: newCompany.email,
            province_id: newCompany.province.id,
            modality_id: newCompany.modality.id,
            active: newCompany.active,
            longitude: newCompany.longitude,
            latitude: newCompany.latitude,
            postal_code: newCompany.postal_code,
          },
        ])
        .select();

      if (insertCompanyError) {
        alert('Error al insertar la empresa: ' + insertCompanyError.message);
        console.error(insertCompanyError.message);
        return;
      }

      const companyId = insertCompany?.[0]?.id;
      if (!companyId) {
        console.error('Error al obtener el ID de la empresa creada');
        return;
      }

      const cyclesRelation = selectedCycleIds.value.map((cycleId) => ({
        company_id: companyId,
        cycle_id: cycleId,
      }));

      const { error: cycleError } = await supabase
        .from('company_cycle')
        .insert(cyclesRelation);

      if (cycleError) {
        alert('Empresa creada, ciclos no añadidos: ' + cycleError.message);
        console.error(cycleError.message);
        return;
      }

      //router.push(`/company/${companyId}`);
      emit('close');
    } finally {
      isLoading.value = false;
    }
  };

  const handleAddressChange = async () => {
    if (!showMap.value) {
      const fullAddress =
        newCompany.address +
        ', ' +
        newCompany.postal_code +
        ', ' +
        newCompany.province.name;
      const result = await searchAddress(fullAddress);

      if (result) {
        const { lat, lon } = result;
        newCompany.latitude = parseFloat(lat);
        newCompany.longitude = parseFloat(lon);
      } else {
        errorAdressNotFound.value = true;
      }
    }
  };
  const router = useRouter();
  type Option<T> = {
    label: string;
    value: T;
  };

  function setProvinceNameById(id: string) {
    // Buscar la provincia en el array de provincias por el id (value)
    const provinceData = province.value.find((option) => option.value === id);

    // Si se encontró la provincia, se actualiza el nombre
    if (provinceData) {
      newCompany.province.name = provinceData.label;
    } else {
      // Si no se encontró, se muestra un mensaje en la consola
      console.log('Provincia no encontrada');
    }
  }

  function handleOptionSelected(option: Option<string>) {
    // Ahora 'option' es un objeto con 'value' y 'label'
    setProvinceNameById(option.value);

    // Validar los títulos, si es necesario
    validateTitles();
  }

  // Función para eliminar tildes y mayus en el filtro en el select
  //Extraer lógica?
  const customFilter = (
    _option: Option<string>,
    label: string,
    search: string
  ) => {
    return normalize(label).includes(normalize(search));
  };

  // AÑADIR NUEVO CICLO
  const addCycle = async () => {
    if (
      !newCycle.value.trim() ||
      !newCycleLevel.value ||
      !newCycleModality.value
    ) {
      return;
    }

    const { data: newItem, error } = await supabase
      .from('cycle')
      .insert({
        name: newCycle.value,
        education_level: newCycleLevel.value,
        modality_id: newCycleModality.value,
      })
      .select()
      .single();

    if (!error && newItem) {
      cycles.value.push(newItem);
      selectedCycleIds.value = [...(selectedCycleIds.value || []), newItem.id];

      toggleVisibility();
      newCycle.value = '';
      newCycleLevel.value = '';
      newCycleModality.value = '';
    } else {
      console.error('Error al añadir el ciclo:', error);
      alert('Error al añadir el ciclo.');
    }
  };

  onMounted(async () => {
    const { data: provinceData } = await supabase.from('province').select('*');
    province.value = (provinceData ?? []).map((item: any) => ({
      value: item.id,
      label: item.name,
    }));
    province.value = (provinceData ?? []).map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    const { data: modalitiesData } = await supabase
      .from('modality')
      .select('*');
    modalities.value = modalitiesData ?? [];

    const { data: cycleDataAll } = await supabase.from('cycle').select('*');
    cycles.value = cycleDataAll ?? [];
  });

  const isReadOnly = ref(false);

  const errorAdressNotFound = ref(false);
  const showMap = ref(false);
  const mapRef = ref<InstanceType<typeof OpenMap> | null>(null);

  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<L.Map | null>(null);
  const handleUpdateCoordinates = (lat: number, lon: number) => {
    console.log('Coordenadas recibidas en el padre:', lat, lon);
    newCompany.latitude = lat;
    newCompany.longitude = lon;
  };
  // Watch para observar cambios en `showMap`
  watch(showMap, (newVal) => {
    if (newVal && mapContainer.value) {
      nextTick(() => {
        if (map.value) {
          map.value.invalidateSize(); // Ajustamos el tamaño del mapa
        }
      });
    }
  });
  const toggleMap = async () => {
    isReadOnly.value = !isReadOnly.value;
    showMap.value = !showMap.value;
    errorAdressNotFound.value = !errorAdressNotFound.value;

    // Esperamos que Vue termine de renderizar el DOM
    await nextTick();

    // Si el componente OpenMap ya está cargado y tiene un mapa
    if (mapRef.value && mapRef.value.map) {
      mapRef.value.map.invalidateSize();
    }
  };

  function toggleVisibility() {
    isNewCycleVisible.value = !isNewCycleVisible.value;
  }
</script>
