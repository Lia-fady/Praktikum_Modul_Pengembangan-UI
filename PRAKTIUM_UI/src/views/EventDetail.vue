<template>
  <div class="event-detail-page">
    <!-- ASYMMETRICAL LAYOUT -->
    <div class="detail-content grid-asymmetric">
      <!-- F-PATTERN: Breaking text with Headings & Bullet Points -->
      <div class="main-desc">
        <h2>About This Event</h2>
        <p>
          Welcome to the biggest web interface development training event of the year!
          Gatherly is collaborating with the local developer community to host a comprehensive workshop
          designed specifically to bring together professionals, enthusiasts, and students.
        </p>
        <p>
          In this session, we will discuss various current industry challenges, dissect the implementation
          of Single Page Applications (SPA), and practice hands-on Layout System design prioritizing visual hierarchy.
          You will gain practical insights that can be directly applied to your future projects or career.
        </p>

        <h2>Event Agenda</h2>
        <ul class="agenda-list">
          <li><strong>09:00 AM</strong> Registration & QR Check-in Scanning</li>
          <li><strong>10:00 AM</strong> Session 1: Vue Router & Navigation Fundamentals</li>
          <li><strong>11:30 AM</strong> Coffee Break & Networking Session</li>
          <li><strong>01:00 PM</strong> Session 2: Layout System & Grid Implementation</li>
          <li><strong>03:00 PM</strong> Q&A & Closing Remarks</li>
        </ul>
      </div>

      <!-- FOCAL POINT & STICKY PANE -->
      <div class="sidebar">
        <div class="ticket-card sticky-pane">
          <h3>Attendee Registration</h3>
          <p class="price">Free</p>
          <p class="ticket-desc">Secure your seat now before the quota is full.</p>
          <!-- STRONGEST FOCAL POINT -->
          <button class="btn-register">Register Now</button>
          <p class="spots">Only 12 seats left!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ASYMMETRICAL GRID */
.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc h2 {
  margin-bottom: var(--space-4);
  font-size: 1.8rem;
  border-left: 4px solid var(--primary);
  padding-left: var(--space-2);
}

.main-desc p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-6);
  font-size: 1.05rem;
}

.agenda-list { list-style: none; padding: 0; margin: var(--space-8) 0; }
.agenda-list li {
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 1.05rem;
}

/* FOCAL POINT CARD */
.ticket-card {
  background: white;
  padding: var(--space-8);
  border-radius: var(--space-4);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  text-align: center;
}

/* STICKY BEHAVIOR */
.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card h3 { font-size: 1.5rem; margin-bottom: var(--space-2); }
.price { font-size: 2.8rem; font-weight: 700; color: var(--primary); margin-bottom: var(--space-2); }
.ticket-desc { color: var(--text-muted); margin-bottom: var(--space-6); }

.btn-register {
  width: 100%;
  padding: var(--space-4);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-register:hover { background: var(--primary-hover); }
.spots { margin-top: var(--space-4); color: #e63946; font-weight: 600; font-size: 0.95rem; }

@media (max-width: 900px) {
  .grid-asymmetric { grid-template-columns: 1fr; }
}
</style>