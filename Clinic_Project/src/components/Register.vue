<template>
  <form class="auth-form">
    <h2>Crear una cuenta</h2>
    <input type="text" placeholder="Nombre completo" />
    <input type="email" placeholder="Correo electrónico" />
    <input type="password" placeholder="Contraseña" />
    <input type="password" placeholder="Confirmar contraseña" />
    <button type="submit">Registrarse</button>
  </form>
</template>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background-color: var(--blanco-puro);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  animation: fadeIn 0.4s ease-in;
}

.auth-form h2 {
  margin-bottom: 1rem;
  color: var(--azul-profesional);
  text-align: center;
}

.auth-form input {
  padding: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--azul-profesional);
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.2);
}

.auth-form input::placeholder {
  color: #999;
}

.auth-form button {
  padding: 0.9rem;
  background-color: var(--verde-confianza);
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.auth-form button:hover {
  background-color: #388e3c;
}

.auth-form button:active {
  transform: scale(0.98);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
