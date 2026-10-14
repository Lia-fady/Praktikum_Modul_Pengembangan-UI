<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04);
}
</style>
