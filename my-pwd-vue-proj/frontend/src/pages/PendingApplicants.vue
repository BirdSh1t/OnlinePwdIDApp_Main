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
          <div class="table-wrapper" v-if="applications.length > 0">
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
        <p v-else>Loading...</p>
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
        activeTab: 'new', // 'applicants' or 'renewals'
        selectedStatus: '',
  
        // Holds all applications from backend
        applications: [
          {
            fullName: 'Juan Dela Cruz',
            email: 'juan@example.com',
            disability: 'Visual',
            status: 'Pending',
            date: '2025-04-19',
            is_renewal: 0, // ← indicates this is a "New Applicant"
            application_status: 'Pending',
          },
          {
            fullName: 'Maria Santos',
            email: 'maria@example.com',
            disability: 'Hearing',
            status: 'Pending',
            date: '2025-04-19',
            is_renewal: 1, // ← indicates this is a "Renewal Request"
            application_status: 'Pending',
          },
        ],
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
      },
    },
    methods: {
      async fetchApplications() {
        try {
          const res = await axios.get('http://localhost:4000/api/pending');
          this.applications = res.data.map(app => ({
            id: app.id,
            fullName: app.full_name,
            email: app.email,
            disability: app.types_of_disability,
            status: app.application_status,
            date: app.submitted_at,
            is_renewal: app.is_renewal,
            application_status: app.application_status
          }));
          console.log("Mapped applications:", this.applications);
        } catch (err) {
          console.error('Error fetching pending applications:', err);
        }
      },
      async approve(id) {
        await axios.put(`http://localhost:4000/api/pending/${id}/approve`);
        this.fetchApplications();
      },
      async reject(id) {
        await axios.put(`http://localhost:4000/api/pending/${id}/reject`);
        this.fetchApplications();
      },
      formatDate(date) {
        return new Date(date).toLocaleString();
      },
      setTab(tab) {
        this.activeTab = tab;
      },
    },
    mounted() {
      this.fetchApplications().then(() => {
    console.log("Applications fetched:", this.applications);
    console.log("Filtered applications:", this.filteredApplications);
      });
    },    
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
    overflow: clip;
    display: flex;
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
    display: flex;
    flex-direction: column;
    padding-left: 30px;
    align-items: flex-start;
    height: calc(100vh - 230px);
    transition: all 0.3s ease-in-out;
    min-height: 300px;
    overflow: auto;
    padding-bottom: 14px;
    margin-right: 20px;
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
    left: 40%; /* Starts right after New Applicants section */
    width: 60%; /* 55% width for Renewal Requests */
    }
    
    .tab-indicator.renewal {
    left: 50%;
    }

    /* Table styling */
    .table-wrapper {
    position: relative;
    flex-grow: 1; /* ✅ Allows table to expand */
    overflow-y: auto;
    max-height: calc(100% - 50px);
}

    .data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Segoe UI', sans-serif;
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

    .data-table tbody tr {
    border-bottom: 1px solid #ededed;
    }

    .data-table td {
    width: 10%;
    margin: 0 auto;
    padding: 8px 8px;
    font-size: 16px;
    color: #a6a6a6;
    padding-right: 40px;
    padding-left: 20px; /* ✅ Aligns with header */
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
    }

    /* Column widths */
    .data-table th:nth-child(1),
    .data-table td:nth-child(1) { width: 32%; min-width: 230px; }
    .data-table th:nth-child(2),
    .data-table td:nth-child(2) { width: 25%; min-width: 230px; }
    .data-table th:nth-child(3),
    .data-table td:nth-child(3) { width: 20%; min-width: 150px; }
    .data-table th:nth-child(4),
    .data-table td:nth-child(4) { width: 20%; min-width: 120px; }
    .data-table th:nth-child(5),
    .data-table td:nth-child(5) { width: 9%; min-width: 190px; }
    .data-table th:nth-child(6),
    .data-table td:nth-child(6) { width: 5%; }
  </style>
  