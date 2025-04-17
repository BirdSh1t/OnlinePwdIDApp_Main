<template>
  <div class="home-bg-container">
    
    <!-- Background Image -->
    <img :src="getImageUrl('LasPinasHomePg_Latest.png')" alt="Home Background" class="home-bg" />

    <!-- Sub Container for Grids -->
    <div class="content-wrapper">
      
      <!-- Grid Layout (4 Items) -->
      <div class="grid-layout">
      <Header class="NavBar" />

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
    </div>
  </div>
</template>


<script>
import Header from '@/components/Header.vue';

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
  max-width: 100%;
  min-height: 100vh; /* ensures at least full viewport height */
  overflow-y: auto;
  background-color: #F9FAFA;

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 86px;
}

/* ✅ Background Image with fade-out at the bottom */
.home-bg {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 5rem;

  /* Smooth fade-out effect at bottom */
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}


/* ✅ Sub-Container */
.content-wrapper {
  position: relative;
  width: 80%;
  margin: 0 auto;
  padding: 2rem 0;
}

/* ✅ Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 8rem;
}

.grid-item {
  position: relative;
  width: 280px;
  height: auto;
}

.responsive-image {
  width: 100%;
  height: auto;
  object-fit: contain;
    /* Smooth fade-out effect at bottom */
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

/* ✅ Info Card Styling */
.info-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Add smooth transition */
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

.info-text {
  position: absolute;
  bottom: 1rem; /* Position from the bottom */
  left: 1rem; /* Position from the left */
  right: 1rem; /* Ensure it doesn't touch the right edge */
  color: white;
  text-align: justify; /* Align text to justify */
  z-index: 2;
  font-family: 'barlow', sans-serif; /* Set font family to barlow */
  width: calc(100% - 2rem); /* Ensure the container is wide enough for text to wrap */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.info-text h2 {
  font-size: 1.5rem;
  line-height: 1.4;
}

.info-text p {
  font-size: 0.8em;
  line-height: 1.4;
}

/* Individual Header and Paragraph Styling */
.mission-header {
  font-size: 1.4rem;
  margin-bottom: 0.5em;
  color: #ffffff; /* Example color for mission header */
}

.mission-paragraph {
  margin-bottom: 30px;
  font-size: 1rem;
  line-height: 1.4;
  color: #ffffff; /* Example color for mission paragraph */
}

.vision-header {
  font-size: 1.4rem;
  margin-bottom: 0.5em;
  color: #ffffff; /* Example color for vision header */
}

.vision-paragraph {
  font-size: 1rem;
  line-height: 1.4;
  color: #ffffff; /* Example color for vision paragraph */
  margin-bottom: 65px;
}

.get-to-know-header {
  font-size: 1.4rem;
  margin-bottom: 0.5em;
  color: #ffffff; /* Example color for get-to-know header */
}

.get-to-know-paragraph {
  font-size: 1rem;
  line-height: 1.4;
  color: #ffffff; /* Example color for get-to-know paragraph */
  margin-bottom: 172px;
}

.view-button {
  position: absolute; /* Position the button absolutely within its container */
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%); 
  background-color: rgba(255, 255, 255, 0.3); 
  color: rgb(255, 255, 255);
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1em;
  border-radius: 0.5em;
  cursor: pointer;
  z-index: 3; /* Ensure the button is above other elements */
}

/* ✅ Secondary Section */
.secondary-section {
  border-radius: 1rem;
  margin-top: clamp(1rem, 3vw, 2rem); /* Min: 1rem, Ideal: 3vw, Max: 2rem */
    /* Smooth fade-out effect at bottom */
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
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
  background: linear-gradient(
    90deg, 
    rgba(255, 255, 255, 0.58) 5%,  /* White with 58% opacity */
    rgba(0, 0, 0, 0.7)            /* Black with 70% opacity (unchanged) */
  );
  z-index: 1;
}

.overlay-mayor {
  position: absolute;
  left: 0.0vw; /* Adjust as needed */
  bottom: 0.1vh;
  width: min(20vw, 840px);
  height: auto; 
  z-index: 2;
  transform: scaleX(-1); 
  -webkit-transform: scaleX(-1); 
  object-fit: contain;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5)); /* Optional shadow for depth */
  transition: transform 0.3s ease; 

  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.aid-text {
  position: absolute;
  top: 20%;
  right: 5%;
  width: 40%;
  z-index: 3;
  color: white;
  text-align: right;
  font-family: barlow;
}

.aid-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.aid-text p {
  font-size: 1.2rem;
  line-height: 1.5;
  font-family: barlow;
}

/* ✅ Responsive Text */
@media (max-width: 768px) {
  .aid-text {
    width: 90%;
    top: 10%;
    left: 5%;
    right: auto;
    text-align: left;
  }

  .overlay-mayor {
    position: relative;
    margin: 1rem auto;
    display: block;
    left: auto;
  }
}

/* Expanded Card Styling with Transition */
.info-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Add smooth transition */
  position: relative; /* Ensure the card is positioned relative */
}

.info-card.expanded {
  transform: scale(1.4);
  z-index: 3; /* Bring the card to the front */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Add a shadow for depth */
}

.info-card.expanded .info-text {
  bottom: 2rem; /* Adjust text position when expanded */
}

/* Mask Overlay */
.mask-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  z-index: 2; /* Ensure it appears behind the expanded card */
  display: none; /* Hidden by default */
}

.mask-overlay.active {
  display: block; /* Show the overlay when active */
}


</style>