<template>
    <div class="pwd-layout">
      <Header /> <!-- ✅ Use your custom header -->
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

  .pwd-layout {
    height: auto;
    overflow-y: auto;
    flex-direction: column;
  }
  </style>
  