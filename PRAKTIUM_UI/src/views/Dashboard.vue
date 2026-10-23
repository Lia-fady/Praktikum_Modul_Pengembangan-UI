<script setup>
import { computed } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import { useEvents } from '@/composables/useEvents'
import { formatEventDate } from '@/utils/formatEventDate'

const { events, totalEvents, activeEvents, completedEvents } = useEvents()
const recentEvents = computed(() =>
  [...events.value].sort((first, second) => {
    const firstCreated = new Date(first.createdAt || first.date).getTime() || 0
    const secondCreated = new Date(second.createdAt || second.date).getTime() || 0
    return secondCreated - firstCreated
  }),
)
</script>

<template>
  <section class="dashboard-overview">
    <div class="dashboard-heading">
      <div>
        <p class="eyebrow">Organizer workspace</p>
        <h2>Welcome back, Organizer</h2>
        <p>Monitor your event activity and status at a glance.</p>
      </div>
      <AppButton as="router-link" to="/dashboard/events" variant="primary">
        Manage Events
      </AppButton>
    </div>

    <div class="metrics-grid">
      <article class="metric-card">
        <span class="metric-icon total-icon" aria-hidden="true">✦</span>
        <div>
          <h3>Total Events</h3>
          <p class="metric-value">{{ totalEvents }}</p>
        </div>
      </article>
      <article class="metric-card">
        <span class="metric-icon active-icon" aria-hidden="true">●</span>
        <div>
          <h3>Active Events</h3>
          <p class="metric-value">{{ activeEvents.length }}</p>
        </div>
      </article>
      <article class="metric-card">
        <span class="metric-icon completed-icon" aria-hidden="true">✓</span>
        <div>
          <h3>Completed Events</h3>
          <p class="metric-value">{{ completedEvents.length }}</p>
        </div>
      </article>
    </div>

    <div class="data-table-container">
      <div class="table-heading">
        <div>
          <h3>Recent Events Status Overview</h3>
          <p>Latest event activity across your organization.</p>
        </div>
        <AppButton as="router-link" to="/dashboard/events" variant="secondary">
          View all events
        </AppButton>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>Date &amp; Time</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="events.length === 0">
              <td colspan="5" class="empty-row">
                No events yet. Create an event to see its status here.
              </td>
            </tr>
            <tr v-for="event in recentEvents" :key="event.id">
              <td class="event-title">{{ event.title }}</td>
              <td>{{ event.cat }}</td>
              <td>{{ formatEventDate(event.date) }}</td>
              <td>{{ event.loc }}</td>
              <td>
                <span :class="['status-badge', event.done ? 'status-completed' : 'status-active']">
                  {{ event.done ? 'Completed' : 'Active' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard-heading {
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

.dashboard-heading h2 {
  margin: 0;
  color: var(--text-main);
  font-size: clamp(1.6rem, 4vw, 2rem);
}

.dashboard-heading p:last-child,
.table-heading p {
  margin: var(--space-2) 0 0;
  color: var(--text-muted);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.metric-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: white;
  padding: var(--space-6);
  border-radius: var(--space-3);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.metric-icon {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  font-size: 1.25rem;
}

.total-icon {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
}

.active-icon {
  background: rgba(46, 204, 113, 0.12);
  color: #16834a;
}

.completed-icon {
  background: #f0f1f4;
  color: #686b76;
}

.metric-card h3 {
  margin: 0 0 var(--space-2);
  color: var(--text-muted);
  font-size: 0.95rem;
}

.metric-value {
  margin: 0;
  color: var(--text-main);
  font-size: 2rem;
  font-weight: 700;
}

.data-table-container {
  background: white;
  padding: var(--space-6);
  border-radius: var(--space-3);
  border: 1px solid var(--border-color);
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.table-heading h3 {
  margin: 0;
  font-size: 1.2rem;
}

.table-heading p {
  font-size: 0.9rem;
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.data-table th,
.data-table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--bg-gray);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.data-table td {
  color: var(--text-main);
  font-size: 0.95rem;
}

.data-table .event-title {
  font-weight: 600;
}

.empty-row {
  padding-block: var(--space-8) !important;
  color: var(--text-muted) !important;
  text-align: center !important;
}

.status-badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.status-active {
  background: rgba(46, 204, 113, 0.12);
  color: #16834a;
}

.status-completed {
  background: #f0f1f4;
  color: #686b76;
}

@media (max-width: 640px) {
  .dashboard-heading,
  .table-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>