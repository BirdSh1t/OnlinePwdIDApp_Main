<template>
    <div class="page-container">
      <div class="content-container">
        <h1 class="section-title">GET TO KNOW THE PEOPLE IN CHARGE</h1>
  
        <!-- Row 1 -->
        <div class="person-row">
          <img :src="getImageUrl('get-to-know-us_sample2_bong.png')" alt="Bong" class="person-image" />
          <div class="person-info">
            <div class="grid-top-left">
              <p class="person-name">Bong GoGoGo!!!</p>
              <p class="person-role">(Kagawad)</p>
            </div>
            <div class="grid-top-right"></div>
            <div class="grid-bottom-left">
              <p class="person-email">BungGu@spist.edu.ph</p>
              <p class="person-email-label">Email Address</p>
            </div>
            <div class="grid-bottom-right">
              <p class="person-contact">0953-768-1234</p>
              <p class="person-contact-label">Cellphone#</p>
            </div>
          </div>
        </div>
        <hr class="divider" />
  
        <!-- Row 2 -->
        <div class="person-row">
          <img :src="getImageUrl('get-to-know-us_sample1_leni.png')" alt="Leni" class="person-image" />
          <div class="person-info">
            <div class="grid-top-left">
              <p class="person-name">Leni Robredo</p>
              <p class="person-role">(Punong Kagawad)</p>
            </div>
            <div class="grid-top-right"></div>
            <div class="grid-bottom-left">
              <p class="person-email">Leniiii@spist.edu.ph</p>
              <p class="person-email-label">Email Address</p>
            </div>
            <div class="grid-bottom-right">
              <p class="person-contact">0961-366-7132</p>
              <p class="person-contact-label">Cellphone#</p>
            </div>
          </div>
        </div>
        <hr class="divider" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      getImageUrl(fileName) {
        return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
      }
    }
  };
  </script>
  
  <style scoped>
  .page-container {
    padding-top: 10vh;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .content-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 10vh;
  }
  
  .section-title {
    font-weight: bold;
    font-size: 2.8vw;
    margin-bottom: 7vh;
    margin-top: 10vh;
  }
  
  .person-row {
    display: flex;
    gap: 3vw;
    align-items: center;
    margin-bottom: 3vh;
  }
  
  .person-image {
    width: 20vw;
    aspect-ratio: 1 / 0.9;
    object-fit: contain;
  }
  
  .person-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.1vh 1vw;
    width: 100%;
    font-size: 1.3vw;
  }
  
  .grid-top-left,
  .grid-top-right,
  .grid-bottom-left,
  .grid-bottom-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .person-name {
    font-weight: bold;
    margin-bottom: 2.5vh;
  }
  
  .person-role {
    color: #a6a6a6;
    margin-top: -0.5vh;
    font-size: 1.1vw;
  }
  
  .person-email-label,
  .person-contact-label {
    color: #a6a6a6;
    font-size: 1.1vw;
    margin-bottom: 1vh;
  }

  .person-email,
  .person-email-label{
    margin-bottom: 0vh;
  }

  .person-contact,
  .person-contact-label{
    margin-bottom: 0vh;
  }

  .person-email,
  .person-contact {
   margin-top: 0; /* remove top margin */
 }

  .person-email {
    color: black;
  }
  
  .person-contact {
    color: #000000;
  }
  
  .divider {
    border: none;
    border-top: 3px solid #d9d9d9;
    margin: 2vh 0;
  }
  </style>
  