<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import CategoryFilter from '@/components/event/CategoryFilter.vue'
import EventCard from '@/components/event/EventCard.vue'
import SearchBar from '@/components/event/SearchBar.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import { eventCategories, events } from '@/data/events'

const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('All')

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return events.filter((event) => {
    const matchesCategory = selectedCategory.value === 'All' || event.cat === selectedCategory.value
    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.loc.toLowerCase().includes(query) ||
      event.desc.toLowerCase().includes(query)

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
    <div class="toolbar">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter v-model="selectedCategory" :categories="eventCategories" />
    </div>

    <div v-if="filteredEvents.length" class="event-grid">
      <EventCard v-for="event in filteredEvents" :key="event.id" :event="event" @view-detail="openEventDetail" />
    </div>

    <AppCard v-else class="empty-state">
      <h3>No events found</h3>
      <p>Try a different keyword or reset the category filter to discover more options.</p>
      <AppButton variant="secondary" @click="resetFilters">Reset filters</AppButton>
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
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.6rem;
  color: var(--text-main);
}

.empty-state p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
