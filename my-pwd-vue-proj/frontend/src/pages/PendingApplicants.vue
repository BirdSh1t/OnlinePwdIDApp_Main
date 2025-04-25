<template>
    <div class="applicants-container">

    <DashboardHeader title="Pending Applicants" />
      <!-- Tabs -->
      <div class="pending-applicants-card">
        <div class="tabs-container">
            <div
            class="tab"
            :class="{ active: activeTab === 'new' }"
            @click="activeTab = 'new'"
            alt="New-app-text"
            >
            New Applicants
            </div>
            <div
            class="tab"
            :class="{ active: activeTab === 'renewal' }"
            @click="activeTab = 'renewal'"
            >
            Renewal Requests
            </div>
            <div class="tab-indicator" :class="activeTab"></div>
        </div>
    
        <!-- Table -->
        <div class="table-wrapper">
            <table class="data-table">
            <thead>
                <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Disability</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(app, index) in filteredApplications" :key="index">
                <td>{{ app.fullName }}</td>
                <td>{{ app.email }}</td>
                <td>{{ app.disability }}</td>
                <td>{{ app.application_status }}</td>
                <td>{{ app.date }}</td>
                <td>
                  <button class="btn approve" @click="approve(app.id)">Approve</button>
                  <button class="btn reject" @click="reject(app.id)">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import DashboardHeader from '@/components/DashboardHeader.vue';
  
  export default {
    components: { DashboardHeader },
    name: 'PendingApplicants',
    data() {

      return {
        activeTab: 'new',
        selectedStatus: '',
        applications: [], // ⛔ Removed static data
        socket: null
      };
    },
    computed: {
      filteredApplications() {
        return this.applications.filter((app) => {
          const isCorrectTab =
            this.activeTab === 'new' ? app.is_renewal === 0 : app.is_renewal === 1;
          const matchesStatus =
            !this.selectedStatus || app.application_status === this.selectedStatus;
          return isCorrectTab && matchesStatus;
        });
      }
    },
    methods: {
      async fetchApplications() {
        try {
          const res = await axios.get('http://localhost:4000/api/applicants/pending');
          this.applications = res.data.map(app => ({
            id: app.id,
            fullName: app.full_name,
            email: app.email,
            disability: app.types_of_disability,
            status: app.application_status,
            date: this.formatDate(app.submitted_at), // ✅ Format date
            is_renewal: app.is_renewal,
            application_status: app.application_status
          }));
        } catch (err) {
          console.error('Error fetching pending applications:', err);
        }
      },
      async approve(id) {
        await axios.put(`http://localhost:4000/api/applicants/pending/${id}/approve`);
        this.fetchApplications();
      },
      async reject(id) {
        await axios.put(`http://localhost:4000/api/applicants/pending/${id}/reject`);
        this.fetchApplications();
      },
      formatDate(dateString) {
        if (!dateString) return '';
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        return new Date(dateString).toLocaleString('en-US', options);
      },
      setTab(tab) {
        this.activeTab = tab;
      }
    },
    mounted() {
    this.fetchApplications();

    // ✅ WebSocket listener
    this.socket = new WebSocket("ws://localhost:4000");

    this.socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event === "new-applicant") {
        // Just refetch to refresh the full list
        this.fetchApplications();
      }
    });
  },
  beforeUnmount() {
    if (this.socket) this.socket.close();
  }
};
  </script>
   
  
  <style scoped>
  .applicants-container {
    font-family: 'montserrat', sans-serif;
    font-weight: 400;
    font-style: normal; 
    padding-left: 50px;
    padding-right: 60px;
    height: 100vh;
    overflow: hidden;
    display: column;
    flex-direction: column;
    width: 95%;
    padding-top: 10px;
  }
  
  .pending-applicants-card{
    background: white;
    width: calc(100% - 50px); /* Match the width of .table-card */
    margin: 0 auto 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    display: column;
    flex-direction: column;
    padding-left: 30px;
    /* align-items: flex-start; */
    height: calc(100vh - 230px);
    transition: all 0.3s ease-in-out;
    min-height: 300px;
    overflow: auto;
    padding-bottom: 14px;
    margin-right: 20px;
    transition: all 0.3s ease-in-out;
  }

    .data-table {
      width: 100%;
      min-width: 800px; /* Optional: base width before scroll activates */
      border-collapse: collapse;
      font-family: 'Segoe UI', sans-serif;
      table-layout: auto;
    }

/* Table Headers */
    .data-table th {
    position: sticky;
    top: 0;
    background: white;
    z-index: 200;
    font-family: 'montserrat', sans-serif;
    font-size: 17px;
    font-weight: 700;
    text-align: left;
    padding: 12px 15px;
    color: black;
    border-bottom: 3px solid #ededed;
    white-space: nowrap;
    }

    .data-table tbody tr {
    border-bottom: 1px solid #ededed;
    }

    .data-table td {
    margin: 0 auto;
    padding: 10px 1em;
    font-size: 0.95rem;
    color: #a6a6a6;
    white-space: nowrap;
    }

    .data-table tr td {
    border-bottom: 1px solid #ddd;
    }

    /* Action buttons */
    .btn {
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: bold;
    font-family: 'Segoe UI';
    cursor: pointer;
    margin-right: 6px;
    }

    .btn.approve {
    background-color: rgba(6, 106, 255, 0.4);
    color: #066aff;
    }

    .btn.reject {
    background-color: rgba(255, 49, 49, 0.4);
    color: #ff3131;
    width: 5vw;
    }

    /* Column widths */
  /* Column 1 */
  .data-table th:nth-child(1),
.data-table td:nth-child(1) { min-width: 150px; }

.data-table th:nth-child(2),
.data-table td:nth-child(2) { min-width: 150px; }

.data-table th:nth-child(3),
.data-table td:nth-child(3) { min-width: 130px; }

.data-table th:nth-child(4),
.data-table td:nth-child(4) { min-width: 100px; }

.data-table th:nth-child(5),
.data-table td:nth-child(5) { min-width: 140px; }

.data-table th:nth-child(6){
  padding-left: 4em;
}
.data-table td:nth-child(6) {
  min-width: 200px;
}

    /* Tabs container */
    .tabs-container {
    display: flex;
    background: #dbdbdb;
    border-radius: 20px;
    width: fit-content;
    padding: 0.5px;
    height: auto;
    position: relative;
    margin-bottom: 6vh;
    overflow: hidden;
    }

    .tab {
    font-size: 0.8rem; /* ~13px at default settings */
    padding: 6px 16px;
    border-radius: 15px;
    color: #737373;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    z-index: 1;
    }

    
    .tab.active {
    color: white;
    }

    .tab-indicator {
    position: absolute;
    height: 100%;
    background-color: #a4a4a4;
    border-radius: 20px;
    top: 0;
    transition: left 0.3s ease, width 0.3s ease; /* Add width transition */
    z-index: 0;
    }

    .tab-indicator.new {
    left: 0;
    width: 46%; /* 45% width for New Applicants */
    }

    .tab-indicator.renewal {
    left: 35%; /* Starts right after New Applicants section */
    width: 65%; /* 55% width for Renewal Requests */
    }
    
    .tab-indicator.renewal {
    left: 50%;
    }

    /* Table styling */
    .table-wrapper {
      width: 100%;
      overflow-x: auto;
}


  </style>
  