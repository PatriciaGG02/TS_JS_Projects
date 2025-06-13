<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="['app-button', variantClass]"
    @click="handleClick"
  >
    <span v-if="formLoading && type === 'submit' && showLoader">Cargando...</span>
    <slot v-else />
  </button>
</template>

<script setup>
import { inject, computed, ref } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "button",
    validator: (val) => ["button", "submit", "reset"].includes(val),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showLoader: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: "primary",
    validator: (val) => ["primary", "red", "green", "orange"].includes(val),
  },
});

// Estado de carga del formulario desde el proveedor
const formLoading = inject("formLoading", ref(false));

const isDisabled = computed(() => {
  if (props.type === "submit") return formLoading.value || props.disabled;
  return props.disabled;
});

const variantClass = computed(() => `app-button--${props.variant}`);

const emit = defineEmits(["click"]);

function handleClick(e) {
  if (props.type !== "submit") {
    emit("click", e);
  }
}
</script>

<style scoped>
.app-button {
  padding: 0.5em 1em;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s ease;
}

/* Variantes */
.app-button--green {
  padding: 0.9rem;
  background-color: var(--verde-confianza, #43a047);
  color: white;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}
.app-button--green:hover {
  background-color: #388e3c;
}

.app-button--red {
  padding: 0.9rem;
  background-color: var(--rojo-controlado);
  color: white;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.app-button--red:hover {
  background-color: #c62828;
}

.app-button--primary {
  padding: 0.9rem;
  background-color: var(--azul-profesional, #1565c0);
  color: white;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.app-button--primary:hover {
  background-color: #0d47a1;
}

.app-button--orange {
  margin-top: 1rem;
  padding: 0.9rem;
  background-color: #ff9800;
  color: white;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.app-button--primary:hover {
  background-color: #0d47a1;
}

.app-button--orange {
  margin-top: 1rem;
  padding: 0.9rem;
  background-color: #ff9800;
  color: white;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.app-button--orange:hover {
  background-color: #ef6c00;
}

.app-button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

.app-button--orange:hover {
  background-color: #ef6c00;
}

.app-button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
