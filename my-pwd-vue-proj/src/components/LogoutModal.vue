<template>
  <div v-if="show" class="overlay">
    <div class="logout-card">
      <div class="logout-header">
        <h2 class="logout-title">LOGOUT?</h2>
        <img :src="getIconUrl('Logout_black.png')" alt="Logout Icon" class="logout-icon" />
      </div>
      <div class="logout-buttons">
        <button class="yes-button" @click="confirmLogout">YES</button>
        <button class="no-button" @click="closeLogout">NO</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean, // Controls the visibility of the modal
  },
  methods: {
    getIconUrl(fileName) {
      return new URL(`../assets/icons/${fileName}`, import.meta.url).href;
    },
    confirmLogout() {
      localStorage.removeItem('isLoggedIn'); // ✅ Clear login state
      this.$router.push('/'); // ✅ Redirect to login page
      this.$emit('close'); 
    },
    closeLogout() {
      this.$emit('close'); 
    }
  }
};
</script>

<style scoped>
/* Dimmed background */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3); /* ✅ 30% black transparency */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Logout Card */
.logout-card {
  background: white;
  padding: 20px 30px; /* ✅ Reduced top padding */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  min-width: 320px;
  height: 180px;
}

/* Logout Header */
.logout-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* ✅ Adds space between text and icon */
  margin-bottom: 55px; /* ✅ Reduced spacing below */
}

.logout-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 34px;
  padding-left: 10px;
  margin: 0; /* ✅ Remove any extra margin */
}

.logout-icon {
  width: 42px; /* ✅ Increased size */
  height: 42px;
}

/* Buttons */
.logout-buttons {
  display: flex;
  gap: 40px;
}

.yes-button {
  background: #066aff;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.no-button {
  background: #d9d9d9;
  color: #737373;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.yes-button:hover {
  background: #0555cc;
}

.no-button:hover {
  background: #c4c4c4;
}
</style>
