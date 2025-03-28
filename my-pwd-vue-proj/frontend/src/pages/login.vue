<template>
  <div class="login-container">
    <!-- Header Section -->
    <div class="header">
      <img :src="getIconUrl('PWD-icon.png')" alt="PWD Icon" class="pwd-icon" />
      <h1 class="header-title">LAS PIÑAS CITY OFFICIAL DATA BASE FOR REGISTERED PWDS</h1>
    </div>

    <!-- Centered Login Form -->
    <div class="login-card">
      <div class="welcome-section">
        <h2 class="welcome-text">Welcome</h2>
        <img :src="getIconUrl('admin_black.png')" alt="Admin Icon" class="admin-icon" />
      </div>
      <p class="login-instruction">PLEASE LOGIN USING YOUR ADMIN ID</p>

      <!-- Input Fields -->
      <div class="input-container">
        <!-- Username Input -->
        <div class="input-wrapper">
          <input 
            v-model="username" 
            type="text" 
            class="login-input" 
            placeholder="Username" 
            @input="validateUsername"
          />
          <p v-if="usernameValidationError" class="error-message">{{ usernameValidationError }}</p>
          <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
        </div>

        <!-- Password Input with Show/Hide Feature -->
        <div class="input-wrapper">
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              class="login-input password-input" 
              placeholder="Password" 
              @input="validatePassword"
            />
            <img 
              :src="getIconUrl(showPassword ? 'eye_open.png' : 'eye_closed.png')" 
              class="eye-icon" 
              @click="togglePasswordVisibility"
            />
          </div>
          <p v-if="passwordValidationError" class="error-message">{{ passwordValidationError }}</p>
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>
      </div>

      <!-- Button Section -->
      <div class="button-container">
        <button @click="login" class="login-button" :disabled="!username || !password">LOGIN</button>
      </div>

      <!-- Forgot Password -->
      <p class="forgot-password">FORGOT YOUR PASSWORD?</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      usernameError: '', 
      passwordError: '',
      usernameValidationError: '',
      passwordValidationError: ''
    };
  },
  methods: {
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    validateUsername() {
      // Clear both error types when validation starts
      this.usernameError = '';
      this.usernameValidationError = '';
      
      if (this.username.length > 0 && this.username.length < 3) {
        this.usernameValidationError = "Must be at least 3 characters long";
      }
    },

    validatePassword() {
      // Clear both error types when validation starts
      this.passwordError = '';
      this.passwordValidationError = '';
      
      if (this.password.length > 0 && this.password.length < 8) {
        this.passwordValidationError = "Must be at least 8 characters long";
      } else if (this.password.length >= 8 && !/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
        this.passwordValidationError = "Must contain a special character or symbol";
      }
    },

    async login() {
      // Clear all error messages when login is attempted
      this.usernameError = ''; 
      this.passwordError = '';
      this.usernameValidationError = '';
      this.passwordValidationError = '';

      // Validate fields before submitting
      let isValid = true;
      
      if (this.username.length < 3) {
        this.usernameValidationError = "Must be at least 3 characters long";
        isValid = false;
      }
      
      if (this.password.length < 8) {
        this.passwordValidationError = "Must be at least 8 characters long";
        isValid = false;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
        this.passwordValidationError = "Must contain a special character";
        isValid = false;
      }
      
      if (!isValid) return;

      // Server-side validation
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {  
          username: this.username,  
          pass: this.password  
        });

        if (response.data.success) {
          alert(response.data.message);
          localStorage.setItem('isLoggedIn', 'true');
          this.$router.push('/dashboard');
        } else {
          if (response.data.message.includes('username')) {
            this.usernameError = "Incorrect Username!";
          } else if (response.data.message.includes('password')) {
            this.passwordError = "Incorrect Password!";
          } else {
            this.usernameError = "Mismatch credentials";
          }
        }
      } catch (error) {
        console.error("Login Error:", error);
        this.usernameError = "Incorrect Username!";
        this.passwordError = "Incorrect Password!";
      }
    }
  },
  watch: {
    username() {
      // Clear authentication error when username changes
      this.usernameError = '';
      this.validateUsername();
    },
    password() {
      // Clear authentication error when password changes
      this.passwordError = '';
      this.validatePassword();
    }
  }
};
</script>

<style scoped>
  /* Prevent scrolling and ensure full-screen layout */
  html, body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: clip; /* Prevents scrolling */
  }

  /* Fullscreen container */
  .login-container {
    overflow: clip;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding-top: 0px;
  }

  /* Login Form Card */
  .login-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 35px;
    border-radius: 10px;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    height: 500px; /* Fixed height for the login card */
    width: 400px;
    background: #ededed;
    margin-top: 0px;
    margin-bottom: 50px;
    overflow-y: auto; /* Allow vertical scrolling if content overflows */
  }

  /* Header Section */
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px 0;
    margin: 0;
    text-align: center;
    flex-wrap: wrap;
  }

  .pwd-icon {
    width: 55px;
    height: 55px;
  }

  .header-title {
    font-family: 'barlow', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #149656;
    text-align: center;
    margin-left: 25px;
    padding: 0;
  }

  /* Welcome Section */
  .welcome-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  /* Welcome Text */
  .welcome-text {
    font-family: 'work-sans', sans-serif;
    font-size: 46px;
    font-weight: 400;
    color: black;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    line-height: 1;
  }

  /* Admin Icon */
  .admin-icon {
    width: 4.3em;
    height: 4.3em;
    position: relative;
    top: 3px;
    margin-left: 15px;
  }

  /* Login Instruction */
  .login-instruction {
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #707680;
    margin-top: 1px;
    margin-bottom: 75px;
    text-align: center;
  }

  /* Input Fields */
  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 50px; /* Adjusted gap between input fields */
    margin-bottom: 10px;
  }

  .input-wrapper{
    position: relative;
    width: 74%;
    padding-right: 15px;
  }

  .login-input {
    width: 100%;
    height: 40px;
    border: none;
    border-radius: 5px;
    background: #f6f6f6;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    outline: none;
    text-align: left;
    padding-left: 12px;
  }

  /* Error Messages */
  .error-message {
    color: red;
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
    margin-top: 5px;
    text-align: left;
    width: 100%;
    position: absolute;
    bottom: -45px; /* Position below input */
    padding-left: 10px;
    left: 0;
    height: 20px; /* Fixed height for error message */
  }

  .password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #f6f6f6;
    border-radius: 5px;
    height: 40px;
    width: 305px;
  }

  .password-input {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px;
    background: transparent;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    outline: none;
    text-align: left;
    /* padding-left: 12px;
    padding-right: 35px; */
  }

  /* Eye Icon */
  .eye-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  /* Button Section */
  .button-container {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

 
  /* Login Button */
  .login-button {
      width: 305px;
      height: 40px;
      background: #149656;
      color: white;
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 35px;
  }

  .login-button:hover:not(:disabled) {
      background: #117a48;
  }

  .login-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  /* Forgot Password */
  .forgot-password {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: black;
    cursor: pointer;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .forgot-password:hover {
    text-decoration: underline;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .login-card {
      width: 90%;
      padding: 30px;
    }
  }

  @media (max-width: 500px) {
    .login-card {
      width: 95%;
      padding: 25px;
    }

    .login-input,
    .login-button {
      width: 100%;
    }
  }
</style>
