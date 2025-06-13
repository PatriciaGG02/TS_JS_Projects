<script lang="js" setup>
import {onMounted, ref, computed} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import CoordinatorModify from './CoordinatorModify.vue';
import NewCoordinator from './NewCoordinator.vue';
import Modal from '../common/Modal.vue';
import AppButton from '../common/AppButton.vue';
import AppNotification from '../common/AppNotification.vue';

const store = useUserStore();
const showModalNewC = ref(false);
const showModalModify = ref(false);
const selectCoordinatorId = ref(null);

const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})

onMounted(async () =>{
    if(store.users.length === 0){
        await store.loadUsers();
    }
})

const coordinators = computed(() =>{
    return store.users.filter(
        user =>
        user.headquarters_id === props.headquater.id &&
        user.rol.toLowerCase() === 'coordinator',
    );
})


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
  <div>
    <div v-if="coordinators.length > 0">
      <ul>
        <li
          v-for="(coordinator, index) in coordinators"
          :key="index"
          class="coordinatorsData"
        >
          <p class="coordinatorData">
            Nombre y apellidos: {{ coordinator.full_name }}
          </p>
          <p class="coordinatorData">Correo: {{ coordinator.email }}</p>
          <div class="buttonsCoordinator">
            <AppButton
              @click="
                () => {
                  selectCoordinatorId = coordinator.id;
                  showModalModify = true;
                }
              "
              class="buttonCoordinator"
              >Modificar coordinador</AppButton
            >
            <AppButton @click="showModalNewC = true" class="buttonCoordinator"
              >Crear nuevo coordinador</AppButton
            >
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="noCoordinators">
      <AppButton @click="showModalNewC = true"
        >Crear nuevo coordinador</AppButton
      >
    </div>
  </div>

  <Modal
    v-if="showModalModify"
    title="Modificar coordinador"
    @close="showModalModify = false"
  >
    <CoordinatorModify
      :coordinatorId="selectCoordinatorId"
      @close="showModalModify = false"
      @modify="showSuccess('Coordinador modificado correctamente')"
    />
  </Modal>
  <Modal
    v-if="showModalNewC"
    title="Nuevo coordinador"
    @close="showModalNewC = false"
  >
    <NewCoordinator :headquater="headquater" @close="showModalNewC = false" @create="showSuccess('Coordinador creado correctamente')" />
  </Modal>

  <AppNotification
    v-if="notification.show"
    :message="notification.message"
    :type="notification.type"
    :duration="5000"
    @hidden="notification.show = false"
  />
</template>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}

.coordinatorsData {
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
  list-style-type: none;
}

.coordinatorData {
  margin: 0.3rem 0;
  font-size: 1rem;
}

.buttonsCoordinator {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.buttonCoordinator {
  width: auto;
  flex: 0 0 auto;
  padding: 0.4rem 0.8rem;
  white-space: nowrap; /* evita que se parta en dos líneas si es muy largo */
}

.noCoordinators {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.noCoordinators > * {
  width: fit-content;
  max-width: 300px;
}
</style>
