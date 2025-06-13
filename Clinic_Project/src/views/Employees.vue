<template>
  <Header :menu-items="menuItems" />
  <main class="content">
    <!-- Barra de búsqueda y botón de añadir usuario -->
    <div class="top-bar">
      <AppSearchbar
        v-model="search"
        v-model:modelFiltro="filter"
        :filtros="[
          { label: 'Nombre', value: name },
          { label: 'Rol', value: rol },
        ]"
      />
      <AppButton
        variant="primary"
        @click="showModalAddUser = true"
        class="addBtn"
        >Añadir usuario</AppButton
      >
    </div>

    <!--Modal para añadir usuario-->
    <ModalAddUser
      v-if="showModalAddUser"
      @close="showModalAddUser = false"
      @submit="onUserCreated"
      @error="(msg) => showNotification(msg, 'error')"
    />

    <!-- Tabla para mostrar los usuarios -->
    <div>
      <TableUsers
        :search="search"
        :filter="filter"
        @notify="showNotification"
      />
    </div>

    <!-- Notificaciones -->
    <AppNotification
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      @hidden="notification.show = false"
    />
  </main>
</template>

<script setup>
import { ref } from "vue";
import Header from "@/components/common/Header.vue";
import AppSearchbar from "@/components/common/AppSearchbar.vue";
import AppButton from "@/components/common/AppButton.vue";
import ModalAddUser from "@/components/Employees/ModalAddUser.vue";
import TableUsers from "@/components/Employees/TableUsers.vue";
import AppNotification from "@/components/common/AppNotification.vue";

const name = "name";
const rol = "rol";
const search = ref("");
const filter = ref("name");
const showModalAddUser = ref(false);
const notification = ref({ show: false, message: "", type: "success" });

// Mostrar notificaciones.
function showNotification(message, type = "success") {
  notification.value = { show: true, message, type };
}

// Creación de las opciones del sidebar.
const menuItems = [
  { label: "Inicio", path: "/headquarters" },
  { label: "Empleados", path: "/employees" },
  { label: "Clientes", path: "/clients" },
  { label: "Mascotas", path: "/pets" },
];

function onUserCreated() {
  showModalAddUser.value = false;
  showNotification("Usuario creado correctamente.", "success");
}
</script>

<style scoped>
.top-bar {
  display: flex;
  gap: 20px;
  width: 100%;
}
.addBtn {
  margin-top: 0;
  width: 10%;
  font-size: 1rem;
}

.content {
  margin: 16px 16px 0px 16px;
}
</style>
