<template>
  <form
    v-if="companyForm"
    @submit.prevent="updateDataCompany"
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
            v-model="companyForm.name"
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
            v-model="companyForm.cif"
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
            v-model="companyForm.phone"
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
            v-model="companyForm.email"
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
        v-model="companyForm.address"
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
            v-model="companyForm.postal_code"
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
            v-model="companyForm.province.id"
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
          :province="companyForm.province.name"
          :company="companyForm.name"
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
        v-model="companyForm.modality"
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
        <input type="checkbox" v-model="companyForm.active" />
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
  import MultiSelect from '../dashboard/company-dashboard/MultiSelect.vue';
  import type { CompanyData } from '@/types/company';
  import { normalize } from '@/composables/useCommon';
  import VueSelect from 'vue3-select-component';
  import searchAddress from '@/composables/useSearchAddress';
  import OpenMap from './OpenMap.vue';

  // OBTENER LOS DATOS BASE DE LA EMPRESA
  const props = defineProps<{
    companyData: CompanyData;
  }>();

  // OBTENER LAS REFERENCIAS DE LOS DATOS
  const province = ref<any[]>([]);
  const modalities = ref<any[]>([]);
  const cycles = ref<any[]>([]);
  const companyForm: CompanyData = reactive({
    ...props.companyData,
  });
  const selectedCycleIds = ref<string[]>([]);
  selectedCycleIds.value = companyForm.cycles.map((cycle) => cycle.cycle_id);

  //NUEVO CICLO
  const newCycle = ref('');
  const newCycleLevel = ref('');
  const newCycleModality = ref('');
  const isNewCycleVisible = ref(false);

  //EVENTOS
  const emit = defineEmits(['close', 'dataSaved']);

  // Función para alternar la visibilidad
  function toggleVisibility() {
    isNewCycleVisible.value = !isNewCycleVisible.value;
  }

  // ERRORES
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
    errorTitle.value.name = !/^[\p{L}0-9\s.'-]{2,60}$/u.test(companyForm.name);
    errorTitle.value.address = !/^[\p{L}0-9\s,.\-ºª/]{2,100}$/u.test(
      companyForm.address
    );

    errorTitle.value.cif = !/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/.test(
      companyForm.cif
    );

    errorTitle.value.phone = !/^\+?\d{9,15}$/.test(companyForm.phone);
    errorTitle.value.email = !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
      companyForm.email
    );

    errorTitle.value.postal_code = !/^[A-Za-z0-9\s\-]{3,10}$/.test(
      companyForm.postal_code
    );

    errorTitle.value.province = !companyForm.province?.id;

    console.log(errorTitle.value);
    return !Object.values(errorTitle.value).includes(true);
  };

  // Función para eliminar tildes y mayus en el filtro en el select
  //Extraer lógica?
  const customFilter = (
    _option: Option<string>,
    label: string,
    search: string
  ) => {
    return normalize(label).includes(normalize(search));
  };

  const isLoading = ref(false);

  // CARGAR DATOS AL MONTAR EL COMPONENTE
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

    console.log(companyForm);
  });

  // ACTUALIZAR LA EMPRESA
  const updateDataCompany = async () => {
    isLoading.value = true;
    try {
      await handleAddressChange();

      if (!validateTitles()) return;

      if (errorAdressNotFound.value) return;

      const { error: updateError } = await supabase
        .from('company')
        .update({
          name: companyForm.name,
          address: companyForm.address,
          cif: companyForm.cif,
          phone: companyForm.phone,
          email: companyForm.email,
          province_id: companyForm.province.id,
          modality_id: companyForm.modality.id,
          active: companyForm.active,
          postal_code: companyForm.postal_code,
          latitude: companyForm.latitude,
          longitude: companyForm.longitude,
        })
        .eq('id', props.companyData.id);

      if (updateError) {
        console.error(
          'Error al actualizar los datos de la empresa:',
          updateError
        );
        alert('Error al actualizar los datos de la empresa.');
        return;
      }

      const { data: existingCyclesData, error: existingCyclesError } =
        await supabase
          .from('company_cycle')
          .select('cycle_id')
          .eq('company_id', props.companyData.id);

      if (existingCyclesError) {
        console.error(
          'Error al cargar los ciclos de la empresa:',
          existingCyclesError
        );

        if (!validateTitles()) {
          return;
        }
        return;
      }

      const newCyclesToAdd = selectedCycleIds.value
        .filter(
          (cycleId: string) =>
            !existingCyclesData?.some(
              (existingCyclesData: any) =>
                existingCyclesData.cycle_id === cycleId
            )
        )
        .map((cycleId: string) => ({
          company_id: props.companyData.id,
          cycle_id: cycleId,
        }));

      if (newCyclesToAdd.length > 0) {
        const { error: cyclesError } = await supabase
          .from('company_cycle')
          .insert(newCyclesToAdd);

        if (cyclesError) {
          console.error(
            'Error al añadir los ciclos de la empresa:',
            cyclesError
          );
          alert('Error al añadir los ciclos de la empresa.');
          return;
        }
      }

      const unselectedCycles = props.companyData.cycles.filter(
        (cycle) => !selectedCycleIds.value.includes(cycle.cycle_id)
      );

      if (unselectedCycles.length > 0) {
        const { error: unselectedCyclesError } = await supabase
          .from('company_cycle')
          .delete()
          .eq('company_id', props.companyData.id)
          .in(
            'cycle_id',
            unselectedCycles.map((cycle) => cycle.cycle_id)
          );

        if (unselectedCyclesError) {
          console.error(
            'Error deleting unselected cycles:',
            unselectedCyclesError.message
          );
        }
      }

      // Filtrar los ciclos que han sido seleccionados
      const selectedCycles = selectedCycleIds.value
        .map((cycleId) => {
          // Buscar el ciclo completo en cycles con el id del ciclo seleccionado
          const fullCycle = cycles.value.find((cycle) => cycle.id === cycleId);
          if (!fullCycle) return null; // Si no se encuentra, retornar null
          return {
            cycle_id: fullCycle.id,
            cycle_name: fullCycle.name,
            education_level: fullCycle.education_level,
            modality: {
              id: fullCycle.modality_id,
              name: fullCycle.name,
            },
          };
        })
        .filter(
          (
            cycle
          ): cycle is {
            cycle_id: string;
            cycle_name: string;
            education_level: string;
            modality: { id: string; name: string };
          } => cycle !== null
        );

      // Asignar los ciclos seleccionados con la estructura correcta a companyForm.cycles
      companyForm.cycles = selectedCycles;

      console.log(companyForm);
      Object.assign(props.companyData, companyForm);
      emit('close');
    } catch (error) {
      console.error('Error al actualizar los datos de la empresa:', error);
    } finally {
      isLoading.value = false;
    }
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
  type Option<T> = {
    label: string;
    value: T;
  };

  function setProvinceNameById(id: string) {
    // Buscar la provincia en el array de provincias por el id (value)
    const provinceData = province.value.find((option) => option.value === id);

    // Si se encontró la provincia, se actualiza el nombre
    if (provinceData) {
      companyForm.province.name = provinceData.label;
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
  //Mapa
  const errorAdressNotFound = ref(false);
  const showMap = ref(false);
  const mapRef = ref<InstanceType<typeof OpenMap> | null>(null);

  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<L.Map | null>(null);
  const isReadOnly = ref(false);

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
  const addressIsChanged = ref(false);

  watch(
    () => [companyForm.address, companyForm.postal_code, companyForm.province],
    () => {
      addressIsChanged.value = true;
    }
  );

  const handleAddressChange = async () => {
    if (!showMap.value && addressIsChanged.value) {
      const fullAddress =
        companyForm.address +
        ', ' +
        companyForm.postal_code +
        ', ' +
        companyForm.province.name;
      const result = await searchAddress(fullAddress);

      if (result) {
        const { lat, lon } = result;
        companyForm.latitude = parseFloat(lat);
        companyForm.longitude = parseFloat(lon);
      } else {
        errorAdressNotFound.value = true;
      }
    }
  };

  // Función para manejar la actualización de las coordenadas
  const handleUpdateCoordinates = (lat: number, lon: number) => {
    console.log('Coordenadas recibidas en el padre:', lat, lon);
    companyForm.latitude = lat;
    companyForm.longitude = lon;
  };
</script>
<style scoped>
  .custom-select {
    --vs-border: 1px solid oklch(70.7% 0.022 261.325);
    --vs-border-radius: 0.375rem;
    --vs-padding: 0.5rem 1rem;
    --vs-font-size: 1rem;
    --vs-text-color: #000000;
    --vs-placeholder-color: #6b7280;
  }

  .custom-select.select-error {
    --vs-border: 1px solid oklch(63.7% 0.237 25.331);
  }

  :deep(.single-value) {
    max-width: 50px;
  }
</style>
