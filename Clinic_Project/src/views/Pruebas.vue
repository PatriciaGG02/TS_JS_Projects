<template>
  <div class="buttons-container">
    <AppButton @click="toggleSearchBarTableClick"
      >Buscador + Tabla falsa</AppButton
    >
    <AppButton @click="modalForm = true">Modal + Formulario</AppButton>
    <AppButton @click="toggleNotificationsClick">Notificaciones</AppButton>
  </div>
  <SearchBarTable v-if="openSearchBarTable" />
  <Modal v-if="modalForm" title="Formulario de prueba" @close="modalForm = false">
    <FormTest @close="modalForm = false" @succes="showSuccess" />
  </Modal>

  <div class="buttons-container" v-if="openNotificationsButtons">
    <AppButton @click="showSuccess" variant="green"
      >Click aquí - Notificación "success"</AppButton
    >
    <AppButton @click="showError" variant="red"
      >Click aquí - Notificación "error"</AppButton
    >
    <AppButton @click="showInfo">Click aquí - Notificación "info"</AppButton>
    <AppButton @click="showWarning" variant="orange"
      >Click aquí - Notificación "warning"</AppButton
    >
  </div>

  <AppNotification
    v-if="notification.show"
    :message="notification.message"
    :type="notification.type"
    :duration="5000"
    @hidden="notification.show = false"
  />
</template>

<script setup>
import { ref } from "vue";
import AppButton from "@/components/common/AppButton.vue";
import SearchBarTable from "@/components/pruebas-badel/SearchBarTable.vue";
import Modal from "@/components/common/Modal.vue";
import FormTest from "@/components/pruebas-badel/FormTest.vue";
import AppNotification from "@/components/common/AppNotification.vue";

const openSearchBarTable = ref(false);
const modalForm = ref(false);
const openNotificationsButtons = ref(false);

function toggleSearchBarTableClick() {
  openSearchBarTable.value = !openSearchBarTable.value;
}

function toggleNotificationsClick() {
  openNotificationsButtons.value = !openNotificationsButtons.value;
}

function openModalForm() {
  modalForm.value = true;
}

function closeModalForm() {
  modalForm.value = false;
}

const notification = ref({
  show: false,
  message: "",
  type: "success",
});

function showSuccess() {
  notification.value = {
    show: true,
    message: "Guardado correctamente.",
    type: "success",
  };
}

function showError() {
  notification.value = {
    show: true,
    message: "Error al guardar los datos.",
    type: "error",
  };
}

function showInfo() {
  notification.value = {
    show: true,
    message: "Tiene una cita en 20 minutos.",
    type: "info",
  };
}

function showWarning() {
  notification.value = {
    show: true,
    message: "Tiene 5 citas pendiente de confirmación.",
    type: "warning",
  };
}
</script>

<style scoped>
.buttons-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin: 16px;
}
</style>
