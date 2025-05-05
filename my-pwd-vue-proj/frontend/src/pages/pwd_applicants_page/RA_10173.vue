<template>
    <div class="ra-container">
      <!-- Gradient Overlay with 50% opacity -->
      <div class="gradient-overlay"></div>
  
      <!-- Icon behind text -->
      <img :src="getIconUrl('PWD-icon.png')" alt="PWD Icon" class="center-icon" />
  
      <!-- Text content above everything -->
      <div class="content-wrapper">
        <h1>Republic Act No. 10173</h1>
        <h2>Data Privacy Act of 2012</h2>
  
        <div class="privacy-body">
          <p>
            In accordance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012 (DPA), our website is committed to safeguarding your personal data and upholding your rights to privacy. This Act mandates that any government or private institution collecting and processing personal information must do so in a lawful, fair, and transparent manner. As a PWD ID application platform, we collect and process personal data solely for legitimate government purposes—to validate applications, assess eligibility, and issue PWD Identification Cards to qualified individuals in accordance with national policies and local government mandates.
          </p>
          <p>
            The data we collect includes your full name, sex, age, birthdate, contact number, home address, guardian information, civil and employment status, types of disability, and relevant supporting documents such as identification photos and certificates. These details are used to ensure the integrity and legitimacy of each application. The collection of such data is strictly limited to what is necessary and relevant for the processing of your application. We do not collect sensitive or personally identifiable information beyond what is outlined in the requirements of the application process.
          </p>
          <p>
            Your personal information will be processed with the highest level of confidentiality and will only be accessed by authorized personnel. We do not sell, share, or disclose your information to any third parties without your explicit consent, except when such disclosure is required or authorized by law. Any transfer of your data to other government entities (e.g., social welfare or local offices) will be conducted in compliance with the DPA and solely for the purpose of service delivery and verification.
          </p>
          <p>
            Under the Data Privacy Act, you have the right to access, correct, and update your personal data. You may also request the removal or blocking of information that is outdated, inaccurate, or unnecessary. You are entitled to be informed about how your data is being used and have the option to withdraw your consent at any time, subject to applicable laws and policies. Should you wish to exercise any of these rights or inquire about your data, you may contact our Data Protection Officer at <strong>pwd-dpo@example.gov.ph</strong>.
          </p>
          <p>
            To protect your information, we employ industry-standard security measures, including SSL encryption, firewalls, secure servers, access logs, and limited user access based on role. These technologies and procedures are designed to minimize the risks of data breaches, unauthorized access, or unlawful disclosure. By continuing to use this platform, you affirm your understanding of our privacy practices and your consent to the collection and processing of your data as described in this policy. Your privacy matters to us, and we remain fully committed to protecting it throughout your application journey.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      getIconUrl(fileName) {
        return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
      }
    }
  };
  </script>
  
  <style scoped>
  .ra-container {
    position: relative;
    width: 100%;
    height: auto;
    font-family: 'Segoe UI', sans-serif;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Masked overlay with 50% transparency */
  .gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #139402, rgb(10, 77, 21));
    opacity: 0.5;
    z-index: 1;
  }
  
  /* Icon positioned behind text */
  .center-icon {
    position: absolute;
    top: 50%;
    left: 49%;
    transform: translate(-50%, -50%);
    z-index: 0;

  }
  
  /* Content wrapper on top of everything */
  .content-wrapper {
    position: relative;
    z-index: 2;
    max-width: 80%;
    padding: 40px;
    color: white;
    text-align: center;
  }
  
  h1 {
    font-size: 2.8rem;
    margin-bottom: 0.5rem;
    margin-top: 8.5rem;
  }
  
  h2 {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }
  
  .privacy-body {
    text-align: justify;
    font-size: 1.4rem;
    line-height: 1.9;
  }
  </style>
  