<script lang="js" setup>
import {ref,onMounted, defineEmits, reactive} from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useHeadquartersStore } from '@/stores/useHeadquartersStore'
import AppForm from '../common/AppForm.vue';
import AppInput from '../common/AppInput.vue';
import AppButton from '../common/AppButton.vue';
import AppSelect from '../common/AppSelect.vue';

const userStore = useUserStore();
const headquarterStore = useHeadquartersStore();
const selectedHeadquarters = ref(null);

const props = defineProps({
    headquater: {
        type: Object,
        required: true
    }
})

const form = ref({
    name: '',
    first_surname: '',
    second_surname: '',
    email: '',
    date: '',
    rol: 'coordinator'
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


const emit = defineEmits(['close', 'create']);

onMounted(async() =>{
    await headquarterStore.loadHeadquarters();

    if(props.headquater && headquarterStore.headquarters.length > 0){
        selectedHeadquarters.value = headquarterStore.headquarters.find(
            h => h.id === props.headquater.id
        );
    }

    if(!selectedHeadquarters.value){
        selectedHeadquarters.value = headquarterStore.headquarters[0] ?? null;
    }
    
}
)

const createCoordinator = async () =>{
    if (!validate()) return
    if(!selectedHeadquarters.value){
        alert('Debes seleccionar una sede')
        return
    }

    const newCoorditanor = {
        name: form.value.name,
        first_surname: form.value.first_surname,
        second_surname: form.value.second_surname,
        email: form.value.email,
        date: form.value.date,
        rol: form.value.rol,
        id_headquarters: selectedHeadquarters.value.id
    }

    const {error} = await userStore.createUser(newCoorditanor)

    if(error){
        alert('Error al crear el coordinador')
        console.error(error)
    }

    emit('close');
    emit('create');
}


</script>

<template>

    <div name="containerNewCoordinator">
        <AppForm :onSubmit="createCoordinator">
            <AppInput type="text" v-model="form.name" required label="Nombre"></AppInput>
            <p v-if="errors.name" class="error-text">{{errors.name}}</p>
            <AppInput type="text" v-model="form.first_surname" required label="Primer apellido"></AppInput>
            <p v-if="errors.first_surname" class="error-text">{{errors.first_surname}}</p>
            <AppInput type="text" v-model="form.second_surname" label="Segundo apellido"></AppInput>
            <p v-if="errors.second_surname" class="error-text">{{errors.second_surname}}</p>
            <AppInput type="email" v-model="form.email" required label="E-mail"></AppInput>
            <p v-if="errors.email" class="error-text">{{errors.email}}</p>
            <AppInput type="date" v-model="form.date" required label="Fecha de inicio"></AppInput>
            <p v-if="errors.date" class="error-text">{{errors.date}}</p>
            <AppSelect v-model="selectedHeadquarters" required label="Sede">
                <option v-for="headquarter in headquarterStore.headquarters" :key="headquarter.id" :value="headquarter">
                    {{ headquarter.name }}
                </option>
            </AppSelect>

            <AppButton type="submit" variant="green">Crear coordinador</AppButton>

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