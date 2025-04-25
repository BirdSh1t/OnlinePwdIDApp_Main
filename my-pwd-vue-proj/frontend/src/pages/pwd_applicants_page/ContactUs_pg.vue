<template>
  <Header class="NavBar" />
  <div class="contact-container">
    <div class="image-section">
      <img 
        :src="getImageUrl('LasPinasHomePg_Latest.png')" 
        alt="Las Pinas Background" 
        class="background-image"
      />
      <div class="contact-content">
        <h1>CONTACT US</h1>
        <p class="location-title">Alabang-Zapote Rd., Las Pinas City NCR Philippines</p>
      </div>
    </div>

    <div class="info-section">
      <img :src="getIconUrl('PWD-icon.png')" alt="PWD Icon" class="pwd-icon" />
      <div class="info-text">
        <p>Alabang-Zapote Rd., Las Pinas<br />City NCR Philippines</p>
        <p><strong>LasPiñasCityPWDid@gmail.com</strong></p>
        <p>Monday-Friday | 8am - 5pm</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';

const getIconUrl = (fileName) => {
  return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
};

const getImageUrl = (fileName) => {
  return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
};
</script>

<style scoped>
.contact-container {
  margin-top: 9.5vh;
  font-family: 'montserrat', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.image-section {
  position: relative;
  width: 100%;
  min-height: 50vh;
  overflow: hidden;
  margin: 0; 
  padding: 0;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top; /* Focus on top portion of image */
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  display: block; 
}

/* For screens wider than the image's aspect ratio */
@media (min-aspect-ratio: 21/9) { /* Adjust this ratio to match your image */
  .background-image {
    width: auto;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
}

.image-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(115, 115, 115, 0.5);
  z-index: 0;
}

.contact-content {
  position: relative;
  z-index: 1;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-content h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.contact-content .location-title {
  font-size: clamp(1rem, 2vw, 1.25rem);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.info-section {
  background-color: white;
  padding: 2rem;
  text-align: center;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.pwd-icon {
  width: 70px;
  margin-bottom: 1rem;
}

.info-text p {
  font-size: 1.1rem;
  margin: 0.25rem 0;
  color: black;
  margin-bottom: 1.3vh;
}
</style>