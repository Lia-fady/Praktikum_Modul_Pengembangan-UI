<template>
  <div class="browse-page">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.browse-page {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>