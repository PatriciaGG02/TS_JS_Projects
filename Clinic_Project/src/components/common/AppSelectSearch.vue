<template>
  <div class="app-select-search">
    <label v-if="label" :for="id" class="app-select-search__label">
      {{ label }}
    </label>

    <div class="input-wrapper">
      <input
        type="text"
        :id="id"
        class="app-select-search__input"
        :placeholder="placeholder"
        v-model="searchTerm"
        @focus="showOptions = true"
        @blur="handleBlur"
        :class="{ 'input--error': error }"
      />
      <button
        v-if="props.modelValue !== null && props.modelValue !== ''"
        type="button"
        class="clear-btn"
        @click="clearSelection"
        aria-label="Clear selection"
      >
        ×
      </button>
    </div>

    <ul
      v-if="showOptions"
      class="app-select-search__dropdown"
    >
      <li
        v-if="filteredOptions.length"
        v-for="option in filteredOptions"
        :key="option.value"
        class="app-select-search__option"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option.label }}
        <small v-if="option.extra" class="extra-label">
          {{ option.extra }}
        </small>
      </li>
      <li v-else class="app-select-search__option no-results">
        No se encontraron resultados.
      </li>
    </ul>

    <p v-if="error" class="app-select-search__error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
    validator: (arr) =>
      arr.every(
        (opt) => typeof opt === "object" && "label" in opt && "value" in opt
      ),
  },
  label: String,
  placeholder: String,
  error: String,
  id: String,
});

const emit = defineEmits(["update:modelValue"]);

const searchTerm = ref("");
const showOptions = ref(false);

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const filteredOptions = computed(() => {
  const term = normalize(searchTerm.value);
  return props.options.filter(
    (opt) =>
      normalize(opt.label).includes(term) ||
      (opt.extra && normalize(opt.extra).includes(term))
  );
});

watch(
  () => props.modelValue,
  (newValue) => {
    const match = props.options.find((opt) => opt.value === newValue);
    if (match) {
      searchTerm.value = match.label;
    } else {
      searchTerm.value = "";
    }
  },
  { immediate: true }
);

const selectOption = (option) => {
  emit("update:modelValue", option.value);
  searchTerm.value = option.label;
  showOptions.value = false;
};

const clearSelection = () => {
  emit("update:modelValue", null);
  searchTerm.value = "";
  showOptions.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    showOptions.value = false;
    const match = props.options.find((opt) => opt.label === searchTerm.value);
    if (!match) {
      const current = props.options.find(
        (opt) => opt.value === props.modelValue
      );
      searchTerm.value = current
        ? current.label + (current.extra ? ` (${current.extra})` : "")
        : "";
    }
  }, 100);
};
</script>

<style scoped>
.app-select-search {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.app-select-search__label {
  font-weight: 500;
  font-size: 0.95rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.app-select-search__input {
  position: relative;
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #888;
  padding: 0;
  line-height: 1;
  user-select: none;
}

.clear-btn:hover {
  color: #555;
}

.app-select-search__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 150px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-select-search__option {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-select-search__option:hover {
  background-color: #f0f0f0;
}

.extra-label {
  color: #777;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  font-style: italic;
}

.app-select-search__error {
  color: red;
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

.no-results {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 0.75rem;
}
</style>
