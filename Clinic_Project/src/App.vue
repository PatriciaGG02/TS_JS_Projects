<template>


<router-view />



</template>


<script setup>

</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--gris-claro);
  color: var(--texto);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>