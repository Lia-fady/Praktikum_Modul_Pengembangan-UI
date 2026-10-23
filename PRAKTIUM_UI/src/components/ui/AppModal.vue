<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Please confirm',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
})

const emit = defineEmits(['confirm', 'close'])

function onEnter(element, done) {
  window.setTimeout(() => {
    element.classList.add('is-visible')
    window.setTimeout(done, 220)
  }, 16)
}

function onLeave(element, done) {
  element.classList.remove('is-visible')
  element.classList.add('is-leaving')
  window.setTimeout(done, 220)
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div
      v-if="show"
      class="modal-overlay"
      role="presentation"
      @click.self="emit('close')"
      @keydown.esc="emit('close')"
    >
      <section
        class="modal-dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
      >
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button type="button" class="cancel-button" @click="emit('close')">
            {{ cancelText }}
          </button>
          <button type="button" class="confirm-button" @click="emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  background: rgba(28, 25, 72, 0.28);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.modal-overlay.is-visible {
  opacity: 1;
}

.modal-overlay.is-leaving {
  opacity: 0;
}

.modal-dialog {
  width: min(100%, 440px);
  padding: var(--space-8);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: white;
  box-shadow: 0 24px 80px rgba(28, 25, 72, 0.2);
  transform: translateY(12px) scale(0.98);
  transition: transform 0.2s ease;
}

.modal-overlay.is-visible .modal-dialog {
  transform: translateY(0) scale(1);
}

.modal-dialog h2 {
  margin: 0 0 var(--space-3);
  color: var(--text-main);
  font-size: 1.4rem;
}

.modal-dialog p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.modal-actions button {
  min-height: 44px;
  padding: 0.65rem 1rem;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button {
  border-color: var(--border-color) !important;
  background: white;
  color: var(--text-main);
}

.confirm-button {
  background: #dc3545;
  color: white;
}

.confirm-button:hover {
  background: #bb2d3b;
}

</style>
