import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'gatherly-events'

function loadEvents() {
  try {
    const storedEvents = window.localStorage.getItem(STORAGE_KEY)

    if (!storedEvents) {
      return []
    }

    const parsedEvents = JSON.parse(storedEvents)
    if (!Array.isArray(parsedEvents)) {
      throw new TypeError('Stored Gatherly events must be an array.')
    }

    return parsedEvents
  } catch (error) {
    console.error('Unable to load Gatherly events from LocalStorage.', error)
    return []
  }
}

const events = ref(loadEvents())
const totalEvents = computed(() => events.value.length)
const activeEvents = computed(() => events.value.filter((event) => !event.done))
const completedEvents = computed(() => events.value.filter((event) => event.done))

watch(
  events,
  (updatedEvents) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents))
    } catch (error) {
      console.error('Unable to save Gatherly events to LocalStorage.', error)
    }
  },
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
  return true
}

function getEventById(id) {
  return events.value.find((event) => String(event.id) === String(id)) ?? null
}

export function useEvents() {
  return {
    events,
    totalEvents,
    activeEvents,
    completedEvents,
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById,
  }
}
