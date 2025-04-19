<template>
    <div class="pwd-layout">
      <router-view /> <!-- ✅ Load PWD pages inside -->
      <Footer class="Footer"/> 
    </div>
  </template>
  
  <script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  export default {
    components: { Header, Footer }
  };
  </script>
  
  
  <style scoped>

  .NavBar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1; /* Ensure it stays above other content */
  }

  .Footer {
  margin-top: auto;       /* Pushes footer to bottom */
  width: 100%;
  padding: 1rem;
  z-index: 1;
}
  .pwd-layout {
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  </style>
  