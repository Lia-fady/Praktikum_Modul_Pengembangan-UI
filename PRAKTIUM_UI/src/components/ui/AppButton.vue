<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  as: {
    type: String,
    default: 'button',
  },
  type: {
    type: String,
    default: 'button',
  },
  to: {
    type: [String, Object],
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const classes = computed(() => ['app-button', `variant-${props.variant}`])
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
    :to="to"
    :type="as === 'button' ? type : undefined"
    :class="classes"
    :disabled="as === 'button' && (loading || $attrs.disabled)"
    :aria-busy="loading ? 'true' : undefined"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <slot />
  </component>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: auto;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
}

.app-button:hover {
  transform: translateY(-1px);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.75;
  transform: none;
}

.btn-spinner {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 0.7s linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}

.variant-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 68, 255, 0.25);
}

.variant-primary:hover {
  background: var(--primary-hover);
}

.variant-secondary {
  background: white;
  border-color: var(--border-color);
  color: var(--text-main);
}

.variant-secondary:hover {
  background: var(--bg-gray);
}
</style>
