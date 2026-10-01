<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const isScrolled = ref(false)
const route = useRoute()

const menus = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  {
    name: 'Browse',
    path: '/browse',
    children: [
      {
        name: 'Event List',
        path: '/browse/events',
        children: [{ name: 'Event Detail (Sample)', path: '/browse/events/1' }],
      },
      { name: 'Category', path: '/browse/category' },
    ],
  },
  { name: 'Contact', path: '/contact' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <svg
          width="28"
          height="32"
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="logo-icon"
        >
          <path
            d="M12 0L22.3923 6V18L12 24L1.6077 18V6L12 0Z"
            fill="white"
          />
          <path
            d="M15 9.5 C15 9.5 14 8 12 8 C9.5 8 8 10 8 12.5 C8 15 9.5 17 12 17 C14 17 15 16 15.5 14.5 V 12.5 H 12.5"
            stroke="#1A1643"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="logo-text">Gatherly</span>
      </router-link>

      <ul class="nav-menu">
        <li
          class="nav-item"
          v-for="menu in menus"
          :key="menu.name"
        >
          <router-link
            :to="menu.path"
            class="nav-link"
            :class="{
              active:
                route.path === menu.path ||
                (menu.path !== '/' && route.path.startsWith(menu.path)),
            }"
          >
            {{ menu.name }}

            <svg
              v-if="menu.children"
              class="dropdown-indicator"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </router-link>

          <!-- First Level Dropdown -->
          <ul v-if="menu.children" class="dropdown-menu">
            <li
              v-for="child in menu.children"
              :key="child.name"
              class="dropdown-item"
            >
              <router-link :to="child.path" class="dropdown-link">
                {{ child.name }}

                <svg
                  v-if="child.children"
                  class="submenu-indicator"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </router-link>

              <!-- Second Level Dropdown (Submenu) -->
              <ul v-if="child.children" class="submenu">
                <li
                  v-for="subchild in child.children"
                  :key="subchild.name"
                  class="submenu-item"
                >
                  <router-link :to="subchild.path" class="dropdown-link">
                    {{ subchild.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      
        <div class="nav-right">
        <div class="lang-selector">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
            ></path>
          </svg>

          <span class="lang-text">EN</span>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="chevron"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <button class="hamburger-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>