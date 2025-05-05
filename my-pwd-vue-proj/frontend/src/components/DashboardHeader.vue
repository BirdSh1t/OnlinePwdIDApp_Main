<!-- DashboardHeader.vue -->
<template>
<div class="dashboard-header-card">
  <div class="dashboard-left">
    <img :src="getIconUrl('menu_bar_black.png')" alt="Dashboard Icon" class="dashboard-icon" />
    <h1 class="dashboard-title">
      {{ $route.path === '/admin/database' ? 'Reports' : title }}
    </h1>
    <!-- Optional subtitle on the Create page -->
    <p v-if="$route.path === '/admin/create'" class="create-subtitle">
      IDNow - PWD Old Members
    </p>
  </div>

  <!-- Show search bar on all routes except create -->
  <div v-if="$route.path !== '/admin/create'" class="search-bar">
    <img :src="getIconUrl('search_black.png')" alt="Search Icon" class="search-icon" />
    <input
      type="text"
      v-model="searchText"
      placeholder="Search here"
      @input="onSearch"
      class="search-input"
    />
  </div>

  <!-- Show icons only on the Create page -->
  <div v-if="$route.path === '/admin/create'" class="icons-container">
    <img :src="getIconUrl('printer_grey.png')" alt="Printer" class="icon" />
    <img
      :src="getIconUrl('new_document_grey.png')"
      alt="New Document"
      class="icon"
      @click="$emit('new-document')"
    />
  </div>
</div>
</template>

<script>
export default {
  name: "DashboardHeader",
  props: {
    title: { type: String, required: true }
  },
  data() {
    return {
      searchText: "",
    };
  },
  methods: {
    onSearch() {
      // Emit the search event to be handled by the parent component.
      this.$emit("search", this.searchText);
    },
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    async triggerNewDocument() {
    this.$emit("new-document-clicked"); // Notify AdminLayout or Create page
    },
    clearSearch() {
    this.searchText = '';
    }
  }
};
</script>

  
<!-- ✅ Scoped styles for the Dashboard Header component -->
  
  <style scoped>

  .dashboard-left {
    display: flex;
    gap: 0px; 
    position: relative; 
  }

  /* ✅ Title (Header) */
  .dashboard-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0; /* ✅ Remove default margin */
  }

  .create-subtitle {
    font-size: 14px;
    color: #707680;
    position: absolute;
    top: 100%; /* ✅ Moves paragraph right below title */
    left: 61px; 
    margin-top: 2px; 
    white-space: nowrap; 
  }
  /* Dashboard Header Card */
  .dashboard-header-card {
    display: flex;
    align-items: center;
    justify-content: space-between; /* ✅ This ensures it applies directly */
    font-family: 'Montserrat', sans-serif;
    background: white;
    padding: 26px 40px;
    border-radius: 10px;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    width: calc(100% - 80px); /* ✅ Prevents stretching */
    margin: 0 auto 20px; /* ✅ Centers and adds spacing */
    flex-wrap: wrap; /* ✅ Prevents overlapping */
  }
  
  /* Dashboard Left Section */
  .dashboard-left {
    display: flex;
    align-items: center;
  }
  
  /* Dashboard Icon */
  .dashboard-icon {
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }
  
  /* Dashboard Title */
  .dashboard-title {
    font-size: 30px;
    font-weight: 700;
    font-family: 'cooper-hewitt/', sans-serif;
    font-style: normal;
  }
  
  /* Search Bar */
  .search-bar {
    display: flex;
    align-items: center;
    border: 2px solid #ccc;
    border-radius: 30px;
    padding: 12px 20px;
    width: 400px;
    background-color: white;
    min-width: 130px;
  }
  
  .search-icon {
    width: 34px;
    height: 34px;
  }
  
  .search-input {
    border: none;
    outline: none;
    margin-left: 10px;
    font-size: 18px;
    color: #a6a6a6;
    background: transparent;
    flex-grow: 1;
  }

    /* Icons Container */
  .icons-container {
    display: flex;
    gap: 20px; /* Space between icons */
    padding-bottom: 31px;
  }

  /* Icon */
  .icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  </style>
  