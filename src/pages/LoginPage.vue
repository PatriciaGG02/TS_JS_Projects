<script lang="ts" setup>
  import HeaderBasic from '@/components/common/HeaderBasic.vue';
  import Login from '@/components/login/Login.vue';
</script>

<template>
  <div class="w-[100vw] h-[100vh] flex justify-center items-center">
    <div class="flex flex-col items-center">
      <HeaderBasic />
      <div>
        <Login />
      </div>
    </div>
  </div>
</template>
