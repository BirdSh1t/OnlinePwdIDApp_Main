<template>
  <div class="admin-layout">
    <NavBar />
    <div class="admin-content">
      <!-- Listen for the openForm event from Database.vue -->
      <router-view @openForm="fetchUserDetails" />
    </div>
    <!-- Modal wrapper -->
    <div v-if="showAppDetails" class="modal-wrapper">
      <component
        :is="currentFormComponent"
        :visible="showAppDetails"
        :userData="selectedUser"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @close="closeForm"
        @next="goToNextPage"
        @prev="goToPreviousPage"
      />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import AppDetailsForm_pg1 from '@/pages/AppDetailsForm_pg1.vue';
import AppDetailsForm_pg2 from '@/pages/AppDetailsForm_pg2.vue';
import axios from "axios";

export default {
  name: "AdminLayout",
  components: { NavBar },
  data() {
    return {
      showAppDetails: false,
      formPage: 1,
      currentPage: 1,
      totalPages: 2,
      selectedUser: {} // Will store detailed user data fetched from the backend
    };
  },
  computed: {
    currentFormComponent() {
      // Returns the component for the current form page (pg1 or pg2)
      return this.formPage === 1 ? AppDetailsForm_pg1 : AppDetailsForm_pg2;
    },
  },
  methods: {
  fetchUserDetails(userData) {
    this.selectedUser = userData;
    this.showAppDetails = true;
    this.formPage = 1;
    this.currentPage = 1;
  },
  closeForm() {
    this.showAppDetails = false;
  },
  goToPreviousPage() {
    if (this.formPage > 1) {
      this.formPage--;
      this.currentPage--;
    }
  },
  goToNextPage() {
    if (this.formPage < this.totalPages) {
      this.formPage++;
      this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh; 
  overflow: hidden; 
}

.admin-content {
  flex-grow: 1;
  padding: 20px;
  margin-left: 200px; /* Ensure it does not overlap with the sidebar */
  overflow: hidden; /* Prevent scrolling within this section */
}

</style>
