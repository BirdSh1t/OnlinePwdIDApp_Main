<template>
    <div class="modal-mask" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- Background Image -->
        <img 
          :src="getImageUrl('renew-bg-image-modal.jpg')" 
          class="modal-bg-image" 
          alt="Background pattern"
        />
        
        <div class="modal-content">
          <!-- Icon -->
          <img 
            :src="getIconUrl('id-renew-black.png')" 
            class="modal-icon" 
            alt="PWD ID Icon"
          />
          
          <h1 class="modal-title">PLEASE ENTER YOUR OLD PWD ID</h1>
          
          <p class="modal-description">
            Enter here the ID of your expired PWD ID to confirm that the ID exist.
          </p>
          
          <div 
            :class="['id-input-container', { shake, 'error-shake-container': shake }]"
            ref="idInputContainer"
            >
            <input 
                v-for="n in 7" 
                :key="n"
                ref="squareInputs"
                type="text" 
                maxlength="1"
                class="id-square"
                :class="{ 'error-shake': shake }"
                v-model="pwdId[n-1]"
                @input="handleInput(n, $event)"
                @keydown="handleKeyDown(n, $event)"
                @paste.prevent="handlePaste"
            />
            </div>
          
          <button class="confirm-btn" @click="confirmId">
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pwdId: Array(7).fill(''),
        shake: false
      }
    },
    mounted() {
    // Auto-focus first input on mount
        this.$nextTick(() => {
        this.$refs.squareInputs[0]?.focus()
        })
    },
    methods: {
    triggerShake() {
    this.pwdId = Array(7).fill('');
    this.shake = false; // reset first to retrigger animation
    this.$nextTick(() => {
        this.shake = true;
        setTimeout(() => (this.shake = false), 400);

        // Refocus first input
        this.$nextTick(() => {
        this.$refs.squareInputs[0]?.focus();
         });
      });
    },
    confirmId() {
        const id = this.pwdId.join('');
        this.$emit('confirm', id);

        // Remove any shake if valid later in parent
    },
    confirmId() {
        const rawId = this.pwdId.join('');
    if (rawId.length !== 7 || rawId.includes('-')) {
        this.toast.error("Invalid PWD ID length");
        return;
    }

    const formattedId = rawId.slice(0, 3) + '-' + rawId.slice(3);
    this.$emit('confirm', formattedId);
    },
    getImageUrl(fileName) {
        return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
    },
    getIconUrl(fileName) {
        return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    focusNext(index, event) {
        if (event.target.value && index < 7) {
          this.$refs[`square${index}`][0]?.focus();
        }
    },
    handleInput(index, event) {
      // Only allow numbers
      const numericValue = event.target.value.replace(/\D/g, '')
      this.pwdId[index-1] = numericValue
      
      // Move focus to next input if number entered
      if (numericValue && index < 7) {
        this.$refs.squareInputs[index]?.focus()
      }
    },
    handleKeyDown(index, event) {
      // Handle backspace/delete
      if (event.key === 'Backspace' && !event.target.value && index > 1) {
        this.$refs.squareInputs[index-2]?.focus()
      }
      // Handle arrow keys
      else if (event.key === 'ArrowLeft' && index > 1) {
        this.$refs.squareInputs[index-2]?.focus()
        event.preventDefault()
      }
      else if (event.key === 'ArrowRight' && index < 7) {
        this.$refs.squareInputs[index]?.focus()
        event.preventDefault()
      }
    },
    handlePaste(event) {
      // Get pasted numbers only
      const pasteData = event.clipboardData.getData('text').replace(/\D/g, '')
      
      // Fill inputs with pasted numbers
      pasteData.split('').slice(0, 7).forEach((char, i) => {
        if (i < 7) {
          this.pwdId[i] = char
        }
      })
        // Focus last filled input
        const lastFilledIndex = Math.min(pasteData.length, 6)
        this.$refs.squareInputs[lastFilledIndex]?.focus()
        },
    }
  }
  </script>
  
  <style scoped>
  /* Mask for entire page */
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 900
  }
  
 /* Modal container - Now scales proportionally */
.modal-container {
  position: relative;
  width: min(90vw, 600px); /* More flexible max-width */
  aspect-ratio: 9/16; /* Maintain widescreen proportion */
  max-height: 75vh; /* Prevent being too tall */
  background: white;
  border-radius: clamp(8px, 2vw, 12px);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Background image - Maintains proportion */
.modal-bg-image {
  position: absolute;
  top: 55%;
  left: 50%;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  width: min(80%, 500px); /* Flexible but constrained */
  aspect-ratio: 16/7.5; /* Square proportion */
  opacity: 0.3;
  z-index: 0;
  object-fit: cover; /* Prevents distortion */
}

/* Content container - Proportional padding */
.modal-content {
  position: relative;
  z-index: 1;
  padding: min(5%, 40px); /* Percentage-based padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90%;
  justify-content: center; /* Better vertical centering */
}

/* Icon - Proportional scaling */
.modal-icon {
  margin-top: -60px; /* Pulls icon upward */
  width: min(20%, 120px); /* Scales with container */
  height: auto;
  aspect-ratio: 1/1; /* Perfect square */
  margin-bottom: min(3%, 20px);
}

/* Title - Improved fluid typography */
.modal-title {
  margin-top: 0; /* Remove default margins */
  margin-bottom: 8px; /* Tight space above description */
  position: relative;
  top: -20px; /* Optional fine-tuning */
  font-family: 'Barlow', sans-serif;
  font-weight: 700;
  color: black;
  font-size: 2rem; /* More fluid scaling */
  margin-bottom: min(3%, 20px);
  text-align: center;
}

/* Description - Better text flow */
.modal-description {
  font-family: 'Barlow', sans-serif;
  color: #777;
  font-size: min(3.1vw, 16px);
  margin-top: 0; /* Remove default margins */
  margin-bottom: 60px; /* Space below description */
  position: relative;
  top: -33px; /* Optional fine-tuning */
  text-align: center;
  max-width: min(80%, 400px); /* Better content width */
  line-height: 1.4; /* Improved readability */
}

/* ID Input Squares - Perfectly proportional */
.id-input-container {
  display: flex;
  justify-content: center;
  gap: min(2%, 12px);
  margin-bottom: min(6%, 40px);
  width: 100%; /* Full container width */
}

.id-square {
  /* Size adjustments */
  width: min(9%, 70px); /* Increased base size */
  height: min(13vw, 55px); /* Height based on viewport width */
  min-height: 40px; /* Absolute minimum height */
  aspect-ratio: 1/1; /* Perfect square (simpler than 12/12) */
  
  /* Visual styling */
  border: 2px solid #000000;
  border-radius: 4px;
  text-align: center;
  
  /* Typography */
  font-family: 'Barlow', sans-serif;
  font-size: min(5vw, 24px); /* Larger font */
  font-weight: bold;
  
  /* Interactive states */
  transition: all 0.2s ease;
}

/* Confirm Button - Now scales perfectly */
.confirm-btn {
  background: #149656;
  color: white;
  border: none;
  margin-top: min(20%, 90px);
  padding: min(3%, 15px) min(20%, 150px); /* Proportional padding */
  border-radius: min(1.5vw, 8px);
  font-family: 'Barlow', sans-serif;
  font-weight: 600;
  font-size: min(4vw, 18px);
  cursor: pointer;
  transition: all 0.2s;
  width: min(88%, 490px); /* Constrained but fluid */
  white-space: nowrap; /* Prevents text wrapping */
}

/* Hover effects */
.confirm-btn:hover {
  background: #00bf63;
  transform: scale(1.02); /* Subtle growth effect */
}

/* Focus states */


@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

.id-input-container {
  transition: transform 0.8s ease;
}

.id-input-container.shake {
  animation: shake 0.8s ease;
}

.error-shake-container {
  --error-color: #ff3333;
}

.id-square {
  transition: border-color 0.3s, box-shadow 0.3s;
}

.id-square.error-shake {
  border-color: var(--error-color);
  box-shadow: 0 0 0 2px rgba(255, 51, 51, 0.2);
}

.id-square:focus {
  outline: none;
  border-color: #149656;
  transform: scale(1.05); 
}
  /* Responsive adjustments */
  @media (max-width: 400px) {
    .id-square {
      width: 25px;
      height: 35px;
      font-size: 14px;
    }
  }
  </style>