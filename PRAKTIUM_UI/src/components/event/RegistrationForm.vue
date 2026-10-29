<script setup>
import { computed, reactive, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'

const props = defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
  submissionError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  reason: '',
})
const errors = reactive({})
const showCancelConfirmation = ref(false)
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const isFormDirty = computed(() => Object.values(form).some((value) => value.trim()))

function validateField(field) {
  const value = form[field].trim()

  if (field === 'name') {
    return value ? '' : 'Enter your full name.'
  }
  if (field === 'email') {
    if (!value) return 'Enter your email address.'
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ''
      : 'Enter a valid email address, such as name@example.com.'
  }
  if (field === 'phone') {
    if (!value) return 'Enter your phone number.'
    if (!/^\+?[\d\s().-]+$/.test(value)) {
      return 'Use only digits and common phone number separators.'
    }
    const digits = value.replace(/\D/g, '')
    return digits.length >= 8 && digits.length <= 15
      ? ''
      : 'Enter a phone number containing 8 to 15 digits.'
  }
  if (field === 'dateOfBirth') {
    if (!value) return 'Enter your date of birth.'
    return value <= today ? '' : 'Date of birth cannot be in the future.'
  }
  if (field === 'reason') {
    if (!value) return 'Tell us why you want to attend.'
    return value.length >= 10 ? '' : 'Please enter at least 10 characters.'
  }

  return ''
}

function updateError(field) {
  if (Object.hasOwn(errors, field)) {
    errors[field] = validateField(field)
  }
}

function submitForm() {
  for (const field of Object.keys(form)) {
    errors[field] = validateField(field)
  }

  if (Object.values(errors).some(Boolean)) {
    return
  }

  emit('submit', {
    ...form,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    reason: form.reason.trim(),
  })
}

function requestCancel() {
  if (props.submitting) return
  if (isFormDirty.value) {
    showCancelConfirmation.value = true
    return
  }
  emit('cancel')
}

function confirmCancel() {
  showCancelConfirmation.value = false
  emit('cancel')
}
</script>

<template>
  <form class="registration-form" novalidate @submit.prevent="submitForm">
    <div class="form-heading">
      <p class="eyebrow">Attendee details</p>
      <h2>Complete your registration</h2>
      <p>All fields are required to reserve your place.</p>
    </div>

    <p v-if="submissionError" class="submission-error" role="alert">{{ submissionError }}</p>

    <div class="fields-grid">
      <label class="form-field full-width" for="attendee-name">
        Full name
        <input
          id="attendee-name"
          v-model="form.name"
          :class="{ invalid: errors.name }"
          :aria-invalid="Boolean(errors.name)"
          aria-describedby="attendee-name-error"
          autocomplete="name"
          type="text"
          @blur="updateError('name')"
          @input="updateError('name')"
        />
        <span v-if="errors.name" id="attendee-name-error" class="field-error" role="alert">
          {{ errors.name }}
        </span>
      </label>

      <label class="form-field" for="attendee-email">
        Email address
        <input
          id="attendee-email"
          v-model="form.email"
          :class="{ invalid: errors.email }"
          :aria-invalid="Boolean(errors.email)"
          aria-describedby="attendee-email-error"
          autocomplete="email"
          type="email"
          @blur="updateError('email')"
          @input="updateError('email')"
        />
        <span v-if="errors.email" id="attendee-email-error" class="field-error" role="alert">
          {{ errors.email }}
        </span>
      </label>

      <label class="form-field" for="attendee-phone">
        Phone number
        <input
          id="attendee-phone"
          v-model="form.phone"
          :class="{ invalid: errors.phone }"
          :aria-invalid="Boolean(errors.phone)"
          aria-describedby="attendee-phone-error"
          autocomplete="tel"
          inputmode="tel"
          type="tel"
          @blur="updateError('phone')"
          @input="updateError('phone')"
        />
        <span v-if="errors.phone" id="attendee-phone-error" class="field-error" role="alert">
          {{ errors.phone }}
        </span>
      </label>

      <label class="form-field full-width" for="attendee-birth-date">
        Date of birth
        <input
          id="attendee-birth-date"
          v-model="form.dateOfBirth"
          :class="{ invalid: errors.dateOfBirth }"
          :aria-invalid="Boolean(errors.dateOfBirth)"
          aria-describedby="attendee-birth-date-error"
          :max="today"
          type="date"
          @blur="updateError('dateOfBirth')"
          @input="updateError('dateOfBirth')"
        />
        <span v-if="errors.dateOfBirth" id="attendee-birth-date-error" class="field-error" role="alert">
          {{ errors.dateOfBirth }}
        </span>
      </label>

      <label class="form-field full-width" for="attendee-reason">
        Why would you like to attend?
        <textarea
          id="attendee-reason"
          v-model="form.reason"
          :class="{ invalid: errors.reason }"
          :aria-invalid="Boolean(errors.reason)"
          aria-describedby="attendee-reason-error"
          rows="4"
          @blur="updateError('reason')"
          @input="updateError('reason')"
        ></textarea>
        <span v-if="errors.reason" id="attendee-reason-error" class="field-error" role="alert">
          {{ errors.reason }}
        </span>
      </label>
    </div>

    <div class="form-actions">
      <AppButton variant="secondary" :disabled="submitting" @click="requestCancel">
        Cancel
      </AppButton>
      <AppButton variant="primary" type="submit" :disabled="submitting">
        {{ submitting ? 'Registering…' : 'Complete Registration' }}
      </AppButton>
    </div>
  </form>

  <AppModal
    :show="showCancelConfirmation"
    title="Discard registration details?"
    message="Your entered information will be lost if you leave this page."
    confirm-text="Discard and leave"
    cancel-text="Keep filling"
    @confirm="confirmCancel"
    @close="showCancelConfirmation = false"
  />
</template>

<style scoped>
.registration-form {
  padding: clamp(var(--space-6), 4vw, var(--space-8));
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: white;
  box-shadow: 0 16px 40px rgba(28, 25, 72, 0.06);
}

.form-heading {
  margin-bottom: var(--space-6);
}

.eyebrow {
  margin: 0 0 var(--space-2);
  color: var(--primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.form-heading h2 {
  margin: 0 0 var(--space-2);
  color: var(--text-main);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
}

.form-heading > p:last-child {
  margin: 0;
  color: var(--text-muted);
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}

.form-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-2);
  color: var(--text-main);
  font-size: 0.92rem;
  font-weight: 650;
}

.full-width {
  grid-column: 1 / -1;
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
  min-height: 120px;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: 3px solid rgba(102, 68, 255, 0.15);
  border-color: var(--primary);
}

.form-field input.invalid,
.form-field textarea.invalid {
  border-color: #dc3545;
}

.field-error,
.submission-error {
  color: #b42332;
  font-size: 0.84rem;
  font-weight: 500;
  line-height: 1.45;
}

.submission-error {
  margin: 0 0 var(--space-5);
  padding: var(--space-3) var(--space-4);
  border-radius: 10px;
  background: #fff1f2;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.form-actions :deep(button:disabled) {
  cursor: wait;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .fields-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions :deep(.app-button) {
    width: 100%;
  }
}
</style>
