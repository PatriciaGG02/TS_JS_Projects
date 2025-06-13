<script lang="ts" setup>
  import { ref } from 'vue';
  import LoginForm from './LoginForm.vue';
  import ResetPasswordForm from './ResetPasswordForm.vue';

  const isResetingPassword = ref<boolean>(false);
</script>

<template>
  <HeaderBasic />
  <main class="flex justify-center mt-5">
    <section
      v-if="!isResetingPassword"
      class="border-2 px-10 pt-5 pb-7 border-gray-400 rounded-2xl"
    >
      <LoginForm @start-reset="isResetingPassword = true" />
    </section>
    <section
      v-if="isResetingPassword"
      class="border-2 px-10 pt-5 pb-7 border-gray-400 rounded-2xl"
    >
      <ResetPasswordForm @go-login="isResetingPassword = false" />
    </section>
  </main>
</template>
