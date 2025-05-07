<template>  
        <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h2>OVERVIEW</h2> 
        </div>
  
        <!-- Body -->
        <div class="modal-body">
          <section>
            <h3>Personal Info</h3>
            <hr />
            <div v-if="!formData || !formData.first_name">No data loaded</div>
<div v-else>
  <p>{{ formData.first_name }} {{ formData.middle_name }} {{ formData.surname }}</p>
</div>
            <p>{{ formData.full_name }}</p>
            <p>{{ formData.sex }}</p>
            <p>{{ formData.birthdate }}</p>
          </section>
  
          <section>
            <h3>Contact Info</h3>
            <hr />
            <p>{{ formData.contact_number }}</p>
            <p>{{ formData.email }}</p>
            <p>{{ formData.parent_guardian }}</p>
          </section>
  
          <section>
            <h3>Other Info</h3>
            <hr />
            <p>{{ formData.address }}</p>
            <p>{{ formData.age }} years old</p>
            <p>{{ formData.civil_status }}</p>
            <p>{{ formData.employment_status }}</p>
            <p>{{ formData.types_of_disability }}</p>
            <p>{{ formData.bloodType }}</p>
            <p>{{ formData.education }}</p>
            <p v-if="formData.philhealth_no">PhilHealth No: {{ formData.philhealth_no }}</p>
          </section>
  
            <section>
                <h3>Documents</h3>
                <hr />
               <div class="thumbnails-container">
                <div
                v-for="(fileKey, index) in fileKeys"
                :key="index"
                class="thumbnail-wrapper"
                @click="openLightbox(index)"
                >
                <img :src="getFileUrl(formData[fileKey], fileKey)" class="thumbnail" />
                
                <p class="file-label">{{ fileLabels[fileKey] }}</p>
                </div>
               </div>
            </section>
  
          <div class="confirmation">
            <label class="checkbox-container">
                <input type="checkbox" v-model="isConfirmed" />
                <span>Checkbox Label</span>
            </label>
            <label for="confirm">
              By submitting this application, I confirm that I have read, understood, and attest that all information and documents submitted are true, accurate and authentic. I understand that any falsification or misrepresentation may result in the rejection of my application or future consequences.
            </label>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <!-- Confirm Submit Button -->
          <button 
            class="submit-btn" 
            :disabled="!isConfirmed"
            @click="submitModal"
          >
            Submit
          </button>

          <vue-easy-lightbox
          :visible="previewVisible"
          :imgs="previewImages"
          :index="previewIndex"
          @hide="previewVisible = false"
          />

        </div>
      </div>
  </template>
  
  <script>
  import VueEasyLightbox from 'vue-easy-lightbox';
  
  export default {
    components: { VueEasyLightbox },
    name: "OverviewModal",
    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        isConfirmed: false,
        previewVisible: false,
        previewImages: [],
        previewIndex: 0,
        fileKeys: [
          '1x1_img',
          'birthcert_img',
          'brgycert_img',
          'votersreg_img',
          'govissue_img_1',
          'govissue_img_2',
          'med_cert'
        ],
        fileLabels: {
          '1x1_img': '1x1 Photo',
          'birthcert_img': 'Birth Certificate',
          'brgycert_img': 'Barangay Certificate',
          'votersreg_img': "Voter's Registration",
          'govissue_img_1': "Gov't Issued ID 1",
          'govissue_img_2': "Gov't Issued ID 2",
          'med_cert': 'Medical Certificate',
        },
      };
    },
    watch: {
      formData: {
        immediate: true,
        deep: true,
        handler() {
          this.updatePreviewImages();
          console.log("📸 Updating preview images with:", this.formData);
        }
      }
    },
    methods: {
      openLightbox(index) {
        this.previewIndex = index;
        this.previewVisible = true;
      },
      closeLightbox() {
        this.showLightbox = false;
      },
      getFileUrl(filename) {
        const baseUrl = 'http://localhost:4000';
        if (typeof filename === 'string') {
          return `${baseUrl}/uploads/${filename.replace(/^Documents\//, '')}`;
        } else if (filename instanceof File) {
          return URL.createObjectURL(filename);
        }
        return '';
      },
      updatePreviewImages() {
        this.previewImages = this.fileKeys
          .filter(key => this.formData[key])
          .map(key => {
            const url = this.getFileUrl(this.formData[key], key);
            console.log('Resolved URL:', url);
            return url;
          });
      },
      closeModal() {
        this.$emit('close');
        document.body.classList.remove('modal-open');
      },
      submitModal() {
        console.log("Submit button in modal clicked");
        this.$emit('confirm-submit');
        document.body.classList.remove('modal-open');
      },
    },
    mounted() {
      console.log("🧪 formData prop received:", this.formData);
      console.log("🧪 first name is:", this.formData?.first_name);
    },
  };
  </script>
  
  
  
  <style scoped>

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
  }
  
  .modal-content {
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 600px;
    background: white;
    border-radius: 12px;
    overflow: auto;
    font-family: 'Segoe UI', sans-serif;
    margin: 50px auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    animation: popIn 0.3s ease;
  }
  
  @keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header h2 {
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
}

  .modal-header {
    background-color: #149656;
    padding: 30px;
    text-align: center;
    flex-shrink: 0;
  }
  
  .modal-header h2 {
    color: #cefe3c;
    margin: 0;
    font-size: 2.2rem;
  }
  
  .modal-body {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .modal-body section {
    margin-bottom: 20px;
  }
  
  .modal-body h3 {
    color: #149656;
    margin-top: 6vh;
    margin-bottom: 5px;
  }
  
  .modal-body hr {
    border: none;
    border-top: 2px solid #dbdbdb;
    margin-bottom: 10px;
  }
  
  .modal-body p {
    color: black;
    margin: 5px 0;
    word-break: break-word;
  }
  
  .confirmation {
    margin-top: 20px;
    padding: 15px;
    background: #fff;
    border: 2px solid #ff3131;
    border-radius: 8px;
    font-size: 12px;
    color: #ff3131;
  }
  
  .confirmation input[type="checkbox"] {
    margin-right: 10px;
  }
  
  .modal-footer {
    background: #f8f8f8;
    padding: 15px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .cancel-btn {
    background: transparent;
    border: none;
    color: black;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    text-decoration-color: red; /* change underline color */
  text-decoration-thickness: 2px; /* change underline thickness */
  text-underline-offset: 2px; /* adjust underline position */
  }
  
  .submit-btn {
    background: #149656;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px; /* makes it easier to click */
}
.checkbox-container input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.thumbnail-wrapper {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.thumbnail-wrapper:hover {
  transform: scale(1.05);
}

  /* Custom Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
  height: 30%; /* Adjust height to not reach top and bottom */
  margin: 20% 0; /* Add margin to create gaps at top and bottom */
}

.modal-body::-webkit-scrollbar-thumb {
  background: #ededed; /* Color of the scrollbar thumb */
  border-radius: 2px; /* Rounded corners */
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #dbdbdb; /* Color on hover */
}

</style>
  