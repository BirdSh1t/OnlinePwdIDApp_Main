<template>
    <div class="invalid-toast">
      <h4>⚠️ Please fix the following issues:</h4>
      <div class="error-list">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    errors: {
      type: Array,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .invalid-toast {
    max-height: 250px;
    overflow-y: auto;
    padding: 10px;
    color: #fff;
    background-color: #ff4d4f;
    border-radius: 8px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
  }
  
  .error-list ul {
    padding-left: 20px;
    margin: 0;
  }
  
  .error-list li {
    margin-bottom: 8px;
    line-height: 1.4;
  }

  /* Custom Scrollbar */
.invalid-toast::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
  height: 30%; /* Adjust height to not reach top and bottom */
  margin: 20% 0; /* Add margin to create gaps at top and bottom */
}

.invalid-toast::-webkit-scrollbar-thumb {
  background: #eb4040; /* Color of the scrollbar thumb */
  border-radius: 5px; /* Rounded corners */
}

.invalid-toast::-webkit-scrollbar-thumb:hover {
  background: #a50505; /* Color on hover */
}

  </style>
  