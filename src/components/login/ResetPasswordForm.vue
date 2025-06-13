<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import type { DataUser } from '@/types/auth';
  import { useRouter } from 'vue-router';
  import { supabase } from '@/services/DatabaseConnection';

  const isValid = ref<boolean>(false);

  //URL Frontend
  const frontendURL = import.meta.env.VITE_FRONTEND_URL;

  //Eventos
  const emit = defineEmits(['go-login']);

  function handleGoLogin() {
    emit('go-login');
  }

  //Datos del formulario
  const dataUser: DataUser = reactive({
    email: '',
    password: '',
  });

  //Errores
  const errors = reactive({
    email: '',
    password: '',
    login: '',
  });

  //Carga
  const isLoading = ref<boolean>(false);

  //Función para logear
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // Limpiar errores
    errors.email = '';

    // Validación básica
    if (!dataUser.email) {
      errors.email = 'Campo obligatorio';
    } else {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      if (!emailPattern.test(dataUser.email)) {
        errors.email = 'Formato de email incorrecto';
      }
    }

    // Si hay errores, no continuar
    if (errors.email) {
      return;
    }

    // Cambiar el estado de carga a true
    isLoading.value = true;

    // Llamada a la API Supabase
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        dataUser.email,
        {
          redirectTo: frontendURL + '/new-password',
        }
      );

      if (error) {
        errors.email =
          'No se pudo enviar el correo de recuperación. Inténtalo de nuevo.';
      } else {
        isValid.value = true;
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
  }
</script>

<template>
  <div v-if="!isValid">
    <h1 class="text-[1.7rem] font-light">Recuperar contraseña</h1>
    <form @submit="handleSubmit" class="line relative pb-8">
      <div class="mt-5">
        <label for="email" class="font-bold">Introduce tu email</label>
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
            class="border-1 w-full py-1 pr-1 pl-10 text-[1.1rem] min-w-[350px]"
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
      <button
        class="w-full mt-9 rounded-md py-2 px-5 text-white hover:ring-2 hover:outline-none transition-all"
        :disabled="isLoading"
        :class="{
          'bg-primary hover:ring-black cursor-pointer': !isLoading,
          'bg-gray-400 cursor-not-allowed': isLoading,
        }"
      >
        Recuperar contraseña
      </button>
      <p v-if="errors.login" class="text-red-500 text-sm mt-1">
        {{ errors.login }}
      </p>
    </form>
    <div class="flex flex-col items-center gap-3 justify-center pt-4">
      <a @click="handleGoLogin" class="text-center underline cursor-pointer text-primary hover:not-focus:text-black"
        >Volver al inicio</a
      >
    </div>
  </div>
  <div v-if="isValid">
    <h1 class="text-[1.7rem] font-light">
      Correo de confirmación eviado correctamente
    </h1>
    <p>
      Si el correo está registrado, recibirás un email con instrucciones para
      restablecer tu contraseña.
    </p>
  </div>
</template>
