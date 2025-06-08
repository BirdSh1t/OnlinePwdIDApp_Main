<template>
  <div class="create-page-container">
    <!-- Dashboard Header -->
    <DashboardHeader 
    title="ID Now Application Form" 
    class="dashboard-header-card"
    @new-document="newDocument"
    />

    <!-- Create Card -->
    <div class="create-card">
      <!-- Search Bar -->
      <div class="search-bar">
        <img :src="getIconUrl('search_black.png')" alt="Search Icon" class="search-icon">
        <input
          type="text"
          placeholder="Search PWD ID here..."
          class="search-input"
          v-model="searchQuery"
          @keydown.enter="handleSearch"
        />
      </div>

      <!-- Form -->
      <form class="main-form">
        <!-- Left Side Container -->
        <div class="left-side-container">
          <!-- Record Navigation Container -->
          <div class="record-navigation-container">
            <div class="record-navigation">
              
              <!-- Fast Rewind (First Record) -->
              <div class="fast-rewind-icon">
                <img
                  :src="getIconUrl('next_double_arrow_right.png')"
                  alt="Fast Rewind"
                  class="arrow-icon flip-horizontal"
                  @click="goToFirst"
                  :class="{ 'disabled-icon': currentIndex <= 0 }"
                />
              </div>

              <!-- Previous Record -->
              <div class="previous-icon">
                <img
                  :src="getIconUrl('next_grey.png')"
                  alt="Previous"
                  class="arrow-icon flip-horizontal"
                  @click="goToPrev"
                  :class="{ 'disabled-icon': currentIndex <= 0 }"
                />
              </div>

              <!-- Record Counter -->
              <div class="record-card">
                Record {{ currentIndex + 1 }} of {{ allRecords.length }}
              </div>

              <!-- Next Record -->
              <div class="next-icon">
                <img
                  :src="getIconUrl('next_grey.png')"
                  alt="Next"
                  class="arrow-icon"
                  @click="goToNext"
                  :class="{ 'disabled-icon': currentIndex >= allRecords.length - 1 }"
                />
              </div>

              <!-- Fast Forward (Last Record) -->
              <div class="fast-forward-icon">
                <img
                  :src="getIconUrl('next_double_arrow_right.png')"
                  alt="Fast Forward"
                  class="arrow-icon"
                  @click="goToLast"
                  :class="{ 'disabled-icon': currentIndex >= allRecords.length - 1 }"
                />
              </div>
              
            </div>
          </div>

          <!-- ID Status -->
          <div class="id-status-container">
            <label for="id-status" class="id-label">IDNow ID:</label>
            <input
            type="checkbox"
            id="id-status"
            class="checkbox-input"
            v-model="isActive"
            :readonly="isNavigationMode"
          />
          <label for="id-status" class="status-label">
            {{ isActive ? 'Valid' : 'Invalid' }}
          </label>
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
              <button type="button" class="btn save-btn" @click="submitForm">Save</button>
            </div>
          </div>
        </div>

        <!-- Form Columns -->
        <div class="form-columns">
          <!-- Column A -->
          <div class="form-column column-a">
            <div class="form-group">
              <label for="id-number">ID No:</label>
              <input type="text" id="id-number" class="form-control" v-model="pwd_id" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" class="form-control" v-model="name" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="type-of-disability">Type of Disability:</label>
              <multiselect
                v-model="typeOfDisability"
                :options="disabilityOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="type-of-disability"
              ></multiselect>
            </div>

            <div class="form-group">
              <label for="address">Address:</label>
              <input type="text" id="address" class="form-control" v-model="address" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="date-of-birth">Date of Birth:</label>
              <input type="date" id="date-of-birth" class="form-control" v-model="dateOfBirth" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="date-issued">Date Issued:</label>
              <input type="date" id="date-issued" class="form-control" v-model="dateIssued" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="sex">Sex:</label>
              <multiselect
                v-model="sex"
                :options="sexOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="sex"
              ></multiselect>
            </div>

            <div class="form-group">
              <label for="blood-type">Blood Type:</label>
              <multiselect
                v-model="bloodType"
                :options="bloodTypeOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="blood-type"
              ></multiselect>
            </div>

            <div class="form-group">
              <label for="parent-guardian">Parent/Guardian:</label>
              <input type="text" id="parent-guardian" class="form-control" v-model="parentGuardian" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="contact">Contact:</label>
              <input type="text" id="contact" class="form-control" v-model="contact" :readonly="isNavigationMode">
            </div>

            <div class="form-group">
              <label for="remarks">Remarks:</label>
              <multiselect
                v-model="remarks"
                :options="remarksOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="remarks"
              ></multiselect>
            </div>

            <div class="form-group">
              <label for="annotation">Annotation:</label>
              <multiselect
                v-model="annotation"
                :options="annotationOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="annotation"
              ></multiselect>
            </div>

            <div class="form-group">
              <label for="philhealth-no">Philhealth No:</label>
              <input type="text" id="philhealth-no" class="form-control" v-model="philhealthNo" :readonly="isNavigationMode">
            </div>
          </div>

          <!-- Column B -->
          <div class="form-column column-b">
            <div class="form-group">
              <label for="transfer-from">Transfer From:</label>
              <input type="text" id="transfer-from" class="form-control" v-model="transferFrom" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="care-of">Care of:</label>
              <input type="text" id="care-of" class="form-control" v-model="careOf" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="first-name">Name:</label>
              <input type="text" id="first-name" class="form-control" v-model="firstName" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="middle-name">Middle Name:</label>
              <input type="text" id="middle-name" class="form-control" v-model="middleName" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="surname">Surname:</label>
              <input type="text" id="surname" class="form-control" v-model="surname" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="barangay">Barangay:</label>
              <input type="text" id="barangay" class="form-control" v-model="barangay" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="member-since">Member Since:</label>
              <input type="date" id="member-since" class="form-control" v-model="memberSince" :readonly="isNavigationMode">
            </div>
            <div class="form-group">
              <label for="education">Education:</label>
              <multiselect
                v-model="education"
                :options="educationOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="education"
              />
            </div>
            <div class="form-group">
              <label for="disability-cause">Disability Cause:</label>
              <multiselect
                v-model="disabilityCause"
                :options="disabilityCauseOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="disability-cause"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="assistive-device">Assistive Device:</label>
              <multiselect
                v-model="assistiveDevice"
                :options="assistiveDeviceOptions"
                :disabled="isNavigationMode"
                class="custom-dropdown"
                id="assistive-device"
              ></multiselect>
            </div>
            <div class="form-group">
              <label for="occupation">Occupation:</label>
              <input type="text" id="occupation" class="form-control" v-model="occupation" :readonly="isNavigationMode">
            </div>
          </div>
        </div>
      </form>

      <!-- Trash Icon -->
      <img
      :src="getIconUrl('trash_grey.png')"
      alt="Trash Icon"
      class="trash-icon"
      @click="onTrashClick"
      :class="{ disabled: !isTrashEnabled }"
      />

      <DeleteModal
        v-model="showDeleteModal"
        :isDelete="isDeleteMode"
        @delete-confirmed="deleteCurrentRecord"
      />
    </div>
  </div>
</template>



<script>
import { apiClient } from "@/api/apiClient.js";
import axios from 'axios';
import DashboardHeader from '@/components/DashboardHeader.vue';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css"; // Import default styles
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useToast } from 'vue-toastification';
import DeleteModal from '@/components/modals/DeleteModal.vue'; 


export default {
  setup() {
    const toast = useToast();

    const notify = () => {
      toast.success('Operation successful!');
    };

    return { notify };
  },
  components: { DashboardHeader, Multiselect, Datepicker, DeleteModal },
  data() {
    return {
      // Form field models:
      pwd_id: '',
      name: '',
      typeOfDisability: '',
      address: '',
      dateOfBirth: '',
      dateIssued: '',
      sex: '',
      bloodType: '',
      parentGuardian: '',
      contact: '',
      remarks: '',
      annotation: '',
      philhealthNo: '',
      transferFrom: '',
      careOf: '',
      firstName: '',
      middleName: '',
      surname: '',
      barangay: '',
      memberSince: '',
      education: '',
      disabilityCause: '',
      assistiveDevice: '',
      occupation: '',
      isActive: false, 
      searchQuery: '', // For the search bar
      // For the checkbox
      showDeleteModal: false,
      isDeleteMode: false, // 👈 Used to conditionally enable the icon
      showPwdIdField: true,
      
      // Dropdown options:
      disabilityOptions: ['Physical Disability', 'Visual Impairment', 'Hearing Impairment', 'Other'],
      sexOptions: ['Male', 'Female'],
      bloodTypeOptions: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      remarksOptions: ['First-time Applicant', 'Renewal', 'Other'],
      annotationOptions: ['Verified and Approved', 'Pending', 'Rejected'],
      educationOptions: ['Elementary', 'High School', 'College', 'Postgraduate'],
      disabilityCauseOptions: ['Accident', 'Genetic', 'Disease', 'Other'],
      assistiveDeviceOptions: ['Wheelchair', 'Hearing Aid', 'Prosthetic', 'Other'],

      currentIndex: 0,
      allRecords: [],
      isNewRecord: false,
    };
  },
  methods: {
    onTrashClick() {
    if (this.isTrashEnabled) {
      const fields = [
        this.pwd_id, this.name, this.typeOfDisability, this.address, this.dateOfBirth,
        this.dateIssued, this.sex, this.bloodType, this.transferFrom, this.careOf,
        this.firstName, this.middleName, this.surname, this.barangay, this.memberSince,
        this.education, this.disabilityCause, this.parentGuardian, this.contact,
        this.remarks, this.philhealthNo, this.assistiveDevice, this.occupation
          // skip this.annotation if it's not editable
        ];

        this.isDeleteMode = fields.every(field => !field || field === "");
        this.showDeleteModal = true;
      }
    },
    onNewDocumentCreated() {
      this.isTrashEnabled = true; // Enable trash when new document is created
      this.isNavigationMode = false; // 🧭 Exit navigation mode
    },
    onRecordSaved() {
      this.isTrashEnabled = false; // Disable trash when existing record is saved
    },
    async deleteCurrentRecord() {
    const toast = useToast();

      if (this.isDeleteMode) {
        if (this.isNewRecord) {
          // New, unsaved record — just clear it
          this.clearForm();
          this.isNewRecord = false;
          toast.success("Form cleared.");
        } else {
          // Existing record — delete from DB
          if (!this.pwd_id) {
            toast.error("Cannot delete. No ID found.");
            return;
          }

          try {
            await axios.delete(`/http://localhost:4000:api/users/${this.pwd_id}`);
            toast.success("Record deleted.");
            this.clearForm();
            this.pwd_id = '';
            this.isNewRecord = false;
            this.isTrashEnabled = false;
          } catch (err) {
            toast.error("Failed to delete record.");
          }
        }
      } else {
        this.clearForm();
        toast.success("Form cleared.");
      }
    },
    async handleSearch() {
    const toast = useToast();
    const query = this.searchQuery.trim();

    if (!query) {
      toast.warning("Please enter a PWD ID.");
      return;
      }

      try {
        const response = await axios.get('/http://localhost:4000/search', {
          params: {
            page: 'form',
            pwd_id: query
          }
        });

        const data = response.data

        if (!response.ok && result.message) {
          throw new Error(result.message);
        }

        if (result.record) {
          this.fillFormFromRecord(result.record);

          // Sync the navigator
          this.currentIndex = result.index;
          this.allRecords = Array(result.total).fill(null); // Dummy array just for navigator count

          toast.success("Record found!");
        } else {
          toast.warning("No record found.");
        }
      } catch (err) {
        toast.error(err.message || "Search error.");
        console.error("Search error:", err);
      }
    },
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
        // File upload logic goes here
      }
    },
    // Call this function when the Save button is pressed.
    submitForm() {
      const toast = useToast();

      this.isTrashEnabled = false; // Disable trash when existing record is saved
      // Create a payload object with all form fields.
      const payload = {
        pwd_id: this.pwd_id, 
        full_name: this.name,
        types_of_disability: this.typeOfDisability,
        address: this.address,
        birthdate: this.dateOfBirth,
        date_issued: this.dateIssued,
        sex: this.sex,
        blood_type: this.bloodType,
        transfer_from: this.transferFrom,
        care_of: this.careOf,
        first_name: this.firstName,
        middle_name: this.middleName,
        surname: this.surname,
        barangay: this.barangay,
        member_since: this.memberSince,
        education: this.education,
        disability_cause: this.disabilityCause,
        status_: this.isActive ? "valid" : "invalid",
        parent_guardian: this.parentGuardian,
        contact_number: this.contact,
        remarks: this.remarks,
        philhealth_no: this.philhealthNo,
        assistive_device: this.assistiveDevice,
        occupation: this.occupation

      };
        if (
          !this.pwd_id ||
          !this.name ||
          !this.sex ||
          !this.typeOfDisability ||
          !this.dateOfBirth ||
          !this.dateIssued ||
          !this.bloodType ||
          !this.transferFrom ||
          !this.careOf ||
          !this.firstName ||
          !this.middleName ||
          !this.surname ||
          !this.address ||
          !this.barangay ||
          !this.memberSince ||
          !this.education ||
          !this.disabilityCause ||
          !this.isActive ||
          !this.parentGuardian ||
          !this.contact ||
          !this.remarks ||
          !this.philhealthNo ||
          !this.assistiveDevice ||
          !this.occupation  
          // add more required fields here
        ) {
          toast.error("Please fill in all required fields.");
          return;
        }
      axios
      .post("/http://localhost:4000/api/users", payload)
      .then(async (response) => {
        console.log(`User ${response.data.pwd_id} added as record #${response.data.user_number}`);
        
        this.clearForm(); // ✅ Clear form first
        await this.fetchAllRecords(); // ✅ Wait for records to load

        this.currentIndex = this.allRecords.length - 1; // ✅ Jump to newest
        this.fillFormFromRecord(this.allRecords[this.currentIndex]);

        toast.success("Form submitted successfully!");
        })
        .catch(error => {
          console.error("Error inserting user:", error);
          toast.error("Error saving form.");
        });
    },
    // Clear all the form fields
    clearForm() {
      //this.pwd_id = '';
      this.name = '';
      this.typeOfDisability = '';
      this.address = '';
      this.dateOfBirth = '';
      this.dateIssued = '';
      this.sex = '';
      this.bloodType = '';
      this.transferFrom = '';
      this.careOf = '';
      this.firstName = '';
      this.middleName = '';
      this.surname = '';
      this.barangay = '';
      this.memberSince = '';
      this.education = '';
      this.disabilityCause = '';
      this.isActive = false;
      this.parentGuardian = '';
      this.contact = '';
      this.remarks = '';
      this.philhealthNo = '';
      this.assistiveDevice = '';
      this.occupation = '';
      //this.annotation = '';

      this.isTrashEnabled = true;

      this.showPwdIdField = false;
    },
    async newDocument() {
      const toast = useToast();

      const fields = [
        this.pwd_id,
        this.name,
        this.typeOfDisability,
        this.address,
        this.dateOfBirth,
        this.dateIssued,
        this.sex,
        this.bloodType,
        this.transferFrom,
        this.careOf,
        this.firstName,
        this.middleName,
        this.surname,
        this.barangay,
        this.memberSince,
        this.education,
        this.disabilityCause,
        this.isActive = false,
        this.parentGuardian,
        this.contact,
        this.remarks,
        this.philhealthNo,
        this.assistiveDevice,
      ];

      const isAnyEmpty = fields.some(field => field === null || field === '');
      if (isAnyEmpty) {
        toast.warning("Please fill in all fields before creating a new document.");
        return;
      }

      // ✅ Clear previous data
      this.clearForm();
      toast.success("New Form created successfully!");
      try {
        // ✅ Fetch next record number (num_users)
        const idResponse = await axios.get('/http://localhost:4000/api/next-id');
        this.currentIndex = idResponse.data.nextId - 1; // For record navigator

        // ✅ Fetch new pwd_id
        const pwdResponse = await axios.get('/http://localhost:4000/api/generate-pwd-id');
        this.pwd_id = pwdResponse.data.pwd_id;

        this.isNewRecord = true; // mark it as new
        this.showPwdIdField = true;
        // ✅ Mark as new document
        this.onNewDocumentCreated(); // <-- 🔥 Enable trash icon and disable navigation mode
      } catch (error) {
        console.error("Error preparing new document:", error);
        toast.error("Failed to initialize new document.");
      }
    },
    async fetchAllRecords() {
    try {
      const response = await axios.get('/http://localhost:4000/api/users');


      // 🔥 Filter out archived users (is_archived = 1)
      const users = response.data.data.filter(user => user.is_archived === false);

      // ✅ Sort by num_users before assigning
      this.allRecords = activeOnly.sort((a, b) => a.num_users - b.num_users);

      if (this.allRecords.length > 0) {
        this.currentIndex = 0;
        this.fillFormFromRecord(this.allRecords[0]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },
  async loadRecordByIndex(index) {
    try {
      const res = await axios.get('/http://localhost:4000/api/form-record', {
        params: { index }
        });
        const data = res.data;

        if (data.record) {
          this.fillFormFromRecord(data.record);
          this.currentIndex = data.index;
          this.allRecords = Array(data.total).fill(null); // Keep for count reference
        }
      } catch (err) {
        console.error("Failed to load record by index:", err);
      }
    },
  goToNext() {
    if (this.currentIndex < this.allRecords.length - 1) {
      this.loadRecordByIndex(this.currentIndex + 1);
    }
  },
  goToPrev() {
    if (this.currentIndex > 0) {
      this.loadRecordByIndex(this.currentIndex - 1);
    }
  },
  goToFirst() {
    this.loadRecordByIndex(0);
  },
  goToLast() {
    this.loadRecordByIndex(this.allRecords.length - 1);
  },
  populateForm(record) {
    this.isNavigationMode = true;
    this.pwd_id = record.pwd_id || '';
    this.name = record.full_name || '';
    this.typeOfDisability = record.types_of_disability || '';
    this.address = record.address || '';
    this.dateOfBirth = record.birthdate || '';
    this.dateIssued = record.date_issued || '';
    this.sex = record.sex || '';
    this.bloodType = record.blood_type || '';
    this.transferFrom = record.transfer_from || '';
    this.careOf = record.care_of || '';
    this.firstName = record.first_name || '';
    this.middleName = record.middle_name || '';
    this.surname = record.surname || '';
    this.barangay = record.barangay || '';
    this.memberSince = record.member_since || '';
    this.education = record.education || '';
    this.disabilityCause = record.disability_cause || '';
    this.isActive = (record.status || record.status_) === 'valid';
    this.parentGuardian = record.parent_guardian || '';
    this.contact = record.contact_number || '';
    this.remarks = record.remarks || '';
    this.philhealthNo = record.philhealth_no || '';
    this.assistiveDevice = record.assistive_device || '';
    this.occupation = record.occupation || '';
  },
  formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
    },
    fillFormFromRecord(record) {
      console.log("FILLING FORM FROM RECORD:", record); 
      console.log("RECORD PROPERTIES:", Object.keys(record)); 

      this.isNavigationMode = true;

      this.pwd_id = record.pwd_id;
      this.name = record.full_name;
      this.typeOfDisability = record.types_of_disability;
      this.address = record.address;
      this.dateOfBirth = this.formatDate(record.birthdate);
      this.dateIssued = this.formatDate(record.date_issued);
      this.sex = record.sex;
      this.bloodType = record.blood_type;
      this.transferFrom = record.transfer_from;
      this.careOf = record.care_of;
      this.firstName = record.first_name;
      this.middleName = record.middle_name;
      this.surname = record.surname;
      this.barangay = record.barangay;
      this.memberSince = this.formatDate(record.member_since);
      this.education = record.education;
      this.disabilityCause = record.disability_cause;
      this.isActive = record.status === 'valid';
      this.parentGuardian = record.parent_guardian;
      this.contact = record.contact_number;
      this.remarks = record.remarks;
      this.philhealthNo = record.philhealth_no;
      this.assistiveDevice = record.assistive_device;
      this.occupation = record.occupation;
    },
  },
  mounted() {
    this.fetchAllRecords();

    this.socket = new WebSocket("ws://localhost:4000");
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "update-active") {
        this.allRecords = message.data;

        //Apply this if the is_archive is fixed
        // this.fetchAllRecords();

        // this.socket = new WebSocket("ws://localhost:4000");
        // this.socket.addEventListener("message", (event) => {
        //   const message = JSON.parse(event.data);
        //   if (message.event === "update-active") {
        //     this.allRecords = message.data;
        //   }
        // });
      }
    });
  },
  beforeUnmount() {
    if (this.socket) this.socket.close();
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
  width: 255px; /* Adjusted width */
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
  flex: 1; 
  background-color: rgba(0, 0, 0, 0.5); 
  color: white;
  border: none;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out; 
  text-align: center;
  font-size: 16px;
}

.upload-image-btn:hover, .save-btn:hover {
  background-color: rgba(141, 138, 138, 0.7); 
  transform: scale(1.05); 
  box-shadow: 0 0 10px rgba(146, 146, 146, 0.2); 
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

.non-interactive {
  pointer-events: none;
  font-size: 13px;
  width: 107%;
  margin-top: 5px;
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

/**calendar icon for date **/
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
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

.disabled-icon {
  opacity: 0.4;
  pointer-events: none;
}

.my-custom-dialog .v-card {
  background-color: white;
  font-family: 'Cooper Hewitt';
  border-radius: 8px;
}

</style>




/* @media (max-width: 768px) {
  .create-card {
    padding-left: 20px; 
  }

  .form-columns {
    padding-left: 50px; 
  }

  .form-column {
    width: 35%; 
  }

  .form-control, .custom-dropdown, .big-box, .upload-image-btn, .save-btn {
    font-size: 11px; 
    padding: 5px; 
  }
} */