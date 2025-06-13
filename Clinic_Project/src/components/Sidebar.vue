<template>
  <div class="sidebar">
    <button class="close-btn" @click="$emit('close')">×</button>
    <nav class="menu">
      <a href="#">Dashboard</a>
      <a href="#">Citas</a>
      <a href="#">Clientes</a>
      <a href="#">Especialidades</a>
      <router-link to="/employees" >Usuarios</router-link>
      <a href="#">Ajustes</a>
    </nav>
  </div>
</template>

<script setup>
// Lógica manejada desde MenuBurger para abrir y cerrar el sidebar facil y sencillo chavales xD
</script>

<style>
:root {  
  --azul-profesional: #1565C0;
  --verde-confianza: #43A047;
  --gris-claro: #F5F5F5;
  --blanco-puro: #FFFFFF;
  --rojo-controlado: #EF5350;
  --texto: #263238;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: var(--azul-profesional);
  color: white;
  padding: 2rem 1rem;
  z-index: 999;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}


@keyframes menuSlideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: menuSlideDown 0.5s ease;
}

.menu a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: color 0.2s;
}

.menu a:hover {
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
</style>
