<template>
  <div class="dashboard-container">
    <!-- Dashboard Header Card -->
    <DashboardHeader title="Dashboard" @search="handleSearch" />

    <p v-if="dashboardData">Welcome, {{ dashboardData.admin_name || dashboardData.employee_name }}</p>

    <!-- Statistics Cards -->
    <div class="stats-container">
      <div class="stats-card">
        <img :src="getIconUrl('total_applicants_black.png')" alt="Total Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">{{ totalApplicants }}</p>
          <p class="stats-label">Total verified PWD IDs</p>
        </div>
      </div>

      <div class="stats-card">
        <img :src="getIconUrl('walk_in_applicant_black.png')" alt="Walk-in Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">{{ walkInApplicants }}</p>
          <p class="stats-label">Walk-in applicants</p>
        </div>
      </div>

      <div class="stats-card">
        <img :src="getIconUrl('online_black.png')" alt="Online Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">{{ onlineApplicants }}</p>
          <p class="stats-label">Online applicants</p>
        </div>
      </div>

      <div class="stats-card">
        <img :src="getIconUrl('processing_black.png')" alt="Processing Applications" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">{{ processingApplications }}</p>
          <p class="stats-label">Processing applications</p>
        </div>
      </div>
    </div>

    <!-- Tables Section -->
    <div class="tables-container">
      <PWDTable :data="filteredData" />
      <RecentApplicantsTable :recentData="recentApplicants" @refresh-recent="fetchRecentApplicants" />
    </div>
  </div>
</template>

<script>
import { apiClient } from "@/api/apiClient.js";
import DashboardHeader from '@/components/DashboardHeader.vue';
import PWDTable from '@/components/PWDTable.vue';
import RecentApplicantsTable from '@/components/RecentApplicantsTable.vue';

export default {
  name: "Dashboard",
  components: {
    DashboardHeader,
    PWDTable,
    RecentApplicantsTable
  },
  data() {
    return {
      users: [],               // Full real-time list
      filteredData: [],        // Filtered view from search
      recentApplicants: [],    // Last 5 entries
      totalApplicants: 0,
      walkInApplicants: 0,
      onlineApplicants: 0,
      processingApplications: 0,
      socket: null,
    };
  },
  methods: {
    animateCounter(fieldName, newValue) {
    const duration = 1000; // milliseconds (1 second)
    const frameRate = 60; // frames per second
    const totalFrames = Math.round((duration / 1000) * frameRate);
    
    const startValue = this[fieldName];
    const increment = (newValue - startValue) / totalFrames;
    
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      this[fieldName] = Math.round(startValue + increment * frame);
      
      if (frame === totalFrames) {
        clearInterval(counter);
        this[fieldName] = newValue; // Make sure it ends exactly at the new value
      }
    }, 1000 / frameRate);
  },
  async fetchRecentApplicants() {
    try {
      const res = await apiClient.get("/api/applicants/pending/recent");
      this.recentApplicants = res.data;
    } catch (err) {
      console.error("Failed to fetch recent applicants:", err);
    }
  },

  async fetchPendingApplicationsCount() {
    try {
      const res = await apiClient.get('/api/applicants/pending/count');
      this.processingApplications = res.data.count;
    } catch (err) {
      console.error('Failed to fetch pending applications count:', err);
    }
  },
  async fetchActiveUsers() {
    try {
      const res = await apiClient.get("/api/users?archived=0");
      this.users = res.data;
      this.filteredData = res.data;
      this.updateStats();
    } catch (err) {
      console.error("Failed to fetch active users:", err);
    }
  },
  updateStats() {
    this.totalApplicants = this.users.length;
    this.walkInApplicants = this.users.filter(u => u.status === "walk-in").length;
    this.onlineApplicants = this.users.filter(u => u.status === "online").length;
  },
  setupWebSocket() {
  this.socket = new WebSocket("ws://localhost:4000");

  this.socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);

    if (msg.event === "recent-applicant") {
      const newEntry = { ...msg.data, isNew: true };
      this.recentApplicants.unshift(newEntry);
      if (this.recentApplicants.length > 10) this.recentApplicants.pop();

      setTimeout(() => {
        newEntry.isNew = false;
      }, 3000);
    }

    if (msg.event === "update-active") {
      this.users = msg.data;
      this.filteredData = [...msg.data];

      // ✅ Animate counters nicely
      this.animateCounter('totalApplicants', this.users.length);
      this.animateCounter('walkInApplicants', this.users.filter(u => u.status === "walk-in").length);
      this.animateCounter('onlineApplicants', this.users.filter(u => u.status === "online").length);
    }

    if (msg.event === "online-applicant-count") {
      this.animateCounter('onlineApplicants', msg.data.count);
    }

    if (msg.event === "processing-applications-count") {
      this.animateCounter('processingApplications', msg.data.count);
    }
  });
},

  async handleSearch(query) {
    if (!query.trim()) {
      this.filteredData = this.users;
      return;
    }

    try {
      const res = await apiClient.get("/api/search", {
        params: { page: "dashboard", query }
      });
      this.filteredData = res.data.length ? res.data : [];
    } catch (error) {
      console.error("Search error:", error);
      this.filteredData = [];
    }
  },

  getIconUrl(fileName) {
    return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
  },
  async mounted() {
    await Promise.all([
      this.fetchRecentApplicants(),
      this.fetchPendingApplicationsCount(),
      this.fetchActiveUsers()
    ]);

    this.setupWebSocket();
  },
  beforeUnmount() {
    if (this.socket) this.socket.close();
  },
  watch: {
  filteredData(newVal) {
    console.log("filteredData changed:", newVal);
    }
  }
};
</script>


<style scoped>
/* Dashboard container */
.dashboard-container {
  font-family: 'montserrat', sans-serif;
  font-weight: 400;
  font-style: normal; 
  padding-left: 50px;
  padding-right: 60px;
  height: 100vh;
  overflow: clip;
  display: flex;
  flex-direction: column;
  width: 95%;
  padding-top: 10px;
}

/* Stats Section */
.stats-container {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 0px); 
  margin: 0;
  margin: 0 auto 30px;
  gap: 30px;
}

/* Stats Cards */
.stats-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px 20px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  flex: 1;
  height: 90px;
  font-family: 'Cooper Hewitt', sans-serif;
  font-weight: 400;
  font-style: normal; 
}

/* Tables Section */
.tables-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; 
  width: calc(100% - 0px); /* ✅ Matches stats card width */
  margin: 0 auto;
  gap: 30px; /* ✅ Adds space between tables */
  height: calc(100vh - 250px); /* ✅ Makes tables responsive based on screen height */
  min-height: 250px; 
  padding-bottom: 94px; 
}

.table-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 300px;
  height: 100%; /* ✅ Adapts to available height */
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
}

.table-wrapper {
  flex-grow: 1; 
  overflow-y: auto; /* ✅ Enables vertical scrolling if needed */
  max-height: 100%;
}

.PWDTable {
  flex: 1.5; /* ✅ Gives it more width */
  min-width: 800px; 
}

.RecentApplicantsTable {
  flex: 1; /* ✅ Makes it smaller compared to PWD Table */
  max-width: 350px; /* ✅ Prevents it from getting too wide */
  width: auto; /* ✅ Allows it to shrink */
}

/* Stats Icons */
.stats-icon {
  width: 65px;
  height: 65px;
  margin-right: 30px; /* ✅ Reduced the space between icon & text */
}

/* Stats Text */
.stats-text {
  display: flex;
  flex-direction: column;
  justify-content: center; /* ✅ Keeps text aligned */
  gap: 2px; /* ✅ Reduced the gap between number & label */
}

/* Stats Numbers */
.stats-number {
  font-size: 38px; /* ✅ Large & bold */
  font-weight: 700;
  font-style: normal;
  line-height: 1; /* ✅ Removes extra spacing */
  margin-bottom: 2px; /* ✅ Further reduces gap */
}

/* Stats Labels */
.stats-label {
  font-size: 14px;
  color: #a6a6a6;
  font-weight: 400;
}

    /* ✅ Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.highlight {
  background-color: #d4f8d4;
  transition: background-color 2s ease;
}
</style>

  
  