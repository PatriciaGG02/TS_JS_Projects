<template>
  <header class="header">
    <div class="header-left">

      <!--Si el usuario esta identificado-->
      <div v-if="authStore.user && authStore.profile" class="user-info">
        <span>Bienvenido, {{ authStore.profile.name }} 👋</span>
        <AppButton @click="logout" variant="green" class="logout-button">Cerrar sesión</AppButton>
      </div>
    </div>

    <div class="header-center">
      <h1 class="clinic-name">
        Multispecialty<span class="accent">Clinic</span>
      </h1>
    </div>

    <div class="header-right">
      <AppSideBar :menu-items="menuItems" />
    </div>
  </header>
  <AuthModal v-if="showAuth" @close="showAuth = false" />
</template>

<script setup>
// Importamos los componentes necesarios
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'
import AppSideBar from "@/components/common/AppSideBar.vue";
import AuthModal from "@/components/AuthModal.vue"; 
import AppButton from "@/components/common/AppButton.vue";

// Una vez se carga el componente se verifica si el usuario está autenticado
onMounted(async () => {
  if (!authStore.user || !authStore.profile) {
    await authStore.fetchUser()
  }
})


const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const showAuth = ref(false) // Controla la visibilidad del modal de autenticación

//Inicializamos el store de autenticación y el router
const authStore = useAuthStore()
const router = useRouter()

// Una vez se carga el componente se verifica si el usuario está autenticado
onMounted(async () => {
  if (!authStore.user || !authStore.profile) {
    await authStore.fetchUser()
  }
})

//Funcion para cerrar sesion
const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, var(--azul-profesional), #0d47a1);
  color: var(--blanco-puro);
  padding: 1.2rem 2.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid var(--verde-confianza);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.2rem;
}

.clinic-name {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.accent {
  color: var(--verde-confianza);
  margin-left: 0.3rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: background 0.3s ease;
}

.user-menu:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.user-icon {
  font-size: 1.8rem;
  color: var(--blanco-puro);
  transition: transform 0.3s ease;
}

.user-menu:hover .user-icon {
  transform: scale(1.1);
}

.username {
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  white-space: nowrap;
}

.user-info {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-family: 'Roboto', sans-serif;
  color: var(--blanco-puro);
  white-space: nowrap;
}

.welcome-message {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--blanco-puro);
  font-family: 'Roboto', sans-serif;
  white-space: nowrap;
}

.logout-button {
  background-color: var(--rojo-controlado, #ef5350) !important;
  color: white !important;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  width: auto;
  white-space: nowrap;

  cursor: pointer;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-button:hover {
  background-color: #c62828 !important;
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .clinic-name {
    font-size: 1.2rem;
  }

  .username {
    display: none;
  }
}
</style>
