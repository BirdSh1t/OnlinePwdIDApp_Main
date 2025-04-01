<template>
  <div class="create-page-container">
    <!-- Dashboard Header -->
    <DashboardHeader title="ID Now Application Form" class="dashboard-header-card" />

    <!-- Create Card -->
    <div class="create-card">
      <!-- Search Bar -->
      <div class="search-bar">
        <img :src="getIconUrl('search_black.png')" alt="Search Icon" class="search-icon">
        <input type="text" placeholder="Search here" class="search-input">
      </div>

      <!-- Form -->
      <form class="main-form">
        <!-- Left Side Container -->
        <div class="left-side-container">
          <!-- Record Navigation Container -->
          <div class="record-navigation-container">
            <div class="record-navigation">
              <div class="fast-rewind-icon">
                <img :src="getIconUrl('next_double_arrow_right.png')" alt="Fast Rewind" class="arrow-icon flip-horizontal">
              </div>
              <div class="previous-icon">
                <img :src="getIconUrl('next_grey.png')" alt="Previous" class="arrow-icon flip-horizontal">
              </div>
              <div class="record-card">
                Record 104 of 8273
              </div>
              <div class="next-icon">
                <img :src="getIconUrl('next_grey.png')" alt="Next" class="arrow-icon">
              </div>
              <div class="fast-forward-icon">
                <img :src="getIconUrl('next_double_arrow_right.png')" alt="Fast Forward" class="arrow-icon">
              </div>
            </div>
          </div>

          <!-- ID Status -->
          <div class="id-status-container">
            <label for="id-status" class="id-label">IDNow ID:</label>
            <input type="checkbox" id="id-status" class="checkbox-input" v-model="isActive">
            <label for="id-status" class="status-label">Inactive</label>
          </div>

          <!-- Action Container for Big Box and Buttons -->
          <div class="action-container">
            <!-- Big Box -->
            <div class="big-box"></div>

            <!-- Buttons Container -->
            <div class="buttons-container">
              <!-- Upload Image Button -->
              <button type="button" class="btn upload-image-btn" @click="openFileExplorer">Upload Image</button>
              <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" accept="image/*" />
              <!-- Save Button -->
              <button type="submit" class="btn save-btn">Save</button>
            </div>
          </div>
        </div>

        <!-- Form Columns -->
        <div class="form-columns">
          <!-- Column A -->
          <div class="form-column column-a">
            <div class="form-group">
              <label for="id-number">ID No:</label>
              <input type="text" id="id-number" class="form-control" v-model="idNumber">
            </div>
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" class="form-control" v-model="name">
            </div>
            <div class="form-group">
              <label for="type-of-disability">Type of Disability:</label>
              <multiselect
                v-model="typeOfDisability"
                :options="disabilityOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="address">Address:</label>
              <input type="text" id="address" class="form-control" v-model="address">
            </div>
            <div class="form-group">
              <label for="date-of-birth">Date of Birth:</label>
              <input type="date" id="date-of-birth" class="form-control" v-model="dateOfBirth">
            </div>
            <div class="form-group">
              <label for="date-issued">Date Issued:</label>
              <input type="date" id="date-issued" class="form-control" v-model="dateIssued">
            </div>
            <div class="form-group">
              <label for="sex">Sex:</label>
              <multiselect
                v-model="sex"
                :options="sexOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="blood-type">Blood Type:</label>
              <multiselect
                v-model="bloodType"
                :options="bloodTypeOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="parent-guardian">Parent/Guardian:</label>
              <input type="text" id="parent-guardian" class="form-control" v-model="parentGuardian">
            </div>
            <div class="form-group">
              <label for="contact">Contact:</label>
              <input type="text" id="contact" class="form-control" v-model="contact">
            </div>
            <div class="form-group">
              <label for="remarks">Remarks:</label>
              <multiselect
                v-model="remarks"
                :options="remarksOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="annotation">Annotation:</label>
              <multiselect
                v-model="annotation"
                :options="annotationOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="philhealth-no">Philhealth No:</label>
              <input type="text" id="philhealth-no" class="form-control" v-model="philhealthNo">
            </div>
          </div>

          <!-- Column B -->
          <div class="form-column column-b">
            <div class="form-group">
              <label for="transfer-from">Transfer From:</label>
              <input type="text" id="transfer-from" class="form-control" v-model="transferFrom">
            </div>
            <div class="form-group">
              <label for="care-of">Care of:</label>
              <input type="text" id="care-of" class="form-control" v-model="careOf">
            </div>
            <div class="form-group">
              <label for="first-name">Name:</label>
              <input type="text" id="first-name" class="form-control" v-model="firstName">
            </div>
            <div class="form-group">
              <label for="middle-name">Middle Name:</label>
              <input type="text" id="middle-name" class="form-control" v-model="middleName">
            </div>
            <div class="form-group">
              <label for="surname">Surname:</label>
              <input type="text" id="surname" class="form-control" v-model="surname">
            </div>
            <div class="form-group">
              <label for="barangay">Barangay:</label>
              <input type="text" id="barangay" class="form-control" v-model="barangay">
            </div>
            <div class="form-group">
              <label for="member-since">Member Since:</label>
              <input type="date" id="member-since" class="form-control" v-model="memberSince">
            </div>
            <div class="form-group">
              <label for="education">Education:</label>
              <multiselect
                v-model="education"
                :options="educationOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="disability-cause">Disability Cause:</label>
              <multiselect
                v-model="disabilityCause"
                :options="disabilityCauseOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="assistive-device">Assistive Device:</label>
              <multiselect
                v-model="assistiveDevice"
                :options="assistiveDeviceOptions"
                class="custom-dropdown"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="occupation">Occupation:</label>
              <input type="text" id="occupation" class="form-control" v-model="occupation">
            </div>
          </div>
        </div>
      </form>

      <!-- Trash Icon -->
      <img :src="getIconUrl('trash_grey.png')" alt="Trash Icon" class="trash-icon">
    </div>
  </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css"; // Import default styles

export default {
  components: { DashboardHeader, Multiselect },
  data() {
    return {
      idNumber: '',
      name: '',
      typeOfDisability: null,
      address: '',
      dateOfBirth: '',
      dateIssued: '',
      sex: null,
      bloodType: null,
      parentGuardian: '',
      contact: '',
      remarks: null,
      annotation: null,
      philhealthNo: '',
      transferFrom: '',
      careOf: '',
      firstName: '',
      middleName: '',
      surname: '',
      barangay: '',
      memberSince: '',
      education: null,
      disabilityCause: null,
      assistiveDevice: null,
      occupation: '',
      isActive: false, // For the checkbox
      // Options for dropdowns
      disabilityOptions: ['Physical Disability', 'Visual Impairment', 'Hearing Impairment', 'Other'],
      sexOptions: ['Male', 'Female'],
      bloodTypeOptions: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      remarksOptions: ['First-time Applicant', 'Renewal', 'Other'],
      annotationOptions: ['Verified and Approved', 'Pending', 'Rejected'],
      educationOptions: ['Elementary', 'High School', 'College', 'Postgraduate'],
      disabilityCauseOptions: ['Accident', 'Genetic', 'Disease', 'Other'],
      assistiveDeviceOptions: ['Wheelchair', 'Hearing Aid', 'Prosthetic', 'Other'],
    };
  },
  methods: {
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    openFileExplorer() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("Selected file:", file);
        // You can handle the file upload logic here
      }
    }
  }
};
</script>

<style scoped>
/* Create Page Container */
.create-page-container {
  font-family: 'Barlow', sans-serif;
  font-weight: 400;
  padding-left: 50px;
  padding-right: 60px;
  height: 100vh;
  overflow: clip;
  display: flex;
  flex-direction: column;
  width: 95%;
  align-items: center;
  padding-top: 10px;
}

/* Create Card */
.create-card {
  background: white;
  width: calc(100% - 50px); /* Match the width of .table-card */
  margin: 0 auto 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  align-items: flex-start;
  height: calc(100vh - 230px);
  transition: all 0.3s ease-in-out;
  min-height: 300px;
  overflow: auto;
  padding-bottom: 14px;
  margin-right: 20px;
  position: relative; /* Needed for absolute positioning of trash icon */
}

/* Search Bar */
.search-bar {
  position: relative;
  width: 300px; /* Adjusted width */
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.search-input {
  width: 100%;
  padding: 10px;
  padding-left: 40px; /* Space for the search icon */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #a6a6a6;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

/* Main Form */
.main-form {
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
}

/* Left Side Container */
.left-side-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30%; /* Adjust width as needed */
}

/* Record Navigation Container */
.record-navigation-container {
  display: flex;
  justify-content: left;
  width: 100%;
  margin-bottom: 20px;
}

.record-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fast-rewind-icon, .fast-forward-icon, .previous-icon, .next-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}

.record-card {
  background-color: #a6a6a6;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px; /* Reduced size */
  margin: 0 10px;
}

/* Arrow Icons */
.arrow-icon {
  width: 14px; /* Reduced size */
  height: 14px; /* Reduced size */
  cursor: pointer;
}

.fast-rewind-icon .arrow-icon,
.fast-forward-icon .arrow-icon {
  width: 24px; /* Adjusted value for the icons */
  height: 24px; /* Adjusted value for the icons */
}

/* Flip Horizontal */
.flip-horizontal {
  transform: scaleX(-1); /* Flips the image horizontally */
}

/* ID Status Container */
.id-status-container {
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 0px;
  justify-content: center;
  gap: 5px; /* Added gap between elements */
}

.id-label {
  font-size: 16px; /* Reduced size */
  color: #333;
  padding-right: 100px;
}

.checkbox-input {
  width: 15px; /* Reduced size */
  height: 15px; /* Reduced size */
  margin-right: 0px;
}

.status-label {
  font-size: 16px; /* Reduced size */
  color: #333;
}

/* Action Container */
.action-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%; /* Ensure it spans full width */
  margin-top: 10px; /* Add some space from the top elements */
}

/* Big Box */
.big-box {
  width: 100%; /* Full width of the wrapper */
  padding-top: 80%; /* Maintain aspect ratio */
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out; /* Smooth transition for size changes */
}

/* Buttons Container */
.buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: 10px; /* Add space between buttons */
}

/* Buttons */
.upload-image-btn, .save-btn {
  flex: 1; /* Allow buttons to grow and shrink */
  background-color: rgba(0, 0, 0, 0.5); /* 50% transparency */
  color: white;
  border: none;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out; /* Smooth transition for size changes */
  text-align: center;
  font-size: 16px;
}

.save-btn {
  background-color: #d9d9d9;
  color: black;
}

/* Form Columns */
.form-columns {
  display: flex;
  justify-content: space-between;
  width: 50%; /* Adjusted width */
  margin-top: 20px; /* Add some space from the top elements */
}

.form-column {
  width: 45%;
  transition: width 0.3s ease-in-out; /* Smooth transition for width changes */
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-size: 13px;
  color: #333;
  align-self: flex-start; /* Align label to the left */
  margin-bottom: 5px; /* Space between label and input */
}

.form-control {
  width: 100%;
  padding: 8px;
  margin-top: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 13px;
  transition: all 0.3s ease-in-out; /* Smooth transition for size changes */
}

/* Custom Dropdown */
.custom-dropdown {
  font-size: 13px;
  width: 107%;
  margin-top: 5px;
  transition: all 0.3s ease-in-out; /* Smooth transition for size changes */
}

/* Trash Icon */
.trash-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* Custom Scrollbar */
.create-card::-webkit-scrollbar {
  width: 10px; /* Width of the scrollbar */
  height: 60%; /* Adjust height to not reach top and bottom */
  margin: 20% 0; /* Add margin to create gaps at top and bottom */
}

.create-card::-webkit-scrollbar-thumb {
  background: #ededed; /* Color of the scrollbar thumb */
  border-radius: 5px; /* Rounded corners */
}

.create-card::-webkit-scrollbar-thumb:hover {
  background: #d4d4d4; /* Color on hover */
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .create-card {
    padding-left: 50px; /* Adjust padding for smaller screens */
  }

  .form-columns {
    padding-left: 100px; /* Adjust padding for smaller screens */
  }

  .form-column {
    width: 40%; /* Reduce width for smaller screens */
  }

  .form-control, .custom-dropdown, .big-box, .upload-image-btn, .save-btn {
    font-size: 12px; /* Reduce font size for smaller screens */
    padding: 6px; /* Reduce padding for smaller screens */
  }
}

@media (max-width: 768px) {
  .create-card {
    padding-left: 20px; /* Further adjust padding for very small screens */
  }

  .form-columns {
    padding-left: 50px; /* Further adjust padding for very small screens */
  }

  .form-column {
    width: 35%; /* Further reduce width for very small screens */
  }

  .form-control, .custom-dropdown, .big-box, .upload-image-btn, .save-btn {
    font-size: 11px; /* Further reduce font size for very small screens */
    padding: 5px; /* Further reduce padding for very small screens */
  }
}
</style>
