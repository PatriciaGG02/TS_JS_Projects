<script lang="js" setup>
import {ref, onMounted, computed, defineEmits} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import DeleteHeadquarter from './DeleteHeadquarter.vue';
import ModifyHeadquarter from './ModifyHeadquarter.vue';
import AssignCoordinator from './AssignCoordinator.vue';
import AppButton from '../common/AppButton.vue';
import Modal from '../common/Modal.vue';
import { useHeadquartersStore } from '@/stores/useHeadquartersStore';
import AppNotification from '../common/AppNotification.vue';

const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})
const hqstore = useHeadquartersStore();

const showModalModify = ref(false);
const showModalDelete = ref(false);
const showModalAssignCoordinator = ref(false);

const userStore = useUserStore();

onMounted(async () => {
    if(userStore.users.length === 0){
       await userStore.loadUsers();
    }
})
const emit = defineEmits(['close', 'delete']);

const handleDeleteClose = () => {
    showModalDelete.value = false;
    emit('delete')
    emit('close');
}

const coordinators = computed(() => {
    return  userStore.users.filter(
        user =>
        user.headquarters_id === props.headquater.id &&
        user.rol.toLowerCase() === 'coordinator');
});

const currentHeadquarter = computed(() =>
    hqstore.headquarters.find(hq => hq.id === props.headquater.id) || props.headquater
)

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
  <div name="containerModalHeadquarterComplete">
    <div name="containerInformation">
      <div class="headquarterHeader">
        <div name="containerHeadquarterName" class="headquarterName">
          {{ currentHeadquarter.name }}
        </div>
        <div class="buttonsHeadquarter">
          <AppButton
            @click="showModalModify = !showModalModify"
            class="modifyButton"
            >Modificar sede</AppButton
          >
          <AppButton
            @click="(showModalDelete = true), { ...headquater }"
            class="deleteButton"
            >Eliminar sede</AppButton
          >
          <AppButton
            @click="
              (showModalAssignCoordinator = !showModalAssignCoordinator),
                { ...headquater }
            "
            class="assignButton"
            >Asignar coordinador</AppButton
          >
        </div>
      </div>
      <div name="containerHeadquarter" class="headquarterData">
        <p class="dataHeadquarter">Ciudad: {{ currentHeadquarter.city }}</p>
        <p class="dataHeadquarter">
          Dirección: {{ currentHeadquarter.address }}
        </p>
        <p class="dataHeadquarter">Teléfono: {{ currentHeadquarter.phone }}</p>
      </div>
      <div name="containterUser" v-if="coordinators.length > 0">
        <p class="coordinatorsData">Coordinador/es</p>
        <ul>
          <li v-for="(coordinator, index) in coordinators" :key="index">
            <p class="coordinatorData">
              Nombre y apellidos: {{ coordinator.full_name }}
            </p>
            <p class="coordinatorData">Correo: {{ coordinator.email }}</p>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="coordinatorNoData">
          No existen coordinadores para {{ currentHeadquarter.name }}
        </p>
      </div>
    </div>
  </div>

  <Modal
    v-if="showModalModify"
    title="Modificar sede"
    @close="showModalModify = false"
  >
    <ModifyHeadquarter
      :headquater="currentHeadquarter"
      @close="showModalModify = false"
      @created="showSuccess('Sede modificada correctamente.')"
    />
  </Modal>
  <Modal
    v-if="showModalDelete"
    title="Eliminar sede"
    @close="showModalDelete = false"
  >
    <DeleteHeadquarter
      :headquater="currentHeadquarter"
      @close="handleDeleteClose"
    />
  </Modal>
  <Modal
    v-if="showModalAssignCoordinator"
    title="Asignar coordinador"
    @close="showModalAssignCoordinator = false"
  >
    <AssignCoordinator :headquater="currentHeadquarter" />
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
[name="containerModalHeadquarterComplete"] {
  padding: 2rem;
}

[name="containerInformation"] {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.headquarterHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.headquarterName {
  background-color: white;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.2rem;
}

.buttonsHeadquarter {
  display: flex;
  gap: 0.5rem;
}

.headquarterData {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dataHeadquarter {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.coordinatorsData {
  margin-top: 1.5rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.coordinatorData {
  margin: 0.2rem 0;
}

li {
  border-bottom: 1px solid #e0e0e0;
  padding: 0.5rem 0;
  list-style-type: none;
}

.coordinatorNoData {
  margin-top: 2rem;
  color: #d9534f;
  text-align: center;
  font-weight: 500;
}
</style>
