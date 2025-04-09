<template>
  <div class="dashboard-container">
    <!-- Dashboard Header Card -->
    <DashboardHeader title="Dashboard" @search="handleSearch" />

    <!-- Statistics Cards -->
    <div class="stats-container">
      <div class="stats-card">
        <img :src="getIconUrl('total_applicants_black.png')" alt="Total Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">{{ totalApplicants }}</p>
          <p class="stats-label">Total applicants</p>
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
      <RecentApplicantsTable />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DashboardHeader from '@/components/DashboardHeader.vue';
import PWDTable from '@/components/PWDTable.vue';
import RecentApplicantsTable from '@/components/RecentApplicantsTable.vue';

export default {
  name: "Dashboard",
  components: { DashboardHeader, PWDTable, RecentApplicantsTable },
  data() {
    return {
      fullData: [],       // Initially fetched full data
      filteredData: [],   // Data filtered based on search
      totalApplicants: 0,
      walkInApplicants: 0,
      onlineApplicants: 0,
      processingApplications: 0
    };
  },
  methods: {
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    async handleSearch(query) {
  try {
    const res = await axios.get("http://localhost:4000/api/search", {
      params: { page: "dashboard", query }
    });
    this.filteredData = res.data.length ? res.data : [];
  } catch (error) {
    console.error("Search error:", error);
    this.filteredData = [];
      }
    }
  },
  async mounted() {
    // On page load, fetch all users; store both fullData and filteredData
    const res = await axios.get("http://localhost:4000/api/users");
    this.fullData = res.data;
    this.filteredData = res.data;
    this.totalApplicants = res.data.length;

    console.log("filteredData sample:", this.filteredData[0]);
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
</style>

  
  