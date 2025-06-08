<template>
    <div class="modal-mask">
      <transition name="slide-up">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h2>OVERVIEW</h2>
          </div>
  
          <!-- Body -->
          <div class="modal-body">
            <section>

              <div class="section-header">
                <h3>Personal Info</h3>
                <div v-if="isPending">
                  <label>
                    <input type="checkbox" v-model="sectionChecks.basic" style="margin-top: 2.5rem;" /> Confirm
                  </label>
                </div>
              </div>
              <hr />
              <p><strong>First name, M.I, Last name:</strong> {{ formData.first_name }} {{ formData.middle_name }} {{ formData.surname }}</p>
              <p><strong>Full Name:</strong> {{ formData.full_name }}</p>
              <p><strong>Sex:</strong> {{ formData.sex }}</p>
              <p><strong>Birthdate:</strong> {{ new Date(formData.birthdate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              }) }}</p>
            </section>

            <section>
              <div class="section-header">
                <h3>Contact Info</h3>
                <div v-if="isPending">
                  <label>
                    <input type="checkbox" v-model="sectionChecks.contact" style="margin-top: 2.5rem;" /> Confirm
                  </label>
                </div>
              </div>
              <hr />
              <p><strong>Contact Number:</strong> {{ formData.contact_number }}</p>
              <p><strong>Email:</strong> {{ formData.email }}</p>
              <p><strong>Parent/Guardian:</strong> {{ formData.parent_guardian }}</p>
            </section>

            <section>
              <div class="section-header">
                <h3>Other Info</h3>
                <div v-if="isPending">
                  <label>
                    <input type="checkbox" v-model="sectionChecks.other" style="margin-top: 2.5rem;" /> Confirm
                  </label>
                </div>
              </div>
              <hr />
              <p><strong>Address:</strong> {{ formData.address }}</p>
              <p><strong>Age:</strong> {{ formData.age }} years old</p>
              <p><strong>Civil Status:</strong> {{ formData.civil_status }}</p>
              <p><strong>Employment Status:</strong> {{ formData.employment_status }}</p>
              <p><strong>Type of Disability:</strong> {{ formData.types_of_disability }}</p>
              <p><strong>Blood Type:</strong> {{ formData.blood_type }}</p>
              <p><strong>Educational Attainment:</strong> {{ formData.education }}</p>
              <p v-if="formData.philhealth_no"><strong>PhilHealth No:</strong> {{ formData.philhealth_no }}</p>
            </section>
  
            <section>
              <div class="section-header">
                <h3>Documents</h3>
                <div v-if="isPending">
                  <label>
                    <input type="checkbox" v-model="sectionChecks.documents" style="margin-top: 2.5rem;" /> Confirm
                  </label>
                </div>
              </div>
              <hr />
              <div class="thumbnails-container">
                <div
                  v-for="(fileKey, index) in fileKeys"
                  :key="fileKey"
                  class="thumbnail-wrapper"
                  @click="openLightbox(index)"
                >
                  <img :src="getFileUrl(formData[fileKey])" class="thumbnail" />
                  <p class="file-label">{{ fileLabels[fileKey] }}</p>
                </div>
              </div>
            </section>
          </div>

          <div
            v-if="applicationStatus === 'rejected' && sanitizedRejectionHTML"
            class="rejection-message-box"
            v-html="sanitizedRejectionHTML"
          ></div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="cancel-btn" @click="closeModal">Close</button>
            <div class="footer-actions" v-if="isPending">
                <button
                  class="submit-btn"
                  :disabled="!allChecked"
                  @click="modalActionType === 'reject' ? showQuillModal = true : submitModal()"
                  >
                  {{ modalActionType === 'approve' ? 'Approve Application' : 'Next' }}
                </button>
            </div>
            <vue-easy-lightbox
              :visible="previewVisible"
              :imgs="previewImages"
              :index="previewIndex"
              @hide="previewVisible = false"
            />
          </div>
        </div>
      </transition>
    </div>

    <!-- Outside main modal -->
    <div v-if="showQuillModal" class="quill-overlay">
      <div class="quill-modal fade-in">
        <h3>Reason for Rejection</h3>
        <div class="editor-wrapper">
          <QuillEditor
            ref="quillEditor"
            v-model:content="localRejectionReason"
            contentType="html"
            placeholder="Write your reason..."
            @text-change="allChecked"
          />
        </div>
        <div class="quill-actions">
          <button @click="showQuillModal = false" class="cancel-btn">Cancel</button>
          <button
            class="submit-btn"
            :disabled="!isRejectInputValid"
            @click="submitModal"
          >
            Reject Application
          </button>
        </div>
      </div>
    </div>


  </template>
  
  <script>
  import axios from 'axios';
  import VueEasyLightbox from 'vue-easy-lightbox';
  import { QuillEditor } from '@vueup/vue-quill';
  import 'quill/dist/quill.snow.css';
  import { useToast } from "vue-toastification";
  import DOMPurify from 'dompurify';

  export default {
    name: 'OverviewRemoteModal',
    components: { VueEasyLightbox, QuillEditor },
    setup() {
      const toast = useToast();
      return { toast };
    },
    props: {
      applicantId: Number,
      modalActionType: {
        type: String,
        default: ''
      },
      initialStatus: {
        type: String,
        required: true
      },
      rejectionReason: {
      type: String,
      default: ''
      },
      applicationStatus: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        localRejectionReason: this.rejectionReason,
        sanitizedRejectionHTML: '',
        showQuillModal: false,
        isRejectInputValid: false,
        formData: {},
        // currentStatus: this.initialStatus,
        isConfirmed: false,
          sectionChecks: {
          personal: false,
          contact: false,
          other: false,
          documents: false
        },
        previewVisible: false,
        previewImages: [],
        previewIndex: 0,
        fileKeys: [
          '1x1_img', 'birthcert_img', 'brgycert_img',
          'votersreg_img', 'govissue_img_1', 'govissue_img_2', 'med_cert'
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
      applicantId: {
        immediate: true,
        handler(id) {
          this.fetchApplicant(id);
        }
      },
      rejectionReason: {
        immediate: true,
        handler(val) {
          if (val) {
            this.sanitizedRejectionHTML = DOMPurify.sanitize(val);
          }
        }
      }
    },
    computed: {
      allChecked() {
        return Object.values(this.sectionChecks).every(val => val);
      },
      isRejectInputValid() {
        const reason = this.rejectionReason.trim();
        const isLongEnough = reason.length >= 30;
        const isNotRandom = /[a-zA-Z]{3,}/.test(reason); // must contain at least a few real words
        return isLongEnough && isNotRandom && reason.length <= 225;
      },
      isPending() {
        return this.currentStatus === 'pending';
      },
    },
    methods: {
      async fetchApplicant(id) {
        if (!id) return;
        try {
          const { data } = await axios.get(`http://localhost:4000/api/applicants/pending/${id}`);
          this.formData = data;
          this.updatePreviewImages();
        } catch (err) {
          console.error('Failed to fetch applicant:', err);
        }
      },
      getFileUrl(filename) {
        const baseUrl = 'http://localhost:4000';
        if (typeof filename === 'string' && filename) {
          return `${baseUrl}/uploads/${filename.replace(/^Documents\//, '')}`;
        }
        return '';
      },
      updatePreviewImages() {
        this.previewImages = this.fileKeys
          .filter(key => this.formData[key])
          .map(key => this.getFileUrl(this.formData[key]));
      },
      openLightbox(index) {
        this.previewIndex = index;
        this.previewVisible = true;
      },
      closeModal() {
        this.$emit('close');
      },
      async submitModal() {
        if (!this.applicantId || !this.allChecked) return;
        try {
          let res;
          if (this.modalActionType === 'approve') {
            res = await axios.post(`http://localhost:4000/api/pending/${this.applicantId}/approve`, {
              is_renewal: this.isRenewal // <-- send to backend
            });
            this.$emit('updateApplication', { id: this.applicantId, status: 'approved' });
            this.toast.info('Applicant approved successfully!');
          } else if (this.modalActionType === 'reject') {
            res = await axios.put(`http://localhost:4000/api/applicants/pending/${this.applicantId}/reject`, {
              reason: this.rejectionReason
            });

            this.$emit('updateApplication', { id: this.applicantId, status: 'rejected' });
            this.toast.info('Applicant rejected successfully!');
          }

          this.$emit('close');
        } catch (error) {
          console.error('❌ Action failed:', error.response?.data || error.message);
          this.toast.error('Failed to process the application.');
        } 
      }
    }
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
  
  .quill-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quill-modal {
  margin-left: 6vw;
  background: white;
  padding: 1.5rem;
  width: 600px;
  max-width: 95%;
  height: 40%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1);
}

.editor-wrapper :deep(.ql-toolbar),
.editor-wrapper :deep(.ql-container) {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
  background-color: #fff;
}

/* Optional: Smooth fade-in animation */
.fade-in {
  animation: fadeInModal 0.3s ease-in-out;
}

@keyframes fadeInModal {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    width: 170%;
    max-width: 800px;
    background: white;
    border-radius: 12px;
    overflow: auto;
    font-family: 'montserrat', sans-serif;
    margin: 50px auto;
    margin-right: 25vw;
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

.rejection-message-box {
  background-color: #ffe6e6;
  border-left: 4px solid #ff3131;
  padding: 1rem;
  margin: 1rem 1.5rem 0;
  border-radius: 8px;
  color: #a60000;
  font-size: 0.95rem;
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
}



</style>
  
  