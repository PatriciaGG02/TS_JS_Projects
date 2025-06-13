<template>
  <form @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script setup>
import { ref, provide, toRef } from "vue";

const props = defineProps({
  onSubmit: {
    type: Function,
    required: true,
  },
});

const loading = ref(false);
provide("formLoading", loading);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await props.onSubmit();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
