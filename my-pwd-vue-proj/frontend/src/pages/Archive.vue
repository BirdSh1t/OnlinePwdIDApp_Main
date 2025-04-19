<template>
  <div class="archive-container">
    <DashboardHeader title="Archive" />

    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Sex</th><th>Disability</th><th>Archived at</th><th>Unarchive</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in archivedUsers" :key="index">
              <td>{{ user.user_number }} - {{ user.full_name }}</td>
              <td>{{ user.sex }}</td>
              <td>{{ user.types_of_disability }}</td>
              <td>{{ formatDate(user.archived_at) }}</td>
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
import axios from "axios";
import DashboardHeader from "@/components/DashboardHeader.vue";

export default {
  name: 'ArchiveTable',
  components: { DashboardHeader },
  data() {
    return { archivedUsers: [] };
  },
  methods: {
    async fetchArchived() {
      try {
        const res = await axios.get("http://localhost:4000/api/pwd-forms", { params: { archived: 1 } });
        this.archivedUsers = res.data;
      } catch (err) {
        console.error("Error fetching archives:", err);
      }
    },
    async unarchiveUser(pwd_id) {
      try {
        await axios.put(`http://localhost:4000/api/users/${pwd_id}/unarchive`);
        //this.archivedUsers = this.archivedUsers.filter(u => u.pwd_id !== pwd_id);
      } catch (err) {
        console.error("Error unarchiving user:", err);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  },
  formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date) ? "Invalid Date" : date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  },
  mounted() {
    this.fetchArchived();

    this.socket = new WebSocket("ws://localhost:4000");

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "update-archived") {
        this.archivedUsers = message.data;
      }
    };
  },
  beforeDestroy() {
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

.data-table th:nth-child(1),
.data-table td:nth-child(1) { width: 15%; min-width: 100px; }

.data-table th:nth-child(2),
.data-table td:nth-child(2) { width: 10%; min-width: 80px; }

.data-table th:nth-child(3),
.data-table td:nth-child(3) { width: 10%; min-width: 80px; }

.data-table th:nth-child(4),
.data-table td:nth-child(4) { width: 9%; min-width: 70px; }

.data-table th:nth-child(5),
.data-table td:nth-child(5) { width: 9%; min-width: 10px; }

.data-table td:nth-child(5) {
  text-align: left;
  padding-left: 20px;
  padding-right: 0; /* Optional: remove extra right padding */
}


</style>
