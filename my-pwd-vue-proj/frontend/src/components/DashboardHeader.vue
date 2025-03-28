<template>
    <!-- Dashboard Header Card -->
    <div class="dashboard-header-card">
      <div class="dashboard-left">
        <img :src="getIconUrl('menu_bar_black.png')" alt="Dashboard Icon" class="dashboard-icon" />
        <h1 class="dashboard-title">{{ title }}</h1> <!-- Dynamically set the title -->
      </div>
  
      <!-- Search Bar -->
      <div class="search-bar">
        <img :src="getIconUrl('search_black.png')" alt="Search" class="search-icon" />
        <input type="text" placeholder="Search here" class="search-input" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      }
    },
    methods: {
      getIconUrl(fileName) {
        return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Dashboard Header Card */
  .dashboard-header-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 25px 40px;
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
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
  
  /* Dashboard Title */
  .dashboard-title {
    font-size: 30px;
    font-weight: 700;
    font-family: 'montserrat', sans-serif;
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
  </style>
  