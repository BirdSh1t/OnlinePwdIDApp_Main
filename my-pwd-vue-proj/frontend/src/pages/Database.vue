<template>
  <div class="database-container">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <DashboardHeader title="Dashboard" @search="handleSearch" />
    </div>

    <!-- Table Card -->
    <div class="table-card">

          <div class="table-filters">
        <!-- Sex Filter -->
        <multiselect
          v-model="selectedFilters[0]"
          :options="sexOptions"
          track-by="value"
          label="label"
          placeholder="Select Sex"
          :clear-on-select="false"
          :close-on-select="true"
          :allow-empty="false"
          @input="onFilterInput('sex', $event)"
          class="custom-dropdown"
          :searchable="false" 
        />

        <!-- Status Filter -->
        <multiselect
          v-model="selectedFilters[1]"
          :options="statusOptions"
          track-by="value"
          label="label"
          placeholder="Select Status"
          :clear-on-select="false"
          :close-on-select="true"
          :allow-empty="false"
          @input="onFilterInput('status', $event)"
          class="custom-dropdown"
          :searchable="false" 
        />

        <!-- Date Picker -->
        <Datepicker
          v-model="selectedDate"
          :enable-time-picker="false"
          placeholder="Select Date"
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
                    :isOpen="activeIndex === index"
                    :index="index"
                    :recordId="row.pwd_id"
                    @toggle="toggleDropdown"
                    @openForm="openFormFromRow"
                    @archive="archiveUser"
                    @updated="handleUpdated"
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
      // now each option is an object:
      sexOptions: [
        { label: "All",   value: "all" },
        { label: "Male",  value: "male" },
        { label: "Female",value: "female" },
      ],
      statusOptions: [
        { label: "All",   value: "all" },
        { label: "Valid", value: "valid" },
        { label: "Invalid", value: "invalid" },
      ],
      // selectedFilters holds two objects (sex, status)
      selectedFilters: [
        { label: "All", value: "all" },
        { label: "All", value: "all" },
      ],
      selectedDate: null,
      tableData: [], 
      tableData: [],
      activeIndex: null,
      socket: null,
      searchQuery: ""
  };
},
computed: {
  filteredTableData() {
      const [sexFilter, statusFilter] = this.selectedFilters.map(f => f.value);
      return this.tableData.filter(row => {
        const sex   = row.sex?.toLowerCase();
        const status= row.status?.toLowerCase();
        const dateOk= !this.selectedDate ||
          new Date(row.date_issued).toDateString() ===
          new Date(this.selectedDate).toDateString();

        return (
          (sexFilter === "all" || sex === sexFilter) &&
          (statusFilter === "all" || status === statusFilter) &&
          dateOk
        );
      });
    }
  },
  methods: {
    onFilterInput(type, option) {
        // find index: sex → 0, status → 1
      const idx = type === "sex" ? 0 : 1;

        // if same value clicked twice, reset to “All”
      if (this.selectedFilters[idx].value === option.value) {
        this.$set(this.selectedFilters, idx, { label: "All", value: "all" });
      } else {
          // otherwise just store the newly selected
        this.$set(this.selectedFilters, idx, option);
      }
    },
    handleUpdated() {
    this.fetchDatabaseData(); // Re-fetch data after archive
    },
    // already existing methods
    fetchDatabaseData() {
    axios
      .get("http://localhost:4000/api/users", { params: { archived: 0 } }) // ✅ only active
      .then((res) => {
        this.tableData = res.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    },
    searchUsers() {
      const query = this.searchQuery.trim();

      if (query === "") {
        this.fetchDatabaseData();
        return;
      }

      axios
        .get("http://localhost:4000/api/search", {
          params: {
            page: "database",
            query
          }
        })
        .then(response => {
          const results = response.data;
          this.tableData =
            results.length && results[0].noMatch ? [] : results;
        })
        .catch(error => {
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
        const message = JSON.parse(event.data);
        if (message.event === "update-active") {
          this.tableData = message.data;
        }
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
          axios.get(
            `http://localhost:4000/api/users/page1/${user.pwd_id}`
          ),
          axios.get(
            `http://localhost:4000/api/users/page2/${user.pwd_id}`
          )
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
    async archiveUser(pwd_id) {
      try {
        await axios.put(`http://localhost:4000/api/users/${pwd_id}/archive`);
        // Let WebSocket broadcast the new list
      } catch (error) {
        console.error("Error archiving user:", error);
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchDatabaseData();
    this.setupWebSocket();
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
  color: #999;
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
  font-size: clamp(0.875rem, 1.5vw, 5.15rem);
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
  font-size: clamp(0.75rem, 1.2vw, 4.95rem);
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


.more-icon {
  position: sticky;
  z-index: 10;
  width: 5vw; /* Scales based on viewport width */
  height: auto; /* Maintain aspect ratio */
  cursor: pointer;
  margin-left: 1vw;
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
