<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '@/services/DatabaseConnection';

  //Router
  const router = useRouter();

  //Datos del formulario
  const dataUser = reactive({
    password: '',
    confirmPassword: '',
  });

  //Errores
  const errors = reactive({
    password: '',
    confirmPassword: '',
  });

  //Carga
  const isLoading = ref<boolean>(false);

  //Función para logear
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // Limpiar errores
    errors.password = '';
    errors.confirmPassword = '';

    // Validación básica
    if (!dataUser.password) {
      errors.password = 'Campo obligatorio';
    } else if (dataUser.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!dataUser.confirmPassword) {
      errors.confirmPassword = 'Campo obligatorio';
    }

    if (dataUser.password !== dataUser.confirmPassword) {
      errors.password = 'Las contraseñas no coinciden';
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Si hay errores, no continuar
    if (errors.password || errors.confirmPassword) {
      return;
    }

    // Cambiar el estado de carga a true
    isLoading.value = true;

    // Llamada a la API Supabase
    try {
      const { error } = await supabase.auth.updateUser({
        password: dataUser.password,
      });

      if (error) {
        if (
          error.message &&
          error.message.includes(
            'New password should be different from the old password'
          )
        ) {
          errors.password =
            'La nueva contraseña debe ser diferente de la antigua';
        } else {
          errors.password =
            'Error del sistema al cambiar la contraseña, inténtalo de nuevo.';
        }
      } else {
        router.push('/');
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
  <section class="border-2 px-10 pt-5 pb-7 border-gray-400 rounded-2xl">
    <h1 class="text-[1.7rem] font-light">Recuperar contraseña</h1>
    <form @submit="handleSubmit" class="relative pb-8">
      <div class="mt-5">
        <label for="password" class="font-bold">Nueva contraseña</label>
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
            class="min-w-[350px] border-1 w-full py-1 pr-1 pl-10 text-[1.1rem]"
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
        <label for="confirmPassword" class="font-bold"
          >Confirmar nueva contraseña</label
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
            name="confirmPassword"
            id="confirmPassword"
            class="min-w-[350px] border-1 w-full py-1 pr-1 pl-10 text-[1.1rem]"
            :class="{ 'border-red-500': errors.confirmPassword }"
            placeholder="Introduce tu contraseña"
            v-model="dataUser.confirmPassword"
            @input="handleInput('password')"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
            {{ errors.confirmPassword }}
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
        Crear nueva contraseña
      </button>
    </form>
  </section>
</template>
