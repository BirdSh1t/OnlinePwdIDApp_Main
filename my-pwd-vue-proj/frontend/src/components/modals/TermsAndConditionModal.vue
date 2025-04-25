<template>
    <div class="terms-modal">
      <div class="modal-header">
        <h1>TERMS AND CONDITIONS</h1>
        <h2>For Online PWD ID Application</h2>
      </div>
  
      <div class="modal-content" @scroll="handleScroll" ref="content">

      <div class="modal-content">
        <div class="terms-content">
          <section>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using this website (the "Service") to apply for a PWD ID, you agree to comply with these Terms and Conditions. If you do not agree, please refrain from using this service.</p>
          </section>
  
          <section>
            <h3>2. Eligibility</h3>
            <p>Applicants must be Filipino citizens or qualified foreign residents with proper documentation.</p>
            <p>Only individuals with a verified disability (as defined by RA 10754 and relevant laws) may apply.</p>
            <p>Minors must submit applications through a parent or legal guardian.</p>
          </section>
  
          <section>
            <h3>3. Application Process</h3>
            <p>Users must provide accurate and complete information, including:</p>
            <p>Full name, birth date, contact details.</p>
            <p>Proof of disability (medical certificate, barangay certification, etc.)</p>
            <p>Valid government-issued ID</p>
            <p>False information may result in application rejection or legal consequences.</p>
          </section>

          <section>
            <h3>4. Data Privacy and Protection</h3>
            <p>This Service complies with the Data Privacy Act of 2012 (RA 10173).</p>
            <p>Personal data collected will be used only for processing the PWD ID application and related government services.</p>
            <p>Data may be shared with relevant government agencies (e.g., LGU, DSWD, PDAO) for verification and approval.</p>
            <p>Users have the right to access, correct, or request deletion of their data, subject to legal limitations.</p>
          </section>

          <section>
            <h3>5. User Responsibilities</h3>
            <p>Keep login credentials (if applicable) secure.</p>
            <p>Do not misuse the website (e.g., hacking, spamming, fraud).</p>
            <p>Report suspicious activities to the website administrator immediately.</p>
          </section>

          <section>
            <h3>6. Limitation of Liability</h3>
            <p>The website and its operators are not liable for:</p>
            <p>Delays caused by incomplete submissions or system errors.</p>
            <p>Minors must submit applications through a parent or legal guardian.</p>
            <p>Technical issues beyond our control (e.g., internet outages).</p>
          </section>
          
          <section>
            <h3>7. Approval and Issuance</h3>
            <p>Submission does not guarantee approval; the concerned LGU or PDAO will evaluate applications</p>
            <p>Approved applicants must claim their PWD ID from the designated office.</p>
          </section>

          <section>
            <h3>8. Amendments</h3>
            <p>These Terms may be updated without prior notice. Continued use constitutes acceptance of changes.</p>
          </section>

          <section>
            <h3>9. Governing Law</h3>
            <p>TThese Terms shall be governed by Philippine laws, particularly RA 10754 (PWD Rights) and RA 10173 (Data Privacy Act).</p>
          </section>

          <section>
            <h3>10. Contact Information</h3>
            <p>For concerns, contact:</p>
            <p><strong>[Alabang-Zapote Rd., Las Pinas
                City NCR Philippines]</strong></p>
            <p>Email: [Burneks@gmail.com]</p>
            <p>Phone: [09483766538]</p>
            <p>Address: [Alabang-Zapote Rd., Las Pinas]</p>
          </section>
        </div>
      </div>
  
      </div>
      <div class="modal-footer">
        <button class="decline-btn" @click="$emit('close')">Decline</button>
            <button 
                class="agree-btn" 
                :disabled="!scrolledToBottom" 
                @click="handleAgree"
            >
                Agree and Continue
            </button>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TermsAndConditionModal', // Fixed: removed space
    data() {
      return {
        scrolledToBottom: false
      }
    },
    methods: {
      emitClose() {
      this.$emit('close');
      },
      emitAgree() {
      this.$emit('agree');
      },
      handleScroll() {
        const content = this.$refs.content;
        if (!content) return; // Safety check
        
        const threshold = 50; // pixels from bottom
        this.scrolledToBottom = 
          content.scrollHeight - content.scrollTop - content.clientHeight <= threshold;
      },
      handleAgree() {
        window.scrollTo({
        top: 0,
        behavior: 'instant'
        });
        this.$emit('agree'); // Emit to parent after scrolling
        }
    },
    mounted() {
      this.handleScroll();
      // Add resize observer in case content changes
      this.resizeObserver = new ResizeObserver(this.handleScroll);
      if (this.$refs.content) {
        this.resizeObserver.observe(this.$refs.content);
      }
    },
    beforeUnmount() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }
  </script>
  
  <style scoped>
  .terms-modal {
    display: flex;
    flex-direction: column;
    height: 70vh;
    max-width: 800px;
    margin: 0 auto;
    margin-top: 4vh;
    background: white;
    border-radius: 0.8rem;
    overflow: hidden;
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', sans-serif; /* Base font */
  }
  
  .modal-header {
    background: #149656;
    color: #f0e616;
    padding: 1.5rem;
    text-align: center;
  }
  
  .modal-header h1 {
    font-family: 'Segoe UI', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .modal-header h2 {
    font-family: 'Segoe UI', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
  }
  
  .modal-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  .terms-content {
    font-family: 'Segoe UI', sans-serif;
    line-height: 1.6;
  }
  
  .terms-content h3 {
    color: #149656;
    font-size: 1.2rem;
    margin: 1.5rem 0 0.5rem;
  }
  
  .terms-content p {
    margin-bottom: 0.8rem;
    text-align: justify;
  }
  
  .modal-footer {
    background: #f8f8f8;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .decline-btn, .agree-btn {
    font-family: 'Barlow', sans-serif;
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
  }
  
  .decline-btn {
    background: #e0e0e0;
    color: #333;
  }
  
  .agree-btn {
    background: #25ae6a;
    color: white;
  }
  
  .agree-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #cccccc;
  color: #666666;
 }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 0.5rem;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 0.1rem;
  }

.terms-content {
  text-align: left; /* Explicitly set alignment */
}

/* For headings */
.terms-content h2 {
  text-align: left;
  margin: 1.5rem 0 0.5rem;
  color: #149656;
  font-size: 1.5rem;
}

/* For paragraphs */
.terms-content p {
  text-align: justify;
  margin-bottom: 1rem;
}

.terms-content {
  font-family: inherit; /* Force Segoe UI inheritance */
  font-size: inherit;
  line-height: inherit;
}


  /* Responsive adjustments */
  @media (max-width: 768px) {
    .terms-modal {
      height: 90vh;
      width: 95vw;
    }
    
    .modal-header h1 {
      font-size: 1.5rem;
    }
    
    .modal-header h2 {
      font-size: 1rem;
    }
    
    .terms-content h3 {
      font-size: 1.1rem;
    }
  }
  </style>