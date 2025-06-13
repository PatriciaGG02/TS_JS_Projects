<script lang="js" setup>
import {defineEmits} from 'vue'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore'
import AppButton from '../common/AppButton.vue';

const store = useHeadquartersStore();

const props = defineProps({
  headquater: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['close', 'delete'])
const deteleHeadquarter = async () => {
 const id = props.headquater.id

if(!id){
    console.error('No se ha encontrado la sede')
    return
}

const {error} = await store.removeHeadquarters(id)
if (error) {
    console.error('Error al eliminar la sede:', error)
    return
}
emit('close')
emit('delete')
}
</script>

<template>
  <div name="deleteHeadquarter">
    <p>¿Estás seguro de que deseas eliminar esta sede?</p>
    <AppButton @click="deteleHeadquarter">Eliminar</AppButton>
  </div>
</template>
