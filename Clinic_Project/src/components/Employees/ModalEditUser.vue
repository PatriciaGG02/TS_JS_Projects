<template>
    <Modal title="Modificar usuario" @close="emit('close')">

      <AppForm :onSubmit="submitForm">
        <AppInput v-model="nombre" label="Nombre" type="text" />
        <AppInput v-model="primerApd" label="Primer apellido" type="text"/>
        <AppInput v-model="segundoApd" label="Segundo apellido" type="text"/>
        <AppInput v-model="email" label="Email" type="email"/>
        <AppInput v-model="password" label="Contraseña" type="password"/>
        <p v-if="password && password.length > 0 && password.length < 6" class="error">
            La contraseña debe de tener al menos 6 caracteres.
        </p>
        <AppSelect v-model="rol" :options="roles" label="Rol" type="" placeholder="Selecciona un rol"/>
        <AppButton type="submit" variant="primary">Guardar cambios</AppButton>
      </AppForm>

    </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import Modal from '../common/Modal.vue'
import AppButton from '../common/AppButton.vue';
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppSelect from '../common/AppSelect.vue';
import { useUserStore } from '@/stores/useUserStore'

const emit = defineEmits(['close','submit','error']);

const props = defineProps({
    user: { type:Object, required: true }
})

const nombre = ref('')
const primerApd = ref('')
const segundoApd = ref('')
const email = ref('')
const password = ref('')
const rol = ref('')
const userStore = useUserStore()

const roles =[
    {label: 'Coordinador', value:'coordinator'},
    {label: 'Trabajador', value:'worker'}
]

//Usamos un watcher para actualizar los refs cuando cambie props.user
watch(() => props.user,
  (user) => {
    if (user) {
      nombre.value = user.name || ''
      primerApd.value = user.first_surname || ''
      segundoApd.value = user.second_surname || ''
      email.value = user.email || ''
      rol.value = user.rol || ''
    }
  },
  { immediate: true }
)

//Función para actualizar el usuario
const submitForm = async () => {
  try{
    const updateFields = {
        name: nombre.value,
        first_surname: primerApd.value,
        second_surname: segundoApd.value,
        email: email.value,
        rol: rol.value,
        ...(password.value && { password: password.value })
    }
    
    // Elimina si es igual al original o si es vacío (excepto password, que solo se añade si hay valor)
    Object.keys(updateFields).forEach(key => {
        if (
            (key !== 'password' && updateFields[key] === props.user[key]) ||
            updateFields[key] === '' ||
            updateFields[key] === null ||
            updateFields[key] === undefined
        ) {
            delete updateFields[key]
        }
    })

    //Comrpueba si la contraseña se ha modificado y si tiene al menos 6 caracteres.
    if (updateFields.password && updateFields.password.length < 6) {
      return
    }
    
    //Comprueba si hay cambios.
    if (Object.keys(updateFields).length === 0) {
      emit('error','No hay cambios para guardar')
      return
    }

   //Llama al store pasando el id y los campos modificados.
    const { error } = await userStore.editUser(props.user.id, updateFields)
    if (error){
      emit('error','Error al actualizar usuario.' + (error.message))
      return
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