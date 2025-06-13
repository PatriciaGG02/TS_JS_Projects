<template>
  <div class="clients-container">
    <Header :menuItems="menuItems" />

    <main class="main-content">
      <div class="search-and-buttons">
        <AppSearchbar
          class="client-search"
          v-model="searchTerm"
          v-model:modelFiltro="filterBy"
          :filtros="filtrosDisponibles"
          placeholder="Buscar cliente..."
        />
        <div class="buttons">
          <AppButton @click="openCreateClientForm" type="button"
            >Agregar Cliente</AppButton
          >
          <AppButton
            @click="openEditClientForm"
            :disabled="!selectedClient"
            type="button"
            >Editar Cliente</AppButton
          >
          <AppButton
            @click="openPetsForm"
            :disabled="!selectedClient"
            type="button"
            >Mascotas</AppButton
          >
        </div>
      </div>

      <ClientsTable :clients="filteredClients" @select-client="selectClient" />

      <Modal
        v-if="showClientForm"
        :title="!!selectedClient?.id ? 'Editar Cliente' : 'Agregar Cliente'"
        @close="closeClientForm"
      >
        <ClientsForm
          :client="selectedClient"
          :headquartersId="headquartersId"
          :isEdit="!!selectedClient?.id"
          @close="closeClientForm"
          @submit="handleSubmitClientForm"
          @delete="handleDeleteClient"
        />
      </Modal>

      <Modal v-if="showPetsForm" title="Agregar mascota" @close="closePetsForm">
        <PetForm
          :pet="newPet"
          @close="closePetsForm"
          @submit="handlePetSubmit"
        />
      </Modal>
    </main>

    <AppNotification
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      :duration="3000"
      @hidden="notification.show = false"
    />
  </div>
</template>

<script setup>
import Header from "@/components/common/Header.vue";
import { ref, onMounted, computed, watch } from "vue";
import ClientsTable from "@/components/Clients/ClientsTable.vue";
import ClientsForm from "@/components/Clients/ClientsForm.vue";
import AppButton from "@/components/common/AppButton.vue";
import Modal from "@/components/common/Modal.vue";
import PetForm from "@/components/Pets/PetForm.vue";
import ClientSearchBar from "@/components/Clients/ClientSearchBar.vue";
import { useClientStore } from "@/stores/useClientStore";
import { usePetsStore } from "@/stores/usePetStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useHeadquartersStore } from "@/stores/useHeadquartersStore";
import AppSearchbar from "@/components/common/AppSearchbar.vue";
import { useRoute } from "vue-router";
import AppNotification from "@/components/common/AppNotification.vue";

// Notificaciones
const notification = ref({
  show: false,
  message: "",
  type: "success", // o "error", "warning", "info"
});

// Inicialización de stores
const clientStore = useClientStore();
const petStore = usePetsStore();
const authStore = useAuthStore();
const headquartersStore = useHeadquartersStore();

// Estado reactivo para la búsqueda y filtrado de clientes
const searchTerm = ref("");
const filterBy = ref("name");

const filtrosDisponibles = [
  { label: "Nombre", value: "name" },
  { label: "Primer Apellido", value: "first_surname" },
  { label: "Segundo Apellido", value: "second_surname" },
  { label: "DNI", value: "DNI" },
  { label: "Email", value: "email" },
  { label: "Teléfono", value: "phone" },
  { label: "Dirección", value: "address" },
];

// Estado reactivo para controlar la visibilidad de los modales
const showClientForm = ref(false);
const selectedClient = ref(null);
const showPetsForm = ref(false);
const newPet = ref({});

const rol = authStore.profile?.rol;
// Array de objetos para los elementos del menú
const menuItems = [
  { label: "Inicio", path: "/headquarters" },
  ...(rol === "coordinator"
    ? [{ label: "Empleados", path: "/employees" }]
    : []),
  { label: "Clientes", path: "/clients" },
  { label: "Mascotas", path: "/pets" },
];

// Obtiene el ID de la sede del usuario autenticado
const headquartersId = computed(
  () => authStore.profile?.id_headquarters || null
);

const route = useRoute();
const clientIdFromRoute = computed(() => route.params.clientId);

// Carga los clientes y las sedes al montar el componente
onMounted(async () => {
  await clientStore.loadClients();
  await headquartersStore.loadHeadquarters(); // Carga las sedes al montar el componente
});

// Filtra los clientes basándose en el término de búsqueda y el filtro seleccionado
const filteredClients = computed(() => {
  if (clientIdFromRoute.value) {
    return clientStore.clients.filter(
      (client) => client.id === clientIdFromRoute.value
    );
  }
  return clientStore.clients.filter((client) => {
    const term = searchTerm.value.toLowerCase();
    const filter = filterBy.value;

    if (!term) {
      return true;
    }

    return String(client[filter]).toLowerCase().includes(term);
  });
});

// Watch para limpiar el filtro cuando cambia la ruta
watch(
  () => clientIdFromRoute.value,
  (newClientId) => {
    if (newClientId) {
      searchTerm.value = "";
      filterBy.value = "name";
    }
  }
);

// Abre el formulario para crear un nuevo cliente
const openCreateClientForm = () => {
  selectedClient.value = {
    name: "",
    first_surname: "",
    second_surname: "",
    DNI: "",
    phone: "",
    email: "",
    address: "",
    id_headquarters: headquartersId.value,
  };
  showClientForm.value = true;
};

// Abre el formulario para editar un cliente existente
const openEditClientForm = () => {
  showClientForm.value = true;
};

// Cierra el formulario de cliente y deselecciona el cliente
const closeClientForm = () => {
  showClientForm.value = false;
  selectedClient.value = null;
};

// Selecciona un cliente de la tabla para editarlo
const selectClient = (client) => {
  selectedClient.value = { ...client };
};

// Maneja la creación de un nuevo cliente
const handleCreateClient = async (clientData) => {
  try {
    const isValidHeadquarters =
      !clientData.id_headquarters ||
      headquartersStore.headquarters.some(
        (hq) => hq.id === clientData.id_headquarters
      );

    if (!isValidHeadquarters) {
      console.error("Error: ID de sede inválido");
      notification.value = {
        show: true,
        message: "Error: ID de sede inválido",
        type: "error",
      };
      return;
    }

    const error = await clientStore.createClient(clientData);
    if (error) {
      console.error("Error al crear cliente:", error);
      notification.value = {
        show: true,
        message: "Error al crear cliente: " + error.message,
        type: "error",
      };
    } else {
      clientStore.loadClients();
      closeClientForm();
      notification.value = {
        show: true,
        message: "Cliente creado correctamente.",
        type: "success",
      };
    }
  } catch (error) {
    console.error("Error al crear cliente:", error);
    notification.value = {
      show: true,
      message: "Error al crear cliente: " + error.message,
      type: "error",
    };
  }
};

// Maneja la edición de un cliente existente
const handleEditClient = async (clientData) => {
  try {
    // Divide el full_name en sus componentes
    const { name, first_surname, second_surname } = splitFullName(clientData);

    const isValidHeadquarters =
      !clientData.id_headquarters ||
      headquartersStore.headquarters.some(
        (hq) => hq.id === clientData.id_headquarters
      );

    if (!isValidHeadquarters) {
      console.error("Error: ID de sede inválido");
      notification.value = {
        show: true,
        message: "Error: ID de sede inválido",
        type: "error",
      };
      return;
    }

    // Crea un nuevo objeto con los datos separados
    const updatedClientData = {
      name,
      first_surname,
      second_surname,
      DNI: clientData.DNI,
      email: clientData.email,
      phone: clientData.phone,
      address: clientData.address,
      id_headquarters: clientData.id_headquarters,
    };

    const error = await clientStore.editClient(
      selectedClient.value.id,
      updatedClientData
    );
    if (error) {
      console.error("Error al editar cliente:", error);
      notification.value = {
        show: true,
        message: "Error al editar cliente: " + error.message,
        type: "error",
      };
    } else {
      clientStore.loadClients();
      closeClientForm();
      notification.value = {
        show: true,
        message: "Cliente editado correctamente.",
        type: "success",
      };
    }
  } catch (error) {
    console.error("Error al editar cliente:", error);
    notification.value = {
      show: true,
      message: "Error al editar cliente: " + error.message,
      type: "error",
    };
  }
};

// Maneja la eliminación de un cliente existente
const handleDeleteClient = async (clientToDelete) => {
  try {
    const error = await clientStore.removeClient(clientToDelete.id);
    if (error) {
      console.error("Error al eliminar cliente:", error);
      notification.value = {
        show: true,
        message: "Error al eliminar cliente: " + error.message,
        type: "error",
      };
    } else {
      clientStore.loadClients();
      closeClientForm();
      notification.value = {
        show: true,
        message: "Cliente eliminado correctamente.",
        type: "success",
      };
    }
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    notification.value = {
      show: true,
      message: "Error al eliminar cliente: " + error.message,
      type: "error",
    };
  }
};

// Función auxiliar para dividir el nombre completo
const splitFullName = (clientData) => {
  const name = clientData.name || "";
  const first_surname = clientData.first_surname || "";
  const second_surname = clientData.second_surname || "";
  return { name, first_surname, second_surname };
};

// Maneja el envío del formulario de cliente (creación o edición)
const handleSubmitClientForm = async (clientData, event) => {
  event?.preventDefault?.();
  if (selectedClient.value && selectedClient.value.id) {
    await handleEditClient(clientData);
  } else {
    await handleCreateClient(clientData);
  }
};

// Abre el formulario para agregar una mascota a un cliente
const openPetsForm = () => {
  newPet.value = {
    id_client: selectedClient.value?.id,
    id_headquarters: authStore.profile?.id_headquarters, // Agrega el id_headquarters
  };
  showPetsForm.value = true;
};

// Cierra el formulario de mascotas
const closePetsForm = () => {
  showPetsForm.value = false;
};

// Maneja el envío del formulario de mascotas
const handlePetSubmit = async (petData) => {
  try {
    // Incluir el client_id en los datos a crear
    const newPetData = {
      ...petData,
      id_client: selectedClient.value.id,
    };
    const error = await petStore.createPet(newPetData);
    if (error) {
      console.error("Error al crear mascota:", error);
      notification.value = {
        show: true,
        message: "Error al crear mascota: " + error.message,
        type: "error",
      };
    } else {
      petStore.loadPets();
      closePetsForm();
      notification.value = {
        show: true,
        message: "Mascota creada correctamente.",
        type: "success",
      };
    }
  } catch (error) {
    console.error("Error al crear mascota:", error);
    notification.value = {
      show: true,
      message: "Error al crear mascota: " + error.message,
      type: "error",
    };
  }
};
</script>

<style scoped>
.clients-container {
  background-color: #f0fdfc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 1rem;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-and-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.client-search {
  width: 70%;
}
</style>
