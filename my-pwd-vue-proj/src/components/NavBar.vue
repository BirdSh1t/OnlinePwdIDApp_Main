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
          <img :src="getIconUrl(item.icon)" :alt="item.name" class="nav-icon" />
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>

    <!-- ✅ Logout button -->
    <div class="logout">
      <a href="#" class="nav-item" @click.prevent="handleLogout">
        <img :src="getIconUrl('log-out_white.png')" alt="Logout" class="nav-icon" />
        <span class="nav-text">Log out</span>
      </a>
    </div>
  </div>

  <!-- ✅ Logout Modal -->
  <LogoutModal :show="showLogout" @close="showLogout = false" />
</template>

<script>
import LogoutModal from './LogoutModal.vue'; // ✅ Import LogoutModal

export default {
  components: { LogoutModal }, // ✅ Register the component

  data() {
    return {
      activeIndex: 0,
      showLogout: false, // ✅ Controls visibility of logout modal
      navItems: [
        { name: "Dashboard", icon: "dashboard_white.png", link: "/dashboard" },
        { name: "Database", icon: "database_white.png", link: "/database" },
        { name: "Create", icon: "create_white.png", link: "/create" },
        { name: "Calendar", icon: "calendar_white.png", link: "/calendar" },
      ],
    };
  },

  methods: {
    getIconUrl(fileName) {
      return new URL(`../assets/icons/${fileName}`, import.meta.url).href;
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
    width: 200px;
    height: 100vh;
    background-color: #149656;
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
    padding-left: 15px; 
  }

  .nav-icon {
    width: 30px;
    height: 30px;
    margin-right: 15px; 
    margin-left: 18px; 
  }

  .nav-text {
    font-size: 18px;
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

