<template>
  <div class="dashboard-container">
    <!-- Dashboard Header Card -->
    <div class="dashboard-header-card">
      <div class="dashboard-left">
        <img :src="getIconUrl('menu_bar_black.png')" alt="Dashboard Icon" class="dashboard-icon" />
        <h1 class="dashboard-title">Dash board</h1>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <img :src="getIconUrl('search_black.png')" alt="Search" class="search-icon" />
        <input type="text" placeholder="Search here" class="search-input" />
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-container">
      <div class="stats-card">
        <img :src="getIconUrl('total_applicants_black.png')" alt="Total Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">9,873</p>
          <p class="stats-label">Total applicants</p>
        </div>
      </div>

      <div class="stats-card">
        <img :src="getIconUrl('walk_in_applicant_black.png')" alt="Walk-in Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">256</p>
          <p class="stats-label">Walk-in applicants</p>
        </div>
      </div>

      <div class="stats-card">
        <img :src="getIconUrl('online_black.png')" alt="Online Applicants" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">350</p>
          <p class="stats-label">Online applicants</p>
        </div>
      </div>

      <div class="stats-card">
        <img :src="getIconUrl('processing_black.png')" alt="Processing Applications" class="stats-icon" />
        <div class="stats-text">
          <p class="stats-number">350</p>
          <p class="stats-label">Processing applications</p>
        </div>
      </div>
    </div>

    <!-- Tables Section -->
    <div class="tables-container">
      <PWDTable />
      <RecentApplicantsTable />
    </div>
  </div>
</template>

<!-- <script>
import PWDTable from '../components/PWDTable.vue';
import RecentApplicantsTable from '../components/RecentApplicantsTable.vue';


export default {
  components: { PWDTable, RecentApplicantsTable },
  methods: {
    getIconUrl(fileName) {
      return new URL(`../assets/icons/${fileName}`, import.meta.url).href;
    }
  }
};
</script> -->

<script>
import PWDTable from '../components/PWDTable.vue';
import RecentApplicantsTable from '../components/RecentApplicantsTable.vue';

export default {
  components: { PWDTable, RecentApplicantsTable },

  beforeRouteEnter(to, from, next) {
    const isAuthenticated = localStorage.getItem('isLoggedIn'); // ✅ Check login state
    if (!isAuthenticated) {
      next('/'); // ✅ Redirect to login if not logged in
    } else {
      next();
    }
  },

  methods: {
    getIconUrl(fileName) {
      return new URL(`../assets/icons/${fileName}`, import.meta.url).href;
    }
  }
};
</script>


<style scoped>
  
/* Dashboard container */
.dashboard-container {
  font-family: 'Cooper Hewitt', sans-serif;
  font-weight: 400;
  font-style: normal; 
  padding-left: 20px;
  padding-right: 60px;
  height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* Dashboard Header Card */
.dashboard-header-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 25px 40px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  width: calc(100% - 80px); /* ✅ Prevents stretching */
  margin: 0 auto 20px; /* ✅ Centers and adds spacing */
  flex-wrap: wrap; /* ✅ Prevents overlapping */
}

/* Dashboard Left Section */
.dashboard-left {
  display: flex;
  align-items: center;
}

/* Dashboard Icon */
.dashboard-icon {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

/* Dashboard Title */
.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  font-style: normal; 
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding: 12px 20px;
  width: 400px;
  background-color: white;
}

.search-icon {
  width: 34px;
  height: 34px;
}

.search-input {
  border: none;
  outline: none;
  margin-left: 10px;
  font-size: 18px;
  color: #a6a6a6;
  background: transparent;
  flex-grow: 1;
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
  padding: 20px 30px;
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
  align-items: flex-start; /* ✅ Ensures tables align at the top */
  width: calc(100% - 0px); /* ✅ Matches stats card width */
  margin: 0 auto;
  gap: 30px; /* ✅ Adds space between tables */
  height: calc(100vh - 350px); /* ✅ Makes tables responsive based on screen height */
  min-height: 250px; /* ✅ Prevents tables from getting too small */
  padding-bottom: 80px; /* ✅ Ensures spacing before the bottom edge */
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
}

.table-wrapper {
  flex-grow: 1; /* ✅ Allows table to expand within card */
  overflow-y: auto; /* ✅ Enables vertical scrolling if needed */
  max-height: 100%;
}

.PWDTable {
  flex: 1.5; /* ✅ Gives it more width */
  min-width: 600px; /* ✅ Ensures it doesn’t shrink too much */
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

  
  