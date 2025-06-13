<script setup lang="js">
import {ref, reactive, defineEmits} from 'vue'
import { useHeadquartersStore } from '../../stores/useHeadquartersStore'
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppButton from '../common/AppButton.vue';


const newHeadquater = ref({
  name: '',
  city: '',
  address: '',
  phone: ''
})

const errors = reactive({
  name: '',
  city: '',
  address: '',
  phone: ''
})

const patterns = {
  name: /^[a-zA-Z\s]{3,30}$/,
  city: /^[a-zA-Z\s]{2,30}$/,
  address: /^.{5,50}$/,
  phone: /^\d{9}$/,
}

const store = useHeadquartersStore();

const validate = () => {
  let valid = true

  if (!patterns.name.test(newHeadquater.value.name)) {
    errors.name = 'Nombre inválido (3-30 letras)'
    valid = false
  } else errors.name = ''

  if (!patterns.city.test(newHeadquater.value.city)) {
    errors.city = 'Ciudad inválida'
    valid = false
  } else errors.city = ''

  if (!patterns.address.test(newHeadquater.value.address)) {
    errors.address = 'Dirección demasiado corta'
    valid = false
  } else errors.address = ''

  if (!patterns.phone.test(newHeadquater.value.phone)) {
    errors.phone = 'Teléfono inválido (deben ser 9 dígitos)'
    valid = false
  } else errors.phone = ''

  return valid
}
const emit = defineEmits(['close', 'created'])

const createNewHeadquater = async () => {
  if(!validate()) return;

  const {error} = await store.createHeadquarters({...newHeadquater.value})
 
  if (error) {
    console.error('Error al crear la sede:', error)
    return
  }
  
  newHeadquater.value = {
    name: '',
    city: '',
    address: '',
    phone: ''
  }
  Object.keys(errors).forEach(key => {errors[key] = '' })
  
  emit('close')
  emit('created')

}
</script>

<template>
      <AppForm :onSubmit="createNewHeadquater">
        <AppInput v-model="newHeadquater.name" placeholder="Nombre de la sede" label="Nombre" required />
        <p v-if="errors.name" class="error-text">{{errors.name}}</p>
        <AppInput v-model="newHeadquater.city" placeholder="Ciudad" label="Ciudad" required/>
        <p v-if="errors.city" class="error-text">{{errors.city}}</p>
        <AppInput v-model="newHeadquater.address" placeholder="Dirección" label="Dirección" required/>
        <p v-if="errors.address" class="error-text">{{errors.address}}</p>
        <AppInput v-model="newHeadquater.phone" placeholder="Teléfono" label="Teléfono" required/>
        <p v-if="errors.phone" class="error-text">{{errors.phone}}</p>
        <AppButton type="submit" variant="green">Crear sede</AppButton>
      </AppForm>
   
</template>

<style scoped>
  .error-text {
    color: #C62828;
    font-size: 0.875em;
    margin-top: -0.5em;
  }
</style>