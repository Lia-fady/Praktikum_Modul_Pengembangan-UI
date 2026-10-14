<script setup>
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'

const features = [
  {
    icon: '🔎',
    title: 'Discover Easily',
    description:
      'Find events tailored to your interests using our smart category and location filters.',
  },
  {
    icon: '🎟️',
    title: 'Seamless Ticketing',
    description:
      'Register with one click and get your digital QR ticket instantly on your device.',
  },
  {
    icon: '📊',
    title: 'Host Like a Pro',
    description:
      'Manage attendees, track revenue, and scan QR codes with our comprehensive dashboard.',
  },
]
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Connect, Discover, and Experience</h1>
        <p class="hero-subtitle">
          A community event platform designed to bring ideas together. Discover hundreds of events near you.
        </p>
        <div class="hero-action">
          <AppButton as="router-link" :to="'/browse/events'" variant="primary">
            Discover Events
          </AppButton>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="features-header">
        <h2>Why Choose Gatherly?</h2>
        <p>Everything you need to host or attend unforgettable events.</p>
      </div>
      <div class="features-grid">
        <AppCard v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon" aria-hidden="true">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </AppCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  min-height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--bg-light);
  border-radius: var(--space-6);
  border: 1px solid var(--border-color);
  padding: var(--space-12) var(--space-6);
  margin-bottom: var(--space-12);
}

.hero-content {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-title {
  font-size: clamp(2.25rem, 8vw, 4rem);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
  margin-bottom: var(--space-6);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: var(--space-8);
  max-width: 600px;
}

.hero-action {
  display: flex;
  justify-content: center;
}

.features-section {
  padding: 0 var(--space-12) 0;
}

.features-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.features-header h2 {
  font-size: 2.2rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.features-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-8);
}

.feature-card {
  padding: var(--space-8);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.feature-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  margin: 0 auto var(--space-4);
  font-size: 2rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: var(--text-main);
  margin-bottom: var(--space-2);
}

.feature-card p {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 640px) {
  .features-section {
    padding: 0;
  }
}
</style>
