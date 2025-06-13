<template>
  <div
    class="bg-gray-light grid grid-cols-[1fr] grid-rows-[auto_1fr] w-full h-full min-h-[100vh]"
  >
    <HeaderDashboard />
    <div v-if="loading">
      <img :src="loadingGif" alt="Cargando..." class="w-12 h-12 mx-auto" />
    </div>
    <div v-else-if="error">{{ error }}</div>
    <main
      class="p-10 grid grid-cols-2 items-stretch grid-rows-[auto_auto_auto_auto_auto] align-center gap-x-10 gap-y-5"
      v-else-if="company"
    >
      <section
        class="flex justify-between col-span-full h-fit gap-6 items-center not-supports-[display:grid]:flex"
      >
        <div class="flex h-fit gap-6 items-center">
          <div
            @click="$router.back"
            class="bg-white rounded-full no-print relative min-w-[45px] min-h-[45px] cursor-pointer hover:bg-gray-300 border-2 border-gray-400 transition-all"
          >
            <img
              class="absolute top-[2px] left-[3px]"
              src="../assets/return.png"
              alt="icono de volver atrás"
              width="40"
            />
          </div>
          <div
            id="nameTag"
            class="bg-primary py-4 px-6 rounded-2xl text-2xl text-white"
          >
            {{ company.name }}
          </div>
        </div>
        <div id="modifyAndDeleteButtons" class="no-print flex gap-6">
          <button
            @click="openModifyCompany()"
            id="modifyButton"
            class="w-35 h-10 rounded-2xl cursor-pointer bg-gray-300 hover:bg-orange-600 text-lg hover:text-xl text-black hover:text-white hover:not-focus:bg-secondary font-bold"
          >
            Modificar
          </button>
          <button
            id="deleteButton"
            @click="openDelete()"
            class="w-35 h-10 rounded-2xl cursor-pointer bg-gray-300 hover:bg-blue-600 text-lg hover:text-xl text-black hover:text-white hover:not-focus:bg-red-600 font-bold"
          >
            Eliminar
          </button>
        </div>
      </section>
      <section
        id="dataContainer"
        class="flex flex-col col-[1/2] text-[1.2rem] h-full"
      >
        <article
          id="dataCompanyAll"
          class="flex flex-col items-start justify-between mb-4 flex-wrap gap-y-3 synoptic_table"
        >
          <div class="flex justify-between items-center w-full">
            <h2 class="text-left text-2xl font-bold text-black">Datos</h2>
            <span
              class="px-3 py-1 text-sm font-semibold h-fit w-fit text-white not-first:rounded-full mr-5"
              :class="statusColor"
            >
              {{ company.active ? 'Disponible' : 'No disponible' }}
            </span>
          </div>
          <ul
            id="informationCompany"
            class="ml-2 text-gray-700 space-y-2 break-words"
          >
            <li><strong>Nombre:</strong> {{ company.name }}</li>
            <li><strong>CIF:</strong> {{ company.cif }}</li>
            <li>
              <strong>Modalidad:</strong>
              {{ company?.modality?.name ?? 'Sin modalidad' }}
            </li>
            <li>
              <strong>Dirección:</strong>
              {{ company.address }},
              {{ company?.province?.name ?? 'Sin provincia ni dirección' }},
              {{ company.postal_code }}
            </li>
          </ul>
        </article>
        <article
          id="containerCompanyAddress"
          class="flex text-[1.2rem] flex-col items-start justify-between flex-wrap gap-y-3 synoptic_table"
        >
          <h2 class="text-left text-2xl font-bold text-black">
            Datos de contacto
          </h2>
          <ul class="ml-2 text-gray-700 space-y-2 break-words">
            <li><strong>Teléfono:</strong> {{ company.phone }}</li>
            <li>
              <strong>E-mail: </strong>
              <a
                :href="'mailto:' + company.email"
                class="text-blue-500 hover:underline"
                >{{ company.email }}</a
              >
            </li>
          </ul>
        </article>
        <div
          class="overflow-hidden max-h-[275px] min-h-[230px] mt-4 synoptic_table"
        >
          <article
            id="vocationalTrainingCyclesCompatible"
            class="flex flex-col items-start gap-y-3 overflow-y-auto max-w-full h-full"
          >
            <h2 class="text-left text-2xl font-bold text-black">
              Ciclos compatibles
            </h2>
            <ul
              v-if="company.cycles.length > 0"
              class="ml-2 text-gray-700 space-y-2 break-words"
            >
              <li v-for="(cycle, index) in company.cycles" :key="index">
                Grado {{ cycle.education_level }} en {{ cycle.cycle_name }} ({{
                  cycle.modality?.name ?? 'Sin modalidad'
                }})
              </li>
            </ul>
          </article>
        </div>
      </section>
      <!--Mapa-->
      <section
        class="h-full flex flex-col items-center justify-start gap-y-15 synoptic_table"
      >
        <h2 class="text-left text-2xl font-bold text-black self-start">
          Localización
        </h2>
        <OpenMapCoordinated
          :lat="company.latitude"
          :lon="company.longitude"
          :name="company.name"
        >
        </OpenMapCoordinated>
      </section>
      <section id="students" class="col-span-full grid gap-2">
        <div v-if="errorAlumn">{{ errorAlumn }}</div>
        <div
          v-else-if="currentStudents.length > 0"
          class="border-2 bg-white rounded-2xl"
        >
          <h2 class="m-6 text-3xl font-bold">Alumnos actuales</h2>
          <div
            class="rounded-b-2xl shadow-md bg-white overflow-hidden pb-3"
          >
            <div>
              <table class="w-full divide-y divide-gray-200 table-fixed">
                <thead
                  class="bg-primary text-white uppercase text-2xs font-bold tracking-wider text-left"
                >
                  <tr>
                    <th class="px-6 py-3 w-1/5">Nombre</th>
                    <th class="px-6 py-3 w-1/5">DNI</th>
                    <th class="px-6 py-3 w-1/5">Ciclo cursado</th>
                    <th class="px-6 py-3 w-1/5">Fecha de inicio</th>
                    <th class="px-6 py-3 w-1/5">Fecha de fin</th>
                    <th class="px-6 py-3 w-1/5">Resultado</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="overflow-y-auto max-h-[600px]">
              <table class="w-full table-fixed divide-y divide-gray-200">
                <tr
                  v-for="(alumn, index) in currentStudents"
                  :key="index"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <router-link
                      :to="`/alumn/${alumn.id}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ alumn.first_name }} {{ alumn.last_name_1 }}
                      {{ alumn.last_name_2 }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4">{{ alumn.dni }}</td>
                  <td class="px-6 py-4">
                    {{ alumn?.cycle?.name }} <br />{{ alumn?.modality?.name }}
                  </td>
                  <td class="px-6 py-4">{{ alumn.start_date }}</td>
                  <td class="px-6 py-4">{{ alumn.end_date }}</td>
                  <td class="px-6 py-4">{{ alumn.status }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div
          v-if="oldStudents.length > 0"
          class="border-2 bg-white rounded-2xl mt-5"
        >
          <h2 class="text-3xl font-bold m-6">Alumnos antiguos</h2>
          <div
            class="rounded-b-2xl shadow-md bg-white mt-5 overflow-hidden pb-3"
          >
            <div>
              <table class="w-full divide-y divide-gray-200 table-fixed">
                <thead
                  class="bg-primary text-white uppercase text-2xs font-bold tracking-wider text-left"
                >
                  <tr>
                    <th class="px-6 py-3 w-1/5">Nombre</th>
                    <th class="px-6 py-3 w-1/5">DNI</th>
                    <th class="px-6 py-3 w-1/5">Ciclo cursado</th>
                    <th class="px-6 py-3 w-1/5">Fecha de inicio</th>
                    <th class="px-6 py-3 w-1/5">Fecha de fin</th>
                    <th class="px-6 py-3 w-1/5">Estado</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="overflow-y-auto  max-h-[600px]">
              <table class="w-full table-fixed divide-y divide-gray-200">
                <tr
                  v-for="(alumn, index) in oldStudents"
                  :key="index"
                  class="hover:bg-gray-100"
                >
                  <td class="px-6 py-4">
                    <router-link
                      :to="`/alumn/${alumn.id}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ alumn.first_name }} {{ alumn.last_name_1 }}
                      {{ alumn.last_name_2 }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4">{{ alumn.dni }}</td>
                  <td class="px-6 py-4">
                    {{ alumn?.cycle?.name }} <br />{{ alumn?.modality?.name }}
                  </td>
                  <td class="px-6 py-4">{{ alumn.start_date }}</td>
                  <td class="px-6 py-4">{{ alumn.end_date }}</td>
                  <td class="px-6 py-4">{{ alumn.result }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!--Graficas-->
      <section class="col-span-full">
        <div v-if="loadingAlumn">
          <img :src="loadingGif" alt="Cargando..." class="w-12 h-12 mx-auto" />
        </div>
        <div v-else-if="errorAlumn">{{ errorAlumn }}</div>

        <div class="grid synoptic_table" v-else-if="alumnDetails.length > 0">
          <h2 class="text-3xl font-bold mb-6">Gráfico de alumnos</h2>
          <hr />
          <div class="grid grid-cols-2 gap-15 mt-6 items-center">
            <div class="border-2 border-gray-100">
              <StudentsChart />
            </div>
            <div class="border-2 border-gray-100 size-150">
              <RatingsChart />
            </div>
          </div>
        </div>

        <div class="grid justify-center mt-4">
          <button
            class="cursor-pointer no-print bg-blue-500 text-white px-4 py-2 rounded-2xl hover:font-bold hover:bg-blue-600 min-w-[20vw] font-semibold"
          >
            Descargar PDF
          </button>
        </div>
      </section>
    </main>
  </div>

  <Modal ref="modalModifyCompany" title="Modificar datos de la empresa">
    <ModifyCompany
      :company-data="company"
      @close="modalModifyCompany?.closeModal()"
    />
  </Modal>

  <Modal
    ref="modalDeleteCompany"
    title="¿Seguro quieres eliminar esta empresa?"
  >
    <DeleteCompany
      :company-id="route.params.id"
      @close="modalDeleteCompany?.closeModal()"
    />
  </Modal>
</template>

<style scoped>
  @media print {
    .no-print {
      display: none;
    }

    .page-break {
      page-break-after: always;
    }
  }
</style>

<script setup lang="ts">
  import { ref, onMounted, watch, reactive } from 'vue';
  import { useRoute } from 'vue-router';

  import ModifyCompany from '@/components/companyInformation/ModifyCompany.vue';
  import DeleteCompany from '@/components/companyInformation/DeleteCompany.vue';
  import StudentsChart from '@/components/companyInformation/StudentChart.vue';
  import RatingsChart from '@/components/companyInformation/RatingsChart.vue';
  import Modal from '@/components/common/Modal.vue';
  import HeaderDashboard from '@/components/common/HeaderDashboard.vue';
  import { supabase } from '@/services/DatabaseConnection';
  import loadingGif from '@/assets/Loading.gif';
  import type { AlumnCompany, CompanyData } from '@/types/company';
  import { useStatusColor } from '@/composables/useCommon';
  import OpenMapCoordinated from '@/components/companyInformation/OpenMapCoordinated.vue';

  const modalModifyCompany = ref();
  const modalDeleteCompany = ref();

  const openModifyCompany = () => {
    modalModifyCompany.value?.openModal();
  };

  const openDelete = () => {
    modalDeleteCompany.value?.openModal();
  };

  const route = useRoute();
  const company: CompanyData = reactive({
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

  const loading = ref(true);
  const error = ref<string | null>(null);

  const loadingAlumn = ref(true);
  const errorAlumn = ref<string | null>(null);
  const alumnDetails = ref<any[]>([]);

  const interships = ref<any[]>([]);
  const loadingIntership = ref(true);
  const errorIntership = ref<string | null>(null);

  const currentStudents = ref<AlumnCompany[]>([]);
  const oldStudents = ref<AlumnCompany[]>([]);

  onMounted(async () => {
    const companyId = route.params.id;
    company.id = companyId.toString();

    // OBTENER DATOS DE LA EMPRESA SELECCIONADA
    const { data: companyData, error: companyErr } = await supabase
      .from('company')
      .select(
        'name, cif, address, active, phone, email, province:province_id (id,name), modality:modality_id (id,name), postal_code, latitude, longitude'
      )
      .eq('id', companyId)
      .single();

    if (companyErr) {
      error.value = companyErr.message;
    } else {
      console.log(companyData);
      Object.assign(company, companyData);
    }

    // OBTENER CICLOS ASOCIADOS A LA EMPRESA SELECCIONADA
    const { data: cyclesData, error: cyclesErr } = await supabase
      .from('company_cycle')
      .select(
        'cycle:cycle_id (id, name, education_level, modality:modality_id (id, name))'
      )
      .eq('company_id', companyId);

    if (cyclesErr) {
      console.error(cyclesErr);
    } else {
      // Adaptamos al tipo CompanyData
      const parsedCycles = (cyclesData ?? []).map((item: any) => {
        const cycle = item.cycle;
        return {
          cycle_id: cycle.id,
          cycle_name: cycle.name,
          education_level: cycle.education_level,
          modality: Array.isArray(cycle.modality)
            ? cycle.modality[0]
            : cycle.modality,
        };
      });

      company.cycles = parsedCycles;
    }

    // OBTENER ALUMNOS ASOCIADOS A LA EMPRESA SELECCIONADA
    const { data: internData, error: internErr } = await supabase
      .from('internship')
      .select('alumn_id')
      .eq('company_id', companyId);

    if (internErr) {
      errorAlumn.value = internErr.message;
    } else {
      const alumnIds = internData.map((item: any) => item.alumn_id);
      const { data: alumnData, error: alumnErr } = await supabase
        .from('alumn')
        .select(
          '*, cycle:cycle_id (name), modality:modality_id (name), province:province_id (name)'
        )
        .in('id', alumnIds);

        console.log(alumnData); 
      if (alumnErr) {
        errorAlumn.value = alumnErr.message;
      } else {
        alumnDetails.value = alumnData;
      }
    }

    // MOSTRAR LOS ALUMNOS EN LA TABLA ACTUALES O ANTIGUOS SEGÚN EL ESTADO
    const { data: intershipData, error: intershipErr } = await supabase
      .from('internship')
      .select('*')
      .eq('company_id', companyId);

    if (intershipErr) {
      errorIntership.value = intershipErr.message;
      console.log(intershipErr);
    } else {
      interships.value = intershipData;
    }

    // FILTRADO DE ALUMNOS ACTUALES Y ANTIGUOS
    const currentlyStudents = alumnDetails.value
      .filter((alumn: any) => {
        return (
          alumn.status &&
          typeof alumn.status === 'string' &&
          ['activo', 'sin cursar', 'cursando'].includes(
            alumn.status.toLowerCase()
          )
        );
      })
      .map((alumn: any) => {
        const intern = interships.value.find((i) => i.alumn_id === alumn.id);
        return {
          ...alumn,
          start_date: intern?.start_date,
          end_date: intern?.end_date,
        };
      });

    const oldStudentsFilter = alumnDetails.value
      .filter((alumn: any) => {
        return (
          alumn.status &&
          typeof alumn.status === 'string' &&
          alumn.status.toLowerCase() === 'finalizado'
        );
      })
      .map((alumn: any) => {
        const intern = interships.value.find((i) => i.alumn_id === alumn.id);
        return {
          ...alumn,
          start_date: intern?.start_date,
          end_date: intern?.end_date,
          result: intern?.result,
        };
      });

    // OBTENER LOS ALUMNOS ACTUALES
    currentStudents.value = currentlyStudents;

    // OBTENER LOS ALUMNOS ANTIGUOS
    oldStudents.value = oldStudentsFilter;

    loadingIntership.value = false;
    loading.value = false;
    loadingAlumn.value = false;
  });

  // Variable para manejar el color
  const statusColor = ref('bg-gray-500');

  // Observar los cambios en alumnData.status
  watch(
    () => company.active,
    (newStatus) => {
      if (newStatus !== undefined && newStatus !== null) {
        const { colorByStatusResult } = useStatusColor(String(newStatus));
        statusColor.value = colorByStatusResult.value;
      }
    }
  );
</script>
