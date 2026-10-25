<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEvents } from '@/composables/useEvents';
import EventCard from '@/components/event/EventCard.vue';
import SearchBar from '@/components/event/SearchBar.vue';
import CategoryFilter from '@/components/event/CategoryFilter.vue';
import AppButton from '@/components/ui/AppButton.vue';

const router = useRouter();

// MENGONSUMSI SINGLE SOURCE OF TRUTH (Hanya mengambil event yang berstatus aktif)
const { activeEvents } = useEvents();

const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ['All', 'Workshop', 'Meetup', 'Competition', 'Seminar', 'Conference'];

// FILTERING REAKTIF TERHADAP DATA STATE AKTIF
const filteredEvents = computed(() => {
  return activeEvents.value.filter(event => {
    const matchSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.loc.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = selectedCategory.value === 'All' || event.cat === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`);
};
</script>


<template>
  <div class="event-list-page">
    <div class="page-header">
      <div>
        <h1>Jelajahi Event</h1>
        <p>Temukan event menarik dan ikuti kegiatan favoritmu.</p>
      </div>
    </div>

    <div class="filters">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter
        :categories="categories"
        v-model="selectedCategory"
      />
    </div>

    <div v-if="filteredEvents.length > 0" class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @click="handleViewDetail(event.id)"
      />
    </div>

    <div v-else class="empty-state">
      <h3>Belum ada event</h3>
      <p>Event yang sesuai belum tersedia. Coba kata kunci atau kategori lain.</p>
    </div>
  </div>
</template>

<style scoped>
.event-list-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 700;
}

.page-header p {
  color: #64748b;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.empty-state {
  padding: 48px 24px;
  text-align: center;
  color: #64748b;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: #334155;
}

@media (max-width: 600px) {
  .event-list-page {
    padding: 16px;
  }

  .event-grid {
    grid-template-columns: 1fr;
  }
}
</style>
