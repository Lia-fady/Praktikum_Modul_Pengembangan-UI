<script setup lang="ts">
import Navbar from '@/components/app/Navbar.vue';
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding: 0.5rem clamp(16px, 3vw, 40px);
}
</style>
