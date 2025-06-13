<template>
  <div class="progress-bar" :style="{ width: progress + '%' }"></div>
  <div class="form_container">
    <AppForm :onSubmit="submit">
      <AppSelectSearch
        label="DNI"
        placeholder="Busca por DNI o Nombre"
        v-model="form.id_client"
        :options="appointmentStore.formData.clients"
        :error="errors.id_client"
      >
      </AppSelectSearch>

      <transition name="fade">
        <AppInput
          v-show="form.id_client"
          label="Nombre del paciente"
          :modelValue="selectedClient ? selectedClient.extra : ''"
          disabled
          required
        />
      </transition>

      <transition name="fade">
        <AppSelect
          v-show="form.id_client"
          label="Especialidad"
          v-model="form.id_specialties"
          :error="errors.id_specialties"
          :options="appointmentStore.formData.specialties"
          required
        />
      </transition>

      <transition name="fade">
        <div class="form-group" v-show="form.id_specialties">
          <label for="pet">¿Es para una mascota?</label>
          <div class="form_pet_radio">
            <input type="radio" id="pet" v-model="form.pet" :value="true" />
            <label for="pet">Sí</label>
          </div>
          <div class="form_pet_radio">
            <input type="radio" id="NoPet" v-model="form.pet" :value="false" />
            <label for="NoPet">No</label>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <AppSelectSearch
          v-show="form.pet"
          label="Mascota"
          placeholder="Selecciona la mascota"
          :error="errors.id_pets"
          :options="appointmentStore.formData.clientPets || []"
          v-model="form.id_pets"
        />
      </transition>

      <transition name="fade">
        <AppInput
          v-show="form.id_specialties"
          label="Fecha"
          v-model="form.date"
          type="date"
          required
        />
      </transition>

      <transition name="fade">
        <AppInput
          v-show="form.date && form.id_specialties"
          label="Hora"
          v-model="form.time"
          type="time"
        />
      </transition>

      <transition name="fade">
        <div class="form-group" v-show="form.time">
          <label for="description">Notas</label>
          <textarea id="description" v-model="form.note" rows="3" />
        </div>
      </transition>

      <transition v-if="isEdit" name="fade">
        <AppSelect v-show="form.time" label="Estado" v-model="form.status">
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmada</option>
          <option value="cancelado">Cancelada</option>
          <option value="realizada">Realizada</option>
        </AppSelect>
      </transition>

      <transition name="fade">
        <div class="buttons-group" v-show="form.time">
          <AppButton variant="green" type="submit">Guardar</AppButton>
          <AppButton @click="emit('close')" variant="primary">Salir</AppButton>
        </div>
      </transition>
    </AppForm>
  </div>
</template>

<script setup>
// Importamos funciones de Vue necesarias para reactividad y propiedades computadas
import { reactive, computed, onMounted, watch, ref } from "vue";

// Importamos el botón de eliminación de citas
import AppForm from "../common/AppForm.vue";
import AppInput from "../common/AppInput.vue";
import AppSelect from "../common/AppSelect.vue";
import { useAppointmentStore } from "@/stores/useAppointmentStore";
import AppSelectSearch from "../common/AppSelectSearch.vue";
import AppButton from "../common/AppButton.vue";

// Definimos las propiedades que este componente espera recibir
const props = defineProps({
  selectedDate: { type: String, required: true },
  authData: { type: Object, required: true },
  isEdit: { type: Object, required: true },
});

const appointmentStore = useAppointmentStore();

onMounted(async () => {
  await appointmentStore.getFormData(props.authData.profile.id_headquarters);
});

// Definimos los eventos que el componente puede emitir
const emit = defineEmits(["close", "save"]);

const form = reactive({
  id_client: "",
  id_specialties: "",
  pet: false,
  id_pets: null,
  date: props.selectedDate,
  time: "",
  reason: null,
  note: null,
  id_employee: props.authData.profile.id,
  id_headquarters: props.authData.profile.id_headquarters,
  status: "pendiente",
});

const id_cita = ref(null);

watch(
  () => appointmentStore.formData.clients,
  (newClients) => {
    if (newClients.length && props.isEdit) {
      id_cita.value = props.isEdit.id;
      form.id_client = props.isEdit.id_client;
      form.id_specialties = props.isEdit.id_specialties;
      form.date = props.isEdit.date;
      form.time = props.isEdit.time;
      form.reason = props.isEdit.reason;
      form.note = props.isEdit.note;
      form.id_employee = props.isEdit.id_employee;
      form.id_headquarters = props.isEdit.id_headquarters;
      form.status = props.isEdit.status.toLowerCase();

      if (props.isEdit.id_pets) {
        form.pet = true;
        form.id_pets = props.isEdit.id_pets;
      } else {
        form.pet = false;
        form.id_pets = null;
      }
    }
  },
  { immediate: true }
);

const errors = reactive({
  id_client: "",
  id_specialties: "",
  id_pets: "",
  date: "",
  time: "",
});

// Barra de progreso
const progress = computed(() => {
  const keys = ["id_client", "id_specialties", "date", "time"];
  const filled = keys.filter((k) => form[k]?.trim()).length;
  return (filled / keys.length) * 100;
});

async function submit() {
  errors.id_client = "";
  errors.id_specialties = "";
  errors.id_pets = "";
  errors.date = "";
  errors.time = "";

  let valid = true;
  console.log(form);
  if (!form.id_client) {
    errors.id_client = "El DNI es obligatorio.";
    valid = false;
  }

  if (!form.id_specialties) {
    errors.id_specialties = "La especialidad es obligatoria.";
    valid = false;
  }

  if (!form.date) {
    errors.date = "La fecha es obligatoria.";
    valid = false;
  }

  if (!form.time) {
    errors.time = "La hora es obligatoria.";
    valid = false;
  }

  if (form.pet && !form.id_pets) {
    errors.id_pets = "Debe seleccionar una mascota.";
    valid = false;
  }

  if (!valid) {
    return;
  }

  const { pet, ...newAppointment } = form;

  if (props.isEdit) {
    await appointmentStore.editAppointment(id_cita.value, newAppointment);
    await appointmentStore.loadAppointments();
  } else {
    await appointmentStore.createAppointment(newAppointment);
    await appointmentStore.loadAppointments();
  }
  emit("close");
  emit("save");
}

const selectedClient = computed(() => {
  return appointmentStore.formData.clients.find(
    (cliente) => cliente.value === form.id_client
  );
});

watch(
  () => form.id_client,
  (newId) => {
    if (newId) {
      appointmentStore.getPetsByClient(newId);
    } else {
      form.id_specialties = "";
      form.pet = false;
      appointmentStore.clearPets();
    }
  }
);

watch(
  form,
  (newForm) => {
    if (newForm.id_client) errors.id_client = "";
    if (newForm.id_specialties) errors.id_specialties = "";
    if (newForm.date) errors.date = "";
    if (newForm.time) errors.time = "";
    if (newForm.id_pets) errors.id_pets = "";
  },
  { deep: true }
);
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

:root {
  --primary: var(--azul-profesional);
  --danger: #e53935;
  --bg: #ffffff;
  --shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  --transition: 0.3s ease;
  --radius: 12px;
}

/* Barra de progreso */
.progress-bar {
  height: 6px;
  background: var(--primary);
  transition: width 0.4s ease;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form_pet_radio {
  display: flex;
  gap: 1rem;
}

.form_pet_radio label {
  font-weight: 400;
}

.buttons-group {
  display: flex;
  gap: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

textarea {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  font-size: 1rem;
  transition: border-color var(--transition), box-shadow var(--azul-profesional);
  font-family: "Inter", sans-serif;
}

textarea:focus {
  border-color: var(--azul-profesional);
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
  outline: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.form_container {
  color: black;
  min-height: 250px;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
</style>
