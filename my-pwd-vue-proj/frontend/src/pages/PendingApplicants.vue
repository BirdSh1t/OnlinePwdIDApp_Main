<template>
  <div class="applicants-container">
    <DashboardHeader title="Pending Applicants" @search="handleSearch" />

    <!-- Card Container -->
    <div class="pending-applicants-card">
      <div class="top-container">
        <!-- Moved tabs to top-left of the table -->
        <div class="tabs-container small-tabs">
          <div
            ref="newTab"
            class="tab"
            :class="{ active: activeTab === 'new' }"
            @click="switchTab('new')"
          >
            New Applicants
          </div>
          <div
            ref="renewalTab"
            class="tab"
            :class="{ active: activeTab === 'renewal' }"
            @click="switchTab('renewal')"
          >
            Renewal Requests
          </div>
          <div class="tab-indicator" :style="indicatorStyle" />
        </div>

        <!-- Status Multiselect -->
        <div class="table-filters" style="width: 200px;">
          <multiselect
            v-model="selectedStatus"
            :options="statusOptions"
            track-by="value"
            label="label"
            placeholder="Filter by Status"
            :clear-on-select="false"
            :close-on-select="true"
            :allow-empty="true"
            :searchable="false"
            class="custom-dropdown"
          />
        </div>
      </div>

      <!-- Table & Tabs -->
      <div class="table-wrapper">

        <!-- Your data table -->
        <table class="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
            <tbody>
              <tr v-if="finalApplications.length === 0">
                <td colspan="5" class="text-center text-gray-500 py-4">
                  No Match Found
                </td>
              </tr>

              <tr v-for="(app, index) in finalApplications" :key="index">
                <td>{{ app.fullName }}</td>
                <td>{{ app.email }}</td>
                <td :class="['status-cell', app.application_status === 'approved' ? 'status-approved' : app.application_status === 'rejected' ? 'status-rejected' : '']">
                  {{ app.application_status }}
                </td>
                <td>{{ app.date }}</td>
                <td class="action-buttons">
                  <button
                    class="btn approve"
                    :class="{ expanded: app.isApproved }"
                    @click="handleApproveClick(app.id, index)"
                    @mouseenter="hoveredButton = { id: app.id, type: 'approve' }"
                    @mouseleave="hoveredButton = null"
                  >
                    {{ app.isApproved ? (hoveredButton?.id === app.id && hoveredButton?.type === 'approve' ? 'View' : 'Approved') : 'Approve' }}
                  </button>

                  <button
                    v-if="!app.isApproved || app.isRejected"
                    class="btn reject"
                    :class="{ expanded: app.isRejected }"
                    @click="handleRejectClick(app.id, index)"
                    @mouseenter="hoveredButton = { id: app.id, type: 'reject' }"
                    @mouseleave="hoveredButton = null"
                  >
                    {{ app.isRejected ? (hoveredButton?.id === app.id && hoveredButton?.type === 'reject' ? 'View' : 'Rejected') : 'Reject' }}
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
  import axios from 'axios';
  import Multiselect from "vue-multiselect";
  import DashboardHeader from '@/components/DashboardHeader.vue';
  import { useToast } from 'vue-toastification';

  export default {
    components: { DashboardHeader, Multiselect },
    name: 'PendingApplicants',
    data() {
      return {
        hoveredButton: null,
        toast: useToast(),
        activeTab: 'new',
        tabPositions: {
        left: '0px',
        width: '0px'
        },
        selectedStatus: null, // 👈 bound to multiselect
        statusOptions: [
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
        ],
        applications: [],
        socket: null,
        applications: [],
        filteredData: [],
        searchQuery: ''
      };
    },
    computed: {
      finalApplications() {
        const list = this.filteredData.length ? this.filteredData : this.applications;

        return list.filter((app) => {
          const isCorrectTab =
            this.activeTab === 'new' ? app.is_renewal === 0 : app.is_renewal === 1;
          const matchesStatus =
            !this.selectedStatus || app.application_status === this.selectedStatus.value;
          return isCorrectTab && matchesStatus;
        });
      },
      indicatorStyle() {
        return {
          left: this.tabPositions.left,
          width: this.tabPositions.width
        };
      }
    },
    methods: {
      async handleSearch(query) {
        if (!query.trim()) {
          this.filteredData = this.applications; // 👈 Fix here
          return;
        }

        try {
          const res = await axios.get("http://localhost:4000/api/search", {
            params: { page: "pending", query }
          });

          if (res.data.length && res.data[0].noMatch) {
            this.filteredData = [];
          } else {
            const searchedApps = res.data.map(app => ({
              id: app.id,
              fullName: app.full_name,
              email: app.email,
              date: this.formatDate(app.submitted_at),
              is_renewal: app.is_renewal,
              application_status: app.application_status,
              isApproved: app.application_status === 'approved'
            }));
            this.filteredData = searchedApps;
          }

        } catch (error) {
          console.error("Search error:", error);
          this.filteredData = [];
        }
      },
      switchTab(tab) {
        this.activeTab = tab;
        this.updateIndicator();
      },
      updateIndicator() {
          this.$nextTick(() => {
            const el = this.activeTab === 'new' ? this.$refs.newTab : this.$refs.renewalTab;
          if (el) {
            const extra = 4; // Total gap you want to "close" (in px)

            const left = el.offsetLeft - extra / 6;
            const width = el.offsetWidth + extra;

            this.tabPositions.left = `${left}px`;
            this.tabPositions.width = `${width}px`;
          }
        });
      },
      async fetchApplications() {
        try {
          const res = await axios.get('http://localhost:4000/api/applicants/pending');
          const apps = res.data.map(app => ({
            id: app.id,
            fullName: app.full_name,
            email: app.email,
            date: this.formatDate(app.submitted_at),
            is_renewal: app.is_renewal,
            application_status: app.application_status,
            isApproved: app.application_status === 'approved'
          }));
          
          this.applications = apps;
          this.filteredData = apps; // 👈 Set this too!

        } catch (err) {
          console.error('Error fetching pending applications:', err);
        }
      },
      async handleApproveClick(id) {
        // 1. Locate the applicant in the full applications array
        const originalIndex = this.applications.findIndex(app => app.id === id);
        if (originalIndex === -1) {
          console.warn(`Applicant with id ${id} not found in applications.`);
          return;
        }
        const app = this.applications[originalIndex];

        // 2. If already approved, open the view modal
        if (app.isApproved) {
          this.openViewModal(id);
          return;
        }

        // 3. Otherwise, call the approve endpoint
        try {
          const response = await axios.post(`http://localhost:4000/api/pending/${id}/approve`);
          console.log('✅ Applicant approved:', response.data);

          // 4. Mutate the full applications array entry
          app.application_status = 'approved';
          app.isApproved = true;

          // 5. Also update the filteredData array
          const filteredIndex = this.filteredData.findIndex(a => a.id === id);
          if (filteredIndex !== -1) {
            this.filteredData[filteredIndex].application_status = 'approved';
            this.filteredData[filteredIndex].isApproved = true;
          }

          // 6. Notify the user
          this.toast.info('Applicant approved successfully!');
        } catch (error) {
          console.error('❌ Failed to approve applicant:', error.response?.data || error.message);
          this.toast.error('Failed to approve applicant.');
        }
      },
      async handleRejectClick(id, index) {
        const app = this.applications[index];

        if (app.isRejected) {
          this.openViewModal(id); // to be implemented next
          return;
        }

        try {
          await axios.put(`http://localhost:4000/api/applicants/pending/${id}/reject`);

          app.application_status = 'rejected';
          app.isRejected = true;

          const filtered = this.filteredData.find(app => app.id === id);
          if (filtered) {
            filtered.application_status = 'rejected';
            filtered.isRejected = true;
          }

          this.toast.info('Applicant rejected successfully!');
        } catch (error) {
          console.error('❌ Failed to reject applicant:', error.response?.data || error.message);
          this.toast.error('Failed to reject applicant.');
        }
      },
      openViewModal(id) {
        console.log('🔍 View modal opened for applicant:', id);
        // you'll implement this in your next step
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
    this.updateIndicator();
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
    },
    watch: {
    activeTab() {
      this.searchQuery = '';   
      this.selectedStatus = null;      // 👈 Reset filter too (optional)
      this.filteredData = this.applications; // 👈 Reset data
    }
  }
};
</script>
   
  
  <style scoped>
  .applicants-container {
    font-family: 'montserrat', sans-serif;
    font-weight: 400;
    font-style: normal; 
    padding: 0.625rem 3.125rem;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 95%;
    padding-top: 10px;
  }
  
  .pending-applicants-card{
    background: white;
    width: calc(100% - 3.125rem);
    margin: 0 auto 1.25rem;
    padding: 1.25rem;
    border-radius: 0.625rem;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    padding-left: 30px;
    height: calc(100vh - 230px);
    transition: all 0.3s ease-in-out;
    min-height: 18.75rem;
    overflow: hidden;
    padding-bottom: 14px;
    margin-right: 20px;
    transition: all 0.3s ease-in-out;
    position: relative;
  }

  .data-table {
    table-layout: fixed;
    width: 100%;
    min-width: 37.5rem; 
    border-collapse: collapse;
    font-family: 'Segoe UI', sans-serif;
    table-layout: auto;
  }

/* Table Headers */
    .data-table th {
    top: 0;
    position: sticky;
    background: white;
    z-index: 200;
    font-family: 'montserrat', sans-serif;
    font-size: clamp(0.875rem, 1.4vw, 5.15rem);
    font-weight: 700;
    text-align: left;
    padding: 0.75rem 0.938rem;
    color: black;
    border-bottom: 3px solid #ededed;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem 0.5rem; /* Reduced padding */
      text-overflow: ellipsis;
      max-width: 15rem; /* Maximum column width */
    }

    .data-table tbody tr {
    border-bottom: 1px solid #ededed;
    }

    .data-table td {
    margin: 0 auto;
    padding: 0.625rem 0.5em;
    font-size: clamp(0.75rem, 1.2vw, 4.95rem);
    color: #a6a6a6;
    white-space: nowrap;
    }

    .data-table tr td {
    border-bottom: 1px solid #ddd;
    }

    /* Table styling */
    .table-wrapper {
    width: 100%; /* Control width here */
    margin: 0 auto; /* Center the table */
    flex-grow: 1;
    overflow-x: auto;
    padding-right: 0;
    -webkit-overflow-scrolling: touch;
    
  }

  /* Column 1 */
.data-table th:nth-child(1),
.data-table td:nth-child(1) { width: 17vw; max-width: 22.5rem; }
.data-table th:nth-child(2)
.data-table td:nth-child(2) { width: 17vw; max-width: 20.75rem; 
  word-break: break-word;
  white-space: normal;}
.data-table th:nth-child(3),
.data-table td:nth-child(3) { width: 10vw; max-width: 12.5rem; 
}
.data-table th:nth-child(4),
.data-table td:nth-child(4) { 
  width: 10vw; max-width: 9.375rem; 
  max-width: 12.5rem;
}
.data-table th:nth-child(5){ 
  border-bottom: 3px solid #ededed; 
  padding-left: 5.4vw; /* 5.4% of viewport width */
} 
.data-table td:nth-child(5) { 
  width: 15vw; 
  max-width: 12.5rem; 
  border-bottom: none !important; 
  border-bottom-style: none !important;
}

.btn {
  border: none;
  border-radius: clamp(0.15rem, 0.3vw, 0.25rem);
  padding: 
    clamp(0.25rem, 0.5vw, 0.5rem) 
    clamp(0.5rem, 1.2vw, 1.5rem);
  font-size: clamp(0.7rem, 1.1vw, 0.875rem);
  font-weight: bold;
  transition: all 0.6s ease;
  cursor: pointer;
  margin-right: clamp(0.25rem, 0.5vw, 0.375rem);
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}


.btn.reject {
  background-color: rgba(255, 49, 49, 0.4); /* Active */
  color: #ff3131;
  min-width: clamp(3.5rem, 6.5vw, 5.6rem);
}

.btn.reject.expanded {
  background-color: rgba(255, 49, 49, 0.2); /* Dimmed */
  color: rgba(255, 49, 49, 0.6);
}

.btn.reject.expanded:hover {
  background-color: rgba(255, 49, 49, 0.7); /* Bright */
  color: white;
  cursor: pointer;
}

.btn.approve {
  background-color: rgba(6, 106, 255, 0.4); /* Active */
  color: #066aff;
}

.btn.approve.expanded {
  flex-grow: 1; /* Expand and take up the reject button space */
  flex-basis: 100%;
  margin-right: 0; 
  background-color: rgba(6, 106, 255, 0.2); /* Dimmed */
  color: rgba(6, 106, 255, 0.6);
}

.btn.approve.expanded:hover {
  background-color: rgba(6, 106, 255, 0.7); /* Bright */
  color: white;
  cursor: pointer;
}

.btn.approve.expanded,
.btn.reject.expanded {
  flex-grow: 1;
  flex-basis: 100%;
  margin-right: 0;
}

.status-cell {
  font-weight: bold;
  text-transform: capitalize;
}

.status-approved {
  color: #066aff;
}

.status-rejected {
  color: #ff3131;
}

.top-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-right: 2rem; /* Adjusted for better alignment */
  z-index: 1000; /* Ensure it stays above other content */
}

  /* Tabs container */
.tabs-wrapper {
  top: 0; /* Or however far from top you want */
  z-index: 100; /* Make sure it stays above other content */
  background-color: #dbdbdb; /* Prevent transparency gap when scrolling */
  display: flex;
  justify-content: left;
 
  padding: 2vh 4vw;
}

/* Container scales with screen size and centers content */
.tabs-container {
  margin-bottom: 6rem;
  display: flex;
  background-color: #dbdbdb;
  border-radius: 0.5rem;
  padding: 0.2rem;
  position: relative;
  overflow: hidden;
  width: 23%;
  height: auto;
  min-height: 2rem;
}

/* Tabs scale and fill space equally */
.tab {
  flex: 1;
  text-align: center;
  font-size: clamp(0.7rem, 0.6vw, 1.6rem);
  padding: clamp(0.6rem, 1vh, 1rem) clamp(0.2rem, 0.6vw, 0.9rem);
  color: #737373;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.tab.active {
  color: #fff;
}

/* Indicator auto sizes using JavaScript */
.tab-indicator {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: #25ae6a;
  border-radius: inherit;
  margin-left: -2px;
  transition: all 0.3s ease;
  z-index: 0;
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

.table-filters {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  color: #999;
}


.table-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 5rem;
}

.text-center {
  text-align: center;
}
.text-gray-500 {
  color: #6b7280;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}


/* Optional media tweaks */
@media (max-width: 600px) {
  .tabs-container {
    height: 6.5vh;
  }

  .tab {
    font-size: clamp(0.85rem, 1.3vw, 1.1rem);
  }
}

@media (min-width: 1200px) {
  .tabs-wrapper {
    padding: 2vh 10vw;
  }
}

  </style>
  