<template>
  <header class="form-header">
    <img :src="getIconUrl('back_button_grey.png')" alt="Back" class="back-icon" @click="closeForm" />
    <h2 class="form-title">{{ title }}</h2>
    <div class="right-header-group">
      <div class="picture-placeholder">
        <img
          v-if="userImages['1x1_img']"
          :src="userImages['1x1_img']"
          class="resized-1x1"
          @click="openImageModal(userImages['1x1_img'])"
        />
      </div>
      <img :src="getIconUrl('edit_black.png')" alt="Edit" class="edit-icon"  @click="emit('toggle-edit')"  />
    </div>
    <VueEasyLightbox
      :visible="imageModal"
      :imgs="[previewImage]"
      @hide="closeImageModal"
    />
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import VueEasyLightbox from 'vue-easy-lightbox';

const props = defineProps({
  visible: Boolean,
  userData: {
    type: Object,
    default: () => ({})
  },
  currentPage: Number,
  totalPages: Number,
  title: {
    type: String,
    default: "Form"
  }
});

const emit = defineEmits(["close", "prev", "next", "toggle-edit"]);


const imageModal = ref(false);
const previewImage = ref('');
const userImages = ref({});

function openImageModal(path) {
  if (!path) return;
  previewImage.value = path;
  imageModal.value = true;
}
function closeImageModal() {
  imageModal.value = false;
}

function getIconUrl(fileName) {
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
}

function closeForm() {
  emit("close");
}

function fetchUserImages() {
  const id = props.userData?.pwd_id;
  if (!id) return;

  axios.get(`http://localhost:4000/api/users/images/${id}`)
    .then(res => {
      userImages.value = res.data || {};
    })
    .catch(err => console.error("Image fetch error:", err));
}

watch(() => props.userData, fetchUserImages, { immediate: true });
</script>

<style scoped>

  /* Header Section */
  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-icon {
    position: absolute;
    top: 0.5em;
    left: 0.5em;
    width: 1.8em;
    height: 1.8em;
    cursor: pointer;
  }
  
  .form-title {
    margin-top: 27px;
    font-size: 2.0rem; /* ~24px */
    font-weight: bold;
    color: black;
  }

  .right-header-group {
    display: flex;
    align-items: center;
    gap: 0.75em; /* ~12px */
  }

    /* Gray square for picture placeholder */
    .picture-placeholder {
  margin-top: 25px;
  width: 5.5em;
  height: 5.5em;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.resized-1x1 {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures it fills the box without distortion */
  cursor: pointer;
  image-rendering: auto;
}

  /* Edit Icon */
  .edit-icon {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    width: 1.8em;
    height: 1.8em;
    cursor: pointer;
  }
  
</style>