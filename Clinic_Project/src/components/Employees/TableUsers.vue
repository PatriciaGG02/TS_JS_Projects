<template>
    <!-- Tarjetas para ver los usuarios -->
    <CardUser 
    v-for="user in users"
    :key="user.id"
    :user="user"
    @edit="handleEditUser"
    @delete="handleDeleteUser"
    />
    <!-- Modales para edición y eliminación de usuarios -->
    <ModalEditUser 
        v-if="showModalEditUser" 
        :user="userToEdit" 
        @close="showModalEditUser = false" 
        @submit="onUserEdited"
        @error="msg => $emit('notify', msg, 'error')"
    />
    <DeleteUser v-if="showDeleteUser" 
        :userId="userToDelete?.id" 
        @close="showDeleteUser = false" 
        @deleted="onUserDeleted"
        @error="msg => $emit('notify', msg, 'error')"
    />
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useAuthStore } from '@/stores/useAuthStore'
import CardUser from './CardUser.vue';
import ModalEditUser from './ModalEditUser.vue';
import DeleteUser from './DeleteUser.vue';

const emit = defineEmits(['notify'])

const userStore = useUserStore()
const authStore = useAuthStore()
const showModalEditUser = ref(false)
const userToEdit = ref(null)
const showDeleteUser = ref(false)
const userToDelete = ref(null)


const props = defineProps({
    search: String,
    filter: String
})

// Traducción de los valores en inglés de los roles para la searchBar.
const roleMap = {
    coordinador: 'coordinator',
    trabajador: 'worker'
}
/* Función para filtrar los usuarios a mostrar según: 
    el id del usuario logueado, sin mostrar los superadmin y según la barra de búsqueda. */
const users = computed(() => {
    const headquartersId = authStore.profile?.id_headquarters
    
    return userStore.users.filter(user => {
        console.log(user)
        const matchesHeadquarters = user.headquarters_id === headquartersId
        const notSuperAdmin = user.rol !== 'superadmin'
        let matchesSearch = true

        if (props.search){
            if (props.filter === 'rol'){
                const searchValue = props.search.trim().toLowerCase()
                const dbRole = roleMap[searchValue]
                matchesSearch = dbRole
                    ? user.rol === dbRole
                    : user.rol.includes(searchValue)
            } else{
                matchesSearch = user[props.filter]?.toLowerCase().includes(props.search.toLowerCase())
            }
        }
        return matchesHeadquarters && notSuperAdmin && matchesSearch
    })
})

// Función para controlar el modal de editar usuario.
function handleEditUser(user){
    userToEdit.value = user
    showModalEditUser.value = true
}

// Función para controlar eliminar un usuario.
function handleDeleteUser(user){
    userToDelete.value = user
    showDeleteUser.value = true
}

// Cerrar modal y mostrar notificación.
function onUserEdited(){
    showModalEditUser.value = false
    emit('notify', 'Usuario modificado correctamente','success')
}
// Refrescar la lista tras el borrado y mostrar notificación.
function onUserDeleted(){
    userStore.loadUsers()
    showDeleteUser.value = false
    emit('notify', 'Usuario eliminado correctamente.','success')
}

onMounted(() => {
    userStore.loadUsers()
})

</script>
