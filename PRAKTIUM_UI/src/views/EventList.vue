<script setup>
const events = [
  { id: 1, title: 'Vue.js Mastery Workshop', date: 'Oct 12, 2026', loc: 'Tech Hub, Jakarta', cat: 'Workshop', desc: 'Learn advanced Vue 3 concepts, Composition API, and state management to build high-performance web applications interactively.' },
  { id: 2, title: 'National Tech Meetup', date: 'Oct 15, 2026', loc: 'Main Auditorium, City Center', cat: 'Meetup', desc: 'A gathering of hundreds of developers and tech enthusiasts to share the latest industry trends and expand professional networks.' },
  { id: 3, title: 'Startup Pitch Competition', date: 'Nov 02, 2026', loc: 'Innovation Center', cat: 'Competition', desc: 'Watch the best local startup founders pitch their innovative ideas live in front of a panel of renowned investors.' },
  { id: 4, title: 'UI/UX Design Sprint', date: 'Nov 10, 2026', loc: 'Creative Studio', cat: 'Workshop', desc: 'A hands-on session on designing user interfaces by implementing layout systems and visual hierarchy principles.' },
  { id: 5, title: 'Digital Marketing Seminar', date: 'Nov 20, 2026', loc: 'Grand Hotel Hall', cat: 'Seminar', desc: 'An in-depth seminar dissecting modern digital marketing strategies, from SEO optimization to user conversion tactics.' },
  { id: 6, title: 'Community Leaders Summit', date: 'Dec 05, 2026', loc: 'Gatherly HQ', cat: 'Conference', desc: 'An exclusive year-end conference for community leaders to formulate sustainable ecosystem development strategies.' }
]
</script>

<template>
  <div class="event-list-page">
    <!-- LAYOUT SYSTEM: ADAPTIVE GRID -->
    <div class="event-grid">
      <!-- VISUAL HIERARCHY: GROUPING & COMMON REGIONS -->
      <div class="event-card" v-for="event in events" :key="event.id">
        <div class="event-body">
          <div class="event-meta">
            <!-- LABEL CONTRAST: Recognition over Recall -->
            <span class="event-date">{{ event.date }}</span>
            <span class="event-category">{{ event.cat }}</span>
          </div>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-loc">{{ event.loc }}</p>
          <p class="event-desc">
            {{ event.desc }}
          </p>
          <div class="card-footer">
            <router-link :to="`/browse/events/${event.id}`" class="btn-link">View Event Details &rarr;</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keep the catalogue to three columns on wide screens while allowing
   auto-fill to reduce it naturally on tablets and phones. */
.event-list-page {
  width: 100%;
  max-width: 1100px;
  min-width: 0;
  margin-inline: auto;
}

/* ADAPTIVE GRID */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: var(--space-6);
}

/* COMMON REGIONS */
.event-card {
  background: white;
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.06);
}

/* PROXIMITY */
.event-body { padding: var(--space-6); display: flex; flex-direction: column; height: 100%; }
.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.event-date {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}

.event-category { color: var(--text-muted); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; }
.event-title { margin-bottom: var(--space-2); font-size: 1.4rem; }
.event-loc { color: var(--text-muted); font-size: 0.95rem; margin-bottom: var(--space-4); }
.event-desc { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; margin-bottom: var(--space-6); flex-grow: 1; }

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
}

.btn-link {
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
}

.btn-link:hover { color: var(--primary); }
</style>