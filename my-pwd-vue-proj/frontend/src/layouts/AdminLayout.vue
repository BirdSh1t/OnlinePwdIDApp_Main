<template>
    <div class="admin-layout">
      <NavBar />
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/NavBar.vue';
  


  export default {
    components: { NavBar }
  };
  </script>
  
  <style scoped>

  .admin-layout {
    display: flex;
  }


    .admin-content {
    flex-grow: 1;
    padding: 20px;
    margin-left: 200px; /* Ensure it does not overlap with the sidebar */
    }

  </style>
  