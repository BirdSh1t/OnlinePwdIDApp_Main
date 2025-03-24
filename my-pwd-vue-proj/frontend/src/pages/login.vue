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
          <input v-model="username" type="text" class="login-input" placeholder="Username" />
          <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
  
          <!-- Password Input with Show/Hide Feature -->
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
  
        <!-- Button Section -->
        <div class="button-container">
          <button @click="login" class="login-button">LOGIN</button>
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
      showPassword: false, // Toggle password visibility
      usernameError: '', 
      passwordError: '',
      passwordValidationError: ''
    };
  },
  methods: {
    // ✅ Function to get image URL
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },

    // ✅ Toggle password visibility
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    // ✅ Live Password Validation
    validatePassword() {
      if (this.password.length >= 4) {
        if (this.password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
          this.passwordValidationError = "The password should be at least 8 characters long and contain a special character.";
        } else {
          this.passwordValidationError = "";
        }
      } else {
        this.passwordValidationError = "";
      }
    },

    // ✅ Function to handle login validation
    async login() {
    this.usernameError = ''; 
    this.passwordError = '';
    this.errorMessage = '';

        // ✅ Check if fields are empty
        if (!this.username) {
            this.usernameError = "The username does not match.";
        }

        if (!this.password) {
            this.passwordError = "The password does not match.";
        }

        if (this.usernameError || this.passwordError) {
            return; // ❌ Stop login if errors exist
        }

        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {  
                username: this.username,  
                pass: this.password  
            });


            if (response.data.success) {
                alert(response.data.message);
                localStorage.setItem('isLoggedIn', 'true'); // ✅ Save login state
                this.$router.push('/dashboard'); // ✅ Redirect to Dashboard
            } else {
                this.usernameError = "Mismatch credentials"; // ✅ Case-sensitive error message
            }
        } catch (error) {
            console.error("Login Error:", error);
            this.errorMessage = "Server error. Try again later."; // ✅ Handle server errors
        }
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
    overflow: clip; /* ✅ Prevents scrolling */
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
    max-height: 90vh; /* ✅ Ensures it fits within screen */
    width: 400px;
    background: #ededed;
}

/* Header Section */
.header {
   /*  position: fixed; | ✅ Keeps it above the form */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    padding-bottom: 1px;
    margin: 0; /* ✅ Ensures no margin */
    text-align: center;
    flex-wrap: wrap; /* ✅ Ensures content wraps properly */
}

.pwd-icon {
    width: 55px;
    height: 55px;
}

.header-title {
    font-family: 'Poppins', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #149656;
    text-align: center;
    margin-left: 25px;
    padding: 0; /* ✅ Ensures no padding is adding extra space */
}

/* Welcome Section */
.welcome-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px; /* ✅ Controls spacing between text & icon */
    margin-bottom: 10px; /* ✅ Reduced gap */
}

/* Welcome Text */
.welcome-text {
    font-family: 'Poppins', sans-serif;
    font-size: 46px;
    font-weight: 400; 
    color: black;
    display: flex;
    align-items: center; /* ✅ Ensures icon stays aligned */
    margin-bottom: 5px; /* ✅ Reduces space below "Welcome" */
    line-height: 1; /* ✅ Prevents extra spacing */
}

/* Admin Icon */
.admin-icon {
    width: 4.3em; /* ✅ Scales with text */
    height: 4.3em;
    position: relative;
    Top: 3px; /* ✅ Fine-tune vertical alignment */
    margin-left: 15px; /* ✅ Adjust this to increase spacing */

}

/* Login Instruction */
.login-instruction {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #707680;
    margin-top: 1px; /* ✅ Adjusted spacing */
    margin-bottom: 70px; /* ✅ Controlled gap before input fields */
    text-align: center;

}

/* Input Fields */
.input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 35px;
}

.login-input {
    width: 74%;
    height: 40px;
    border: none;
    border-radius: 5px;
    background: #f6f6f6;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    outline: none;
    text-align: left;
    padding-left: 12px; /* ✅ Adds space inside the input field */
    gap: 15px; /* ✅ Adds space between Username & Password */
}

/* ✅ Error Messages */
.error-message {
  color: red;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  margin-top: 5px;
  text-align: left;
  width: 74%;
}

.password-wrapper{
    width: 77%;
}

/* Password Input Wrapper */
.password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #f6f6f6; /* ✅ Match the background of input fields */
    border-radius: 5px; /* ✅ Keep consistent border-radius */
    height: 40px; /* ✅ Ensure it matches the input field */
}

.password-input {
    width: 100%; /* ✅ Fill the password-wrapper */
    height: 100%; /* ✅ Match the height of username field */
    border: none;
    border-radius: 5px;
    background: transparent; /* ✅ Inherit background */
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    outline: none;
    text-align: left;
    padding-left: 12px; /* ✅ Match username field padding */
    padding-right: 35px; /* ✅ Space for the eye icon */
}

/* ✅ Eye Icon */
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
    margin-top: 30px; /* ✅ Ensures spacing stays consistent */
    display: flex;
    justify-content: center;
}

/* Login Button - Same Size as Input Fields */
.login-button {
    width: 75%;
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

.login-button:hover {
    background: #117a48;
}

/* Forgot Password */
.forgot-password {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: black;
    cursor: pointer;
    margin-top: 15px;
    margin-bottom: 95px;
}

.forgot-password:hover {
    text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
    .login-card {
        width: 90%;  /* ✅ Make it more responsive */
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
  