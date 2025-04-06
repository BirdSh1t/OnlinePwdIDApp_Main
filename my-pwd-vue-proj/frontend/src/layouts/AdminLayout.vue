<template>
  <div class="admin-layout">
    <NavBar />
    <div class="admin-content">
      <!-- Use router-view so that routed child components are rendered -->
      <router-view @openForm="openAppDetails" />
    </div>

    <!-- Conditionally render the Application Details Form modal -->
    <div v-if="showAppDetails" class="modal-wrapper">
      <!-- Dynamically render Page 1 or Page 2 based on formPage -->
      <component
        :is="currentFormComponent"
        :visible="showAppDetails"
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

export default {
  name: "AdminLayout",
  components: { NavBar },
  data() {
    return {
      showAppDetails: false, // Controls the modal visibility
      formPage: 1,           // 1 for Page 1, 2 for Page 2
      currentPage: 1,        // Tracks current page for indicator
      totalPages: 2,         // Total number of pages
    };
  },
  computed: {
    currentFormComponent() {
      // Returns the component for the current form page
      return this.formPage === 1 ? AppDetailsForm_pg1 : AppDetailsForm_pg2;
    },
  },
  methods: {
    openAppDetails() {
      this.showAppDetails = true;
      this.formPage = 1;  // Reset to Page 1 when opening
      this.currentPage = 1;
    },
    closeForm() {
      this.showAppDetails = false;
    },
    goToPreviousPage() {
      if (this.formPage > 1) {
        this.formPage--; // Switch to previous page
        this.currentPage--; // Update page number
      }
    },
    goToNextPage() {
      if (this.formPage < this.totalPages) {
        this.formPage++; // Switch to next page
        this.currentPage++; // Update page number
      }
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh; /* Ensure it takes full viewport height */
  overflow: hidden; /* Prevent scrolling */
}

.admin-content {
  flex-grow: 1;
  padding: 20px;
  margin-left: 200px; /* Ensure it does not overlap with the sidebar */
  overflow: hidden; /* Prevent scrolling within this section */
}
</style>
