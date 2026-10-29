<script setup>
import { computed, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useEvents } from '@/composables/useEvents'
import { formatEventDate } from '@/utils/formatEventDate'

const { userRegistrations, getEventById, isEventDone, cancelRegistration } = useEvents()
const ticketItems = computed(() =>
  userRegistrations.value.map((registration) => ({
    registration,
    event: getEventById(registration.eventId),
  })),
)
const selectedRegistrationId = ref(null)
const cancellationError = ref('')
const cancellationNotice = ref('')

function requestCancellation(registrationId) {
  cancellationError.value = ''
  selectedRegistrationId.value = registrationId
}

function closeCancellation() {
  selectedRegistrationId.value = null
}

function confirmCancellation() {
  const cancelled = cancelRegistration(selectedRegistrationId.value)
  if (!cancelled) {
    cancellationError.value = 'This ticket can no longer be cancelled.'
    selectedRegistrationId.value = null
    return
  }

  cancellationNotice.value = 'Your registration was cancelled and the event quota was updated.'
  selectedRegistrationId.value = null
}
</script>

<template>
  <section class="your-events-page">
    <header class="page-heading">
      <div>
        <p class="eyebrow">Digital ticket wallet</p>
        <h1>Your Events</h1>
        <p>View and manage the event registrations saved in this browser.</p>
      </div>
      <AppButton as="router-link" to="/browse/events" variant="primary">
        Explore events
      </AppButton>
    </header>

    <p v-if="cancellationNotice" class="notice" role="status">{{ cancellationNotice }}</p>
    <p v-if="cancellationError" class="notice error" role="alert">{{ cancellationError }}</p>

    <div v-if="ticketItems.length" class="ticket-grid">
      <AppCard
        v-for="{ registration, event } in ticketItems"
        :key="registration.id"
        class="ticket-card"
      >
        <div class="ticket-heading">
          <span
            class="status-badge"
            :class="{ concluded: event && isEventDone(event) }"
          >
            {{ !event ? 'Event unavailable' : isEventDone(event) ? 'Concluded' : 'Upcoming' }}
          </span>
          <span class="reference">{{ registration.reference }}</span>
        </div>
        <h2>{{ event?.title || 'Event details unavailable' }}</h2>
        <dl>
          <div>
            <dt>Date &amp; time</dt>
            <dd>{{ event ? formatEventDate(event.date) : 'Unavailable' }}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{{ event?.loc || 'Unavailable' }}</dd>
          </div>
          <div>
            <dt>Attendee</dt>
            <dd>{{ registration.name }}</dd>
          </div>
        </dl>
        <div class="ticket-actions">
          <AppButton
            as="router-link"
            :to="{ name: 'ticket-receipt', params: { id: registration.id } }"
            variant="primary"
          >
            View ticket
          </AppButton>
          <button
            v-if="event && !isEventDone(event)"
            type="button"
            class="cancel-ticket"
            @click="requestCancellation(registration.id)"
          >
            Cancel registration
          </button>
        </div>
      </AppCard>
    </div>

    <AppCard v-else class="empty-state">
      <div class="empty-icon" aria-hidden="true">🎟️</div>
      <h2>No tickets yet</h2>
      <p>When you register for an event, your digital ticket will appear here.</p>
      <AppButton as="router-link" to="/browse/events" variant="primary">
        Find an event
      </AppButton>
    </AppCard>

    <AppModal
      :show="Boolean(selectedRegistrationId)"
      title="Cancel this registration?"
      message="Your ticket will be removed and its seat returned to the event."
      confirm-text="Cancel registration"
      cancel-text="Keep ticket"
      @confirm="confirmCancellation"
      @close="closeCancellation"
    />
  </section>
</template>

<style scoped>
.your-events-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: var(--space-6) 0 var(--space-12);
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-heading h1 {
  margin: 0 0 var(--space-2);
  font-size: clamp(1.8rem, 5vw, 2.4rem);
}

.page-heading p:last-child,
.empty-state p {
  margin: 0;
  color: var(--text-muted);
}

.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: var(--space-5);
}

.ticket-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
}

.ticket-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.status-badge {
  border-radius: 999px;
  padding: var(--space-1) var(--space-3);
  background: #e9f7ef;
  color: #197847;
  font-size: 0.78rem;
  font-weight: 700;
}

.status-badge.concluded {
  background: #f0eff5;
  color: var(--text-muted);
}

.reference {
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.ticket-card h2 {
  margin: 0;
  font-size: 1.25rem;
}

dl {
  display: grid;
  gap: var(--space-3);
  margin: 0;
}

dt {
  margin-bottom: var(--space-1);
  color: var(--text-muted);
  font-size: 0.8rem;
}

dd {
  margin: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.ticket-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-2);
}

.cancel-ticket {
  border: 0;
  background: none;
  color: #b42332;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.cancel-ticket:hover {
  text-decoration: underline;
}

.empty-state {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
  text-align: center;
}

.empty-state h2 {
  margin: 0;
}

.empty-icon {
  font-size: 2.5rem;
}

.notice {
  margin: 0 0 var(--space-5);
  padding: var(--space-3) var(--space-4);
  border-radius: 10px;
  background: #e9f7ef;
  color: #197847;
}

.notice.error {
  background: #fff1f2;
  color: #b42332;
}

@media (max-width: 600px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .ticket-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
