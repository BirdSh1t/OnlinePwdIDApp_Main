<template>
    <div class="pwd-layout">
      <Header class="NavBar" />
      <router-view /> <!-- ✅ Load PWD pages inside -->
    </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  
  export default {
    components: { Header }
  };
  </script>
  
  
  <style scoped>

  .NavBar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000; /* Ensure it stays above other content */
  }

  .pwd-layout {
    display: flex;
    /* overflow-y: auto; */
    flex-direction: column;
  }
  </style>
  