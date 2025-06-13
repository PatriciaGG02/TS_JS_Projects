<script lang="js" setup>
import { ref, onMounted } from "vue";
import SuperadminFilters from "../Superadmin/SuperadminFilters.vue";
import SuperadminCreateForm from "./SuperadminCreateForm.vue";
import SuperadminButton from "../Superadmin/SuperadminButton.vue";
import { useHeadquartersStore } from "../../stores/useHeadquartersStore";
import Modal from "../common/Modal.vue";
import AppButton from "../common/AppButton.vue";
import AppNotification from "../common/AppNotification.vue";


const store = useHeadquartersStore();
const modalCreateForm = ref(false);
const modalHeadquarter = ref(false);
const selectHeadquater = ref(null);

const filteredList = ref(store.headquarters);

// OBTENER DATOS DE LA SEDE (solo necesito el nombre)
onMounted(async () => {
  await store.loadHeadquarters();
});



function openModal(headquarter) {
  modalHeadquarter.value = true;
  selectHeadquater.value = headquarter;

}

const notification = ref({
  show: false,
  message: "",
  type: "success",
});

function showSuccess(message) {
  notification.value = {
    show: true,
    message: message,
    type: "success",
  };
}
</script>

<template>
  <main>
    <div class="containerComplete">
      <div class="containerFiltersButton">
        <SuperadminFilters @update:filters="filteredList = $event" />
        <AppButton @click="modalCreateForm = true">Crear sede</AppButton>
      </div>

      <div name="headquartesData">
        <div v-if="store.loading">Cargando datos de las sedes...</div>
        <div v-else-if="store.error">{{ store.error }}</div>
        <div v-else></div>
        <div v-if="filteredList.length === 0" class="headquarterNoData">No existen resultados</div>
        <div v-else class="grid">
          <div
            v-for="(headquater, index) in filteredList"
            :key="index"
            @click="openModal(headquater)"
            class="sede-card"
          >
            {{ headquater.name }}
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-if="modalCreateForm"
      title="Crear sede"
      @close="modalCreateForm = false"
    >
      <SuperadminCreateForm
        @close="modalCreateForm = false"
        @created="showSuccess('Sede creada correctamente')"
      />
    </Modal>
    <Modal v-if="modalHeadquarter" @close="modalHeadquarter = false">
      <SuperadminButton
        :headquater="selectHeadquater"
        @close="modalHeadquarter = false"
        @delete="showSuccess('Sede eliminada correctamente.')"
      />
    </Modal>

    <AppNotification
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      :duration="5000"
      @hidden="notification.show = false"
    />

  </main>
</template>

<style scoped>
.containerComplete {
  margin: 0px 20px 0px 20px;
}
.containerFiltersButton {
  display: grid;
  grid-template-columns: 80% 20%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  margin-top: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.sede-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  padding: 1.5rem;
  height: 150px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  font-weight: bold;
  color: var(--azul-profesional, #1565c0);
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.sede-card:hover {
  transform: translateY(-5px);
}

.headquarterNoData {
  margin-top: 2rem;
  color: #d9534f;
  text-align: center;
  font-weight: 500;
}
</style>
