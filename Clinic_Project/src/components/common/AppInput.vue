<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      v-model="model"
      :class="{ 'input--error': error }"
    />
    <p v-if="error" class="input__error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  error: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  disabled: Boolean,
  id: String,
  required: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
}

.form-group input {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--azul-profesional, #1565c0);
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input__error {
  color: var(--rojo-controlado);
  font-size: 0.85rem;
}

.input--error {
  border-color: var(--rojo-controlado) !important;
  box-shadow: none !important;
}

.input--error:focus {
  border-color: var(--rojo-controlado) !important;
  box-shadow: none !important;
  outline: none;
}
</style>
