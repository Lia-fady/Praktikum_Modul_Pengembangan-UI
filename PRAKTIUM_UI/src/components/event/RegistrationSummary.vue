<script setup>
import { formatEventDate } from '@/utils/formatEventDate'

defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <aside class="registration-summary">
    <p class="eyebrow">Your event</p>
    <h2>{{ event.title }}</h2>
    <dl class="event-facts">
      <div>
        <dt>Date &amp; time</dt>
        <dd>{{ formatEventDate(event.date) }}</dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>{{ event.loc }}</dd>
      </div>
      <div v-if="event.cat">
        <dt>Category</dt>
        <dd>{{ event.cat }}</dd>
      </div>
      <div v-if="event.price">
        <dt>Ticket</dt>
        <dd>{{ event.price }}</dd>
      </div>
      <div v-if="Number.isFinite(event.seatsLeft)">
        <dt>Seats remaining</dt>
        <dd>{{ event.seatsLeft }}</dd>
      </div>
    </dl>
    <p class="event-description">{{ event.summary || event.desc }}</p>
  </aside>
</template>

<style scoped>
.registration-summary {
  position: sticky;
  top: 100px;
  padding: var(--space-8);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(102, 68, 255, 0.1), transparent 45%),
    white;
  box-shadow: 0 16px 40px rgba(28, 25, 72, 0.06);
}

.eyebrow {
  margin: 0 0 var(--space-3);
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 var(--space-6);
  color: var(--text-main);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  line-height: 1.25;
}

.event-facts {
  display: grid;
  gap: var(--space-5);
  margin: 0;
}

.event-facts dt {
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  font-size: 0.82rem;
}

.event-facts dd {
  margin: 0;
  color: var(--text-main);
  font-weight: 650;
  overflow-wrap: anywhere;
}

.event-description {
  margin: var(--space-6) 0 0;
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  line-height: 1.7;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .registration-summary {
    position: static;
    padding: var(--space-6);
  }
}
</style>
