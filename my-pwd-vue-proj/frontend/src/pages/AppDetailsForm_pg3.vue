<template>
    <transition name="fade">
      <div v-if="visible" class="mask-overlay">
        <div class="form-container">
          <!-- Header Section -->
          <AppDetailsFormHeader
            :userData="props.userData"
            :visible="props.visible"
            :currentPage="props.currentPage"
            :totalPages="props.totalPages"
            title="Documents"
            @close="closeForm"
            @toggle-edit="toggleEditMode"
          />

          <!-- Body Section -->
            <main class="form-body">

            <div class="form-group linked-item">
              <a class="doc-link linked-word" 
              @click="openImageModal(userImages['1x1_img'])">
                1x1 ID Picture
              </a>
            </div>

            <div class="form-group linked-item">
              <a
                class="doc-link linked-word"
                @click="openImageModal(userImages['votersreg_img'])">
                Voters Registration
              </a>
            </div>

            <div class="form-group linked-item">
              <a class="doc-link linked-word" 
              @click="openImageModal(userImages['birthcert_img'])">
                Birth Certification
              </a>
            </div>

            <div class="form-group linked-item">
              <a class="doc-link linked-word" 
              @click="openImageModal(userImages['brgycert_img'])">
                Barangay Certification
              </a>
            </div>

            <div class="form-group linked-item">
              <a class="doc-link linked-word" 
              @click="openImageModal(userImages['govissue_img_1'])">
                Government Issue 1
              </a>
            </div>

            <div class="form-group linked-item">
              <a class="doc-link linked-word" 
              @click="openImageModal(userImages['govissue_img_2'])">
                Government Issue 2
              </a>
            </div>

            <div class="form-group linked-item">
              <a class="doc-link linked-word" 
              @click="openImageModal(userImages['med_cert'])">
               Medical Certificate  
              </a>
            </div>

            <vue-easy-lightbox
            :visible="imageModal"
            :imgs="[previewImage]"
            @hide="closeImageModal"
            />

            </main>
  
          <!-- Footer Section -->
            <footer class="form-footer">
              <img
                :src="getIconUrl('next_right.png')"
                alt="Previous"
                class="footer-arrow flip-horizontal"
                @click="$emit('prev')"
                v-if="!isEditMode"
              />
  
              <!-- Page indicator or Save/Cancel button -->
                <template v-if="!isEditMode">
                  <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
                </template>
                <template v-else>
                  <div class="edit-buttons">
                    <span class="cancel-btn" @click="cancelEdit">Cancel</span>
                    <button class="save-btn" @click="saveChanges">Save</button>
                  </div>
                </template>
  
              <img
                :src="getIconUrl('next_right.png')"
                alt="Next"
                class="footer-arrow"
                @click="$emit('next')"
                v-if="!isEditMode"
              />
            </footer>
        </div>
      </div>
    </transition>
  </template>
  
<script setup>
import { apiClient } from '@/api/apiClient.js';
import { ref, watch, computed } from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import AppDetailsFormHeader from '@/components/AppDetailsFormHeader.vue';

const props = defineProps({
  visible: Boolean,
  userData: {
    type: Object,
    default: () => ({})
  },
  currentPage: Number,
  totalPages: Number
});
const emit = defineEmits(["close", "prev", "next"]);

const isEditMode = ref(false);
const formData = ref({ ...props.userData });

watch(() => props.userData, (newVal) => {
  formData.value = { ...newVal };
  fetchUserImages(); // Fetch metadata every time user changes
}, { immediate: true });


function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
}
function closeForm() {
  emit("close");
}
function cancelEdit() {
  formData.value = { ...props.userData };
  isEditMode.value = false;
}
function getIconUrl(fileName) {
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
}
function saveChanges() {
  const payload = {
    ...formData.value,
    member_since: formatDateToMySQL(formData.value.member_since),
  };
}

const imageModal = ref(false);
const previewImage = ref('');

function openImageModal(path) {
  if (!path) return;
  previewImage.value = path; // path already starts with /
  imageModal.value = true;
}

function closeImageModal() {
  imageModal.value = false;
}

const userImages = ref({
  '1x1_img': '',
  'votersreg_img': '',
  'birthcert_img': '',
  'brgycert_img': '',
  'govissue_img_1': '',
  'govissue_img_2': '',
  'med_cert': ''
});

function fetchUserImages() {
  const id = props.userData.pwd_id;
  if (!id) return;
  apiClient.get(`/api/users/images/${id}`)
    .then(res => {
      userImages.value = res.data || {};
    })
    .catch(err => console.error("Image fetch error:", err));
}
</script>
  
  <style scoped>
  /* Fade transition for black mask & form */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Black Mask Overlay (30% transparency) */
  .mask-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3); /* 30% black */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  /* Form Container */
  .form-container {
    width: 70vw;
    max-width: 56.25em; /* 900px / 16 */
    min-width: 25em;    /* 400px / 16 */
  
    /* Reduce the overall height */
    min-height: 20rem;  /* Lower than your original 600px (~37.5rem) */
  
    background: #fff;
    border-radius: 0.625em; /* 10px / 16 */
    box-shadow: 0 0.3125em 0.9375em rgba(0,0,0,0.2); /* 5px 15px in rem */
    
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    
    /* Use em-based padding so it scales with font size */
    padding: 1.25em; /* ~20px */
    font-family: 'Barlow', sans-serif;
    font-size: 0.8rem; /* Base font size */
    position: relative;
  }
  
  /* Header Section */
  .form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  
  .back-icon {
    position: absolute;
    top: 0.5em;
    left: 0.5em;
    width: 1.8em;
    height: 1.8em;
    cursor: pointer;
  }
  
  /* Body Section */
  .form-body {
    display: grid;
    /* Two columns on larger screens */
    margin-top: 1.5em; /* ~8px */
    grid-template-columns: 1fr 1fr;
    /* Use em for column/row gap so it scales */
    column-gap: 1.5em; /* ~24px */
    row-gap: 1em;      /* ~16px */
  }
  
  /* Form Group */
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  /* Labels */
  .form-group label {
    color: #707680;
    margin-bottom: 0.3125em; /* ~5px */
    font-size: 0.875rem;     /* ~14px */
  }
  
  
  /* Footer Section */
  .form-footer {
    margin-top: 1.25em; /* ~20px */
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 0.625em; /* ~10px */
  }
  
  /* Page Indicator */
  .page-indicator {
    margin-top: 9.5em;
    color: #707680;
    font-size: 0.875rem; /* ~14px */
  }
  
  /* Footer Arrow */
  .footer-arrow {
    margin-top: 10.8em;
    width: 1em;  /* ~16px if base is 16px */
    height: 1em;
    cursor: pointer;
    filter: grayscale(100%) brightness(40%); /* Make it #707680-ish */
  }
  
  .flip-horizontal {
    transform: scaleX(-1);
  }
  
  .edit-buttons {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .cancel-btn {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: lightgray;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 159px;
  }
  
  .save-btn {
    background-color: #066aff;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 159px;
  }
  
  .save-btn:hover {
    background-color: #0051cc;
  }
  .cancel-btn:hover {
    color: #202020;
  }
  /* Responsive Adjustments */
  @media (max-width: 37.5em) { /* 600px / 16 = 37.5em */
    .form-container {
      width: 90vw;
      padding: 1em;
    }
  
    .form-body {
      grid-template-columns: 1fr; /* Single column on small screens */
    }
  
    .address-group {
      grid-column: 1; /* Single column layout */
    }
  }

.linked-item {
  display: flex;
  justify-content: center; /* Center the content horizontally */
  padding-top: 2em;
  margin-left: 40px;
  margin-top: 2em;
  margin-bottom: 1em; /* Add some spacing between items */
}

.doc-link {
  color: rgba(0, 68, 204, 0.55); /* Dimmer blue with 45% transparency */
  font-family: 'Barlow', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-block;
  text-align: left;
  text-decoration: underline;
  text-decoration-color: rgba(0, 68, 204, 0.55); /* Match the text color */
}

.doc-link:hover {
  color: #005bb5;
  text-shadow: 0 0 5px rgba(0, 91, 181, 0.3); /* Lighter shadow to match */
}

.doc-link:active {
  transform: scale(0.96);
}





  </style>