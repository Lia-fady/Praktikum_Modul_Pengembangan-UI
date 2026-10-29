import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'gatherly-events'
const REGISTRATIONS_STORAGE_KEY = 'gatherly-registrations'

function loadStoredArray(key, label) {
  try {
    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return []
    }

    const parsedEvents = JSON.parse(storedValue)
    if (!Array.isArray(parsedEvents)) {
      throw new TypeError(`Stored Gatherly ${label} must be an array.`)
    }

    return parsedEvents
  } catch (error) {
    console.error(`Unable to load Gatherly ${label} from LocalStorage.`, error)
    return []
  }
}

const events = ref(loadStoredArray(STORAGE_KEY, 'events'))
const userRegistrations = ref(loadStoredArray(REGISTRATIONS_STORAGE_KEY, 'registrations'))
const totalEvents = computed(() => events.value.length)
const activeEvents = computed(() => events.value.filter((event) => !event.done))
const completedEvents = computed(() => events.value.filter((event) => event.done))

function persistToLocalStorage(key, value, label) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save Gatherly ${label} to LocalStorage.`, error)
  }
}

watch(events, (updatedEvents) => persistToLocalStorage(STORAGE_KEY, updatedEvents, 'events'), {
  deep: true,
})
watch(
  userRegistrations,
  (updatedRegistrations) =>
    persistToLocalStorage(REGISTRATIONS_STORAGE_KEY, updatedRegistrations, 'registrations'),
  { deep: true },
)

function createEvent(eventData) {
  const existingNumericIds = events.value
    .map((event) => Number(event.id))
    .filter(Number.isSafeInteger)
  const nextId = Math.max(Date.now(), ...existingNumericIds.map((id) => id + 1))

  const newEvent = {
    ...eventData,
    id: nextId,
    done: false,
    createdAt: new Date().toISOString(),
  }

  events.value.unshift(newEvent)
  return newEvent
}

function completeEvent(id) {
  const event = getEventById(id)
  if (!event || event.done) {
    return false
  }

  event.done = true
  event.completedAt = new Date().toISOString()
  return true
}

function deleteEvent(id) {
  const eventIndex = events.value.findIndex((event) => String(event.id) === String(id))
  if (eventIndex === -1) {
    return false
  }

  events.value.splice(eventIndex, 1)
  userRegistrations.value = userRegistrations.value.filter(
    (registration) => String(registration.eventId) !== String(id),
  )
  return true
}

function getEventById(id) {
  return events.value.find((event) => String(event.id) === String(id)) ?? null
}

function getRegistrationById(id) {
  return userRegistrations.value.find((registration) => String(registration.id) === String(id)) ?? null
}

function getRegistrationForEvent(eventId) {
  return (
    userRegistrations.value.find(
      (registration) => String(registration.eventId) === String(eventId),
    ) ?? null
  )
}

function isUserRegistered(eventId) {
  return Boolean(getRegistrationForEvent(eventId))
}

function isEventDone(eventOrId) {
  const event =
    typeof eventOrId === 'object' && eventOrId !== null
      ? eventOrId
      : getEventById(eventOrId)

  return Boolean(event?.done)
}

function createReference() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  let reference

  do {
    const randomPart =
      typeof window !== 'undefined' && window.crypto?.randomUUID
        ? window.crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()
        : Math.random().toString(36).slice(2, 12).toUpperCase()
    reference = `GAT-${datePart}-${randomPart}`
  } while (userRegistrations.value.some((registration) => registration.reference === reference))

  return reference
}

function createRegistrationId() {
  let id

  do {
    id =
      typeof window !== 'undefined' && window.crypto?.randomUUID
        ? `ticket-${window.crypto.randomUUID()}`
        : `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  } while (userRegistrations.value.some((registration) => String(registration.id) === id))

  return id
}

function registerAttendee(eventId, attendeeData) {
  const event = getEventById(eventId)
  if (!event) {
    return { success: false, message: 'This event could not be found.' }
  }
  if (event.done) {
    return { success: false, message: 'Registration for this event has closed.' }
  }
  if (isUserRegistered(eventId)) {
    return { success: false, message: 'You are already registered for this event.' }
  }
  if (Number.isFinite(event.seatsLeft) && event.seatsLeft <= 0) {
    return { success: false, message: 'This event is sold out.' }
  }

  const registration = {
    ...attendeeData,
    id: createRegistrationId(),
    eventId: event.id,
    reference: createReference(),
    registeredAt: new Date().toISOString(),
  }

  if (Number.isFinite(event.seatsLeft)) {
    event.seatsLeft -= 1
  }
  userRegistrations.value.push(registration)

  return { success: true, registration }
}

function cancelRegistration(id) {
  const registrationIndex = userRegistrations.value.findIndex(
    (registration) => String(registration.id) === String(id),
  )
  if (registrationIndex === -1) {
    return false
  }

  const registration = userRegistrations.value[registrationIndex]
  const event = getEventById(registration.eventId)
  if (event?.done) {
    return false
  }

  userRegistrations.value.splice(registrationIndex, 1)
  if (event && Number.isFinite(event.seatsLeft)) {
    event.seatsLeft += 1
  }
  return true
}

export function useEvents() {
  return {
    events,
    userRegistrations,
    totalEvents,
    activeEvents,
    completedEvents,
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById,
    getRegistrationById,
    getRegistrationForEvent,
    isUserRegistered,
    isEventDone,
    registerAttendee,
    cancelRegistration,
  }
}
