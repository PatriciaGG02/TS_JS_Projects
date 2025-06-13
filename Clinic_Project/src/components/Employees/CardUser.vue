<template>
  <div class="card-user">
    <div class="user-info">
      <p><strong>Nombre:</strong> {{ user.full_name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Rol:</strong> {{ roleLabels[user.rol] }}</p>
    </div>
    <!--Botones para la gestión de usuarios-->
    <div class="actions">
      <AppButton variant="primary" @click="$emit('edit', user)"
        >Editar</AppButton
      >
      <AppButton variant="red" @click="$emit('delete', user)"
        >Eliminar</AppButton
      >
    </div>
  </div>
</template>

<script setup>
import AppButton from "../common/AppButton.vue";

defineProps({
  user: {
    type: Object,
    required: true,
  },
});

// Mapa de roles para mostrar el nombre legible del rol.
const roleLabels = {
  worker: "Trabajador",
  coordinator: "Coordinador",
};
</script>

<style scoped>
.card-user {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.user-info p {
  margin: 0 0 4px 0;
}
.actions {
  display: flex;
  gap: 8px;
}
.actions :deep(button),
.actions .app-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85em;
  padding: 15px 20px;
  height: 28px;
}
</style>
