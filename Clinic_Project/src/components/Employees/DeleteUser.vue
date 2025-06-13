<template>
    <!-- Modal de confirmación -->
    <Modal title="Confirmar eliminación" @close="handleCancel">
        <p>¿Estás seguro de que quieres eliminar este usuario?</p>
        <div class="btns">
            <AppButton :disabled="loading" variant="green"  @click="confirmDelete">
                <span v-if="loading"> Eliminando...</span>
                <span v-else>Sí, eliminar</span>
            </AppButton>
            <AppButton :disabled="loading" variant="red" @click="handleCancel">Cancelar</AppButton>
        </div>
    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '../common/AppButton.vue';
import Modal from '../common/Modal.vue';
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore()
const loading = ref(false)

const emit = defineEmits(['close','deleted','error'])

// Recibe el id del usuario a eliminar como prop.
const props = defineProps({
    userId: { type: String, required: true }
})

const handleCancel = () => {
    emit('close')
}

// Función que se ejecuta al confirmar la eliminación.
const confirmDelete = async () => {
    loading.value = true
    const error = await userStore.removeUser(props.userId)
    loading.value = false
    if(error) 
        emit('error', 'Error al eliminar usuario.')
    else{
        emit('deleted')
    }
}
</script>

<style scoped>
.btns{
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-top: 1.5rem;
}
p{
    text-align: center;
}
</style>