<template>
  <transition name="fade">
    <div v-if="visible" class="mask-overlay">
      <div class="form-container">
        <!-- Header Section -->
        <header class="form-header">
          <img :src="getIconUrl('back_button_grey.png')" alt="Back" class="back-icon" @click="closeForm" />
          <h2 class="form-title">PERSONAL DETAILS</h2>
          <div class="right-header-group">
            <div class="picture-placeholder"></div>
            <!-- Clicking the edit icon toggles edit mode -->
            <img :src="getIconUrl('edit_black.png')" alt="Edit" class="edit-icon" @click="toggleEditMode" />
          </div>
        </header>

        <!-- Body Section -->
        <main class="form-body">
          <!-- Type of Disability -->
          <div class="form-group">
            <label>Type of Disability:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.types_of_disability"
                :options="disabilityOptions"
                class="custom-multiselect"
                ref="typeOfDisabilityRef"
              >
                <template #caret="{ toggle }">
                  <img
                    :src="getIconUrl('drop_down_black.png')"
                    alt="Dropdown"
                    class="caret-icon"
                    @mousedown.prevent
                    @click.stop="toggle"
                  />
                </template>
              </Multiselect>
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.types_of_disability" readonly />
            </template>
          </div>

          <!-- Full Name -->
          <div class="form-group">
            <label>Full Name:</label>
            <input 
              type="text" 
              class="text-field" 
              v-model="formData.full_name"
              :readonly="!isEditMode" 
            />
          </div>

          <!-- Education -->
          <div class="form-group">
            <label>Education:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.education"
                :options="educationOptions"
                class="custom-multiselect"
                ref="educationRef"
              >
                <template #caret="{ toggle }">
                  <img
                    :src="getIconUrl('drop_down_black.png')"
                    alt="Dropdown"
                    class="caret-icon"
                    @mousedown.prevent
                    @click.stop="toggle"
                  />
                </template>
              </Multiselect>
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.education" readonly />
            </template>
          </div>

          <!-- Remarks -->
          <div class="form-group">
            <label>Remarks:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.remarks"
                :options="remarksOptions"
                class="custom-multiselect"
                ref="remarksRef"
              >
                <template #caret="{ toggle }">
                  <img
                    :src="getIconUrl('drop_down_black.png')"
                    alt="Dropdown"
                    class="caret-icon"
                    @mousedown.prevent
                    @click.stop="toggle"
                  />
                </template>
              </Multiselect>
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.remarks" readonly />
            </template>
          </div>

          <!-- Address -->
          <div class="form-group">
            <label>Address:</label>
            <textarea 
              class="address-field" 
              v-model="formData.address" 
              :readonly="!isEditMode"
            ></textarea>
          </div>

          <!-- Birthdate -->
          <div class="form-group">
            <label>Birthdate:</label>
            <div v-if="!isEditMode" class="text-field custom-date-display">{{ formattedBirthdate }}</div>
            <Datepicker
              v-else
              v-model="formData.birthdate"
              :format="'yyyy-MM-dd'"
              :enable-time-picker="false"
              input-class="text-field custom-date-picker"
            />
          </div>

            <!-- Sex -->
            <div class="form-group">
              <label>Sex:</label>
              <template v-if="isEditMode">
                <Multiselect
                  v-model="formData.sex"
                  :options="sexOptions"
                  class="custom-multiselect"
                  ref="sexRef"
                >
                  <template #caret="{ toggle }">
                    <img
                      :src="getIconUrl('drop_down_black.png')"
                      alt="Dropdown"
                      class="caret-icon"
                      @mousedown.prevent
                      @click.stop="toggle"
                    />
                  </template>
                </Multiselect>
              </template>
              <template v-else>
                <input type="text" class="text-field" :value="userData.sex" readonly />
              </template>
            </div>

          <!-- Blood Type -->
          <div class="form-group">
            <label>Blood Type:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.blood_type"
                :options="bloodTypeOptions"
                class="custom-multiselect"
                ref="bloodTypeRef"
              >
                <template #caret="{ toggle }">
                  <img
                    :src="getIconUrl('drop_down_black.png')"
                    alt="Dropdown"
                    class="caret-icon"
                    @mousedown.prevent
                    @click.stop="toggle"
                  />
                </template>
              </Multiselect>
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.blood_type" readonly />
            </template>
          </div>

          <!-- Parent Guardian -->
          <div class="form-group">
            <label>Parent Guardian:</label>
            <input 
              type="text" 
              class="text-field" 
              v-model="formData.parent_guardian"
              :readonly="!isEditMode" 
            />
          </div>

          <!-- Contact Number -->
          <div class="form-group">
            <label>Contact Number:</label>
            <input 
              type="text" 
              class="text-field" 
              v-model="formData.contact_number"
              :readonly="!isEditMode" 
            />
          </div>

            <!-- Date Issued -->
          <div class="form-group">
            <label>Date Issued:</label>
            <div v-if="!isEditMode" class="text-field custom-date-display">{{ formattedDateIssued }}</div>
            <Datepicker
              v-else
              v-model="formData.date_issued"
              :format="'yyyy-MM-dd'"
              :enable-time-picker="false"
              input-class="text-field custom-date-picker"
            />
          </div>

          <!-- Philhealth No -->
          <div class="form-group">
            <label>Philhealth No:</label>
            <input 
              type="text" 
              class="text-field" 
              v-model="formData.philhealth_no"
              :readonly="!isEditMode" 
            />
          </div>

          <!-- Annotation -->
          <div class="form-group">
            <label>Annotation:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.annotation"
                :options="annotationOptions"
                class="custom-multiselect"
                ref="annotationRef"
              >
                <template #caret="{ toggle }">
                  <img
                    :src="getIconUrl('drop_down_black.png')"
                    alt="Dropdown"
                    class="caret-icon"
                    @mousedown.prevent
                    @click.stop="toggle"
                  />
                </template>
              </Multiselect>
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.annotation" readonly />
            </template>
          </div>         
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
import axios from "axios";
import { ref, watch, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import Datepicker from "@vuepic/vue-datepicker";



const emit = defineEmits(["close", "prev", "next"]);
const props = defineProps({
  visible: Boolean,
  userData: {
    type: Object,
    default: () => ({})
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
});

// Reactive flag for toggling edit mode
const isEditMode = ref(false);


const educationOptions = ["Elementary Graduate", "High School Graduate", "College Graduate", "Vocational", "None"];
const disabilityOptions = ["Autism", "Visual Impairment", "Hearing Impairment"];
const sexOptions = ["Male", "Female"];
const bloodTypeOptions = ["A+", "B+", "O+", "AB+"];
const remarksOptions = ["New Applicant", "Renewal", "Missing Documents"];
const annotationOptions = ["Pending", "Rejected", "Verified and Approve"];


// Create a local reactive copy of userData to allow editing
const formData = ref({ ...props.userData });

// Update formData when userData changes
watch(() => props.userData, (newData) => {
  formData.value = { ...newData };
}, { immediate: true });

// Function to toggle edit mode
function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
}

// Helper function for icons
function getIconUrl(fileName) {
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
}

function closeForm() {
  emit("close");
}

// 💡 Computeds for formatted dates
const formattedBirthdate = computed(() => formatDate(formData.value.birthdate));
const formattedDateIssued = computed(() => formatDate(formData.value.date_issued));

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function cancelEdit() {
  formData.value = { ...props.userData };
  isEditMode.value = false;
}

function formatDateToMySQL(date) {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0]; // Extract just the date part
}

function saveChanges() {
  // Format dates before sending
  const payload = {
    ...formData.value,
    birthdate: formatDateToMySQL(formData.value.birthdate),
    date_issued: formatDateToMySQL(formData.value.date_issued)
    
  };

  axios
    .put(`http://localhost:4000/api/users/page1/${formData.value.pwd_id}`, payload)
    .then(response => {
      console.log("Updated user data:", response.data);
      isEditMode.value = false;

      //Need ata
      emit("updated", response.data); // ✅ Emit to parent
      emit('close');    
    })
    .catch(error => {
      console.error("Error updating user:", error);
    });
    
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
  /* Use relative sizing for width, with min/max constraints */
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
  width: 5.5em;  /* ~40px if base font is 16px */
  height: 5.5em;
  background-color: #a6a6a6;
  margin-bottom: 0px;
  margin-top: 30px;
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

/* Text Fields */
.text-field {
  /* Use relative sizing for height/padding */
  height: auto;
  min-height: 1em;         /* ~32px high at base font-size */
  border: 1px solid #ccc;
  border-radius: 0.3125em; /* 5px */
  padding: 0.5em;          /* ~8px */
  font-size: 1rem;
  color: black;
  transition: all 0.3s ease;
}

.text-field:focus {
  outline: none;
  border-color: #888;
}

/* Address Field (Expanding) */
.address-group {
  grid-column: span 1; /* Span across both columns if you want it full width */
}

.address-field {
  /* Start off roughly the same height as text fields */
  min-height: 0.9em; 
  max-height: 1.4em;
  resize: none;
  overflow: hidden;
  transition: max-height 0.3s ease;
  border: 1px solid #ccc;
  border-radius: 0.3125em; /* 5px */
  padding: 0.5em;
  font-size: 1rem;
  color: black;
}

.address-field.expanded {
  max-height: 6em; /* Expand to ~96px if base is 16px */
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
  margin-top: 2.5em; /* ~8px */
  color: #707680;
  font-size: 0.875rem; /* ~14px */
}
/* Footer Arrow */
.footer-arrow {
  margin-top: 2.8em; /* ~8px */
  width: 1em;  /* ~16px if base is 16px */
  height: 1em;
  cursor: pointer;
  filter: grayscale(100%) brightness(40%); /* Make it #707680-ish */
}

.flip-horizontal {
  transform: scaleX(-1);
}

/* Multiselect Customization */
.custom-multiselect {
  --multiselect-border-radius: 0.3125em; /* 5px */
  --multiselect-color: black;
  --multiselect-border: 1px solid #ccc;
  --multiselect-background: white;
  font-size: 1rem;
  position: relative;
}

/* Hide Vue Multiselect's default dropdown icon */
.custom-multiselect .multiselect__select {
  display: none !important;
}

.custom-multiselect .multiselect__tags {
  position: relative;
  padding-right: 1.875em; /* ~30px; ensure space for caret */
}

/* Custom Caret Icon */
.caret-icon {
  width: 1em;  /* ~16px */
  height: 1em;
  position: absolute;
  right: 0.625em; /* ~10px */
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
  cursor: pointer; /* 👈 Allow clicking */
}

/* Rotate the icon when the dropdown is open */
.custom-multiselect.multiselect--active .caret-icon {
  transform: translateY(-50%) rotate(180deg);
}

/**calendar icon for date **/
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.custom-date-picker {
  width: 180px;
  font-family: 'montserrat', sans-serif;
}

.custom-date-picker {
  width: 180px;
  height: 52px; /* ➕ Add 2px */
  border-radius: 5px;
  font-family: 'montserrat', sans-serif;
  box-sizing: border-box;
  transition: border 0.3s ease-in-out;
}

.edit-buttons {
  margin-top: 0.2em; /* ~8px */
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
</style>


  