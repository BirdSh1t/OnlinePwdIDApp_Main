<template>
  <div class="more-options">
    <button @click="emitToggle" class="more-button">
      <img :src="getIconUrl('three_dots_grey.png')" alt="More Options" />
    </button>

    <div v-if="isOpen" class="dropdown-menu">
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
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  isOpen: Boolean,
  index: Number,
});
const emit = defineEmits(["toggle"]);

const emitToggle = () => {
  emit("toggle", props.index);
};

const viewRecord = () => {
  emit("openForm", props.index);
  isDropdownOpen.value = false;
};

const archiveRecord = () => {
  alert("Archiving Record");
  // Close the dropdown after action
  emit("toggle", props.index);
};

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
  