<template>
    <Modal title="Añadir un nuevo usuario" @close="emit('close')">

      <AppForm :onSubmit="submitForm">
        <AppInput v-model="nombre" label="Nombre" type="text" :required="true"/>
        <AppInput v-model="primerApd" label="Primer apellido" type="text" :required="true"/>
        <AppInput v-model="segundoApd" label="Segundo apellido" type="text" :required="true"/>
        <AppInput v-model="email" label="Email" type="email" :required="true"/>
        <AppInput v-model="password" label="Contraseña" type="password" :required="true"/>
        <p v-if="password && password.length > 0 && password.length < 6" class="error">
            La contraseña debe de tener al menos 6 caracteres.
        </p>
        <AppSelect v-model="rol" :options="roles" label="Rol" type="" placeholder="Selecciona un rol" :required="true"/>
        <AppButton type="submit" variant="primary">Confirmar</AppButton>
      </AppForm>

    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../common/Modal.vue'
import AppButton from '../common/AppButton.vue';
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppSelect from '../common/AppSelect.vue';
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'

const emit = defineEmits(['close','submit', 'error']);

const nombre = ref('')
const primerApd = ref('')
const segundoApd = ref('')
const email = ref('')
const password = ref('')
const rol = ref('')
const userStore = useUserStore()

//Accede al id de la sede del usuario logueado
const authStore = useAuthStore()
const id_headquarters = authStore.user?.id_headquarters

//Establece los roles aceptados para mostrar en el formulario.
const roles = [
    {label: 'Coordinador', value:'coordinator'},
    {label: 'Trabajador', value:'worker'}
]

//Función para manejar el submit del formulario.
const submitForm = async () => {
  if(password.value.length < 6) {
    return
  }

  try{
    const error = await userStore.createUser({
      name: nombre.value,
      first_surname: primerApd.value,
      second_surname: segundoApd.value,
      email: email.value,
      rol: rol.value,
      date: new Date().toISOString(),
      id_headquarters
    })
    if (error){
      emit('error','Error al crear el usuario.' + error.message)
      return;
    }
    emit('submit')
    emit('close')
  } catch (err) {
    emit('error','Error inesperado: ' + err.message)
  }
}
</script>

<style scoped>
.error{
  color: red;
  margin-top: -0.8rem;
  margin-bottom: 0.5rem;
  font-size: small;

}
</style>
<style>
.notification.error{
  z-index: 3000 !important;
}
</style>-->

