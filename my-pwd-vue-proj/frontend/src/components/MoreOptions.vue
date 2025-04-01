<template>
    <div class="more-options">
      <button @click="toggleDropdown" class="more-button">
        <img :src="getIconUrl('three_dots_grey.png')" alt="More Options" />
      </button>
  
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <button @click="viewRecord" class="dropdown-item">
          <img :src="getIconUrl('view_docu_black.png')" alt="View" />
          View
        </button>
        <button @click="archiveRecord" class="dropdown-item">
          <img :src="getIconUrl('archive_black.png')" alt="Archive" />
          Archive
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  
  // Props to control dropdown state
  const props = defineProps({
    index: Number,
    isOpen: Boolean,
  });
  
  // Data for dropdown open/close
  const isDropdownOpen = ref(props.isOpen);
  
  // Watch for changes in props to update local state
  watch(() => props.isOpen, (newVal) => {
    isDropdownOpen.value = newVal;
  });
  
  // Toggles the dropdown panel
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };
  
  // Emit event when dropdown is toggled
  const emit = defineEmits(['update:isOpen']);
  watch(isDropdownOpen, (newVal) => {
    emit('update:isOpen', newVal, props.index);
  });
  
  // "View" action
  const viewRecord = () => {
    alert("Viewing Record");
    isDropdownOpen.value = false;
  };
  
  // "Archive" action
  const archiveRecord = () => {
    alert("Archiving Record");
    isDropdownOpen.value = false;
  };
  
  // Dynamically resolve icon URLs
  const getIconUrl = (fileName) => {
    return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
  };
  </script>
  
  <style scoped>
  .more-options {
    position: relative;
  }
  
  .more-button {
    background: none;
    border: none;
    cursor: pointer;
    padding-left: 20px;
  }
  
  .more-button img {
    width: 14px; /* Scaled down icon size */
    height: 14px; /* Scaled down icon size */
  }
  
  .dropdown-menu {
    position: absolute;
    left: -100px; /* Adjust position to be near the "Date" column */
    top: 10px; /* Adjust vertical position */
    background: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 10;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    width: 100%;
  }
  
  .dropdown-item:hover {
    background-color: #ededed; /* Hover color */
  }
  
  .dropdown-item img {
    width: 14px; /* Scaled down icon size */
    height: 14px; /* Scaled down icon size */
  }
  </style>
  