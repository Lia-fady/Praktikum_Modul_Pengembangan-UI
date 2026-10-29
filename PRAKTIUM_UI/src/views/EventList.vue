<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import CategoryFilter from '@/components/event/CategoryFilter.vue'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useEvents } from '@/composables/useEvents'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('All')
const { activeEvents, isUserRegistered } = useEvents()

const defaultCategories = ['Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference']
const eventCategories = computed(() => [
  'All',
  ...new Set([
    ...defaultCategories,
    ...activeEvents.value.map((event) => event.cat).filter(Boolean),
  ]),
])

const emptyHeading = computed(() => {
  if (searchQuery.value.trim()) {
    return `No ${selectedCategory.value === 'All' ? '' : `${selectedCategory.value} `}events match your search`
  }

  if (activeEvents.value.length === 0) {
    return 'No Events Available Yet'
  }

  if (selectedCategory.value !== 'All') {
    return `No ${selectedCategory.value} events found`
  }

  return 'No Events Available Yet'
})

const emptyMessage = computed(() => {
  if (searchQuery.value.trim() && activeEvents.value.length) {
    return 'Try another category or search term, or reset your filters to see all upcoming events.'
  }

  if (activeEvents.value.length === 0) {
    return 'There are currently no active events scheduled. Are you an organizer? Publish and manage your first event today through the Dashboard!'
  }

  return `There are currently no active ${selectedCategory.value} events scheduled. Try another category or publish an event through the Dashboard.`
})

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return activeEvents.value.filter((event) => {
    const matchesCategory = selectedCategory.value === 'All' || event.cat === selectedCategory.value
    const matchesSearch =
      !query ||
      [event.title, event.loc, event.desc, event.cat]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })
})

function openEventDetail(id) {
  router.push(`/browse/events/${id}`)
}

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}
</script>

<template>
  <div class="event-list-page">
    <header class="page-heading">
      <h1>Upcoming Events</h1>
      <p>Discover workshops, seminars, tech meetups, and competitions near you.</p>
    </header>

    <div class="toolbar">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter v-model="selectedCategory" :categories="eventCategories" />
    </div>

    <div v-if="filteredEvents.length" class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :is-registered="isUserRegistered(event.id)"
        @view-detail="openEventDetail"
      />
    </div>

    <AppCard v-else class="empty-state">
      <div class="empty-illustration" aria-hidden="true">🗓️</div>
      <h3>{{ emptyHeading }}</h3>
      <p>{{ emptyMessage }}</p>
      <div class="empty-actions">
        <AppButton v-if="searchQuery.trim() && activeEvents.length" variant="secondary" @click="resetFilters">
          Reset filters
        </AppButton>
        <AppButton as="router-link" to="/dashboard" variant="primary">
          Go to Organizer Dashboard →
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<style scoped>
.event-list-page {
  width: 100%;
  max-width: 1100px;
  min-width: 0;
  margin-inline: auto;
}

.page-heading {
  margin: var(--space-6) 0 var(--space-6);
}

.page-heading h1 {
  margin: 0 0 var(--space-2);
  color: var(--text-main);
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  font-weight: 750;
}

.page-heading p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.toolbar {
  margin-bottom: var(--space-6);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: var(--space-6);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  min-height: 270px;
  padding: clamp(2rem, 6vw, 3.5rem);
  text-align: center;
}

.empty-illustration {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  font-size: 2.5rem;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--text-main);
}

.empty-state p {
  max-width: 680px;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}
</style>
