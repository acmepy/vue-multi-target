<script setup>
import { useAboutStore } from '@/stores/about';
const store = useAboutStore()
store.load();
</script>
<template>
  <div class="about">
    <h1>{{ store.data }}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
