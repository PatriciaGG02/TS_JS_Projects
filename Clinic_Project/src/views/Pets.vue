<template>
  <div class="pets-container">
    <Header :menuItems="menuItems" />

    <main class="main-content">
      <div class="search-and-buttons">
        <AppSearchbar
          class="pet-search"
          v-model="searchTerm"
          v-model:modelFiltro="filterBy"
          :filtros="filtrosDisponibles"
          placeholder="Buscar mascota..."
        />
        <div class="buttons">
          <AppButton @click="openEditPetForm" :disabled="!selectedPet"
            >Editar Mascota</AppButton
          >
          <AppButton
            @click="handleDeletePet"
            :disabled="!selectedPet"
            variant="red"
            >Eliminar Mascota</AppButton
          >
        </div>
      </div>

      <PetsTable
        v-if="petStore.pets.length > 0"
        :pets="filteredPets"
        @select-pet="selectPet"
        :selectedPetId="selectedPet?.id"
      />

      <Modal
        v-if="showPetForm"
        :title="!!selectedPet?.id ? 'Editar Mascota' : 'Editar Mascota'"
        @close="closePetForm"
      >
        <PetForm
          :pet="selectedPet"
          @close="closePetForm"
          @submit="handleEditPetSubmit"
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
import { ref, onMounted, computed } from "vue";
import PetsTable from "@/components/Pets/PetsTable.vue";
import PetForm from "@/components/Pets/PetForm.vue";
import AppButton from "@/components/common/AppButton.vue";
import Modal from "@/components/common/Modal.vue";
import AppSearchbar from "@/components/common/AppSearchbar.vue";
import { usePetsStore } from "@/stores/usePetStore";
import AppNotification from "@/components/common/AppNotification.vue";
import { useAuthStore } from "@/stores/useAuthStore";

// Inicialización del store de mascotas
const petStore = usePetsStore();
const authStore = useAuthStore();

// Estado reactivo para la búsqueda y filtrado de mascotas
const searchTerm = ref("");
const filterBy = ref("name");

const filtrosDisponibles = [
  { label: "Nombre", value: "name" },
  { label: "Tipo", value: "kind" },
  { label: "Raza", value: "breed" },
  { label: "Número de Chip", value: "chip_number" },
];

// Estado reactivo para controlar la visibilidad del formulario de mascotas
const showPetForm = ref(false);
const selectedPet = ref(null);
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
// Carga las mascotas al montar el componente
onMounted(async () => {
  await petStore.loadPets();
});

// Obtiene el ID de la sede del usuario autenticado
const headquartersId = computed(() => {
  console.log(
    "Pets.vue - Headquarters ID:",
    authStore.profile?.id_headquarters
  ); // Agrega este console.log
  return authStore.profile?.id_headquarters || null;
});

// Filtra las mascotas basándose en el término de búsqueda y el filtro seleccionado
const filteredPets = computed(() => {
  let pets = petStore.pets;

  if (!searchTerm.value.trim()) {
    return pets; // Retorna todas las mascotas si no hay término de búsqueda
  }

  return pets.filter((pet) => {
    const term = searchTerm.value.toLowerCase();
    const filter = filterBy.value;
    return String(pet[filter]).toLowerCase().includes(term);
  });
});

// Cierra el formulario de mascotas y deselecciona la mascota
const closePetForm = () => {
  showPetForm.value = false;
  selectedPet.value = null;
};

// Selecciona una mascota de la tabla para editarla
const selectPet = (pet) => {
  selectedPet.value = { ...pet };
};

// Abre el formulario de edición de mascotas
const openEditPetForm = () => {
  showPetForm.value = true;
};

// Maneja la edición de una mascota existente
const handleEditPetSubmit = async (petData) => {
  try {
    // Incluir el client_id en los datos a actualizar
    const updatedPetData = {
      name: petData.name,
      kind: petData.kind,
      breed: petData.breed,
      birthdate: petData.birthdate,
      chip_number: petData.chip_number,
      observations: petData.observations,
      id_client: selectedPet.value.id_client,
    };
    const error = await petStore.editPet(selectedPet.value.id, updatedPetData);
    if (error) {
      console.error("Error al editar mascota:", error);
      notification.value = {
        show: true,
        message: "Error al editar mascota: " + error.message,
        type: "error",
      };
    } else {
      petStore.loadPets();
      closePetForm();
      notification.value = {
        show: true,
        message: "Mascota editada correctamente.",
        type: "success",
      };
    }
  } catch (error) {
    console.error("Error al editar mascota:", error);
    notification.value = {
      show: true,
      message: "Error al editar mascota: " + error.message,
      type: "error",
    };
  }
};

// Maneja la eliminación de una mascota
const handleDeletePet = async () => {
  if (
    selectedPet.value &&
    confirm("¿Estás seguro de que quieres eliminar esta mascota?")
  ) {
    try {
      const error = await petStore.removePet(selectedPet.value.id);
      if (error) {
        console.error("Error al eliminar mascota:", error);
        notification.value = {
          show: true,
          message: "Error al eliminar mascota: " + error.message,
          type: "error",
        };
      } else {
        console.log("Mascota eliminada correctamente");
        petStore.loadPets();
        closePetForm();
        notification.value = {
          show: true,
          message: "Mascota eliminada correctamente.",
          type: "success",
        };
      }
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      notification.value = {
        show: true,
        message: "Error al eliminar mascota: " + error.message,
        type: "error",
      };
    }
  }
};

const notification = ref({
  show: false,
  message: "",
  type: "success",
});
</script>

<style scoped>
.pets-container {
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
  align-items: center;
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

.pet-search {
  width: 70%;
}
</style>
