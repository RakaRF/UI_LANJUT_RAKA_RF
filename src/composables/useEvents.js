import { ref, computed, watch } from 'vue';

const EVENTS_STORAGE_KEY = 'gatherly_events';
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl ? envUrl.trim().replace(/\/+$/, '') : '';
};

const savedData = localStorage.getItem(EVENTS_STORAGE_KEY);
const events = ref(savedData ? JSON.parse(savedData) : []);

const savedRegs = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
const userRegistrations = ref(savedRegs ? JSON.parse(savedRegs) : []);

const loading = ref(false);
const error = ref(null);

watch(events, (newEvents) => {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
}, { deep: true });

watch(userRegistrations, (newRegs) => {
  localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(newRegs));
}, { deep: true });

export function useEvents() {
  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    const baseUrl = getApiBaseUrl();

    if (!baseUrl) {
      loading.value = false;
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/events`);
      if (!response.ok) {
        throw new Error(`Gagal mengambil data acara (HTTP ${response.status})`);
      }
      const data = await response.json();
      events.value = data;
    } catch (err) {
      error.value = err.message || 'Terjadi kesalahan jaringan.';
    } finally {
      loading.value = false;
    }
  };

  const fetchEventById = async (id) => {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return getEventById(id);

    try {
      const response = await fetch(`${baseUrl}/events/${id}`);
      if (!response.ok) {
        throw new Error(`Gagal mengambil detail acara (HTTP ${response.status})`);
      }
      return await response.json();
    } catch (err) {
      error.value = err.message;
      return getEventById(id);
    }
  };

  const createEvent = async (eventData) => {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      const newEvent = {
        id: String(Date.now()),
        ...eventData,
        done: false,
      };
      events.value.push(newEvent);
      return newEvent;
    }

    try {
      const response = await fetch(`${baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          done: false,
        }),
      });
      if (!response.ok) {
        throw new Error(`Gagal membuat acara baru (HTTP ${response.status})`);
      }
      const newEvent = await response.json();
      events.value.push(newEvent);
      return newEvent;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
      events.value = events.value.filter((e) => e.id !== String(id));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Gagal menghapus acara (HTTP ${response.status})`);
      }
      events.value = events.value.filter((e) => e.id !== String(id));
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const completeEvent = (id) => {
    const event = events.value.find((e) => e.id === String(id));
    if (event) {
      event.done = !event.done;
    }
  };

  const getEventById = (id) => {
    return events.value.find((e) => e.id === String(id));
  };

  const registerAttendee = (eventId, attendeeData) => {
    const registration = {
      id: String(Date.now()),
      eventId: String(eventId),
      ...attendeeData,
      registeredAt: new Date().toISOString(),
    };
    userRegistrations.value.push(registration);
    return registration;
  };

  const isUserRegistered = (eventId, email) => {
    return userRegistrations.value.some(
      (r) => r.eventId === String(eventId) && r.email.toLowerCase() === email.toLowerCase()
    );
  };

  const getRegistrationByEventId = (eventId, email) => {
    return userRegistrations.value.find(
      (r) => r.eventId === String(eventId) && r.email.toLowerCase() === email.toLowerCase()
    );
  };

  const cancelRegistration = (registrationId) => {
    userRegistrations.value = userRegistrations.value.filter((r) => r.id !== String(registrationId));
  };

  const totalEvents = computed(() => events.value.length);
  const activeEvents = computed(() => events.value.filter((e) => !e.done).length);
  const completedEvents = computed(() => events.value.filter((e) => e.done).length);
  const totalRegistrations = computed(() => userRegistrations.value.length);

  const clearAllEvents = () => {
    events.value = [];
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  };

  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };

  return {
    events,
    loading,
    error,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    fetchEvents,
    fetchEventById,
    createEvent,
    deleteEvent,
    completeEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations
  };
}