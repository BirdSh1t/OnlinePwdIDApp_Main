<template>
    <div class="login-container">
      <!-- Header with Fade Transition -->
      <transition name="fade">
        <div class="header">
          <img :src="getIconUrl('new-admin-white.png')" alt="Admin Icon" class="admin-icon" />
          <div class="header-text">
            <h1>Employee Login</h1>
          </div>
        </div>
      </transition>
  
      <!-- Form Fields with Slide Transition -->
      <transition-group name="form-slide" tag="div" class="form">
        <div class="form-group" key="1">
          <label>Employee ID</label>
          <div class="input-wrapper">
            <img :src="getIconUrl('employee-id-grey.png')" class="input-icon" />
            <input type="text" placeholder="Enter admin ID" />
          </div>
        </div>
  
        <div class="form-group" key="2">
          <label>Password</label>
          <div class="input-wrapper">
            <img :src="getIconUrl('lock-grey.png')" class="input-icon" />
            <input type="password" placeholder="Enter password" />
          </div>
        </div>
  
        <div class="form-group" key="3">
          <label>Confirm Password</label>
          <div class="input-wrapper">
            <img :src="getIconUrl('lock-grey.png')" class="input-icon" />
            <input type="password" placeholder="Confirm password" />
          </div>
        </div>
  
        <button class="login-btn" key="4">
          <img :src="getIconUrl('log-in-white.png')" class="login-icon" />
          Login
        </button>
  
        <button class="go-back-btn" key="5" @click="$emit('goBack')">
          <span class="arrow">←</span> Go Back
        </button>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  function getIconUrl(fileName) {
    return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
  }
  </script>
  
  <style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw; /* Match the right column */
  height: 100vh;
  font-family: 'Barlow', sans-serif;
  background-color: white;
  overflow-y: auto;
}

/* === Header Section === */
.header {
  background-color: #149656;
  width: 88%;
  display: flex;
  align-items: center;
  padding: 2vh 3vw;
  position: relative;
  flex-direction: row;
  gap: 2vw;
}

.header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1vh;
  background-color: #cefe3c;
}
  
  .admin-icon {
    width: 6vw;
    aspect-ratio: 1 / 1;
  }
  
  .header-text h1 {
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 3vw;
    margin: 0;
  }
  
  .header-text p {
    color: white;
    font-size: 1.2vw;
  }
  
  .form {
    width: 80vw;
    max-width: 600px;
    margin-top: 5vh;
    display: flex;
    flex-direction: column;
    gap: 3vh;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 1vh;
  }
  
  label {
    font-family: 'Barlow', sans-serif;
    color: #707680;
    font-size: 1.5vw;
  }
  
  .input-wrapper {
    display: flex;
    align-items: center;
    border: 0.2vw solid #ededed;
    padding: 1vh 1vw;
    border-radius: 0.5vw;
    background-color: white;
  }
  
  .input-wrapper input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 1.5vw;
    font-family: 'Barlow', sans-serif;
    color: #707680;
    padding-left: 1vw;
  }
  
  .input-icon {
    width: 3vw;
    height: 3vw;
    object-fit: contain;
  }
  
  .login-btn {
    background-color: #149656;
    border: none;
    color: white;
    padding: 1.5vh 0;
    font-size: 2vw;
    font-family: 'Roboto', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1vw;
    border-radius: 0.5vw;
    cursor: pointer;
  }
  
  .login-icon {
    width: 2.5vw;
    height: 2.5vw;
  }
  
  .go-back-btn {
    margin-top: 2vh;
    border: 0.2vw solid #ededed;
    color: #149656;
    background-color: white;
    font-size: 1.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1vw;
    font-family: 'Roboto', sans-serif;
    padding: 1vh;
    border-radius: 0.5vw;
    cursor: pointer;
  }
  
  .go-back-icon {
    width: 2vw;
    height: 2vw;
  }

  /* Fade header */
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}

/* Slide for each field */
.form-slide-enter-active {
  transition: all 0.4s ease;
  
}
.form-slide-enter-from {
  opacity: 0;
  transform: translateY(2vh);
}

/* Optional styling for arrow */
.arrow {
  margin-right: 5px;
}

</style>
  