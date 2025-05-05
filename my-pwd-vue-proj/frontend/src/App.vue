<template>
  <router-view />  <!-- ✅ Let layouts handle structure -->
</template>

<script>
export default {};
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
  margin: 0;
  padding: 0;
}

body.modal-open {
  overflow: hidden;
}
</style>
