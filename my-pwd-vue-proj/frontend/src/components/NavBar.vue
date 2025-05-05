<template>
  <div class="sidebar">
    <!-- Admin Section -->
    <div class="admin-section">
      <img :src="getIconUrl('admin_white.png')" alt="Admin" class="admin-icon" />
      <div class="admin-info">
        <p class="admin-name">BALUYOT</p>
        <p class="admin-role">Admin</p>
      </div>
    </div>

    <!-- Navigation Links -->
    <ul class="nav-links">
      <li v-for="(item, index) in navItems" :key="index">
        <router-link
          :to="item.link"
          class="nav-item"
          :class="{ active: activeIndex === index }"
          @click="setActive(index)"
        >
          <img :src="getIconUrl(item.icon)" :alt="item.name" :class="['nav-icon', item.customClass]" />
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>

    <!-- ✅ Logout button -->
    <div class="logout">
      <a href="#" class="nav-item" @click.prevent="handleLogout">
        <img :src="getIconUrl('log-out_white.png')" alt="Logout" class="nav-icon logout-icon" />
        <span class="nav-text">Log out</span>
      </a>
    </div>
  </div>

  <!-- ✅ Logout Modal -->
  <LogoutModal :show="showLogout" @close="showLogout = false" />
</template>

<script>
import LogoutModal from '@/components/modals/LogoutModal.vue'; // ✅ Use alias '@' for cleaner imports

export default {
  components: { LogoutModal }, // ✅ Register the component

  data() {
    return {
      activeIndex: 0,
      showLogout: false, // ✅ Controls visibility of logout modal
      navItems: [
        { name: "Dashboard", icon: "dashboard_white.png", link: "/admin/dashboard", customClass: 'dashboard-icon' },
        { name: "Report", icon: "records_white.png", link: "/admin/database", customClass: 'records-icon' },
        { name: "Walk-ins", icon: "add_records_white.png", link: "/admin/create", customClass: 'create-icon' },
        // { name: "Schedule", icon: "calendar_white.png", link: "/admin/calendar", customClass: 'calendar-icon' },
        { name: "Applicants", icon: "pending-applicants-white.png", link: "/admin/pendingApp", customClass: 'applicants-icon' },
        { name: "Archive", icon: "archive_white.png", link: "/admin/archive", customClass: 'archive-icon' }
      ],
    };
  },

  methods: {
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    setActive(index) {
      this.activeIndex = index;
    },
    handleLogout() {
      this.showLogout = true; // ✅ Open logout modal instead of confirm()
    },
  },
};
</script>

<style scoped>
  /* Sidebar */
  .sidebar {
    overflow: clip;
    width: 200px;
    height: 100vh;
    background-color: #0812cb;
    display: flex;
    flex-direction: column;
    padding: 15px;
    color: white;
  }

  /* Admin Section */
  .admin-section {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;
  }

  .admin-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .admin-info {
    text-align: center;
  }

  .admin-name {
    color: #7ed957;
    font-weight: bold;
    margin-top: 5px;
    font-size: 18px;
  }

  .admin-role {
    font-size: 12px;
    color: lightgray;
  }

  /* Navigation Links */
  .nav-links {
    list-style: none;
    padding: 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px;
    text-decoration: none;
    color: white;
    font-family: "Cooper Hewitt", sans-serif;
    transition: background 0.3s ease-in-out;
    width: calc(100% + 30px);
    margin-left: -15px;
    padding-left: 35px;
  }

  .nav-icon {
    width: 30px;
    height: 30px;
    margin-right: 15px; /* Adjust this value to control spacing between icon and text */
    transition: transform 0.3s ease-in-out;
  }

  .nav-icon:hover,
  .logout-icon:hover,
  .admin-icon:hover {
    transform: scale(1.2);
  }
  
  .nav-text {
    font-size: 18px;
    margin-left: 10px; /* Adjust this value to control the position of the text */
  }

  /* Custom classes for each icon */
  .dashboard-icon {
    width: 35px;
    height: 35px;
  }

  .records-icon {
    width: 40px;
    height: 40px;
    margin-right: 11px;
  }

  .create-icon {
    width: 35px;
    height: 35px;
  }

  .calendar-icon {
    width: 35px;
    height: 35px;
  }

  .applicants-icon {
    width: 35px;
    height: 35px;
  }

  .archive-icon {
    width: 35px;
    height: 35px;
  }

  .logout-icon {
    width: 35px;
    height: 35px;
  }

  /* Sets the BG color of the selected item */
  .nav-item.active {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 0;
  }

  .nav-item:hover {
    background-color: rgba(127, 246, 194, 0.2);
  }

  /* ✅ Keep Log out Button at the Bottom */
  .logout {
    margin-top: auto;
    padding-bottom: 45px;
  }

  .sidebar {
    width: 200px;
    height: 100vh;
    background-color: #149656;
    display: flex;
    flex-direction: column;
    padding: 15px;
    color: white;
    position: fixed; /* ✅ Keeps it in place */
    left: 0;
    top: 0;
  }
</style>
