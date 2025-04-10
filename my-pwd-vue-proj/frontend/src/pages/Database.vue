<template>
  <div class="database-container">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <DashboardHeader title="Dashboard" @search="handleSearch" />
    </div>

    <!-- Table Card -->
    <div class="table-card">

      <!-- Filters Section -->
      <div class="table-filters">
        <multiselect
          v-model="selectedFilters[0]"
          :options="sexOptions"
          class="custom-dropdown"
          placeholder="Select Sex"
        />
        <multiselect
          v-model="selectedFilters[1]"
          :options="statusOptions"
          class="custom-dropdown"
          placeholder="Select Status"
        />

        <!-- Date Picker -->
        <Datepicker
          v-model="selectedDate"
          :enable-time-picker="false"
          :placeholder="'Select Date'"
          class="custom-date-picker"
        />
        </div>
        
        <!-- Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sex</th>
                <th>PWD ID</th>
                <th>Status</th>
                <th>Date Issued</th>
                <th class="more-header">More</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredTableData.length === 0">
                <td colspan="6" style="text-align: center;">No Match Found</td>
              </tr>
              <tr v-for="(row, index) in filteredTableData" :key="index">
                <td>
                  <span class="name-number">{{ row.user_number }}.</span>
                  <span class="name-text">{{ row.full_name }}</span>
                </td>
                <td>{{ row.sex }}</td>
                <td>{{ row.pwd_id }}</td>
                <td :class="{
                      'valid': row.status.toLowerCase() === 'valid',
                      'invalid': row.status.toLowerCase() === 'invalid'
                    }">
                  {{ row.status }}
                </td>
                <td>{{ formatDate(row.date_issued) }}</td>
                <td class="more-cell">
                  <MoreOptions
                    :index="index"
                    :isOpen="activeIndex === index"
                    @toggle="toggleDropdown"
                    @openForm="openFormFromRow"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import DashboardHeader from "@/components/DashboardHeader.vue";
import Multiselect from "vue-multiselect";
import MoreOptions from "@/components/MoreOptions.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "Database",
  components: {
    DashboardHeader,
    Multiselect,
    MoreOptions,
    Datepicker
  },
  data() {
    return {
      selectedFilters: ["All", "All"], // Default filters
      sexOptions: ["All", "Male", "Female"], // Options for sex filter
      statusOptions: ["All", "Valid", "Invalid"], // Options for status filter
      selectedDate: null,
      tableData: [],
      activeIndex: null,
      socket: null,
      searchQuery: "", // For search input
    };
  },
  computed: {
  filteredTableData() {
      return this.tableData.filter(row => {
        const sexMatch = this.selectedFilters[0] === "All" || row.sex.toLowerCase() === this.selectedFilters[0].toLowerCase();
        const statusMatch = this.selectedFilters[1] === "All" || row.status.toLowerCase() === this.selectedFilters[1].toLowerCase();

        const dateMatch = !this.selectedDate || (
          row.date_issued &&
          new Date(row.date_issued).toDateString() === new Date(this.selectedDate).toDateString()
        );

        return sexMatch && statusMatch && dateMatch;
      });
    }
  },
  mounted() {
    this.fetchDatabaseData();
    this.setupWebSocket();
  },
  methods: {
    fetchDatabaseData() {
      axios
        .get("http://localhost:4000/api/users")
        .then((response) => {
          this.tableData = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    searchUsers() {
      const query = this.searchQuery.trim();

      if (query === "") {
        // If empty, reload the original data
        this.fetchDatabaseData();
        return;
      }

      axios
        .get("http://localhost:4000/api/search", {
          params: {
            page: "report", // Same structure as your database table
            query
          }
        })
        .then((response) => {
          const results = response.data;

          if (results.length && results[0].noMatch) {
            this.tableData = [];
          } else {
            this.tableData = results;
          }
        })
        .catch((error) => {
          console.error("Error searching data:", error);
        });
    },
    handleSearch(query) {
      this.searchQuery = query;
      this.searchUsers();
    },
    setupWebSocket() {
      this.socket = new WebSocket("ws://localhost:4000");

      this.socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      this.socket.onmessage = (event) => {
        const updatedData = JSON.parse(event.data);
        this.tableData = updatedData;
      };

      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    },
    toggleDropdown(rowIndex) {
      this.activeIndex = this.activeIndex === rowIndex ? null : rowIndex;
    },
    async openFormFromRow(rowIndex) {
      try {
        const user = this.tableData[rowIndex];
        const [basicResponse, detailsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/users/page1/${user.pwd_id}`),
          axios.get(`http://localhost:4000/api/users/page2/${user.pwd_id}`)
        ]);
        const userData = {
          ...basicResponse.data,
          ...detailsResponse.data
        };
        this.$emit("openForm", userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>

<style scoped>
/* Overall Page Container */
.database-container {
  font-family: 'montserrat', sans-serif;
  font-weight: 400;
  padding-left: 50px;
  padding-right: 60px;
  height: 100vh;
  overflow: clip;
  display: flex;
  flex-direction: column;
  width: 95%;
  padding-top: 10px;
}

/* Table Card */
.table-card {
  background: white;
  width: calc(100% - 50px); /* Adjust width to be flexible */
  margin: 0 auto 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  height: calc(100vh - 230px);
  min-height: 300px;
  overflow: auto;
  padding-bottom: 14px;
  z-index: 1;
  position: relative;
}

/* Filters Section */
.table-filters {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  gap: 8px;
}

/* Custom Dropdown */
.custom-dropdown {
  width: 180px;
  height: 50px;
  font-family: 'montserrat', sans-serif;
}

.table-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}

.custom-date-picker {
  width: 180px;
  font-family: 'montserrat', sans-serif;
}

.custom-date-picker {
  width: 180px;
  height: 52px; /* ➕ Add 2px */
  border-radius: 5px;
  font-family: 'montserrat', sans-serif;
  box-sizing: border-box;
  transition: border 0.3s ease-in-out;
}

/* ✅ Add black border when hovering over the dropdown */
.custom-dropdown:hover {
  border-radius: 5px;
  border: 1px solid rgb(0, 194, 39) !important;
  transition: border 0.5s ease-in-out;
  height: 10px;
  width: 179px;
}

/* ✅ Remove default styles & apply custom Tailwind CSS */
.custom-dropdown .multiselect__option {
  background: white !important;
  color: black !important;
}

/* ✅ Change hover background color */
.custom-dropdown .multiselect__option--highlight {
  background-color: #f0f0f0 !important; /* Light gray instead of blue */
  color: black !important;
}

/* ✅ Ensures dropdown aligns with table */
.table-filters {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 100px;
}

/* ✅ Prevents dropdown expansion issue */
.custom-dropdown .multiselect__content-wrapper {
  width: 100% !important;
  max-width: 100% !important;
  position: absolute !important;
  z-index: 9999 !important;
}

/* ✅ Custom scrollbar for dropdown */
.custom-dropdown .multiselect__content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.custom-dropdown .multiselect__content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

/* Table Wrapper */
.table-wrapper {
  position: relative;
  flex-grow: 1; /* ✅ Allows table to expand */
  overflow-y: auto;
  max-height: calc(100% - 50px);
}

/* Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* Table Headers */
.data-table th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 200;
  font-family: 'montserrat', sans-serif;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
  padding: 12px 15px;
  color: black;
  border-bottom: 3px solid #ededed;
  white-space: nowrap;
}

.data-table thead tr {
  position: sticky;
  top: 0;
  z-index: 190;
  background: white;
}


.data-table td.more-icon {
  position: sticky;
  right: 0;
  z-index: 50; /* Lower than header */
  background: white;
  padding-right: 30px;
  text-align: right;
}


.table-card,
.table-wrapper,
.database-container {
  position: relative;
  z-index: 1;
}

.custom-dropdown .multiselect__content-wrapper {
  position: absolute !important;
  z-index: 9999 !important;
  background: white;
}

/* Table Rows */
.data-table td {
  width: 10%;
  margin: 0 auto;
  padding: 8px 8px;
  font-size: 16px;
  color: #a6a6a6;
  padding-right: 40px;
  padding-left: 20px; /* ✅ Aligns with header */
}

/* Row Divider (Shortened Line) */
.data-table tr td {
  border-bottom: 1px solid #ddd;
}

.data-table tr td::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20%; /* ✅ Move the line further right */
  /* width: 80%;  */
  border-bottom: 1px solid #ddd;
}

.data-table tr:last-child td::after {
  border-bottom: none;
}

td[class="valid"] {
  color: #00bf63;
  font-weight: 600;
}

td[class="invalid"] {
  color: #ff3131;
  font-weight: 600;
}
/* More Icon Column */
.more-icon {
  position: sticky;
  z-index: 10;
  width: 20px;
  cursor: pointer;
  margin-left: 18px;
}

.name-number {
  display: inline-block;
  width: 0.5em;
  text-align: right;
  margin-right: 1.4em;
  vertical-align: top;
}

.name-text {
  display: inline-block;
  vertical-align: top;
  max-width: calc(100% - 2.4em); /* Adjust based on the number width */
  word-break: break-word;
}


/* Individual Header Styles */
.data-table th:nth-child(1),
.data-table td:nth-child(1) { width: 20%; min-width: 150px; }
.data-table th:nth-child(2),
.data-table td:nth-child(2) { width: 10%; min-width: 80px; }
.data-table th:nth-child(3),
.data-table td:nth-child(3) { width: 10%; min-width: 80px; }
.data-table th:nth-child(4),
.data-table td:nth-child(4) { width: 9%; min-width: 90px; }
.data-table th:nth-child(5),
.data-table td:nth-child(5) { width: 9%; min-width: 100px; }
.data-table th:nth-child(6),
.data-table td:nth-child(6) { width: 5%; }
</style>
