<script setup>
import { formatEventDate } from '@/utils/formatEventDate'

defineProps({
  registration: {
    type: Object,
    required: true,
  },
  event: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="receipt-summary">
    <p class="success-label"><span aria-hidden="true">✓</span> Registration Confirmed</p>
    <p class="receipt-help">Your digital ticket is ready. Keep this reference for check-in.</p>
    <div class="reference">
      <span>Booking reference</span>
      <strong>{{ registration.reference }}</strong>
    </div>
    <dl>
      <div>
        <dt>Attendee</dt>
        <dd>{{ registration.name }}</dd>
      </div>
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
    </dl>
    <p class="ticket-note">Show your ticket reference to the event organizer when you arrive.</p>
  </div>
</template>

<style scoped>
.receipt-summary {
  color: var(--text-main);
}

.success-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  color: #197847;
  font-size: 1.1rem;
  font-weight: 750;
}

.success-label span {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: #e6f6ed;
}

.receipt-help {
  margin: var(--space-2) 0 var(--space-5);
  color: var(--text-muted);
}

.reference {
  display: grid;
  gap: var(--space-1);
  margin-bottom: var(--space-5);
  padding: var(--space-4);
  border: 1px dashed rgba(102, 68, 255, 0.4);
  border-radius: 12px;
  background: rgba(102, 68, 255, 0.06);
}

.reference span,
dt {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.reference strong {
  color: var(--primary);
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

dl {
  display: grid;
  gap: var(--space-4);
  margin: 0;
}

dt {
  margin-bottom: var(--space-1);
}

dd {
  margin: 0;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.ticket-note {
  margin: var(--space-5) 0 0;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
