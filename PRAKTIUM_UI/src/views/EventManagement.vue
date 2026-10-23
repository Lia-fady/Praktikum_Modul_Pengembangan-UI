<script setup>
import { computed, reactive, ref } from 'vue'

import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'
import { formatEventDate } from '@/utils/formatEventDate'

const { activeEvents, completedEvents, createEvent, completeEvent, deleteEvent } = useEvents()

const currentTab = ref('active')
const form = reactive({
  title: '',
  desc: '',
  cat: '',
  loc: '',
  date: '',
  price: '',
})
const errorMessage = ref('')
const successMessage = ref('')
const modalAction = ref(null)
const selectedEventId = ref(null)

const modalContent = computed(() => {
  if (modalAction.value === 'complete') {
    return {
      title: 'Complete this event?',
      message: 'This event will move to Completed Events and will no longer appear in the public catalog.',
      confirmText: 'Complete Event',
    }
  }

  return {
    title: 'Delete this event?',
    message: 'This event will be permanently removed from Gatherly. This action cannot be undone.',
    confirmText: 'Delete Event',
  }
})

function resetForm() {
  Object.assign(form, {
    title: '',
    desc: '',
    cat: '',
    loc: '',
    date: '',
    price: '',
  })
}

function submitEvent() {
  successMessage.value = ''
  const requiredFields = [form.title, form.desc, form.cat, form.loc, form.date]

  if (requiredFields.some((field) => !field.trim())) {
    errorMessage.value = 'Please complete all required fields before creating your event.'
    return
  }

  createEvent({
    title: form.title.trim(),
    desc: form.desc.trim(),
    cat: form.cat.trim(),
    loc: form.loc.trim(),
    date: new Date(form.date).toISOString(),
    price: form.price.trim() || 'Free',
    seatsLeft: null,
    summary: form.desc.trim(),
  })

  resetForm()
  errorMessage.value = ''
  successMessage.value = 'Your event was created successfully.'
  currentTab.value = 'active'
}

function openConfirmation(action, eventId) {
  modalAction.value = action
  selectedEventId.value = eventId
}

function closeModal() {
  modalAction.value = null
  selectedEventId.value = null
}

function confirmAction() {
  if (modalAction.value === 'complete') {
    completeEvent(selectedEventId.value)
  } else if (modalAction.value === 'delete') {
    deleteEvent(selectedEventId.value)
  }

  closeModal()
}
</script>

<template>
  <section class="event-management">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Organizer workspace</p>
        <h2>Event Management</h2>
        <p class="page-description">Create events and manage their lifecycle in one place.</p>
      </div>
      <AppButton variant="primary" @click="currentTab = 'create'">+ Create Event</AppButton>
    </div>

    <div class="tabs" role="tablist" aria-label="Event management sections">
      <button
        id="tab-active"
        type="button"
        role="tab"
        :aria-selected="currentTab === 'active'"
        :class="{ selected: currentTab === 'active' }"
        @click="currentTab = 'active'"
      >
        Active Events <span class="tab-count">{{ activeEvents.length }}</span>
      </button>
      <button
        id="tab-create"
        type="button"
        role="tab"
        :aria-selected="currentTab === 'create'"
        :class="{ selected: currentTab === 'create' }"
        @click="currentTab = 'create'"
      >
        Create Event
      </button>
      <button
        id="tab-completed"
        type="button"
        role="tab"
        :aria-selected="currentTab === 'completed'"
        :class="{ selected: currentTab === 'completed' }"
        @click="currentTab = 'completed'"
      >
        Completed Events <span class="tab-count">{{ completedEvents.length }}</span>
      </button>
    </div>

    <p v-if="successMessage && currentTab === 'active'" class="feedback success" role="status">
      {{ successMessage }}
    </p>

    <div v-if="currentTab === 'active'" class="event-grid" role="tabpanel" aria-labelledby="tab-active">
      <AppCard v-for="event in activeEvents" :key="event.id" class="management-card">
        <div class="event-meta">
          <span class="category-badge">{{ event.cat }}</span>
          <span class="status-badge status-active">Active</span>
        </div>
        <h3>{{ event.title }}</h3>
        <p class="event-date">{{ formatEventDate(event.date) }}</p>
        <p class="event-location">{{ event.loc }}</p>
        <p class="event-description">{{ event.desc }}</p>
        <div class="card-actions">
          <button
            type="button"
            class="complete-button"
            @click="openConfirmation('complete', event.id)"
          >
            Complete Event
          </button>
          <button
            type="button"
            class="delete-button"
            @click="openConfirmation('delete', event.id)"
          >
            Delete
          </button>
        </div>
      </AppCard>

      <AppCard v-if="activeEvents.length === 0" class="empty-state">
        <div class="empty-icon" aria-hidden="true">✦</div>
        <h3>No active events yet</h3>
        <p>Create your first event to publish it in the Gatherly public catalog.</p>
        <AppButton variant="primary" @click="currentTab = 'create'">Create your first event</AppButton>
      </AppCard>
    </div>

    <form
      v-else-if="currentTab === 'create'"
      class="event-form"
      role="tabpanel"
      aria-labelledby="tab-create"
      novalidate
      @submit.prevent="submitEvent"
    >
      <div class="form-heading">
        <h3>Create a new event</h3>
        <p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
      </div>

      <p v-if="errorMessage" class="feedback error" role="alert">{{ errorMessage }}</p>

      <div class="form-grid">
        <label class="form-field">
          Event title <span aria-hidden="true">*</span>
          <input v-model="form.title" type="text" placeholder="e.g. Community Design Meetup" />
        </label>
        <label class="form-field">
          Category <span aria-hidden="true">*</span>
          <input
            v-model="form.cat"
            type="text"
            list="event-categories"
            placeholder="e.g. Workshop"
          />
          <datalist id="event-categories">
            <option value="Workshop" />
            <option value="Meetup" />
            <option value="Conference" />
            <option value="Seminar" />
            <option value="Competition" />
          </datalist>
        </label>
        <label class="form-field">
          Location <span aria-hidden="true">*</span>
          <input v-model="form.loc" type="text" placeholder="Venue or online location" />
        </label>
        <label class="form-field">
          Date and time <span aria-hidden="true">*</span>
          <input v-model="form.date" type="datetime-local" />
        </label>
        <label class="form-field">
          Ticket price
          <input v-model="form.price" type="text" placeholder="Free or IDR 100.000" />
        </label>
        <label class="form-field full-width">
          Description <span aria-hidden="true">*</span>
          <textarea
            v-model="form.desc"
            rows="5"
            placeholder="Tell attendees what to expect from this event."
          ></textarea>
        </label>
      </div>

      <div class="form-actions">
        <AppButton variant="secondary" @click="resetForm">Clear form</AppButton>
        <AppButton variant="primary" type="submit">Publish Event</AppButton>
      </div>
    </form>

    <div
      v-else
      class="event-grid"
      role="tabpanel"
      aria-labelledby="tab-completed"
    >
      <AppCard v-for="event in completedEvents" :key="event.id" class="management-card completed-card">
        <div class="event-meta">
          <span class="category-badge">{{ event.cat }}</span>
          <span class="status-badge status-completed">Completed</span>
        </div>
        <h3>{{ event.title }}</h3>
        <p class="event-date">{{ formatEventDate(event.date) }}</p>
        <p class="event-location">{{ event.loc }}</p>
        <p class="event-description">{{ event.desc }}</p>
      </AppCard>

      <AppCard v-if="completedEvents.length === 0" class="empty-state">
        <div class="empty-icon" aria-hidden="true">✓</div>
        <h3>No completed events</h3>
        <p>Events you complete will be archived here.</p>
      </AppCard>
    </div>

    <AppModal
      :show="Boolean(modalAction)"
      :title="modalContent.title"
      :message="modalContent.message"
      :confirm-text="modalContent.confirmText"
      @confirm="confirmAction"
      @close="closeModal"
    />
  </section>
</template>

<style scoped>
.event-management {
  max-width: 1180px;
  margin: 0 auto;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-heading h2 {
  margin: 0;
  color: var(--text-main);
  font-size: clamp(1.6rem, 4vw, 2rem);
}

.page-description {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
}

.tabs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--space-6);
}

.tabs button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  flex: 0 0 auto;
  padding: var(--space-3) var(--space-4);
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.tabs button.selected {
  border-bottom-color: var(--primary);
  color: var(--primary);
}

.tab-count {
  display: inline-grid;
  min-width: 24px;
  height: 24px;
  place-items: center;
  padding-inline: 6px;
  border-radius: 999px;
  background: var(--bg-gray);
  font-size: 0.8rem;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 310px), 1fr));
  align-items: stretch;
  gap: var(--space-6);
}

.management-card {
  display: flex;
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

.category-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.category-badge {
  background: rgba(102, 68, 255, 0.08);
  color: var(--primary);
}

.status-active {
  background: rgba(46, 204, 113, 0.12);
  color: #16834a;
}

.status-completed {
  background: #f0f1f4;
  color: #686b76;
}

.management-card h3 {
  margin: 0 0 var(--space-3);
  color: var(--text-main);
  font-size: 1.2rem;
}

.event-date,
.event-location {
  margin: 0 0 var(--space-2);
  color: var(--text-muted);
  font-size: 0.92rem;
}

.event-description {
  flex: 1;
  margin: var(--space-3) 0 var(--space-6);
  color: var(--text-muted);
  line-height: 1.6;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: auto;
}

.card-actions button {
  min-height: 42px;
  padding: 0.6rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.complete-button {
  background: var(--primary);
  color: white;
}

.complete-button:hover {
  background: var(--primary-hover);
}

.delete-button {
  border-color: #f2c8cc !important;
  background: #fff;
  color: #c82f3d;
}

.completed-card .event-description {
  text-decoration: line-through;
  opacity: 0.75;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: clamp(2rem, 6vw, 4rem);
  text-align: center;
}

.empty-icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  font-size: 1.8rem;
}

.empty-state h3,
.empty-state p {
  margin: 0;
}

.empty-state p {
  max-width: 460px;
  color: var(--text-muted);
  line-height: 1.6;
}

.event-form {
  max-width: 820px;
  padding: clamp(var(--space-4), 4vw, var(--space-8));
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: white;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04);
}

.form-heading h3 {
  margin: 0 0 var(--space-2);
  color: var(--text-main);
  font-size: 1.3rem;
}

.form-heading p {
  margin: 0 0 var(--space-6);
  color: var(--text-muted);
}

.form-heading span,
.form-field > span {
  color: #dc3545;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: var(--text-main);
  font-weight: 600;
}

.form-field input,
.form-field textarea {
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: white;
  color: var(--text-main);
  font: inherit;
  font-weight: 400;
}

.form-field textarea {
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: 2px solid rgba(102, 68, 255, 0.18);
  border-color: var(--primary);
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.feedback {
  margin: 0 0 var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: 10px;
  font-weight: 600;
}

.error {
  background: #fff0f0;
  color: #b42332;
}

.success {
  background: #eaf8f0;
  color: #187746;
}

@media (max-width: 640px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }
}
</style>
