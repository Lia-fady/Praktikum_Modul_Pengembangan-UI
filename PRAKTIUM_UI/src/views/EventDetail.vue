<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'
import { formatEventDate } from '@/utils/formatEventDate'

const route = useRoute()
const router = useRouter()
const {
  getEventById,
  getRegistrationForEvent,
  isUserRegistered,
} = useEvents()
const event = computed(() => getEventById(route.params.id))
const isRegistered = computed(() => isUserRegistered(route.params.id))
const registration = computed(() => getRegistrationForEvent(route.params.id))
const isSoldOut = computed(
  () => event.value && Number.isFinite(event.value.seatsLeft) && event.value.seatsLeft <= 0,
)

function openRegistration() {
  router.push({ name: 'event-registration', params: { id: route.params.id } })
}
</script>

<template>
  <div v-if="event" class="event-detail-page">
    <div class="detail-content grid-asymmetric">
      <AppCard class="main-desc">
        <div class="info-block">
          <div class="top-meta">
            <span class="event-date">{{ formatEventDate(event.date) }}</span>
            <span class="event-category">{{ event.cat }}</span>
          </div>
          <h2>{{ event.title }}</h2>
          <p class="location">{{ event.loc }}</p>
          <p v-if="Number.isFinite(event.seatsLeft)" class="seat-count">
            {{ event.seatsLeft }} seats remaining
          </p>
          <p>{{ event.desc }}</p>

          <template v-if="event.summary && event.summary !== event.desc">
            <h2>About this event</h2>
            <p>{{ event.summary }}</p>
          </template>
          <h2 v-if="event.agenda?.length">Event Agenda</h2>
          <ul v-if="event.agenda?.length" class="agenda-list">
            <li v-for="item in event.agenda" :key="item.time">
              <strong>{{ item.time }}</strong> {{ item.label }}
            </li>
          </ul>
        </div>
      </AppCard>

      <div class="sidebar sticky-pane">
        <AppCard class="ticket-card">
          <h3>Attendee Registration</h3>
          <p class="price">{{ event.price || 'Free' }}</p>
          <p v-if="event.done" class="ticket-desc closed-message">
            Registration for this event has closed.
          </p>
          <template v-else-if="isRegistered">
            <p class="ticket-desc">Your seat for this event is registered.</p>
            <AppButton
              variant="secondary"
              class="register-button"
              disabled
            >
              Already Registered
            </AppButton>
            <AppButton
              v-if="registration"
              as="router-link"
              :to="{ name: 'ticket-receipt', params: { id: registration.id } }"
              variant="primary"
              class="ticket-link"
            >
              View Ticket Receipt
            </AppButton>
          </template>
          <template v-else-if="isSoldOut">
            <p class="ticket-desc closed-message">All available seats have been reserved.</p>
            <AppButton variant="secondary" class="register-button" disabled>
              Sold Out
            </AppButton>
          </template>
          <template v-else>
            <p class="ticket-desc">Secure your seat now before the quota is full.</p>
            <AppButton variant="primary" class="register-button" @click="openRegistration">
              Register Now
            </AppButton>
            <p v-if="Number.isFinite(event.seatsLeft)" class="spots">
              Only {{ event.seatsLeft }} seats left!
            </p>
          </template>
          <AppButton
            v-if="event.done"
            variant="secondary"
            class="register-button"
            disabled
          >
            Registration Closed
          </AppButton>
        </AppCard>
      </div>
    </div>
  </div>

  <AppCard v-else class="empty-state">
    <h3>Event not found</h3>
    <p>The selected event could not be located. Please return to the event list and choose another option.</p>
    <AppButton as="router-link" to="/browse/events" variant="primary">Back to event catalog</AppButton>
  </AppCard>
</template>

<style scoped>
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc {
  padding: var(--space-8);
}

.info-block {
  display: flex;
  flex-direction: column;
}

.top-meta {
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

.main-desc h2 {
  margin: 0 0 var(--space-4);
  font-size: 1.8rem;
  border-left: 4px solid var(--primary);
  padding-left: var(--space-2);
}

.location {
  margin: 0 0 var(--space-6);
  font-weight: 600;
  color: var(--primary);
}

.main-desc p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-6);
  font-size: 1.05rem;
}

.agenda-list {
  list-style: none;
  padding: 0;
  margin: var(--space-8) 0 0;
}

.agenda-list li {
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 1.05rem;
}

.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card {
  padding: var(--space-8);
  text-align: center;
}

.ticket-card h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.price {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--space-2);
}

.ticket-desc {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.ticket-link {
  width: 100%;
  margin-top: var(--space-3);
}

.seat-count {
  margin: 0 0 var(--space-4);
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
}

.closed-message {
  color: var(--text-muted);
  font-weight: 600;
}

.register-button {
  width: 100%;
}

.spots {
  margin-top: var(--space-4);
  color: #e63946;
  font-weight: 600;
  font-size: 0.95rem;
}

.empty-state {
  padding: 2rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  font-size: 1.6rem;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }
}
</style>
