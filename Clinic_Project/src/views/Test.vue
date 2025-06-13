<template>
  <div class="test-container">
    <h2>Bienvenido</h2>
    <p>Eres un <strong>{{ userRole }}</strong></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userRole = ref('Desconocido');

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.role) {
    userRole.value = user.role;
  }
});
</script>

<style scoped>
.test-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #1565c0;
}

p {
  font-size: 1.2rem;
}
</style>
