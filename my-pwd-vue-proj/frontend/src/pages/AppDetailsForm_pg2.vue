<template>
  <transition name="fade">
    <!-- Show the form & black mask only if visible is true -->
    <div v-if="visible" class="mask-overlay">
      <div class="form-container">
        <!-- Header Section -->
        <header class="form-header">
          <!-- Back Button (top-left) -->
          <img
            :src="getIconUrl('back_button_grey.png')"
            alt="Back"
            class="back-icon"
            @click="closeForm"
          />
          <!-- Title aligned in the center (or right as needed) -->
          <h2 class="form-title">APPLICATION DETAILS</h2>
          <!-- Right header group: Gray Square + Edit Icon -->
          <div class="right-header-group">
            <div class="picture-placeholder"></div>
            <img :src="getIconUrl('edit_black.png')" alt="Edit" class="edit-icon" />
          </div>
        </header>

        <!-- Body Section -->
        <main class="form-body">
            <!-- Transfer From -->
            <div class="form-group">
              <label>Transfer From:</label>
              <input type="text" class="text-field" v-model="transferFrom" />
            </div>

            <!-- Care of -->
            <div class="form-group">
              <label>Care of:</label>
              <input type="text" class="text-field" v-model="careOf" />
            </div>

            <!-- Name -->
            <div class="form-group">
              <label>Name:</label>
              <input type="text" class="text-field" v-model="name" />
            </div>

            <!-- Member Since (was Middle Name's old position) -->
            <div class="form-group">
              <label>Member Since:</label>
              <input type="date" class="text-field" v-model="memberSince" />
            </div>

            <!-- Surname (was originally Member Since's position) -->
            <div class="form-group">
              <label>Middle Name:</label>
              <input type="text" class="text-field" v-model="middleName" />
            </div>

            <!-- Barangay -->
            <div class="form-group">
              <label>Barangay:</label>
              <input type="text" class="text-field" v-model="barangay" />
            </div>

            <!-- Middle Name (swapped with new Member Since position) -->
            <div class="form-group">
              <label>Surname:</label>
              <input type="text" class="text-field" v-model="surname" />
            </div>

            <!-- Education -->
            <div class="form-group">
              <label>Education:</label>
              <Multiselect
                v-model="education"
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
            </div>

            <!-- Disability Cause -->
            <div class="form-group">
              <label>Disability Cause:</label>
              <Multiselect
                v-model="disabilityCause"
                :options="disabilityCauseOptions"
                class="custom-multiselect"
                ref="disabilityCauseRef"
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
            </div>

            <!-- Assistive Device -->
            <div class="form-group">
              <label>Assistive Device:</label>
              <Multiselect
                v-model="assistiveDevice"
                :options="assistiveDeviceOptions"
                class="custom-multiselect"
                ref="assistiveDeviceRef"
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
            </div>

            <!-- Occupation -->
            <div class="form-group">
              <label>Occupation:</label>
              <input type="text" class="text-field" v-model="occupation" />
            </div>
          </main>

        <!-- Footer Section -->
        <footer class="form-footer">
          <!-- Left-facing arrow (Previous) -->
          <img 
            :src="getIconUrl('next_right.png')" 
            alt="Previous" 
            class="footer-arrow flip-horizontal" 
            @click="$emit('prev')" 
          />
          <!-- Page Indicator -->
          <span class="page-indicator">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <!-- Right-facing arrow (Next) -->
          <img 
            :src="getIconUrl('next_right.png')" 
            alt="Next" 
            class="footer-arrow" 
            @click="$emit('next')" 
          />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

// Props to show/hide this form
const props = defineProps({
  visible: Boolean,
});


// ================= Page 2 FIELDS =================
const transferFrom = ref("");
const careOf = ref("");
const name = ref("");
const middleName = ref("");
const surname = ref("");
const barangay = ref("");
const memberSince = ref("");
const education = ref(null);
const disabilityCause = ref(null);
const assistiveDevice = ref(null);
const occupation = ref("");

// Multiselect options
const educationOptions = ["No Formal Education", "Primary", "Secondary", "College", "Vocational", "Postgraduate"];
const disabilityCauseOptions = ["Birth", "Illness", "Accident", "Others"];
const assistiveDeviceOptions = ["Cane", "Walker", "Wheelchair", "Hearing Aid", "None"];

// Refs for multiselect components
const educationRef = ref(null);
const disabilityCauseRef = ref(null);
const assistiveDeviceRef = ref(null);


// Page index: should be 1 for Page 2 (this file is Page 2)
const pageIndex = ref(1);

// Dummy currentPage & totalPages for footer indicator (passed from parent)
const currentPage = ref(2);
const totalPages = ref(2);

// Helper function for icons
function getIconUrl(fileName) {
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
}

// Close form (emit close event)
const emit = defineEmits(["close"]);
function closeForm() {
  emit("close");
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
  margin-top: 1.25em; /* ~20px */
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 0.625em; /* ~10px */
}

/* Page Indicator */
.page-indicator {
  padding-top: 75px;
  color: #707680;
  font-size: 0.875rem; /* ~14px */
}

/* Footer Arrow */
.footer-arrow {
  padding-top: 75px;
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