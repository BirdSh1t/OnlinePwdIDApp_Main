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
        <!-- ✅ Admin ID -->
        <div class="form-group" key="1">
          <label>Employee ID</label>
          <div
          class="input-wrapper"
                :class="{
                'input-valid': validEmployee && loginClicked,
                'input-invalid': !validEmployee && loginClicked
                }"
            >
            <img :src="getIconUrl('employee-id-grey.png')" class="input-icon" />
            <input
                type="text"
                placeholder="Enter Employee ID"
                v-model="employeeId"
            />
            </div>
        </div>
  
        <!-- ✅ Password -->
        <div class="form-group" key="2">
        <label>Password</label>
            <div
                class="input-wrapper"
                :class="{
                'input-valid': password.length >= 3 && validPassword,
                'input-invalid': password.length >= 3 && !validPassword
                }"
            >
                <img :src="getIconUrl('lock-grey.png')" class="input-icon" />
                <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password"
                v-model="password"
                />
                <img
                :src="getIconUrl(showPassword ? 'eye_visible_grey.png' : 'eye_hidden_grey.png')"
                class="eye-toggle"
                @mousedown="showPassword = true"
                @mouseup="showPassword = false"
                @mouseleave="showPassword = false"
                />
            </div>
            </div>
  
       <!-- ✅ Confirm Password -->
       <div class="form-group" key="3">
            <label>Confirm Password</label>
            <div
                class="input-wrapper"
                :class="{
                'input-valid': confirmPassword.length >= 3 && validConfirmPassword,
                'input-invalid': confirmPassword.length >= 3 && !validConfirmPassword
                }"
            >
                <img
                :src="getIconUrl(validConfirmPassword ? 'unlock-grey.png' : 'lock-grey.png')"
                class="input-icon"
                />
                <input
                type="password"
                placeholder="Confirm password"
                v-model="confirmPassword"
                />
            </div>
        </div>
  
        <!-- ✅ Login Button -->
        <button
          class="login-btn"
          key="4"
          :disabled="!canLogin"
          :style="{ backgroundColor: canLogin ? '#149656' : '#d9d9d9' }"
          @click="handleLogin"
        >
          <img :src="getIconUrl('log-in-white.png')" class="login-icon" />
          Login
        </button>
  
        <button class="go-back-btn" key="5" @click="$emit('goBack')">
          <span class="arrow"></span> 
          <img :src="getIconUrl('go-back-arrow-green.png')" class="go-back-arrow-green" />
          <div class="go-back-label">Go Back</div>
        </button>

        <!-- ✅ Lockout Countdown -->
        <p v-if="isLockedOut" class="cooldown" key="6">
          Please wait {{ lockoutTime }} seconds before trying again.
        </p>
      </transition-group>
    </div>
  </template>
  
<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { apiClient } from "@/api/apiClient.js" // Adjust the path as necessary

const router = useRouter()
const toast = useToast()

const employeeId = ref('')
const password = ref('')
const confirmPassword = ref('')
const loginAttempts = ref(0)
const isLockedOut = ref(false)
const lockoutTime = ref(0)
const isLoading = ref(false)
const showPassword = ref(false)

const validEmployee = ref(false)
const validPassword = ref(false)
const validConfirmPassword = ref(false)
const loginClicked = ref(false)

// Validate password format
watch(password, (val) => {
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val)
  validPassword.value = val.length >= 8 && hasSpecial
  checkConfirm()
})

watch(confirmPassword, () => checkConfirm())

function checkConfirm() {
  validConfirmPassword.value = password.value === confirmPassword.value
}

watch(employeeId, async (val) => {
  if (!val) {
    validEmployee.value = false
    return
  }
})

const canLogin = computed(() => {
  return (
    employeeId.value &&
    password.value &&
    confirmPassword.value &&
    !isLockedOut.value
  )
})

async function handleLogin() {
  loginClicked.value = true

  if (!employeeId.value) {
    toast.error('Please enter your Employee ID')
    return
  }
  if (!password.value) {
    toast.error('Please enter your password')
    return
  }
  if (!confirmPassword.value) {
    toast.error('Please confirm your password')
    return
  }
  if (isLockedOut.value) {
    toast.error(`Please wait ${lockoutTime.value} seconds before trying again`)
    return
  }

  isLoading.value = true

  try {

    // Step 1: Check if employee exists
    const checkRes = await apiClient.post('/api/auth/employee/check-employee', {
      admin_id: employeeId.value
    });

    validEmployee.value = checkRes.data.exists;

    if (!validEmployee.value) {
      toast.error('Employee ID not found. Please check your credentials');
      return;
    }

    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
    if (password.value.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    if (!hasSpecial) {
      toast.error('Password must contain at least one special character')
      return
    }
    if (password.value !== confirmPassword.value) {
      toast.error('Passwords do not match. Please re-enter your password')
      return
    }

    const res = await apiClient.post('/api/auth/employee/login', {
      admin_id: employeeId.value,
      pass: password.value
    })

    if (res.data.success) {
      loginAttempts.value = 0
      toast.success('Login successful! Redirecting...')

        router.push('/employee/dashboard');

      
      return
    } else {
      throw new Error(res.data.message || 'Login failed')
    }

  } catch (err) {
    if (err.response) {
    const { status, data } = err.response;
    switch (status) {
      case 401: {
        let msg = data.message || 'Invalid credentials';
        if (data.attempts !== undefined) {
              msg += ` (Attempt ${data.attempts} of 10)`
        }

        if (data.lockedUntil) {
          const lockDate = new Date(data.lockedUntil);
          msg += ` | Locked until: ${lockDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}`;

          function startCooldown(seconds) {
            isLockedOut.value = true;
            lockoutTime.value = seconds;

            const timer = setInterval(() => {
              lockoutTime.value--;
              toast.info(`Too many attempts. Please wait ${lockoutTime.value} seconds`, {
                timeout: 1000
              });

              if (lockoutTime.value <= 0) {
                clearInterval(timer);
                isLockedOut.value = false;
                toast.dismiss();
              }
            }, 1000);
          }

          const remainingSeconds = Math.ceil((new Date(data.lockedUntil) - new Date()) / 1000);
          if (remainingSeconds > 0) startCooldown(remainingSeconds);
          }

          toast.error(msg);
          break;
        }

          case 429:
          toast.error(data.message || 'Too many attempts. Please wait before trying again');
          break;

          case 500:
          toast.error('Server error. Please try again later');
          break;

          default:
          toast.error(data?.message || 'Login failed');
          }
        } else {
        toast.error(err.message || 'Network error. Please check your connection');
      }
    } finally {
      isLoading.value = false;
  }
}

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
    margin-left: 50px;
    width: 6vw;
    aspect-ratio: 1 / 1;
  }
  
  .header-text h1 {
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 4vw;
    margin: 0;
  }
  
  .header-text p {
    color: white;
    font-size: 1.2vw;
  }
  
/* === Form Section === */
.form {
  width: 80%;
  max-width: 600px;
  margin-top: 15vh;
  margin-left: 5vh;
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1vh;
}
  
label {
  font-family: 'Barlow', sans-serif;
  color: #707680;
  font-size: 1.3vw;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 0.2vw solid #ededed;
  padding: 1vh 1vw;
  border-radius: 0.5vw;
  background-color: white;
  transition: border-color 0.2s ease-in-out;
}
  
/* ✅ Input focus style (optional enhancement) */
.input-wrapper:focus-within {
  border-color: #149656;
}

.input-wrapper input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1.3vw;
  font-family: 'Barlow', sans-serif;
  color: #707680;
  padding-left: 1vw;
}
  
.input-icon {
  width: 2.5vw;
  height: 2.5vw;
  object-fit: contain;
}

/* ✅ Dynamic border classes (apply to input-wrapper) */
.input-valid {
  border-color: #00c853 !important; /* Green */
}

.input-invalid {
  border-color: #ff3131 !important; /* Red */
}

  .eye-toggle {
  width: 2vw;
  height: 2vw;
  object-fit: contain;
  margin-left: auto;
  cursor: pointer;
}
  
/* === Buttons === */
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
  width: 2vw;
  height: 2vw;
}
  
  .go-back-arrow-green{
  width: 2vw;
  height: 2vw;
  }

  .go-back-btn {
  border: 0.2vw solid #ededed;
  color: #149656;
  background-color: white;
  font-size: 1.8vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  font-family: 'Roboto', sans-serif;
  padding: 1.5vh 0;
  border-radius: 0.5vw;
  cursor: pointer;
}
  
.go-back-label{
  margin-right: 2rem;
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
  