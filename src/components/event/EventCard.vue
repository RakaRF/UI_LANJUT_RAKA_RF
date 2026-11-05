<template>
  <AppCard class="event-card-wrapper">
    <div class="event-body">
      <div class="event-meta">
        <div class="meta-left">
          <span class="event-date">{{ event.date }}</span>
          <span v-if="isRegistered" class="badge-registered">Registered</span>
        </div>
        <span class="event-category">{{ event.cat }}</span>
      </div>

      <h3 class="event-title">{{ event.title }}</h3>
      <p class="event-loc">{{ event.loc }}</p>
      <p class="event-desc">{{ event.desc }}</p>

      <div class="card-footer">
        <button class="btn-link" @click="$emit('view-detail', event.id)">
          View Event Details &rarr;
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/ui/AppCard.vue';

defineProps({
  event: {
    type: Object,
    required: true
  },
  isRegistered: {
    type: Boolean,
    default: false
  }
});

defineEmits(['view-detail']);
</script>

<style scoped>
.event-card-wrapper {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.event-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.meta-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.event-date {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.badge-registered {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.event-category { color: var(--text-muted); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; }
.event-title { margin: var(--space-2); font-size: 1.4rem; color: var(--text-main); }
.event-loc { color: var(--text-muted); font-size: 0.95rem; margin-bottom: var(--space-4); }
.event-desc { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; margin-bottom: var(--space-6); flex-grow: 1; }

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-4);
}

.btn-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  padding: 0;
}

.btn-link:hover { color: var(--primary); }
</style>