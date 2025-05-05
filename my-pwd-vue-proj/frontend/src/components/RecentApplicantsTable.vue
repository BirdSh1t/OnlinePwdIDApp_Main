<template>
    <div class="table-card">
      <div class="table-header">
        <h2 class="table-title">Recent applicants</h2>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Status</th>
            </tr>
          </thead>

          <!-- ✅ Use transition-group with a key for animation -->
          <tbody is="transition-group" name="fade">
            <tr
              v-for="(applicant, index) in recentApplicants"
              :key="applicant.full_name + index"
              :class="{ highlight: applicant.isNew }"
            >
              <td>{{ applicant.full_name || applicant.fullName }}</td>
              <td>{{ applicant.age }}</td>
              <td>{{ applicant.application_status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "RecentApplicantsTable",
  
    // Robust prop declaration with validation
    props: {
      recentData: {
        type: Array,
        required: true
      }
    },
  
    data() {
      return {
        recentApplicants: [],
        socket: null
      };
    },
  
    watch: {
      // Sync parent prop to local copy
      recentData: {
          immediate: true,
          handler(newVal) {
          this.recentApplicants = [...newVal];
        }
      }
    },
    methods: {
    // ⏳ Helper to filter by 48 hours
    beforeUnmount() {
      if (this.socket) this.socket.close();
      }
    }
  };
  </script>
  
  
  
  <style scoped>

  /* Table Card */
  .table-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 230px);
  min-height: 300px;
  padding-bottom: 15px;
  width: 50%; /* ✅ Takes 50% of its parent container */
  max-width: 480px;
  min-width: 150px; 
  padding-top: 10px;
}

  
/* Table Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vw;
  padding-left: 1vw;
}

.table-title {
  font-size: 2vw;
  font-weight: bold;
  color: black;
}

/* Table Styling */
.table-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100vh - 30vh);
}

table {
  width: 100%;
  font-size: 1.1vw;
  border-collapse: collapse;
  min-width: 200px;
  max-width: 600px;
}

th {
  background: white;
  top: 0;
  z-index: 1;
  position: sticky;
  color: #707680;
  font-weight: bold;
  text-align: left;
  padding: 1vw 1.5vw;
  border-bottom: 0.3vw solid #ededed;
  width: auto;
  white-space: nowrap;
}

td {
  color: #a6a6a6;
  padding: 1vw 1.5vw;
  border-bottom: 0.1vw solid #ededed;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Column widths */
th:nth-child(1), td:nth-child(1) { width: 20%; }
th:nth-child(2), td:nth-child(2) { width: 10%; }
th:nth-child(3), td:nth-child(3) { width: 5%; }

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .table-title {
    font-size: 5vw;
  }

  table {
    font-size: 3.5vw;
  }

  th, td {
    padding: 3vw 2vw;
  }
}



/* .fade-enter-active,
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
    transition: background-color 1.5s ease;
  } */

  </style>
  