<template>
  <div class="app-select">
    <label v-if="label" :for="id" class="app-select__label">{{ label }}</label>
    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      class="app-select__field"
      :class="{ 'app-select__field--error': error }"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
      <slot></slot>
    </select>
    <p v-if="error" class="app-select__error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  error: String,
  disabled: Boolean,
  id: String,
  options: {
    type: Array,
    required: true,
    validator: (arr) =>
      arr.every(
        (opt) => typeof opt === "object" && "label" in opt && "value" in opt
      ),
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped>
.app-select {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.app-select__label {
  font-weight: 500;
  font-size: 0.95rem;
}

.app-select__field {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.app-select__field:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.app-select__error {
  color: var(--rojo-controlado);
  font-size: 0.85rem;
}

.app-select__field:focus {
  outline: none;
  border-color: var(--azul-profesional, #1565c0);
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
}

.app-select__field--error {
  border-color: var(--rojo-controlado) !important;
  box-shadow: none !important;
}

.app-select__field--error:focus {
  border-color: var(--rojo-controlado) !important;
  box-shadow: none !important;
  outline: none;
}
</style>
