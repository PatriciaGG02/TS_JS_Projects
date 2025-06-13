<script lang="js" setup>
import {ref, onMounted, reactive} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore';
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppButton from '../common/AppButton.vue';
import AppSelect from '../common/AppSelect.vue';

const store = useUserStore();
const headquarterStore = useHeadquartersStore();


const props = defineProps({
    coordinatorId: {
        type: String,
        required: true
    }
});

const coordinator =ref(null);
const selectedHeadquarters = ref(null);
const form = ref({
    name: '',
    first_surname: '',
    second_surname: '',
    email: '',
    date: '',
    rol: '',
}) 

const patterns = {
    name: /^[a-zA-Z\s]{3,30}$/,
    first_surname: /^[a-zA-Z\s]{3,30}$/,
    second_surname: /^[a-zA-Z\s]{0,30}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    date: /^\d{4}-\d{2}-\d{2}$/
}

const errors = reactive({
  name: '',
  first_surname: '',
  second_surname: '',
  email: '',
  date: ''
})

const validate = () => {
  let valid = true

  if (!patterns.name.test(form.value.name)) {
    errors.name = 'Nombre inválido (3-30 letras)'
    valid = false
  } else errors.name = ''

  if (!patterns.first_surname.test(form.value.first_surname)) {
  errors.first_surname = 'Primer apellido inválido'
  valid = false
} else errors.first_surname = ''

if (form.value.second_surname && !patterns.second_surname.test(form.value.second_surname)) {
  errors.second_surname = 'Segundo apellido inválido'
  valid = false
} else errors.second_surname = ''


  if (!patterns.email.test(form.value.email)) {
    errors.email = 'Email inválido'
    valid = false
  } else errors.email = ''

  if (!form.value.date) {
    errors.date = 'Fecha requerida'
    valid = false
  } else errors.date = ''

  return valid
}

onMounted(async() =>{
    await store.loadUsers();
    await headquarterStore.loadHeadquarters();

    coordinator.value = store.users.find(user => user.id === props.coordinatorId);

    selectedHeadquarters.value = headquarterStore.headquarters.find(
        headquarter => headquarter.id === coordinator.value.headquarters_id
    );
    
    if(coordinator.value){
        form.value = {
            name: coordinator.value.name || '',
            first_surname: coordinator.value.first_surname || '',
            second_surname: coordinator.value.second_surname || '',
            email: coordinator.value.email || '',
            date: coordinator.value.date || '',
            rol: coordinator.value.rol || ''
        }
    }
})

const emit = defineEmits(['close', 'modify']);

const modifyCoordinator = async() =>{
    if (!validate()) return

    if(!selectedHeadquarters.value){
       alert('Debes seleccionar una sede para el coordinador')
        return
    }


    const updateCoordinator = {
        ...form.value,
        id_headquarters: selectedHeadquarters.value.id,
        rol: 'coordinator'
    }
    

    const {error} = await store.editUser(coordinator.value.id, updateCoordinator);

    if(error) {
        alert('Error al modificar el coordinador')
        console.error(error)
    }

    emit('close');
    emit('modify');
};



</script>

<template>
    
    <div name="containerModalCoordinator">
        <AppForm :onSubmit="modifyCoordinator">
            <AppInput type="text" v-model="form.name" label="Nombre" required></AppInput>  
            <p v-if="errors.name" class="error-text">{{errors.name}}</p>
            <AppInput type="text" v-model="form.first_surname" required label="Primer apellido"></AppInput>           
            <p v-if="errors.first_surname" class="error-text">{{errors.first_surname}}</p>
            <AppInput type="text" v-model="form.second_surname" label="Segundo apellido"></AppInput>        
            <p v-if="errors.second_surname" class="error-text">{{errors.second_surname}}</p>
            <AppInput type="email" v-model="form.email" required label="E-mail"></AppInput>           
            <p v-if="errors.email" class="error-text">{{errors.email}}</p>
            <AppInput type="date" v-model="form.date" required label="Fecha de inicio"></AppInput>          
            <p v-if="errors.date" class="error-text">{{errors.date}}</p>
            <AppSelect v-model="selectedHeadquarters" required>
                <option v-for="headquarter in headquarterStore.headquarters" :key="headquarter.id" :value="headquarter">
                    {{ headquarter.name }}
                </option>
            </AppSelect>
            <AppButton type="submit" variant="green">Modificar</AppButton>
        </AppForm>

    </div>
</template>

<style scoped>
  .error-text {
    color: #C62828;
    font-size: 0.875em;
    margin-top: -0.5em;
  }
</style>