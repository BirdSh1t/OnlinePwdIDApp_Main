<template>
  <div class="application-page">
    <!-- Hero Section with Background Image -->
    <div class="hero-section">
      <img 
        :src="getImageUrl('applicants-pg-bgImage-cropped.jpg')" 
        class="hero-bg-image" 
        alt="Background" 
      />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Application Details</h1>
        <p class="disclaimer">
          By using this platform's services, you acknowledge and consent to the collection, 
          processing, and storage of the personal information you provide in our form. Your data will be used 
          solely for the creation of your PWD ID and related services in accordance with applicable privacy laws. 
          We are committed to protecting your information and ensuring its confidentiality.
        </p>
      </div>
    </div>


      <!-- Content Section -->
      <div class="content-section">

      <p class="required-note">
          Fields marked with an asterisk (<span class="asterisk">*</span>) are required. If a field does not apply, please enter N/A.
      </p>

      <!-- Form Container -->
      <div class="sub-container"  @submit.prevent="submitForm">
          <!-- Green Line -->
          <div class="form-header-top">
              <h3>PERSONAL INFORMATION</h3>
          </div>
          
          <form class="application-form">
          <!-- Name Fields -->
          <div class="form-row-names">
            <div class="form-group">
              <input type="text" v-model="formData.first_name" required @keypress="preventNumbers" />
              <label>First Name<span class="asterisk">*</span></label>
            </div>
            <div class="form-group">
              <input type="text" v-model="formData.middle_name" required @keypress="preventNumbers" />
              <label>Middle Name<span class="asterisk">*</span></label>
            </div>
            <div class="form-group">
              <input type="text" v-model="formData.surname" required @keypress="preventNumbers" />
              <label>Last Name<span class="asterisk">*</span></label>
            </div>
          </div>
          
          <!-- Address -->
          <div class="form-group full-width">
            <input type="text" v-model="formData.address" required />
            <label>Home Address<span class="asterisk">*</span></label>
          </div>
          

          <div class="form-row dropdown-row">
            <div class="form-group-age">
              <input type="text" v-model="formData.age" required @keypress="preventLetters" maxlength="3" />
              <label>Age<span class="asterisk">*</span></label>
            </div>

            <div class="form-group dropdown-group">
              <multiselect
              v-model="sex"
              :options="sexOptions"
              class="custom-dropdown"
              id="sex"
              ></multiselect>
              <label for="sex">Sex<span class="asterisk">*</span></label>
          </div>


          <div class="form-group">
              <Datepicker
              v-model="birthDate"
              class="custom-datepicker"
              id="birthDate"
              :enable-time-picker="false"
              placeholder="Select birth date"
              required
              />
              <label for="birthDate">Birth Date<span class="asterisk">*</span></label>
          </div>
          </div>

          <!-- Contact Info -->
          <div class="form-header-Contact">
          <h3>CONTACT INFORMATION</h3>
          </div>

          <div class="form-row-contacts">
            <div class="form-group">
              <input type="text" v-model="formData.contact_number" required @keypress="preventLetters" maxlength="11" />
              <label>Phone Number<span class="asterisk">*</span></label>
            </div>
            <div class="form-group">
              <input type="email" v-model="formData.email" required />
              <label>Email<span class="asterisk">*</span></label>
            </div>
          </div>

          <div class="form-header-other">
          <h3>OTHER INFORMATION</h3>
          </div>

          <div class="form-row-fullname">
            <div class="form-group full-width">
              <input type="text" v-model="formData.full_name" required @keypress="preventNumbers" />
              <label>Full Name<span class="asterisk">*</span></label>
            </div>
            <div class="form-group full-width">
              <input type="text" v-model="formData.parent_guardian" required @keypress="preventNumbers" />
              <label>Guardian<span class="asterisk">*</span></label>
            </div>
          </div>

          <div class="form-row dropdown-row">
          <div class="form-group dropdown-group">
              <multiselect
              v-model="formData.types_of_disability"
              :options="disabilityOptions"
              class="custom-dropdown"
              id="disability"
              ></multiselect>
              <label for="disability">Types of Disability<span class="asterisk">*</span></label>
          </div>

          <div class="form-group dropdown-group">
              <multiselect
              v-model="bloodType"
              :options="bloodTypeOptions"
              class="custom-dropdown"
              id="bloodType"
              ></multiselect>
              <label for="bloodType">Blood Type<span class="asterisk">*</span></label>
          </div>

          <div class="form-group dropdown-group">
              <multiselect
              v-model="education"
              :options="educationOptions"
              class="custom-dropdown"
              id="education"
              ></multiselect>
              <label for="education">Educational Attainment<span class="asterisk">*</span></label>
          </div>
          </div>

          <div class="form-row dropdown-row">
          <div class="form-group-PhilNum">
              <input type="text" placeholder="Enter PhilHealth number" required />
              <label>PhilHealth Number<span class="asterisk">*</span></label>
          </div>

          <div class="form-group dropdown-group">
              <multiselect
              v-model="formData.civil_status"
              :options="civilStatusOptions"
              class="custom-dropdown"
              id="civilStatus"
              ></multiselect>
              <label for="education">Civil Status<span class="asterisk">*</span></label>
          </div>

          <div class="form-group dropdown-group">
              <multiselect
              v-model="employmentStatus"
              :options="employmentStatusOptions"
              class="custom-dropdown"
              id="employmentStatus"
              ></multiselect>
              <label for="education">Employment Status<span class="asterisk">*</span></label>
          </div>
          </div>

          <div class="form-header-documents">
          <h3>DOCUMENTS</h3>
          </div>

          <div class="form-row document-links">
            <!-- 🟩 Birth Certificate -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                @change="handleFileUpload($event, 'birthcert_img')"
              />
              Birth Certificate
              <span
                class="file-action"
                :class="{ remove: formData.birthcert_img }"
                @click="formData.birthcert_img ? removeFile('birthcert_img') : null"
              >
                {{ formData.birthcert_img ? '×' : '*' }}
              </span>
            </label>
            <div v-if="formData.birthcert_img" class="file-preview">
              {{ formData.birthcert_img.name }}
              <button v-if="isImage(formData.birthcert_img)" @click="openPreview('birthcert_img')">Preview</button>
            </div>

            <!-- 🟩 Barangay Certificate -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                @change="handleFileUpload($event, 'brgycert_img')"
              />
              Barangay Certificate
              <span
                class="file-action"
                :class="{ remove: formData.brgycert_img }"
                @click="formData.brgycert_img ? removeFile('brgycert_img') : null"
              >
                {{ formData.brgycert_img ? '×' : '*' }}
              </span>
            </label>
            <div v-if="formData.brgycert_img" class="file-preview">
              {{ formData.brgycert_img.name }}
              <button v-if="isImage(formData.brgycert_img)" @click="openPreview('brgycert_img')">Preview</button>
            </div>

            <!-- 🟩 Voter's Registration -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                @change="handleFileUpload($event, 'votersreg_img')"
              />
              Voter's Registration
              <span
                class="file-action"
                :class="{ remove: formData.votersreg_img }"
                @click="formData.votersreg_img ? removeFile('votersreg_img') : null"
              >
                {{ formData.votersreg_img ? '×' : '*' }}
              </span>
            </label>
            <div v-if="formData.votersreg_img" class="file-preview">
              {{ formData.votersreg_img.name }}
              <button v-if="isImage(formData.votersreg_img)" @click="openPreview('votersreg_img')">Preview</button>
            </div>

            <!-- 🟩 Government ID 1 -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                @change="handleFileUpload($event, 'govissue_img_1')"
              />
              Government ID 1
              <span
                class="file-action"
                :class="{ remove: formData.govissue_img_1 }"
                @click="formData.govissue_img_1 ? removeFile('govissue_img_1') : null"
              >
                {{ formData.govissue_img_1 ? '×' : '*' }}
              </span>
            </label>
            <div v-if="formData.govissue_img_1" class="file-preview">
              {{ formData.govissue_img_1.name }}
              <button v-if="isImage(formData.govissue_img_1)" @click="openPreview('govissue_img_1')">Preview</button>
            </div>

            <!-- 🟩 Government ID 2 -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                @change="handleFileUpload($event, 'govissue_img_2')"
              />
              Government ID 2
              <span
                class="file-action"
                :class="{ remove: formData.govissue_img_2 }"
                @click="formData.govissue_img_2 ? removeFile('govissue_img_2') : null"
              >
                {{ formData.govissue_img_2 ? '×' : '*' }}
              </span>
            </label>
            <div v-if="formData.govissue_img_2" class="file-preview">
              {{ formData.govissue_img_2.name }}
              <button v-if="isImage(formData.govissue_img_2)" @click="openPreview('govissue_img_2')">Preview</button>
            </div>
              
            <!-- 🟩 1x1 Photo -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/png,image/jpeg"
                hidden
                @change="handleFileUpload($event, '1x1_img')"
              />
              1x1 Photo
              <span
                class="file-action"
                :class="{ remove: formData['1x1_img'] }"
                @click="formData['1x1_img'] ? removeFile('1x1_img') : null"
              >
                {{ formData['1x1_img'] ? '×' : '*' }}
              </span>
            </label>

            <div v-if="formData['1x1_img']" class="file-preview">
              {{ formData['1x1_img'].name }}
              <button v-if="isImage(formData['1x1_img'])" @click="openPreview('1x1_img')">Preview</button>
              <span class="file-action remove" @click="removeFile('1x1_img')">×</span>
            </div>

            <!-- 🔍 Lightbox Preview -->
            <VueEasyLightbox
              :visible="preview.visible"
              :imgs="preview.images"
              @hide="preview.visible = false"
            />
            </div>
        
        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Submit Application</button>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import VueEasyLightbox from 'vue-easy-lightbox';
import { useToast } from 'vue-toastification';

export default {
  components: { Multiselect, Datepicker, VueEasyLightbox },
  name: "ApplicationsPg",
  data() {
    return {

      toast: useToast(),
      // 🔍 preview must be outside formData
      preview: {
        visible: false,
        file: null,
        images: []
      },

      formData: {
        // 💾 All user inputs
        first_name: "",
        middle_name: "",
        surname: "",
        full_name: "",
        address: "",
        age: null,
        sex: "",
        birthdate: null,
        contact_number: "",
        email: "",

        parent_guardian: "",
        civil_status: "",
        employment_status: "",

        types_of_disability: "",
        disability_cause: "",
        assistive_device: "",

        remarks: "",
        annotation: "",

        birthcert_img: null,
        brgycert_img: null,
        votersreg_img: null,
        govissue_img_1: null,
        govissue_img_2: null,
        ["1x1_img"]: null,
      },

      // 🔽 Dropdown values
      bloodType: null,
      education: null,
      employmentStatus: null,
      sex: null,
      birthDate: null,

    // Dropdown options
    disabilityOptions: ['Physical Disability', 'Visual Impairment', 'Hearing Impairment', 'Other'],
    bloodTypeOptions: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    educationOptions: ['Elementary Level', 'Elementary Graduate', 'High School Level', 'High School Graduate', 'College Level', 'College Graduate', 'Postgraduate', 'Vocational', 'SPED', 'None'],
    civilStatusOptions: ['Single', 'Married', 'Widow/er', 'Separated', 'Co-Habitation'],
    employmentStatusOptions: ['Employed', 'Unemployed', 'Retired', 'Resigned', 'Displaced Worker'],
    sexOptions: ['Male', 'Female'],
    };
  },

  // ✅ Auto-save the form to localStorage
  watch: {
    formData: {
      deep: true,
      handler(newVal) {
        localStorage.setItem("pwd_application_form", JSON.stringify(newVal));
      }
    }
  },

  // ✅ Load saved form on page refresh
    mounted() {
    const saved = localStorage.getItem("pwd_application_form");
    const toast = useToast(); // ✅ initialize it here

    if (saved) {
      this.formData = {
        ...this.formData,
        ...JSON.parse(saved)
      };
      toast.info("Restored previous form data."); // ✅ use the correct instance
    }
  },
  methods: {
  getImageUrl(fileName) {  
    return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
    },
      getPreviewUrl(file) {
      return file && file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
    },
      preventNumbers(e) {
      const char = String.fromCharCode(e.keyCode);
      if (/\d/.test(char)) e.preventDefault();
    },
    preventLetters(e) {
      const char = String.fromCharCode(e.keyCode);
      if (!/\d/.test(char)) e.preventDefault();
    },
    handleFileUpload(event, field) {
      const file = event.target.files[0];
      if (file) this.formData[field] = file;
    },
    removeFile(field) {
      this.formData[field] = null;
      this.toast.info("File removed.");
    },
    isImage(file) {
      return file && typeof file.type === "string" && file.type.startsWith("image/");
    },
    openPreview(field) {
    const file = this.formData[field];
    if (!file || !this.isImage(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.preview.images = [e.target.result];
      this.preview.visible = true;
    };
    reader.readAsDataURL(file);
  },
  validateFile(file, type = 'image') {
    if (!file) return false;
    
    const allowedTypes = type === 'image'
      ? ['image/jpeg', 'image/png', 'image/webp']
      : ['application/pdf', 'image/jpeg', 'image/png'];
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  },
  validatePhoneNumber(phone) {
    return /^[0-9]{11}$/.test(phone) && phone.startsWith('09'); // Specific to PH numbers
  },
  validateAge(age) {
    return Number.isInteger(Number(age)) && age >= 0 && age <= 150;
  },
  validateName(name) {
  return /^[A-Za-zÀ-ÿ\s'.-]+$/.test(name);
  },
  validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  },
  validateAllFields() {
    const f = this.formData;
    const validations = {
      names: [
        ['first_name', this.validateName(f.first_name)],
        ['middle_name', f.middle_name ? this.validateName(f.middle_name) : true],
        ['surname', this.validateName(f.surname)],
        ['parent_guardian', f.parent_guardian ? this.validateName(f.parent_guardian) : true]
      ],
      contacts: [
        ['email', this.validateEmail(f.email)],
        ['contact_number', this.validatePhoneNumber(f.contact_number)]
      ],
      documents: [
        ['1x1_img', this.validateFile(f["1x1_img"])],
        ['brgycert_img', this.validateFile(f.brgycert_img)],
        ['birthcert_img', this.validateFile(f.birthcert_img)],
        ['votersreg_img', this.validateFile(f.votersreg_img)],
        ['govissue_img_1', this.validateFile(f.govissue_img_1)],
        ['govissue_img_2', this.validateFile(f.govissue_img_2)],
      ],
      others: [
        ['age', this.validateAge(f.age)],
        ['types_of_disability', !!f.types_of_disability],
        ['civil_status', !!f.civil_status],
        ['address', !!f.address]
      ]
      };

      const failed = [];
      for (const group of Object.values(validations)) {
        for (const [field, valid] of group) {
          if (!valid) failed.push(field);
        }
      }

      if (failed.length) {
        console.warn("Validation failed for:", failed);
        return false;
      }

      return true;
    },
    async submitForm() {
      if (!this.validateAllFields()) {
        this.toast.error("Please correct the errors before submitting.");
        return;
      }

      const formData = new FormData();
      Object.entries(this.formData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        await axios.post("http://localhost:4000/api/applicants/pending", formData);
        this.toast.success("Application submitted successfully!");
      } catch (err) {
        console.error("Submission error:", err);
        this.toast.error("Submission failed. Please try again.");
      }
    }
  }
}
</script>
<style scoped>
/* Base Layout */
.application-page {
font-family: 'Segoe UI', sans-serif;
background-color: #faf4e2;
min-height: 100vh;
}

/* Hero Section */
.hero-section {
position: relative;
height: 40vh;
display: flex;
align-items: center;
justify-content: center;
overflow: hidden;
}

.hero-bg-image {
position: absolute;
width: 100%;
height: 100%;
object-fit: cover;
z-index: 0;
}

.hero-overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: linear-gradient(90deg, #69ff56, #000000);
opacity: 0.7;
z-index: 1;
}

.hero-content {
position: relative;
z-index: 2;
width: 80vw;
color: white;
text-align: left;
padding: 0 5vw;
}

.hero-content h1 {
font-size: 3.5vw;
font-weight: 700;
margin-bottom: 2vh;
}

.disclaimer {
font-size: 1.2vw;
line-height: 1.6;
margin-top: 2vh;
}

/* Required Note */
.required-note {
font-size: 1.5vw;
line-height: 1.6;
padding: 0;
margin: 6.5vh 0 0.5vh 1vw; /* top right bottom left */
text-align: left;
width: fit-content;
}

.required-note .asterisk {
color: #ff3131;
}

.form-header-top {
background-color: #149656;
padding: 1.5vh 2vw;
border-radius: 1.5vw 1.5vw 0 0; /* Rounded top corners only */
margin: -4vw -4vw 2vw -4vw; /* Negative margin to stretch to container edges */
}

.form-header {
background-color: #149656;
padding: 1.5vh 2vw;
margin: -4vw -4vw 2vw -4vw; /* Negative margin to stretch to container edges */
}

.form-header-Contact {
background-color: #149656;
padding: 0.5vh 2vw;
margin-top: -1vw;
margin-right: -4vw;
margin-bottom: 2vw;
margin-left: -4vw;
}

.form-header-other{
background-color: #149656;
padding: 0.5vh 2vw;
margin-top: -1vw;
margin-right: -4vw;
margin-bottom: 2vw;
margin-left: -4vw;
}

.form-header-documents {
  background-color: #149656;
  padding: 0.5vh 2vw;
  margin-top: -1vw;
  margin-right: -4vw;
  margin-bottom: 0vw;
  margin-left: -4vw;
}

/* Multiselect dropdown styling */
::v-deep .multiselect {
width: 100% !important; /* So it scales properly within flex item */
height: 6.5vh !important;
font-size: 1vw !important;
margin: 0 !important;   /* Remove internal spacing */
padding: 0 !important;
}

::v-deep .multiselect__tags {
min-height: 7vh !important; 
display: flex;
align-items: center;
}

::v-deep .multiselect__input {
font-size: 1vw !important;
height: 100%;
}

/* Layout containers */
.form-group.full-width {
width: 96.5%;
}

.form-group {
flex: 1;
display: flex;
border-radius: 10px;
min-width: 0;
flex-direction: column;
font-size: 13px;
color: #333;
align-self: flex-start;
margin-bottom: 5px;
margin-right: 5px;
}

/* Applies only to multiselect groups inside specific rows */
.dropdown-group {
margin-bottom: 0.8vh;
flex: 1 1 20vw;
max-width: 23vw;
}

/* Reduced horizontal gap between dropdowns */
.form-row.dropdown-row {
display: flex;
gap: 1vw;
flex-wrap: wrap;
}

.form-row-names {
  display: flex;
  width: 97%;
  gap: 3vw;
}

.form-row-contacts {
  display: flex;
  width: 97%;
  gap: 3vw;
  margin-top: 0px;
  margin-bottom: 3vh;
}

.form-row-fullname {
  display: flex;
  width: 97%;
  gap: 3vw;
}

.form-group-PhilNum {
  width: 29%;
  margin-right: 2.5vw;
  margin-bottom: 5vh;
}

.form-group-age{
  width: 30%;
  margin-right: 2vw;
  margin-bottom: 4vh;
}
/* Default form-row styles */
.form-row {
display: flex;
gap: 3vw;
flex-wrap: wrap;
}

/* Match Datepicker to multiselect style */
/* Wrapper stays flexible */
.custom-datepicker {
  width: 100% !important;
  font-size: 1vw !important;
  box-sizing: border-box;
}

/* Target the actual <input> inside the datepicker */
::v-deep(.dp__input) {
  width: 100%;
  height: 7vh;
  padding: 0 2.2vw;
  font-size: 1vw;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
}

/* Optional: remove margin under calendar popup if any */
::v-deep .dp__menu {
margin-top: 0.5vh !important;
}

/* Form Section */
.content-section {
padding: 0 10vw 5vh; /* Changed top padding from 5vh to 0 */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(50vw, 1fr));
gap: 1vw;
margin-bottom: 14vh;
}

/* Form Container */
.sub-container {
background-color: white;
border-radius: 1.5vw;
padding: 4vw;
box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.1);
margin-top: 0.5vh; /* Reduced from 1vh to 0.5vh */
position: relative;
}

.sub-container h2 {
font-size: 2.5vw;
margin-bottom: 3vh;
color: #333;
}

/* Form */
.application-form {
display: flex;
flex-direction: column;
gap: 3vh;
}

/* Labels and Inputs */
label {
font-size: 1.5vw;
margin-bottom: 1vh;
margin-top: 1vh;
margin-left: 0.2vw;
color: #333;
}

input {
padding: 1.5vh 1vw;
border: 0.1vw solid #ddd;
border-radius: 0.5vw;
font-size: 1.5vw;
font-family: 'Segoe UI', sans-serif;
width: 100%;
}

.asterisk {
color: #ff3131;
}

/* Button */
.submit-btn {
background-color: #149656;
color: white;
border: none;
padding: 2vh 0;
font-size: 1.8vw;
border-radius: 0.5vw;
cursor: pointer;
margin-top: 2vh;
transition: background-color 0.3s;
}

.submit-btn:hover {
background-color: #0f7a41;
}

/* Responsive Image (with proportional aspect) */
.responsive-image {
width: 20vw;
aspect-ratio: 1 / 1.9;
object-fit: contain;
max-width: 300px;
min-width: 100px;
}

/* Icon Example */
.icon {
width: 5vw;
height: 5vw;
object-fit: contain;
}

.document-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2vw;
  margin-bottom: 2vh;
}

.upload-label {
  font-size: 1.5vw;
  color: #4477aa; /* dim blue */
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.upload-label:hover {
  color: #2196f3; /* bright blue */
}

/* Media Queries */
@media (max-width: 1024px) {
.hero-content h1 {
  font-size: 5vw;
}

.disclaimer,
.required-note {
  font-size: 2vw;
}

.sub-container h2 {
  font-size: 3.5vw;
}

label,
input {
  font-size: 2.5vw;
}

.submit-btn {
  font-size: 3vw;
}
}

@media (max-width: 768px) {
.hero-section {
  height: 30vh;
}

.form-row {
  flex-direction: column;
  gap: 2vh;
}

.hero-content h1 {
  font-size: 6vw;
}

.disclaimer,
.required-note {
  font-size: 3vw;
}

.sub-container h2 {
  font-size: 4vw;
}

label,
input {
  font-size: 3vw;
}

.submit-btn {
  font-size: 4vw;
}
}

@media (max-width: 480px) {
.hero-section {
  height: 25vh;
}

.hero-content {
  padding: 0 4vw;
}

.hero-content h1 {
  font-size: 8vw;
}

.disclaimer,
.required-note {
  font-size: 4vw;
}

.sub-container h2 {
  font-size: 5vw;
}

label,
input {
  font-size: 4vw;
}

.submit-btn {
  font-size: 5vw;
}
}
</style>
