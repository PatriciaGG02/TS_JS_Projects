<script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

  const props = defineProps<{
    options: { id: string; name: string }[];
    modelValue: string[];
    placeholder?: string;
    label?: string;
    hideSelected?: boolean;
  }>();

  const emit = defineEmits<(e: 'update:modelValue', value: string[]) => void>();

  const search = ref('');
  const isOpen = ref(false);
  const selected = ref<string[]>(props.modelValue);

  const toggleOption = (id: string) => {
    if (selected.value.includes(id)) {
      selected.value = selected.value.filter((val) => val !== id);
    } else {
      selected.value.push(id);
    }
  };

  const filteredOptions = computed(() =>
    props.options.filter((opt) =>
      opt.name.toLowerCase().includes(search.value.toLowerCase())
    )
  );

  watch(selected, () => {
    emit('update:modelValue', selected.value);
  });

  watch(
    () => props.modelValue,
    (newVal) => {
      selected.value = newVal;
    }
  );

  const dropdownRef = ref<HTMLElement | null>(null);

  const onClickOutside = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', onClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside);
  });
</script>

<template>
  <div class="relative w-full" ref="dropdownRef">
    <label
      v-if="props.label"
      :for="props.label"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ props.label }}
    </label>

    <div
      class="relative group w-full border border-gray-300 rounded bg-white text-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 flex items-center min-h-[38px] pr-10"
      @click="isOpen = !isOpen"
    >
      <div class="flex-1 px-3 py-2 text-left">
        <template v-if="props.hideSelected || selected.length === 0">
          <span class="text-gray-900 text-sm leading-5">
            {{ props.placeholder || 'Selecciona opciones' }}
          </span>
        </template>
        <template v-else>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="id in selected"
              :key="id"
              class="bg-gray-200 rounded-full px-2 py-1 text-xs flex items-center gap-1"
            >
              {{ props.options.find((o) => o.id === id)?.name }}
              <button
                type="button"
                class="text-gray-500 hover:text-red-500 font-bold"
                @click.stop="toggleOption(id)"
              >
                ×
              </button>
            </span>
          </div>
        </template>
      </div>

      <div
        class="absolute top-0 right-0 flex items-center justify-center h-full w-[20px] bg-white text-black rounded-2xl"
      >
        <svg
          class="h-[36px] w-[36px] transition transform"
          :class="{ 'rotate-180': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div
      v-show="isOpen"
      class="absolute mt-1 w-full z-10 bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto"
    >
      <input
        type="text"
        v-model="search"
        placeholder="Buscar..."
        class="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
      />
      <ul class="divide-y divide-gray-100 max-h-48 overflow-y-auto">
        <li
          v-for="option in filteredOptions"
          :key="option.id"
          @click="toggleOption(option.id)"
          class="cursor-pointer px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            class="form-checkbox h-4 w-4 text-primary"
            :checked="selected.includes(option.id)"
            @change.stop
          />
          <span>{{ option.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
