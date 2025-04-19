<template>
    <div class="login-wrapper">
      <!-- Left Column -->
      <div class="left-column">
        <img class="background-image" :src="getImageUrl('Login-bg-main.png')" alt="Background" />
        <div class="overlay"></div>
        <img class="city-icon" :src="getIconUrl('PWD-icon.png')" alt="PWD Icon" />
        <div class="welcome-text">
          <p>
            <span class="bold">Las Piñas City’s</span><br />
            Official database <br />
            for registered PWDs
          </p>
        </div>
      </div>
  
      <!-- Right Column with Transition -->
      <transition name="fade" mode="out-in">
        <div class="right-column" v-if="showLanding">
          <h1 class="welcome-title">Welcome!</h1>
          <p class="subtitle">PLEASE SELECT AN OPTION BELOW</p>
  
          <button class="admin-btn" @click="delayedShowForm('admin')">
            <img :src="getIconUrl('new-admin-white.png')" alt="Admin" class="icon" />
            I am an <span class="bold">Admin</span>
          </button>
  
          <button class="employee-btn" @click="delayedShowForm('employee')">
            <img :src="getIconUrl('new-employee-green.png')" alt="Employee" class="icon" />
            I am an <span class="green-text">Employee</span>
          </button>
        </div>
      </transition>
  
      <!-- Login Form Slide Transition -->
      <transition name="slide-fade" mode="out-in">
        <component
          v-if="showLogin"
          :is="loginComponent"
          @goBack="delayedGoBack"
          class="login-form-container"
        />
      </transition>
    </div>
  </template>
  
  <script>
  import AdminLoginForm from '@/components/AdminLoginForm.vue'
  import EmployeeLoginForm from '@/components/EmployeeLoginForm.vue'
  
  export default {
    data() {
      return {
        showLogin: false,
        showLanding: true,
        loginComponent: null,
      };
    },
    methods: {
      getIconUrl(fileName) {
        return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
      },
      getImageUrl(fileName) {
        return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
      },
      delayedShowForm(type) {
        // Start fade-out
        this.showLanding = false;
  
        // Wait for fade transition to complete
        setTimeout(() => {
          this.loginComponent = type === 'admin' ? AdminLoginForm : EmployeeLoginForm;
          this.showLogin = true;
        }, 500); // match fade duration
      },
      delayedGoBack() {
        // Start slide-out
        this.showLogin = false;
  
        // Wait for slide-fade out to finish before showing Landing page again
        setTimeout(() => {
          this.showLanding = true;
        }, 500); // match slide-fade transition
      },
    },
  };
  </script>
  
  
  
  
  <style scoped>
  .login-wrapper {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  
  /* === LEFT COLUMN === */
  .left-column {
    width: 50vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* Fade image horizontally from left (visible) to right (transparent) */
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  /* Apply same horizontal fade to overlay mask */
  background: linear-gradient(90deg, rgba(20, 150, 86, 0.5), rgba(0, 0, 0, 0.5));
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
}

  
  .city-icon {
    position: absolute;
    top: 4vh;
    left: 4vw;
    width: 6vw;
    height: auto;
  }
  
  .welcome-text {
    position: absolute;
    bottom: 10vh;
    left: 4vw;
    font-family: 'Barlow', sans-serif;
    font-size: 2.2vw;
    color: #cefe3c;
  }
  
  .bold {
    font-weight: bold;
  }
  
  /* === RIGHT COLUMN === */
  .right-column {
    width: 50vw;
    height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3vh;
    font-family: 'Roboto', sans-serif;
    overflow: hidden;
  }
  
  .welcome-title {
    color: #149656;
    font-size: 4vw;
    margin: 0;
  }
  
  .subtitle {
    font-size: 1.2vw;
    color: #a6a6a6;
  }
  
  button {
    display: flex;
    align-items: center;
    gap: 1vw;
    font-size: 1.5vw;
    padding: 1vh 2vw;
    border: none;
    border-radius: 0.5vw;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    width: 20vw;
    justify-content: center;
  }
  
  .admin-btn {
    background-color: #149656;
    color: white;
  }
  
  .employee-btn {
    background-color: #ededed;
    color: #149656;
  }
  
  .icon {
    width: 2vw;
    height: 2vw;
    object-fit: contain;
  }
  
  .green-text {
    color: #149656;
  }


/* Fade for the right column */
/* Fade for the right column */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


/* Slide-fade for login form */
/* Slide‑fade for login form */
.slide-fade-enter-active {
  animation: slideIn 0.5s ease forwards;
  visibility: hidden;
  animation-fill-mode: forwards;
}

.slide-fade-enter-to {
  visibility: visible;
}

.slide-fade-leave-active {
  animation: slideOut 0.5s ease forwards;
}

/* keyframes unchanged */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(50%);
  }
}


</style>
  