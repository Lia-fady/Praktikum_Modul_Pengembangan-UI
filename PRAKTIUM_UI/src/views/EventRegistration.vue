<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import RegistrationForm from '@/components/event/RegistrationForm.vue'
import RegistrationReceipt from '@/components/event/RegistrationReceipt.vue'
import RegistrationSummary from '@/components/event/RegistrationSummary.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useEvents } from '@/composables/useEvents'

const route = useRoute()
const router = useRouter()
const { getEventById, getRegistrationForEvent, registerAttendee } = useEvents()
const event = computed(() => getEventById(route.params.id))
const registration = computed(() => getRegistrationForEvent(route.params.id))
const isSoldOut = computed(
  () => event.value && Number.isFinite(event.value.seatsLeft) && event.value.seatsLeft <= 0,
)
const canRegister = computed(
  () => event.value && !event.value.done && !isSoldOut.value && !registration.value,
)
const submissionError = ref('')
const isSubmitting = ref(false)
const completedRegistration = ref(null)
const showSuccessModal = ref(false)

function submitRegistration(attendee) {
  if (isSubmitting.value || !canRegister.value) return

  isSubmitting.value = true
  submissionError.value = ''

  try {
    const result = registerAttendee(route.params.id, attendee)
    if (!result.success) {
      submissionError.value = result.message
      return
    }

    completedRegistration.value = result.registration
    showSuccessModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

function cancelRegistration() {
  router.push({ name: 'event-detail', params: { id: route.params.id } })
}
</script>

<template>
  <section class="registration-page">
    <header class="page-heading">
      <p class="eyebrow">Gatherly registration</p>
      <h1>Reserve your place</h1>
      <p>Review the event details and enter your attendee information.</p>
    </header>

    <div v-if="event && canRegister" class="registration-layout">
      <RegistrationSummary :event="event" />
      <RegistrationForm
        :submitting="isSubmitting"
        :submission-error="submissionError"
        @submit="submitRegistration"
        @cancel="cancelRegistration"
      />
    </div>

    <AppCard v-else class="state-card">
      <template v-if="!event">
        <h2>Event not found</h2>
        <p>This event is no longer available. Return to the catalog to find another event.</p>
      </template>
      <template v-else-if="event.done">
        <h2>Registration Closed</h2>
        <p>This event has concluded and is no longer accepting registrations.</p>
      </template>
      <template v-else-if="isSoldOut">
        <h2>Sold Out</h2>
        <p>All available seats for this event have been reserved.</p>
      </template>
      <template v-else>
        <h2>Already Registered</h2>
        <p>You already have a ticket for this event.</p>
      </template>
      <div class="state-actions">
        <AppButton
          v-if="registration"
          as="router-link"
          :to="{ name: 'ticket-receipt', params: { id: registration.id } }"
          variant="primary"
        >
          View your ticket
        </AppButton>
        <AppButton
          v-else-if="event"
          as="router-link"
          :to="{ name: 'event-detail', params: { id: event.id } }"
          variant="secondary"
        >
          Back to event details
        </AppButton>
        <AppButton v-else as="router-link" to="/browse/events" variant="primary">
          Back to event catalog
        </AppButton>
      </div>
    </AppCard>

    <AppModal
      :show="showSuccessModal"
      title="Registration Confirmed"
      :show-cancel="false"
      @close="showSuccessModal = false"
    >
      <RegistrationReceipt
        v-if="completedRegistration && event"
        :registration="completedRegistration"
        :event="event"
      />
      <template #footer>
        <div class="success-actions">
          <AppButton variant="secondary" @click="router.push({ name: 'events' })">
            Browse events
          </AppButton>
          <AppButton
            variant="primary"
            @click="
              router.push({
                name: 'ticket-receipt',
                params: { id: completedRegistration.id },
              })
            "
          >
            View ticket
          </AppButton>
        </div>
      </template>
    </AppModal>
  </section>
</template>

<style scoped>
.registration-page {
  max-width: 1180px;
  margin: 0 auto;
  padding: var(--space-6) 0 var(--space-12);
}

.page-heading {
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
  color: var(--text-main);
  font-size: clamp(1.8rem, 5vw, 2.4rem);
}

.page-heading > p:last-child {
  margin: 0;
  color: var(--text-muted);
}

.registration-layout {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
  align-items: start;
  gap: var(--space-6);
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-8);
}

.state-card h2,
.state-card p {
  margin: 0;
}

.state-card p {
  color: var(--text-muted);
}

.state-actions,
.success-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.success-actions {
  justify-content: flex-end;
  width: 100%;
}

@media (max-width: 760px) {
  .registration-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .state-actions,
  .success-actions {
    flex-direction: column;
  }

  .state-actions :deep(.app-button),
  .success-actions :deep(.app-button) {
    width: 100%;
  }
}
</style>
