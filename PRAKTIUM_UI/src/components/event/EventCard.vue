<script setup>
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['view-detail'])
</script>

<template>
  <AppCard class="event-card">
    <div class="event-body">
      <div class="event-meta">
        <span class="event-date">{{ event.date }}</span>
        <span class="event-category">{{ event.cat }}</span>
      </div>
      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-loc">{{ event.loc }}</p>
      <p class="event-desc">{{ event.desc }}</p>
      <div class="card-footer">
        <AppButton variant="secondary" @click="emit('view-detail', event.id)">
          View Event Details →
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.event-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.06);
}

.event-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--space-6);
}

.event-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.event-date {
  background: rgba(102, 68, 255, 0.08);
  color: var(--primary);
  border-radius: 6px;
  padding: var(--space-1) var(--space-2);
  font-size: 0.8rem;
  font-weight: 600;
}

.event-category {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.event-title {
  margin: 0 0 var(--space-2);
  font-size: 1.4rem;
  color: var(--text-main);
}

.event-loc {
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.95rem;
}

.event-desc {
  margin: 0 0 var(--space-6);
  color: var(--text-muted);
  line-height: 1.6;
  flex: 1;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
}
</style>
