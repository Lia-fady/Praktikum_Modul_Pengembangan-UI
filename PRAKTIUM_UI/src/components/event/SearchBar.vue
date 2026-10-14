<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label for="event-search" class="search-label">Search events</label>
    <input
      id="event-search"
      type="text"
      :value="modelValue"
      placeholder="Search by title, location, or keyword"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.search-bar input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: white;
  color: var(--text-main);
  padding: 0.9rem 1rem;
  font: inherit;
}

.search-bar input:focus {
  outline: 2px solid rgba(102, 68, 255, 0.18);
  border-color: var(--primary);
}
</style>
