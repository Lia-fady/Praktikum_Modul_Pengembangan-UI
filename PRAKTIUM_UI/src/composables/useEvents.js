import { computed, ref, watch } from 'vue'

const REGISTRATIONS_STORAGE_KEY = 'gatherly-registrations'
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function loadRegistrations() {
  try {
    const storedValue = window.localStorage.getItem(REGISTRATIONS_STORAGE_KEY)
    if (!storedValue) {
      return []
    }

    const parsedRegistrations = JSON.parse(storedValue)
    if (!Array.isArray(parsedRegistrations)) {
      throw new TypeError('Stored Gatherly registrations must be an array.')
    }

    return parsedRegistrations
  } catch (error) {
    console.error('Unable to load Gatherly registrations from LocalStorage.', error)
    return []
  }
}

const events = ref([])
const userRegistrations = ref(loadRegistrations())
const loading = ref(false)
const error = ref('')
let activeRequests = 0

const totalEvents = computed(() => events.value.length)
const activeEvents = computed(() => events.value.filter((event) => !event.done))
const completedEvents = computed(() => events.value.filter((event) => event.done))

function persistRegistrations(registrations) {
  try {
    window.localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations))
  } catch (storageError) {
    console.error('Unable to save Gatherly registrations to LocalStorage.', storageError)
  }
}

watch(userRegistrations, persistRegistrations, { deep: true })

function normalizeEvent(event) {
  const quota = event.quota === null || event.quota === '' ? null : Number(event.quota)

  return {
    ...event,
    id: String(event.id),
    seatsLeft: Number.isFinite(quota) ? quota : null,
    price: event.price || 'Free',
    summary: event.summary || event.desc,
    done: Boolean(event.done),
  }
}

function toApiEvent(event) {
  return {
    title: event.title,
    cat: event.cat,
    date: event.date,
    loc: event.loc,
    quota: Number.isFinite(event.seatsLeft) ? event.seatsLeft : null,
    desc: event.desc,
    done: Boolean(event.done),
    price: event.price || 'Free',
  }
}

function getErrorMessage(cause) {
  if (cause instanceof ApiError && cause.status === 404) {
    return 'Event not found (404). It may have been removed.'
  }
  if (cause instanceof TypeError && cause.message === 'Failed to fetch') {
    return 'Unable to connect to the event server. Check your internet connection and try again.'
  }
  return cause instanceof Error ? cause.message : 'An unexpected error occurred.'
}

async function request(path = '', options = {}) {
  activeRequests += 1
  loading.value = true
  error.value = ''

  try {
    if (!API_URL) {
      throw new Error(
        'VITE_API_URL is not configured. Add it to the project .env file and restart Vite.',
      )
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })

    const responseText = response.status === 204 ? '' : await response.text()
    let responseData = null

    if (responseText) {
      try {
        responseData = JSON.parse(responseText)
      } catch {
        throw new Error('The event server returned an invalid JSON response.')
      }
    }

    if (!response.ok) {
      throw new ApiError(
        responseData?.message || `The event server returned HTTP ${response.status}.`,
        response.status,
      )
    }

    return responseData
  } catch (cause) {
    error.value = getErrorMessage(cause)
    throw cause
  } finally {
    activeRequests -= 1
    loading.value = activeRequests > 0
  }
}

function replaceEvent(updatedEvent) {
  const eventIndex = events.value.findIndex((event) => String(event.id) === updatedEvent.id)
  if (eventIndex === -1) {
    events.value.unshift(updatedEvent)
  } else {
    events.value.splice(eventIndex, 1, updatedEvent)
  }
}

function getEventById(id) {
  return events.value.find((event) => String(event.id) === String(id)) ?? null
}

async function fetchEvents() {
  const responseData = await request()
  if (!Array.isArray(responseData)) {
    const cause = new TypeError('The event server response must be a JSON array.')
    error.value = cause.message
    throw cause
  }

  events.value = responseData.map(normalizeEvent)
  return events.value
}

async function fetchEventById(id) {
  const existingEvent = getEventById(id)
  if (existingEvent) {
    return existingEvent
  }

  const responseData = await request(`/${encodeURIComponent(id)}`)
  if (!responseData || typeof responseData !== 'object' || Array.isArray(responseData)) {
    const cause = new TypeError('The event server returned an invalid event.')
    error.value = cause.message
    throw cause
  }

  const event = normalizeEvent(responseData)
  replaceEvent(event)
  return event
}

async function createEvent(eventData) {
  const responseData = await request('', {
    method: 'POST',
    body: JSON.stringify(toApiEvent({ ...eventData, done: false })),
  })
  if (!responseData || typeof responseData !== 'object' || Array.isArray(responseData)) {
    const cause = new TypeError('The event server returned an invalid event after creation.')
    error.value = cause.message
    throw cause
  }

  const event = normalizeEvent({
    ...responseData,
    createdAt: responseData.createdAt || new Date().toISOString(),
  })
  events.value.unshift(event)
  return event
}

async function updateEvent(id, changes) {
  const currentEvent = getEventById(id)
  if (!currentEvent) {
    return false
  }

  const updatedEvent = { ...currentEvent, ...changes }
  const responseData = await request(`/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(toApiEvent(updatedEvent)),
  })
  replaceEvent(normalizeEvent(responseData || updatedEvent))
  return true
}

async function completeEvent(id) {
  const event = getEventById(id)
  if (!event || event.done) {
    return false
  }

  return updateEvent(id, { done: true, completedAt: new Date().toISOString() })
}

async function deleteEvent(id) {
  const eventIndex = events.value.findIndex((event) => String(event.id) === String(id))
  if (eventIndex === -1) {
    return false
  }

  await request(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
  events.value.splice(eventIndex, 1)
  userRegistrations.value = userRegistrations.value.filter(
    (registration) => String(registration.eventId) !== String(id),
  )
  return true
}

function getRegistrationById(id) {
  return (
    userRegistrations.value.find((registration) => String(registration.id) === String(id)) ?? null
  )
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
    typeof eventOrId === 'object' && eventOrId !== null ? eventOrId : getEventById(eventOrId)

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

async function registerAttendee(eventId, attendeeData) {
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

  if (Number.isFinite(event.seatsLeft)) {
    await updateEvent(eventId, { seatsLeft: event.seatsLeft - 1 })
  }

  const registration = {
    ...attendeeData,
    id: createRegistrationId(),
    eventId: event.id,
    reference: createReference(),
    registeredAt: new Date().toISOString(),
  }
  userRegistrations.value.push(registration)

  return { success: true, registration }
}

async function cancelRegistration(id) {
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

  if (event && Number.isFinite(event.seatsLeft)) {
    await updateEvent(event.id, { seatsLeft: event.seatsLeft + 1 })
  }

  userRegistrations.value.splice(registrationIndex, 1)
  return true
}

export function useEvents() {
  return {
    events,
    userRegistrations,
    totalEvents,
    activeEvents,
    completedEvents,
    loading,
    error,
    fetchEvents,
    fetchEventById,
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
