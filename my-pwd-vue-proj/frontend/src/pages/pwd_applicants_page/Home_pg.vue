<template>
  <div class="home-bg-container">
    <!-- Background Image -->
    <Header class="NavBar" />
    <img :src="getImageUrl('LasPinasHomePg_Latest.png')" alt="Home Background" class="home-bg" />
    <!-- Sub Container for Grids -->
    <div class="content-wrapper">
      <!-- Grid Layout (4 Items) -->
      <div class="grid-layout">
      
        <div class="grid-item">
          <img :src="getImageUrl('City_Mayor.png')" alt="City Mayor" class="responsive-image" />
        </div>
        <div class="grid-item info-card mission" @mouseover="expandCard('mission')" @mouseleave="resetCard">
          <img :src="getImageUrl('our-mission.png')" alt="Mission" class="info-image" />
          <div class="overlay"></div>
          <div class="info-text">
            <h2 class="mission-header">OUR MISSION</h2>
            <p class="mission-paragraph">
              Our mission is to provide the residents of Las Piñas City with a seamless, efficient, and
              user-friendly online appointment scheduling system. We aim to bridge the gap between
              the community and essential services by enabling hassle-free bookings, reducing wait times,
              and promoting digital accessibility for government offices, healthcare providers, and businesses.
            </p>
          </div>
        </div>
        <div class="grid-item info-card vision" @mouseover="expandCard('vision')" @mouseleave="resetCard">
          <img :src="getImageUrl('our-vision.png')" alt="Vision" class="info-image" />
          <div class="overlay"></div>
          <div class="info-text">
            <h2 class="vision-header">OUR VISION</h2>
            <p class="vision-paragraph">
              Our vision is to make Las Piñas City more inclusive by ensuring PWDs and all residents can
              easily access essential services through a seamless online appointment system.
              We strive for a city where convenience, efficiency, and equal opportunities are available to everyone.
            </p>
          </div>
        </div>
        <div class="grid-item info-card get-to-know" @mouseover="expandCard('get-to-know')" @mouseleave="resetCard">
          <img :src="getImageUrl('get-to-know-us.png')" alt="Get to Know Us" class="info-image" />
          <div class="overlay"></div>
          <div class="info-text">
            <h2 class="get-to-know-header">GET TO KNOW US</h2>
            <p class="get-to-know-paragraph">Key officials and contact information</p>
            <button class="view-button">View</button>
          </div>
        </div>
      </div>

      <!-- Mask Overlay -->
      <div class="mask-overlay"></div>

      <!-- Secondary Section with Mask and Text -->
      <h1 class="second-image-header">
          Equal Voices, Equal Choices: PWD Support Initiative
      </h1>
      <div class="secondary-section">
        <div class="image-mask-wrapper">
          <img :src="getImageUrl('givingFinancialAidTopwd.png')" alt="Aid to PWD" class="aid-background" />
          <div class="image-mask"></div>
          <img :src="getImageUrl('ermatNicityMayor.png')" alt="Mayor" class="overlay-mayor" />
          <div class="aid-text">
            <h2>SUPPORT, CARE, AND OPPORTUNITIES FOR PWDS!</h2>
            <p>
              We are committed to supporting PWDs with essential benefits and services.
              Apply for your PWD ID today and access the help you deserve!"
            </p>
          </div>
        </div>
      </div>

      <!-- Third Section: PWD Benefits -->
      <h1 class="third-image-header">
        Unlocking PWD Privileges: Learn About Your Discounts and Benefits Today
      </h1>
      <div class="third-section">
        <div class="benefits-container">
          <!-- Left Box with Masked Image -->
          <div class="benefits-left">
            <img :src="getImageUrl('pwd-benifits.jpg')" class="background-image" />
            <div class="image-mask">
              <p class="benefits-text">
                PWDs in the Philippines enjoy certain discounts and privileges under RA 10754
              </p>
              <button class="view-btn">View</button>
            </div>
          </div>

          <!-- Right Logos -->
          <div class="benefits-right">
            <img :src="getImageUrl('DOH_PH_logo.png')" class="logo" alt="DOH Logo" />
            <img :src="getImageUrl('dswd-logo.png')" class="logo-dswd" alt="DSWD Logo" />
            <img :src="getImageUrl('ncda-logo.png')" class="logo" alt="NCDA Logo" />
          </div>
        </div>
      </div>

      <!-- Fourth Section: Application Process -->
      <div class="fourth-section">
        <div class="fourth-section-bg">
          <img :src="getImageUrl('pwd_applicants_bg.png')" alt="PWD Applicants" class="fourth-background" />
          <div class="dark-mask"></div>
        </div>

        <div class="card-wrapper">
          <!-- How to Apply Card -->
          <div class="info-card-section">
            <div class="card-header">HOW TO APPLY?</div>
            <p class="card-text">CLICK HERE TO VIEW REQUIREMENTS</p>
            <img :src="getIconUrl('how-to-apply-icon.png')" alt="How to Apply" class="card-icon-HowToApp" />
          </div>

          <!-- Apply Now Card -->
          <div class="info-card-section">
            <div class="card-header">APPLY NOW</div>
            <router-link to="/pwd/applications" class="card-text-link">
              <p class="card-text">CLICK HERE TO APPLY</p>
            </router-link>
            <img :src="getIconUrl('apply-now-icon.png')" alt="Apply Now" class="card-icon-AppNow" />
          </div>

          <!-- Renew Now Card -->
          <div class="info-card-section">
            <div class="card-header">RENEW NOW</div>
            <p class="card-text">CLICK HERE TO RENEW</p>
            <img :src="getIconUrl('renew-here-icon.png')" alt="Renew" class="card-icon-RenewNow" />
          </div>
        </div>
       
      </div>
    </div>
  </div>
</template>


<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
  },
  data() {
    return {
      // Data properties can be added here if needed
    };
  },
  methods: {
    getImageUrl(fileName) {
      return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
    },
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
    expandCard(card) {
    document.querySelector('.mask-overlay').classList.add('active');
    document.querySelector(`.${card}`).classList.add('expanded');
    },
    resetCard() {
    document.querySelectorAll('.info-card').forEach(card => card.classList.remove('expanded'));
    document.querySelector('.mask-overlay').classList.remove('active');
    }
  },
  mounted() {
    console.log("✅ Home_pg.vue has been loaded!");
  }
};
</script>

<style scoped>
/* ✅ Main Container */
.home-bg-container {
  
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  background-color: #F9FAFA;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: clamp(45px, 4.4vh, 80px); /* Responsive top margin */
  padding: clamp(20px, 5vh, 40px) clamp(0px, 0vw, 40px); /* Responsive padding */
}

/* ✅ Background Image */
.home-bg {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 12vh;
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

/* ✅ Sub-Container */
.content-wrapper {
  position: relative;
  width: 80vw;
  padding: 4vh 0;
}

/* ✅ Grid Layout */
.grid-layout {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap; /* ✅ Prevent stacking */
  width: 100%;
  margin-bottom: 4rem;
}

.grid-item {
  flex: 1 1 auto; /* Let it grow but not shrink below content */
  max-width: 580px;
  width: 10vw;
  height: auto;
  margin-right: 1.5rem; /* consistent gap, matches original */
}

.grid-item:last-child {
  margin-right: 0; /* remove extra margin at the end */
}

/* ✅ Responsive Images */
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  -webkit-mask-image: 
    linear-gradient(to bottom, black 80%, transparent 100%),
    linear-gradient(to left, black 80%, transparent 100%);
  mask-image: 
    linear-gradient(to bottom, black 80%, transparent 100%),
    linear-gradient(to left, black 80%, transparent 100%);
  
  /* Required for multiple masks to work together */
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

/* ✅ Info Card Styling */
.info-card {
  position: relative;
  overflow: hidden;
  border-radius: 2vw;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

/* Header */
.NavBar{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.info-text {
  position: absolute;
  bottom: 0.6vh;
  left: 2vw;
  right: 2vw;
  color: white;
  text-align: justify;
  z-index: 1;
  font-family: 'barlow', sans-serif;
  width: calc(100% - 4vw);
  box-sizing: border-box;
}

.info-text h2 {
  font-size: 1.8vw;
  line-height: 1.4;
}

.info-text p {
  font-size: 0.9vw;
  line-height: 1.2;
}

/* ✅ Text Block Styling */
.mission-header
 {
  font-size: 1vw;
  margin-bottom: 1vh;
  color: #ffffff;
}

.vision-header{
  font-size: 1vw;
  margin-bottom: 1vh;
  color: #ffffff;
}

.get-to-know-header{
  font-size: 1vw;
  margin-bottom: 1vh;
  color: #ffffff;
}

.mission-paragraph {
  font-size: 1.1vw;
  line-height: 1.4;
  color: #ffffff;
  margin-bottom: 5vh;
}

.vision-paragraph {
  font-size: 1.1vw;
  line-height: 1.4;
  color: #ffffff;
  margin-bottom: 11.3vh;
}

.get-to-know-paragraph {
  font-size: 1.1vw;
  line-height: 1.4;
  color: #ffffff;
  margin-bottom: 25.8vh;
}

/* ✅ View Button */
.view-button {
  position: absolute;
  bottom: 2vh;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.4);
  color: white;
  border: none;
  padding: 1vh 2vw;
  font-size: 1.2vw;
  border-radius: 1vw;
  cursor: pointer;
  z-index: 3;
}

/* ✅ Secondary Section */
.secondary-section {
  border-radius: 2vw;
  margin-top: clamp(1rem, 3vw, 2rem);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.second-image-header{
  position: relative;
  text-align: left;
  font-family: barlow;
  font-size: 4.5vh;
  color: rgb(14, 175, 14);
}

.image-mask-wrapper {
  position: relative;
  width: 100%;
  height: auto;
}

.aid-background {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.image-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.58) 5%, rgba(0, 0, 0, 0.7));
  z-index: 1;
}

.overlay-mayor {
  position: absolute;
  left: 0vw;
  bottom: 1vh;
  width: min(20vw, 840px);
  height: auto;
  z-index: 2;
  transform: scaleX(-1);
  object-fit: contain;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5));
  transition: transform 0.3s ease;
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

/* ✅ Aid Text */
.aid-text {
  position: absolute;
  top: 6vh;
  right: 5vw;
  width: 40vw;
  z-index: 3;
  color: white;
  text-align: right;
  font-family: barlow;
}

.aid-text h2 {
  font-size: 2.5vw;
  margin-bottom: 2vh;
  margin-top: 0vh;
}

.aid-text p {
  font-size: 1.4vw;
  line-height: 1.5;
  margin-bottom: 10vh;
}

/* ✅Third section */
.third-section {
  margin-top: clamp(1rem, 2vw, 10rem);
  width: 100%;
  background: linear-gradient(90deg, white, #00a642);
  display: flex;
  justify-content: center;
  padding: 5vh 0;
  border-radius: 2vw;
  -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  mask-image: linear-gradient(to left, black 90%, transparent 100%);
}

.third-image-header{
  margin-top: 5vw;
  position: relative;
  text-align: left;
  font-family: barlow;
  font-size: 4.5vh;

  color: rgb(14, 175, 14);
}

.benefits-container {
  display: flex;
  justify-content: space-between;
  width: 90%;
  max-width: 1200px;
  flex-wrap: wrap;
  gap: 2vw;
}

.benefits-left {
  position: relative;
  flex: 1 1 55%;
  min-width: 300px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 10px;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* Black with 50% transparency */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 2vw;
}

.benefits-text {
  color: white;
  font-size: clamp(16px, 2vw, 34px); /* Responsive font scaling with limits */
  text-align: left;
  font-family: 'Barlow', sans-serif;
  font-weight: 700;
  margin: 0;
  position: absolute;
  left: 5%; /* Percentage-based positioning */
  top: 6%;
  width: 90%; /* Constrains text width relative to container */
  line-height: 1.4;
  padding: 1.5%; /* Relative padding */
  box-sizing: border-box; /* Includes padding in width calculation */
}

.view-btn {
  background-color: rgba(255, 255, 255, 0.35);
  color: white;
  font-family: 'Barlow', sans-serif;
  padding: clamp(8px, 1vh, 16px) clamp(12px, 2vw, 24px); /* Responsive padding */
  position: absolute;
  left: 50%; /* Center horizontally */
  bottom: 15%; /* Position from bottom of container */
  transform: translateX(-50%); /* Precise horizontal centering */
  border: none;
  border-radius: clamp(10px, 2vw, 20px); 
  font-size: clamp(14px, 1.2vw, 18px); 
  cursor: pointer;
  white-space: nowrap; 
  z-index: 2; 
}

.benefits-right {
  flex: 1 1 40%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2vh;
  min-width: 200px;
}

.logo {
  width: auto; /* Allow natural width */
  height: auto; 
  max-height: 150px; 
  min-width: 80px; 
  flex: 0 0 auto; 
}

.logo-dswd{
  width: auto; 
  height: auto; 
  max-height: 187px; 
  min-width: 100px; 
  flex: 0 0 auto; /* Prevent flex shrinking/growing */
}

/* ✅Fourth section */

.fourth-section {
  position: relative;
  width: 100%;
  margin-top: 10vh;
  margin-bottom: 20vh;
}

.fourth-section-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  border-radius: 2vw;
}

.fourth-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dark-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.5;
  z-index: 1;
}

/* Card Container */
.card-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 3rem 1rem;
  z-index: 2;
}

/* Individual Cards */
.info-card-section {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 2rem 1.5rem;
  max-width: 20vw;       
  min-width: 150px;       
  width: 15vw;            
  height: 40vh;           
  min-height: 200px;     
  padding: 2vh 1.5vw;     
  border-radius: 2.5vw;
}

.card-header {
  background-color: #066aff;
  color: white;
  padding: 0.8rem;
  border-radius: 0.5rem;
  font-family: 'Barlow', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  margin-top: 1.5rem;
  text-transform: uppercase;
}

.card-text {
  font-family: 'Barlow', sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  text-decoration: underline; /* Adds default underline */
  color: #000;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.card-icon-HowToApp {
  width: 7vw;
  height: auto;
  margin-top: 0.5rem;
}

.card-icon-AppNow {
  width: 6vw;
  height: auto;
  margin-top: 2.5rem;
}

.card-icon-RenewNow {
  width: 8vw;
  height: auto;
  margin-top: 1.8rem;
}


/* ✅ Mobile Media Queries */
@media (max-width: 768px) {
  .aid-text {
    width: 90vw;
    top: 10vh;
    left: 5vw;
    right: auto;
    text-align: left;
  }

  .overlay-mayor {
    position: relative;
    margin: 2vh auto;
    display: block;
    left: auto;
  }

  .info-text h2 {
    font-size: 5vw;
  }

  .info-text p {
    font-size: 3.5vw;
  }

  .view-button {
    font-size: 3vw;
    padding: 1vh 4vw;
  }
}

/* ✅ Expanded Card Styling */
.info-card.expanded {
  transform: scale(1.4);
  z-index: 3;
  box-shadow: 0 1vh 3vh rgba(0, 0, 0, 0.3);
}

.info-card.expanded .info-text {
  bottom: 3vh;
}

/* ✅ Mask Overlay */
.mask-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: none;
}

.mask-overlay.active {
  display: block;
}

.card-text-link {
  text-decoration: none;
}

.card-text-link .card-text {
  color: #000;
  transition: color 0.3s ease;
}

.card-text-link .card-text:hover {
  color: #066aff;
  cursor: pointer;
}

</style>
