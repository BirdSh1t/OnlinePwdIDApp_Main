<template>
  <div class="pwd-layout">
    <Header />
    <main class="pwd-content">
      <router-view />
    </main>
    <Footer calls="Footer" />
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
  flex-direction: column;
  min-height: 100vh;
}

.pwd-content {
  flex: 1; 
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

  router-view {
  flex-grow: 1; /* takes up available vertical space */
}
  </style>
  