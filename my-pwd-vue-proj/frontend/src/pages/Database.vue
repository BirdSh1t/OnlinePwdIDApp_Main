<template>
  <div class="database-container">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <DashboardHeader title="Database" />
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <!-- Filters Section -->
      <div class="table-filters">
        <multiselect
          v-for="(filter, index) in selectedFilters"
          :key="index"
          v-model="selectedFilters[index]"
          :options="filterOptions"
          class="custom-dropdown"
        ></multiselect>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="data-table">
          <!-- Table Headers -->
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Type of Disability</th>
              <th>Status</th>
              <th>Date</th>
              <th>More</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index">
              <td>{{ row.name }}</td>
              <td>{{ row.gender }}</td>
              <td>{{ row.disability }}</td>
              <td
                :class="{
                  valid: row.status === 'Valid',
                  invalid: row.status === 'Invalid'
                }"
              >
                {{ row.status }}
              </td>
              <td>{{ row.date }}</td>
              <!-- Pass isOpen and index to MoreOptions -->
              <td class="more-icon">
                <MoreOptions
                  :index="index"
                  :isOpen="openMenus[index]"
                  @update:isOpen="handleDropdownToggle"
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
import DashboardHeader from "@/components/DashboardHeader.vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import MoreOptions from "@/components/MoreOptions.vue";

export default {
  name: "Database",
  components: { DashboardHeader, Multiselect, MoreOptions },
  data() {
    return {
      selectedFilters: ["All", "All", "All", "All", "Select Date"],
      filterOptions: ["All", "Example"],
      tableData: [
        {
          name: "Kristell Uchiniga",
          gender: "Female",
          disability: "Autism",
          status: "Valid",
          date: "28/02/2025",
        },
        {
          name: "Bernie Bernardo",
          gender: "Male",
          disability: "Visual Impairment",
          status: "Valid",
          date: "19/03/2025",
        },
        {
          name: "Jayda McKinney",
          gender: "Female",
          disability: "Mobility",
          status: "Invalid",
          date: "20/03/2025",
        },
        {
          name: "Alexa Peters",
          gender: "Female",
          disability: "Impairment",
          status: "Valid",
          date: "23/03/2025",
        },
        {
          name: "Kobe Fleming",
          gender: "Male",
          disability: "Hearing Impairment",
          status: "Invalid",
          date: "10/04/2025",
        },
        {
          name: "Reagan Xiong",
          gender: "Male",
          disability: "Epilepsy",
          status: "Invalid",
          date: "15/05/2025",
        },
      ],
      openMenus: Array(6).fill(false), // Track open state of each dropdown
      activeIndex: null, // Track which row is currently active
    };
  },
  methods: {
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    handleDropdownToggle(isOpen, index) {
      if (this.activeIndex === index) {
        // If the same row is clicked, toggle its dropdown
        this.openMenus[index] = !this.openMenus[index];
      } else {
        // Close all dropdowns
        this.openMenus.fill(false);
        // Open the clicked dropdown
        this.openMenus[index] = isOpen;
      }
      this.activeIndex = isOpen ? index : null;
    },
  },
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
  overflow: hidden;
  padding-bottom: 14px;
}

/* Filters Section */
.table-filters {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  gap: 8px;
}

/* Custom Dropdown */
.custom-dropdown {
  width: 180px;
  height: 50px;
  font-family: 'montserrat', sans-serif;
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
  flex-grow: 1; /* ✅ Allows table to expand */
  overflow-y: auto;
  max-height: calc(100% - 50px);
}

/* Table */
.data-table {
  height: 300px;
  min-height: 400px;
  width: 98%;
  border-collapse: collapse;
}

/* Table Headers */
.data-table th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  font-family: 'montserrat', sans-serif;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
  padding: 12px 15px;
  color: black;
  border-bottom: 3px solid #ededed;
  padding-left: 20px;
  white-space: nowrap;
}

/* Table Rows */
.data-table td {
  width: 10%;
  margin: 0 auto;
  padding: 8px 8px;
  font-size: 16px;
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

/* Status Colors */
.data-table td.valid {
  color: #00bf63;
  font-weight: bold;
}

.data-table td.invalid {
  color: #ff3131;
  font-weight: bold;
}

/* More Icon Column */
.more-icon {
  position: relative;
  width: 20px;
  cursor: pointer;
  margin-left: 18px;
}

/* Individual Header Styles */
.data-table th:nth-child(1) { /* Name */
  width: 15%;
  /* Add any specific styles for the Name column here */
}

.data-table th:nth-child(2) { /* Gender */
  width: 10%;
  /* Add any specific styles for the Gender column here */
}

.data-table th td:nth-child(3) { /* Type of Disability */
  width: 20%;
  /* Add any specific styles for the Type of Disability column here */
}

.data-table th:nth-child(4) { /* Status */
  width: 10%;
  /* Add any specific styles for the Status column here */
}

.data-table th:nth-child(5) { /* Date */
  width: 10%;
  /* Add any specific styles for the Date column here */
}

.data-table th:nth-child(6) { /* More */
  width: 10%;
  /* Add any specific styles for the More column here */
}
</style>
