<script lang="js" setup>
import {ref, onMounted, watch, reactive, defineEmits} from 'vue'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore'
import AppInput from '../common/AppInput.vue';
import AppButton from '../common/AppButton.vue';

const store = useHeadquartersStore();
const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})

const localHeadquarter = ref({
    name: '',
    city: '',
    address: '',
    phone: ''
});

const setHeadquartersData = (data) =>{
    localHeadquarter.value = {
        name: data.name || '',
        city: data.city || '',
        address: data.address || '',
        phone: data.phone || ''
    }
}

const emit = defineEmits(['close', 'created'])

const patterns = {
  name: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/,
  city: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/,
  address: /^.{5,100}$/,
  phone: /^[0-9\s+()-]{7,20}$/
}

const errors = reactive({
  name: '',
  city: '',
  address: '',
  phone: ''
})


onMounted(() => {
  if (props.headquater) setHeadquartersData(props.headquater)
})

watch(() => props.headquater, (newVal) => {
  if (newVal) setHeadquartersData(newVal)
}, { immediate: true })

const validate = () => {
  let valid = true

  if (!patterns.name.test(localHeadquarter.value.name)) {
    errors.name = 'Nombre inválido (mínimo 3 letras)'
    valid = false
  } else errors.name = ''

  if (!patterns.city.test(localHeadquarter.value.city)) {
    errors.city = 'Ciudad inválida (mínimo 3 letras)'
    valid = false
  } else errors.city = ''

  if (!patterns.address.test(localHeadquarter.value.address)) {
    errors.address = 'Dirección inválida (mínimo 5 caracteres)'
    valid = false
  } else errors.address = ''

  if (!patterns.phone.test(localHeadquarter.value.phone)) {
    errors.phone = 'Teléfono inválido (solo números, espacios, +, -, paréntesis)'
    valid = false
  } else errors.phone = ''

  return valid
}

const modifyHeadquarter = async (e) => {
  e.preventDefault()

  const id = props.headquater.id
  if (!id) {
    console.error('No se ha encontrado la sede para poder actualizar')
    return
  }

  if (!validate()) return

  await store.editHeadquarters(id, localHeadquarter.value)
  emit('close')
  emit('created')
}

</script>

<template>
    <div name="modifyHeadquarter">
        <form :onSubmit="modifyHeadquarter">
            <AppInput type="text" v-model="localHeadquarter.name" required label="Nombre de la sede"/>  
            <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
            <AppInput type="text" v-model="localHeadquarter.city" required label="Ciudad"/>
            <p v-if="errors.city" class="error-text">{{ errors.city }}</p>
            <AppInput type="text" v-model="localHeadquarter.address" required label="Dirección"/>
            <p v-if="errors.address" class="error-text">{{ errors.address }}</p>
            <AppInput type="text" v-model="localHeadquarter.phone" required label="Teléfono"/>
            <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>

            <AppButton type="submit" variant="green">Modificar sede</AppButton>
            
        </form>
    </div>

</template>

<style scoped>
  .error-text {
    color: #C62828;
    font-size: 0.875em;
    margin-top: -0.5em;
  }
</style>