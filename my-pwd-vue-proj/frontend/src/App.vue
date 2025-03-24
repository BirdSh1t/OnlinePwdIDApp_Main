<template>
  <div class="app-container">
    <!-- ✅ Only show NavBar if NOT on the Login page -->
    <NavBar v-if="$route.path !== '/'" />

    <!-- ✅ Main content area -->
    <div :class="{'main-content': $route.path !== '/'}">
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



<style>
/* ✅ Apply "main-content" only if the user is logged in */
.main-content {
  overflow: hidden;
  flex-grow: 1;
  background: #ededed;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100vh;
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

html, body, #app, .app-container {
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}


</style>
