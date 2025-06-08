<template>
  <div class="admin-layout">
    <NavBar />
    <div class="admin-content">
      <router-view
        @openForm="fetchUserDetails"
        @updated="handleUpdate"
      />
    </div>
    
    <!-- ✅ MODAL WITH HEADER + FORM COMPONENT -->
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
        @updated="handleUpdate"
      />
    </div>
  </div>
</template>

<script>

import NavBar from '@/components/NavBar.vue';
import AppDetailsForm_pg1 from '@/pages/AppDetailsForm_pg1.vue';
import AppDetailsForm_pg2 from '@/pages/AppDetailsForm_pg2.vue';
import AppDetailsForm_pg3 from '@/pages/AppDetailsForm_pg3.vue';
import AppDetailsFormHeader from '@/components/AppDetailsFormHeader.vue';

export default {
  name: "AdminLayout",
  components: {
    NavBar,
    AppDetailsFormHeader, // ✅ Don't forget to register this!
  },
  data() {
    return {
      showAppDetails: false,
      formPage: 1,
      currentPage: 1,
      totalPages: 3,
      selectedUser: {},
    };
  },
  computed: {
    currentFormComponent() {
      if (this.formPage === 1) return AppDetailsForm_pg1;
      if (this.formPage === 2) return AppDetailsForm_pg2;
      if (this.formPage === 3) return AppDetailsForm_pg3;
      return AppDetailsForm_pg1;
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
    handleUpdate() {
      this.$emit("updated");
      this.closeForm();
    }
  }
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
