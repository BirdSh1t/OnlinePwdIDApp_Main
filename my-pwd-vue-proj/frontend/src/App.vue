<template>
  <div class="app-container">
    <!-- ✅ Only show NavBar if NOT on the Login page -->
    <NavBar v-if="isLoggedIn && $route.path !== '/'" />  

    <!-- ✅ Dynamically adjust layout based on the route -->
    <div :class="{'main-content': isLoggedIn && $route.path !== '/'}">
      <router-view /> <!-- This will dynamically load the page -->
    </div>
  </div> 
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  components: { NavBar },
  data() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' // ✅ Read from localStorage
    };
  },
  watch: {
    $route(to) {
      // ✅ Check localStorage when the route changes
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  }
};
</script>

<style>
/* ✅ Apply "main-content" only if the user is logged in */
.main-content {
  flex-grow: 1;
  background: #ededed;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 200px;
  width: calc(100% - 200px);
}

.app-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* ✅ Prevents scrolling */
}



</style>
