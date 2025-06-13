<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import type { DataUser } from '@/types/auth';
  import { signUpNewUser } from '@/services/auth';
  import { useRouter } from 'vue-router';

  //Router
  const router = useRouter();

  //Datos del formulario
  const dataUser = reactive({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  //Errores
  const errors = reactive({
    email: '',
    password: '',
    passwordConfirm: '',
    registro: '',
  });

  //Carga
  const isLoading = ref<boolean>(false);

  //Función para enviar el formulario
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // Limpiar errores
    errors.email = '';
    errors.password = '';
    errors.passwordConfirm = '';

    // Validación básica
    if (!dataUser.email) {
      errors.email = 'Campo obligatorio';
    } else {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!emailPattern.test(dataUser.email)) {
        errors.email = 'Formato de email incorrecto';
      }
    }

    if (!dataUser.password) {
      errors.password = 'Campo obligatorio';
    } else if (dataUser.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!dataUser.passwordConfirm) {
      errors.passwordConfirm = 'Campo obligatorio';
    }

    if (dataUser.password !== dataUser.passwordConfirm) {
      errors.password = 'Las contraseñas no coinciden';
      errors.passwordConfirm = 'Las contraseñas no coinciden';
    }

    // Si hay errores, no continuar
    if (errors.email || errors.password || errors.passwordConfirm) {
      return;
    }

    // Preparar datos limpios para enviar
    const cleanData: DataUser = {
      email: dataUser.email,
      password: dataUser.password,
    };

    // Cambiar el estado de carga a true
    isLoading.value = true;

    // Llamada a la API Supabase
    try {
      const { error } = await signUpNewUser(cleanData);

      if (error) {
        if (error.message === 'User already registered') {
          errors.email = 'Este correo ya está registrado';
        } else {
          dataUser.email = '';
          dataUser.password = '';
          dataUser.passwordConfirm = '';
          errors.registro =
            'Ha ocurrido un error inesperado, inténtalo más tarde';
        }
      } else {
        router.push('/dashboard/alumn');
      }
    } finally {
      isLoading.value = false;
    }
  }

  function handleInput(field: keyof typeof dataUser) {
    dataUser[field] = dataUser[field].trim();

    // Si el campo está vacío después de escribir, mostramos el error
    if (!dataUser[field]) {
      errors[field] = `Campo obligatorio`;
    } else {
      errors[field] = '';
    }

    if (field === 'password' || field === 'passwordConfirm') {
      if (dataUser.password && dataUser.passwordConfirm) {
        errors.password = '';
        errors.passwordConfirm = '';
      }
    }
  }
</script>

<template>
  <main class="flex justify-center mt-5">
    <section class="border-2 px-10 pt-5 pb-7 border-gray-400 rounded-2xl">
      <h1 class="text-[1.7rem] font-light">Crear cuenta</h1>
      <form @submit="handleSubmit" class="line relative pb-8">
        <div class="mt-5">
          <label for="email" class="font-bold">E-mail</label>
          <div class="relative mt-1">
            <img
              src="../../assets/email-icon.png"
              alt="icono de email"
              width="22"
              class="absolute top-[7px] left-[8px]"
            />
            <input
              type="text"
              name="email"
              id="email"
              class="border-1 w-full min-w-[300px] py-1 pr-1 pl-10 text-[1.1rem]"
              :class="{ 'border-red-500': errors.email }"
              placeholder="Introduce tu email"
              v-model="dataUser.email"
              @input="handleInput('email')"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">
              {{ errors.email }}
            </p>
          </div>
        </div>
        <div class="mt-5">
          <label for="password" class="font-bold">Contraseña</label>
          <div class="relative mt-1">
            <img
              src="../../assets/pass-icon.png"
              alt="icono de password"
              width="22"
              class="absolute top-[7px] left-[8px]"
            />
            <input
              type="password"
              name="password"
              id="password"
              class="border-1 w-full min-w-[300px] py-1 pr-1 pl-10 text-[1.1rem]"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Introduce tu contraseña"
              v-model="dataUser.password"
              @input="handleInput('password')"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">
              {{ errors.password }}
            </p>
          </div>
        </div>
        <div class="mt-5">
          <label for="password-confirm" class="font-bold"
            >Confirma tu contraseña</label
          >
          <div class="relative mt-1">
            <img
              src="../../assets/pass-icon.png"
              alt="icono de password"
              width="22"
              class="absolute top-[7px] left-[8px]"
            />
            <input
              type="password"
              name="password-confirm"
              id="password-confirm"
              class="border-1 w-full min-w-[300px] py-1 pr-1 pl-10 text-[1.1rem]"
              :class="{ 'border-red-500': errors.passwordConfirm }"
              placeholder="Introduce tu contraseña"
              v-model="dataUser.passwordConfirm"
              @input="handleInput('passwordConfirm')"
            />
            <p v-if="errors.passwordConfirm" class="text-red-500 text-sm mt-1">
              {{ errors.passwordConfirm }}
            </p>
          </div>
        </div>
        <button
          class="w-full mt-9 rounded-md py-2 px-5 text-white hover:ring-2 hover:outline-none transition-all"
          :disabled="isLoading"
          :class="{
            'bg-primary hover:ring-black cursor-pointer': !isLoading,
            'bg-gray-400 cursor-not-allowed': isLoading,
          }"
        >
          Registrarse
        </button>
        <p v-if="errors.registro" class="text-red-500 text-sm mt-1">
          {{ errors.registro }}
        </p>
      </form>
      <div class="flex justify-center pt-4">
        <p>
          ¿Ya tienes cuenta?
          <router-link to="/" class="text-center underline cursor-pointer text-primary hover:not-focus:text-black"
            >Iniciar sesión</router-link
          >
        </p>
      </div>
    </section>
  </main>
</template>
