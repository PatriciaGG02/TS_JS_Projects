<template>
  <div class="auth-wrapper">
    <h1 class="title">Multispecialty Clinic</h1>
    <form class="auth-form" @submit.prevent="handleLogin">
      <h2>Iniciar Sesión</h2>

      <!--Input para el mail-->
      <input
        type="email"
        placeholder="Correo electrónico"
        v-model="email"
        required
      />

      <!--Input de las contraseña-->
      <div class="password-wrapper">
        <input
          :type="isPasswordVisible ? 'text' : 'password'"
          placeholder="Contraseña"
          v-model="password"
          required
        />

        <!-- Botón de ojo como boton -->
        <button
          type="button"
          class="toggle-password"
          @click="isPasswordVisible = !isPasswordVisible"
          aria-label="Mostrar u ocultar contraseña"
        >
          <i
            class="fas"
            :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"
          ></i>
        </button>
      </div>

      <!--Checkbox para recordar al usuario-->
      <div class="checkbox-group">
        <label for="remember">Recordarme</label>
        <input type="checkbox" id="remember" v-model="rememberMe" />
      </div>

      <!--Parte del codigo que cambie el contenido del boton mientras carga-->
      <div class="button-group">
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? "Cargando..." : "Iniciar Sesión" }}
        </button>
      </div>

      <!--Mensaje de error si hay un error en el login-->
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
  </div>
</template>

<script setup>
//Importamos todas las dependencias necesarias
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";

//Variables reactivas para el formulario
const email = ref("");
const password = ref("");
const rememberMe = ref(false);

//Variable reactiva para alternar la contraseña
const isPasswordVisible = ref(false);

//Importamos el router para redireccionar al usuario
const router = useRouter();

// Importamos el store de autenticación
const authStore = useAuthStore();

const handleLogin = async () => {
  const error = await authStore.login(email.value, password.value);

  if (!error && authStore.profile?.rol) {
    const role = authStore.profile.rol.toLowerCase();

    //Guardamos los credenciales si el usuario quiere recordar
    if (rememberMe.value) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...authStore.user,
          rol: authStore.profile.rol,
        })
      );
    }

    //Redirigimos en función del rol del usuario
    if (role === "superadmin") {
      router.push("/superadmin");
    } else if (role === "coordinator" || role === "worker") {
      const headquartersId = authStore.profile?.id_headquarters;
      if (headquartersId) {
        router.push({
          name: "Headquarters",
          params: { headquarters_id: headquartersId },
        });
      } else {
        console.error("No se ha encontrado el ID de la sede del coordinador");
        router.push("/");
      }
    }
  }
};
</script>

<style>
:root {
  --azul-profesional: #1565c0;
  --verde-confianza: #43a047;
  --gris-claro: #f5f5f5;
  --blanco-puro: #ffffff;
  --rojo-controlado: #ef5350;
  --texto: #263238;
  --gris-interactivo: #d1d1d1;
}

.title {
  font-size: 2.5rem;
  color: var(--azul-profesional);
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.auth-wrapper {
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #e3f2fd, #f1f8e9);
  padding: 2rem;
}

.auth-form {
  width: 100%;
  max-width: 620px;
  padding: 3rem;
  background-color: var(--blanco-puro);
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.4s ease-in;
}

.auth-form h2 {
  margin-bottom: 1rem;
  color: var(--azul-profesional);
  font-size: 2rem;
  text-align: center;
}

.auth-form input[type="email"],
.auth-form input[type="password"] {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--azul-profesional);
  box-shadow: 0 0 0 4px rgba(21, 101, 192, 0.2);
}

.auth-form input::placeholder {
  color: #999;
}

.custom-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  user-select: none;
  color: var(--texto);
  padding-left: 2rem;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox .checkmark {
  position: absolute;
  left: 0;
  top: 60%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: var(--gris-claro);
  border: 2px solid var(--gris-interactivo);
  border-radius: 6px;
  transition: background-color 0.2s, border-color 0.2s;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--verde-confianza);
  border-color: var(--verde-confianza);
}

.custom-checkbox .checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark::after {
  display: block;
}

#remember {
  margin-right: 0.5rem;
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
  accent-color: var(--verde-confianza);
  transition: transform 0.2s ease;
  border-radius: 10px;
  border: 2px solid var(--gris-interactivo);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-form button {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--verde-confianza);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.auth-form button:hover {
  background-color: #388e3c;
}

.auth-form button:active {
  transform: scale(0.97);
}

.error {
  margin-top: 1rem;
  color: var(--rojo-controlado);
  background-color: #fceaea;
  border: 1px solid #f44336;
  padding: 1rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(239, 83, 80, 0.25);
  user-select: none;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding: 1rem;
  padding-right: 3rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.password-wrapper input:focus {
  outline: none;
  border-color: var(--azul-profesional);
  box-shadow: 0 0 0 4px rgba(21, 101, 192, 0.2);
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 23%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #999;
  font-size: 1.2rem;
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover i {
  color: var(--azul-profesional);
}

.toggle-password:focus {
  outline: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.button-group button {
  flex: 1;
}
</style>
