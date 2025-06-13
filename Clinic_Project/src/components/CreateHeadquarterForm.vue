<template>
  <AppForm :onSubmit="handleSubmit">
    <!-- Input normal -->
    <AppInput v-model="form.nombre" label="Nombre" id="nombre" required />

    <!-- AppSelect -->
    <AppSelect
      v-model="form.departamento"
      label="Departamento"
      placeholder="Selecciona un departamento"
      :options="departamentos"
      :error="errors.departamento"
      id="departamento"
    />

    <!-- AppSelectSearch -->
    <AppSelectSearch
      v-model="form.ciudad"
      label="Ciudad"
      placeholder="Busca una ciudad"
      :options="ciudades"
      :error="errors.ciudad"
      id="ciudad"
    />

    <!-- Botón -->
    <AppButton type="submit" variant="green">Crear sede</AppButton>
  </AppForm>
</template>

<script setup>
import { ref, watch } from "vue";
import AppSelect from "./common/AppSelect.vue";
import AppSelectSearch from "./common/AppSelectSearch.vue";
import AppButton from "./common/AppButton.vue";
import AppForm from "./common/AppForm.vue";
import AppInput from "./common/AppInput.vue";

const form = ref({
  nombre: "",
  departamento: "",
  ciudad: "",
});

const errors = ref({
  nombre: "",
  departamento: "",
  ciudad: "",
});

const departamentos = [
  { label: "Ventas", value: "ventas" },
  { label: "Marketing", value: "marketing" },
  { label: "Tecnología", value: "tecnologia" },
];

const ciudades = [
  { label: "Madrid", value: "madrid", extra: "España" },
  { label: "Barcelona", value: "barcelona", extra: "España" },
  { label: "Valencia", value: "valencia", extra: "España" },
];

function handleSubmit() {
  errors.value = {
    nombre: form.value.nombre.trim() ? "" : "El nombre es obligatorio.",
    departamento: form.value.departamento ? "" : "Selecciona un departamento.",
    ciudad: form.value.ciudad ? "" : "Selecciona una ciudad.",
  };

  const hasErrors = Object.values(errors.value).some((e) => e);
  if (!hasErrors) {
    alert("Formulario enviado con éxito ✅");
    // Aquí podrías hacer un fetch o cualquier otra lógica
  }
}

watch(
  form,
  (nuevo) => {
    if (nuevo.nombre.trim()) {
      errors.value.nombre = "";
    }

    if (nuevo.departamento) {
      errors.value.departamento = "";
    }

    if (nuevo.ciudad) {
      errors.value.ciudad = "";
    }
  },
  { deep: true }
);
</script>
