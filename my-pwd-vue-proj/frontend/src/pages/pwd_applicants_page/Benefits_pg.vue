<template>
    <div class="policy-page">
      <!-- Your header component will be mounted here later -->
      <main class="policy-container">
        <h1 class="policy-title">POLICY STATEMENT</h1>
        
        <div class="privileges">
            PWDs are entitled to the following privileges:
        </div>

        <div class="policy-content">
          <section class="policy-section">
            <h2 class="section-title">Government Health Facilities</h2>
            <p class="section-text">
              A 20% discount on medical, dental, rehabilitation, diagnostic, and laboratory services, 
              including psychological or developmental tests, in accordance with Clinical Practice 
              Guidelines or Hospital Treatment Protocols. Social workers will assess eligibility 
              for free services.
            </p>
          </section>
  
          <section class="policy-section">
            <h2 class="section-title">Private Medical Facilities</h2>
            <p class="section-text">
              A 20% discount on medical, dental, rehabilitation, occupational, physical, and speech 
              therapy services, as well as diagnostic and laboratory fees, including professional fees.
            </p>
          </section>
  
          <section class="policy-section">
            <h2 class="section-title">Exclusions</h2>
            <p class="section-text">
              Non-medically necessary procedures, such as cosmetic surgeries and executive check-ups, 
              are not covered. However, the 20% discount applies to special reagents, dyes, contrast 
              media, and radioactive isotopes used in tests.
            </p>
          </section>
  
          <section class="policy-section">
            <h2 class="section-title">Medicines</h2>
            <p class="section-text">
              A 20% discount on branded and generic medicines from licensed pharmacies for the 
              exclusive use of PWDs.
            </p>
          </section>
  
          <section class="policy-section">
            <h2 class="section-title">PhilHealth Privileges</h2>
            <p class="section-text">
              PWDs are encouraged to enroll in PhilHealth, either through government sponsorship 
              or voluntary membership, ensuring access to coverage in line with PhilHealth policies.
            </p>
          </section>
  
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PolicyStatement'
  }
  </script>
  
  <style scoped>
  .policy-page {
    font-family: 'Segoe UI', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 80px; /* Space for your header */
  }
  
  .policy-container {
    padding: 2rem;
  }
  
  .policy-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .policy-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .policy-section {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 0.5rem;
  }
  
  .section-text {
    font-size: 1rem;
    line-height: 1.6;
    text-align: justify;
    color: #4a4a4a;
  }
  
  .privileges {
    font-size: 1.5rem;
    font-weight: 600;
    font-style: italic;
    color: #ff3131;
    margin-top: 2rem;
    margin-bottom: 4rem;
    padding-top: 1rem;
    border-top: 2px solid #eee;
    text-align: center;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .policy-page {
      padding-top: 60px;
    }
    
    .policy-container {
      padding: 1rem;
    }
    
    .policy-title {
      font-size: 1.5rem;
    }
    
    .section-title {
      font-size: 1.1rem;
    }
  }
  </style>