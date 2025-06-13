<template>
  <div class="menu-burger">
    <button class="burger-btn" @click="toggleSidebar">
      <span class="burger-line"></span>
      <span class="burger-line"></span>
      <span class="burger-line"></span>
    </button>

    <transition name="sidebar-slide">
      <div class="sidebar" v-if="isSidebarOpen">
        <button class="close-btn" @click="toggleSidebar">×</button>
        <nav class="menu">
          <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.path"
            class="menu-link"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  menuItems: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<style scoped>
.menu-burger {
  display: flex;
  align-items: center;
  position: relative;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background-color: var(--azul-profesional);
  color: white;
  padding: 2rem 1rem;
  z-index: 2;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-link {
  text-decoration: none;
  color: white;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: color 0.2s;
}

.menu-link:hover {
  color: var(--verde-confianza);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  align-self: flex-end;
  cursor: pointer;
  margin-bottom: 1rem;
}

.burger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1;
}

.burger-line {
  width: 100%;
  height: 3px;
  background-color: var(--blanco-puro);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Animaciones */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
