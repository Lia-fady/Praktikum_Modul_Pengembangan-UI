<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'
import { formatEventDate } from '@/utils/formatEventDate'

const route = useRoute()
const { getRegistrationById, getEventById, isEventDone } = useEvents()
const registration = computed(() => getRegistrationById(route.params.id))
const event = computed(() =>
  registration.value ? getEventById(registration.value.eventId) : null,
)
</script>

<template>
  <section class="receipt-page">
    <AppCard v-if="registration" class="receipt-card">
      <header class="receipt-header">
        <div>
          <p class="eyebrow">Gatherly digital ticket</p>
          <h1>Registration Confirmed</h1>
        </div>
        <span class="confirmed-mark" aria-label="Confirmed">✓</span>
      </header>

      <div class="reference-block">
        <span>Booking reference</span>
        <strong>{{ registration.reference }}</strong>
      </div>

      <div v-if="!event" class="event-unavailable" role="status">
        The event details are no longer available. Keep this receipt as proof of your registration.
      </div>

      <section v-if="event" class="receipt-section">
        <h2>Event details</h2>
        <dl>
          <div>
            <dt>Event</dt>
            <dd>{{ event.title }}</dd>
          </div>
          <div>
            <dt>Date &amp; time</dt>
            <dd>{{ formatEventDate(event.date) }}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{{ event.loc }}</dd>
          </div>
          <div>
            <dt>Event status</dt>
            <dd>{{ isEventDone(event) ? 'Concluded' : 'Upcoming' }}</dd>
          </div>
        </dl>
      </section>

      <section class="receipt-section">
        <h2>Attendee</h2>
        <dl>
          <div>
            <dt>Full name</dt>
            <dd>{{ registration.name }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{{ registration.email }}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{{ registration.phone }}</dd>
          </div>
          <div>
            <dt>Date of birth</dt>
            <dd>{{ registration.dateOfBirth }}</dd>
          </div>
          <div class="full-width">
            <dt>Reason for attending</dt>
            <dd>{{ registration.reason }}</dd>
          </div>
        </dl>
      </section>

      <p class="receipt-instructions">
        Present this reference to the event organizer at check-in. This ticket is stored in this
        browser and is not linked to an online account.
      </p>
    </AppCard>

    <AppCard v-else class="missing-ticket">
      <h1>Ticket not found</h1>
      <p>This ticket may have been cancelled or the associated event was removed.</p>
    </AppCard>

    <div class="receipt-actions">
      <AppButton as="router-link" to="/your-events" variant="secondary">
        Back to Your Events
      </AppButton>
      <AppButton as="router-link" to="/browse/events" variant="primary">
        Browse events
      </AppButton>
    </div>
  </section>
</template>

<style scoped>
.receipt-page {
  width: min(100%, 820px);
  margin: var(--space-8) auto var(--space-12);
}

.receipt-card,
.missing-ticket {
  padding: clamp(var(--space-5), 5vw, var(--space-8));
}

.receipt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--border-color);
}

.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: var(--text-main);
  font-size: clamp(1.6rem, 5vw, 2.2rem);
}

.confirmed-mark {
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #e6f6ed;
  color: #197847;
  font-size: 1.8rem;
  font-weight: 800;
}

.reference-block {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-5) 0;
  padding: var(--space-5);
  border: 1px dashed rgba(102, 68, 255, 0.5);
  border-radius: 14px;
  background: rgba(102, 68, 255, 0.05);
}

.reference-block span,
dt {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.reference-block strong {
  color: var(--primary);
  font-size: clamp(1.05rem, 4vw, 1.35rem);
  letter-spacing: 0.06em;
  overflow-wrap: anywhere;
}

.receipt-section {
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--border-color);
}

.receipt-section h2 {
  margin: 0 0 var(--space-4);
  font-size: 1.2rem;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  margin: 0;
}

dt {
  margin-bottom: var(--space-1);
}

dd {
  margin: 0;
  color: var(--text-main);
  font-weight: 650;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.full-width {
  grid-column: 1 / -1;
}

.event-unavailable {
  padding: var(--space-4);
  border-radius: 10px;
  background: #fff8e6;
  color: #775b08;
  line-height: 1.6;
}

.receipt-instructions,
.missing-ticket p {
  margin: var(--space-5) 0 0;
  color: var(--text-muted);
  line-height: 1.7;
}

.missing-ticket h1 {
  margin-bottom: var(--space-3);
}

.receipt-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

@media (max-width: 560px) {
  dl {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .receipt-actions {
    flex-direction: column-reverse;
  }

  .receipt-actions :deep(.app-button) {
    width: 100%;
  }
}
</style>
