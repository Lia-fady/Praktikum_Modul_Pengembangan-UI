<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: 'All',
  },
})

const emit = defineEmits(['update:modelValue'])

function selectCategory(category) {
  emit('update:modelValue', category)
}
</script>

<template>
  <div class="category-filter" aria-label="Event categories">
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      :class="['filter-chip', { active: category === modelValue }]"
      @click="selectCategory(category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.filter-chip {
  border: 1px solid var(--border-color);
  background: white;
  color: var(--text-muted);
  border-radius: 999px;
  padding: 0.6rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip.active {
  background: rgba(102, 68, 255, 0.1);
  border-color: rgba(102, 68, 255, 0.25);
  color: var(--primary);
}
</style>
