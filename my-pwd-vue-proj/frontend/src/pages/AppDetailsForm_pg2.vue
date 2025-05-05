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
          title="Other Information"
          @close="closeForm"
          @toggle-edit="toggleEditMode"
        />

        <!-- Body Section -->
        <main class="form-body">

          <!-- PWD ID (always read-only) -->
          <div class="form-group">
            <label>PWD ID:</label>
            <input type="text" class="text-field" :value="userData.pwd_id" readonly />
          </div>

          <!-- First Name -->
          <div class="form-group">
            <label>First Name:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.first_name" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.first_name" readonly />
            </template>
          </div>

          <!-- Transfer From -->
          <div class="form-group">
            <label>Transfer From:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.transfer_from" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.transfer_from" readonly />
            </template>
          </div>

          <!-- Middle Name -->
          <div class="form-group">
            <label>Middle Name:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.middle_name" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.middle_name" readonly />
            </template>
          </div>

          <!-- Disability Cause -->
          <div class="form-group">
            <label>Disability Cause:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.disability_cause"
                :options="disabilityCauseOptions"
                class="custom-multiselect"
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
              <input type="text" class="text-field" :value="userData.disability_cause" readonly />
            </template>
          </div>

          <!-- Surname -->
          <div class="form-group">
            <label>Surname:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.surname" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.surname" readonly />
            </template>
          </div>

          <!-- Care Of -->
          <div class="form-group">
            <label>Care Of:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.care_of" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.care_of" readonly />
            </template>
          </div>

          <!-- Assistive Device -->
          <div class="form-group">
            <label>Assistive Device:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.assistive_device"
                :options="assistiveDeviceOptions"
                class="custom-multiselect"
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
              <input type="text" class="text-field" :value="userData.assistive_device" readonly />
            </template>
          </div>

          <!-- Education -->
          <div class="form-group">
            <label>Education:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.education"
                :options="educationOptions"
                class="custom-multiselect"
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

          <!-- Member Since -->
          <div class="form-group">
            <label>Member Since:</label>

            <!-- READ-ONLY MODE: display formatted date -->
            <div v-if="!isEditMode" class="text-field custom-date-display">
              {{ formattedMemberSince }}
            </div>

            <!-- EDIT MODE: date picker input -->
            <Datepicker
              v-else
              v-model="formData.member_since"
              :format="'dd/MM/yyyy'"
              :enable-time-picker="false"
              type="date"
              input-class="text-field custom-date-picker"
            />
          </div>

          <!-- Barangay -->
          <div class="form-group">
            <label>Barangay:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.barangay" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.barangay" readonly />
            </template>
          </div>

          <!-- Occupation -->
          <div class="form-group">
            <label>Occupation:</label>
            <template v-if="isEditMode">
              <input type="text" class="text-field" v-model="formData.occupation" />
            </template>
            <template v-else>
              <input type="text" class="text-field" :value="userData.occupation" readonly />
            </template>
          </div>

            <!-- Civil status -->
            <div class="form-group">
            <label>Civil Status:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.civil_status"
                :options="civilStatusOptions"
                class="custom-multiselect"
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
            <input type="text" class="text-field" :value="userData.civil_status" readonly />
            </template>
          </div>

            <!-- Employment status -->
            <div class="form-group">
            <label>Employment Status:</label>
            <template v-if="isEditMode">
              <Multiselect
                v-model="formData.employment_status"
                :options="employmentStatusOptions"
                class="custom-multiselect"
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
            <input type="text" class="text-field" :value="userData.employment_status" readonly />
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
import axios from 'axios';
import { ref, watch, computed } from 'vue';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { defineProps, defineEmits } from 'vue';
import Datepicker from "@vuepic/vue-datepicker";
import AppDetailsFormHeader from '@/components/AppDetailsFormHeader.vue';

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

// Edit mode flag
const isEditMode = ref(false);

// Options
const educationOptions = ["No Formal Education", "Primary", "Secondary", "College", "Vocational", "Postgraduate"];
const disabilityCauseOptions = ["Birth", "Illness", "Accident", "Others"];
const assistiveDeviceOptions = ["Cane", "Walker", "Wheelchair", "Hearing Aid", "None"];
const civilStatusOptions = ['Single', 'Married', 'Widow/er', 'Separated', 'Co-Habitation'];
const employmentStatusOptions = ['Employed', 'Unemployed', 'Retired', 'Resigned', 'Displaced Worker'];

// Editable form data
const formData = ref({ ...props.userData });

watch(() => props.userData, (newVal) => {
  formData.value = { ...newVal };
}, { immediate: true });

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
}

function closeForm() {
  emit("close");
}

function getIconUrl(fileName) {
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
}

// 💡 Computed for displaying formatted date
const formattedMemberSince = computed(() => formatDate(formData.value.member_since));

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function cancelEdit() {
  formData.value = { ...props.userData };
  isEditMode.value = false;
}

function formatDateToMySQL(date) {
  const d = new Date(date);
  if (isNaN(d)) return null; // safety check
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function saveChanges() {
  const payload = {
    ...formData.value,
    member_since: formatDateToMySQL(formData.value.member_since),
  };

  axios
    .put(`http://localhost:4000/api/users/page2/${formData.value.pwd_id}`, payload)
    .then(response => {
      console.log("Updated user data:", response.data);
      isEditMode.value = false;
      emit("close");
    })
    .catch(error => {
      console.error("Error updating user:", error.message);
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

/**calendar icon for date **/
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.address-field.expanded {
  max-height: 6em; /* Expand to ~96px if base is 16px */
}

/* Footer Section */
.form-footer {
  margin-top: 1.25em;  /* ~20px */
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 0.625em; /* ~10px */
}

/* Page Indicator */
.page-indicator {
  margin-top: 2.5em;
  color: #707680;
  font-size: 0.875rem; /* ~14px */
}

/* Footer Arrow */
.footer-arrow {
  margin-top: 2.8em; /* ~8px */
  width: 1em;  
  height: 1em;
  cursor: pointer;
  filter: grayscale(100%) brightness(40%); 
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

.edit-buttons {
  margin-top: 0.2em;
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