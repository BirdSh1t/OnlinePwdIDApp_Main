<template>
    <div v-if="modelValue" class="modal-overlay">
      <div class="custom-modal">
        <!-- Close Button -->
        <div class="close-btn" @click="$emit('update:modelValue', false)">
          <img :src="getIconUrl('close_black.png')" alt="Close" class="close-icon" />
        </div>
  
        <!-- Warning Icon -->
        <div class="warning-icon-wrapper">
          <div class="warning-icon-bg">
            <img :src="getIconUrl('warning_sign.png')" alt="Warning" class="warning-icon" />
          </div>
        </div>
  
        <!-- Title & Text -->
        <h2 class="modal-title">Are you sure?</h2>
        <p class="modal-description">
          {{ isDelete
            ? 'Are you sure you want to delete this new document? This action cannot be undone'
            : 'Are you sure you want to clear all fields in this form? This action cannot be undone' }}
        </p>
  
        <!-- Buttons -->
        <div class="modal-buttons">
          <button class="delete-btn" @click="handleDelete">
            {{ isDelete ? 'Delete Form' : 'Clear Form' }}
          </button>
          <button class="cancel-btn" @click="$emit('update:modelValue', false)">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeleteModal',
    props: {
      modelValue: Boolean,
      isDelete: Boolean // 🆕 used to toggle between delete and clear message
    },
    methods: {
      getIconUrl(fileName) {
        return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
      },
      handleDelete() {
        this.$emit('delete-confirmed');
        this.$emit('update:modelValue', false);
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .custom-modal {
    background-color: #ffffff;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    width: 90vw;
    max-width: 400px;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: #e0e0e0;
    border-radius: 20%;
    width: 2.2rem;
    height: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .close-icon {
    width: 1rem;
    height: 1rem;
  }
  
  .warning-icon-wrapper {
    margin-top: 1rem;
  }
  
  .warning-icon-bg {
    background-color: rgba(255, 49, 49, 0.2);
    border-radius: 25%;
    width: 4.5rem;
    height: 4.5rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .warning-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .modal-title {
    font-family: 'Barlow', sans-serif;
    font-weight: 700;
    font-size: 1.8rem;
    margin-top: 1.5rem;
  }
  
  .modal-description {
    font-family: 'Barlow', sans-serif;
    color: #a0a0a0;
    font-size: 1rem;
    margin: 0.5rem 0 1.5rem;
  }
  
  .modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .delete-btn {
  background-color: #d32f2f; /* Slightly dimmer red */
  color: white;
  padding: 0.8rem 0;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'Barlow', sans-serif;
  transition: background-color 0.2s, transform 0.1s; /* Smooth hover & click effect */
}

.delete-btn:hover {
  background-color: #ff3131; /* Brighter red on hover */
}

.delete-btn:active {
  transform: translateY(1px); /* "Pressed" effect */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

.cancel-btn {
  background-color: transparent; /* No fill */
  color: #333; /* Dark text for contrast */
  padding: 0.8rem 0;
  border: 1px solid #ccc; /* Light grey border */
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: 'Barlow', sans-serif;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.1s; /* Smooth hover & click effect */
}

.cancel-btn:hover {
  border-color: #999; /* Slightly darker border on hover */
}

.cancel-btn:active {
  transform: translateY(1px); /* "Pressed" effect */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}
  </style>
  