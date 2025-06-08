<template>
  <div class="archive-container">
    <DashboardHeader title="Pending Applicants" @search="handleSearch" />

      <div class="table-card">
      <div class="table-filters" style="width: 200px;">
        <Multiselect
          v-model="selectedSex"
          :options="sexOptions"
          label="label"
          track-by="value"
          :allow-empty="true"
          :searchable="false"
          :clear-on-select="false"
          :close-on-select="true"
          placeholder="Filter by Sex"
          class="custom-dropdown"
        />
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Sex</th><th>Disability</th><th>Archived at</th><th>Unarchive</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="finalFilteredUsers.length === 0">
              <td colspan="6" style="text-align: center;">No Match Found</td>
            </tr>
            <tr v-for="(user, index) in finalFilteredUsers" :key="index">
              <td>{{ user.userNumber }} - {{ user.fullName }}</td>
              <td>{{ user.sex }}</td>
              <td>{{ user.disability }}</td>
              <td>{{ user.archivedDate }}</td>
              <td>
                <button class="unarchive-btn" @click="unarchiveUser(user.pwd_id)">
                  Unarchive
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { apiClient } from "@/api/apiClient.js";
import DashboardHeader from "@/components/DashboardHeader.vue";
import Multiselect from "vue-multiselect";

export default {
  name: 'ArchiveTable',
  components: { DashboardHeader, Multiselect },
  data() {
    return {
      archivedUsers: [],
      searchQuery:    '', 
      filteredData: [],
      searchAttempted: false,   // new flag
      selectedSex: null,
      sexOptions: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
      ]
    };
  },
  computed: {
    finalFilteredUsers() {
      let data = this.searchAttempted ? this.filteredData : this.archivedUsers;

      if (this.selectedSex) {
        data = data.filter(u => u.sex === this.selectedSex.value);
      }

      return data;
    }
  },
  methods: {
    async fetchArchivedUsers() {
      try {
        const res = await apiClient.get("/api/users/archive");
        console.log("Raw archive response:", res.data);

        if (Array.isArray(res.data)) {
          this.archivedUsers = res.data.map(user => ({
            userNumber:   user.num_users,
            fullName:     user.full_name,
            sex:          user.sex,
            pwd_id:       user.pwd_id,
            disability:   user.types_of_disability,
            archivedDate: this.formatDate(user.archived_at)
          }));
          this.filteredData = this.archivedUsers;
          console.log("Mapped archivedUsers:", this.archivedUsers);
        } else {
          console.error("Search API did not return an array:", res.data);
          this.archivedUsers = [];
          this.filteredData = [];
        }
      } catch (err) {
        console.error("Failed to fetch archive:", err);
      }
    },
    async handleSearch(query) {
      this.searchQuery = query;     // keep your query in sync
      this.searchAttempted = !!query.trim();

      if (!query.trim()) {
        this.filteredData = [];
        return;
      }

    try {
      const { data } = await apiClient.get("/api/search", {
        params: { page: "archive", query }
      });

      console.log("Search API response:", data); // <-- ADD THIS

      if (Array.isArray(data)) {
        if (data.length === 1 && data[0].noMatch) {
          this.filteredData = [];
        } else {
          this.filteredData = data.map(u => ({
            userNumber:   u.user_number,
            fullName:     u.full_name,
            sex:          u.sex,
            pwd_id:       u.pwd_id,
            disability:   u.types_of_disability,
            archivedDate: this.formatDate(u.archived_at)
          }));
        }
      } else {
        console.error("Search API did not return an array:", data);
        this.filteredData = [];
      }

    } catch (err) {
      console.error("Search error:", err);
      this.filteredData = [];
    }
  },
    async unarchiveUser(pwd_id) {
      try {
        await apiClient.put(`/api/users/${pwd_id}/unarchive`);
        // remove locally so UI updates instantly
        this.archivedUsers = this.archivedUsers.filter(u => u.pwd_id !== pwd_id);
      } catch (err) {
        console.error("Error unarchiving user:", err);
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year:  "numeric",
        month: "short",
        day:   "numeric"
      });
    }
  },
  mounted() {
    this.fetchArchivedUsers();

    this.socket = new WebSocket("ws://localhost:4000");
    this.socket.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.event === "update-archived") {
        this.fetchArchivedUsers();
      }
    };
  },
  beforeUnmount() {
    if (this.socket) this.socket.close();
  }
};
</script>



<style scoped>
.archive-container {
  font-family: 'Montserrat', sans-serif;
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

.table-wrapper {
  margin-top: 10vh;
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100% - 50px);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* Add thin line for every table row */
.data-table tbody tr {
  border-bottom: 1px solid #ededed;
}


.unarchive-btn {
  background-color: rgba(6, 106, 255, 0.4);
  color: #066aff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.unarchive-btn:hover {
  background-color: rgba(6, 106, 255, 0.6);
}

.data-table td:last-child {
  padding-right: 20px;
  text-align: right;
}

.data-table td button {
  white-space: nowrap;
  font-size: 14px;
}

.data-table th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 200;
  font-family: 'Montserrat', sans-serif;
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

.table-card,
.table-wrapper,
.database-container {
  position: relative;
  z-index: 1;
}

.data-table td {
  width: 10%;
  padding: 8px 8px;
  font-size: 16px;
  color: #a6a6a6;
  padding-right: 30px;
  padding-left: 20px;
}

.custom-dropdown {
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
}

/* Custom Dropdown */
.custom-dropdown {
  width: 180px;
  height: 50px;
  font-family: 'montserrat', sans-serif;
}

.no-results {
  text-align: center;
  font-style: italic;
  color: #888;
}


.data-table th:nth-child(1),
.data-table td:nth-child(1) { width: 15%; }

.data-table th:nth-child(2),
.data-table td:nth-child(2) { width: 8%; }

.data-table th:nth-child(3),
.data-table td:nth-child(3) { width: 15%; }

.data-table th:nth-child(4),
.data-table td:nth-child(4) { width: 9%; }

.data-table th:nth-child(5),
.data-table td:nth-child(5) { 
  width: 9%; 
  text-align: left;
  padding-left: 20px;
  padding-right: 0; /* Optional: remove extra right padding */
}


</style>
