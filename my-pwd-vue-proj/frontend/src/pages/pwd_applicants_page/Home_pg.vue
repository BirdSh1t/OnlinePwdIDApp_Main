<template>
  <div class="home-container">
    <!-- ✅ Background Image -->
    <img :src="getImageUrl('LasPiñasHomepg_bg.png')" alt="Home Background" class="home-bg" />

    <!-- ✅ City Mayor Section -->
    <div class="city_mayor-container">
      <!-- ✅ City Mayor Image -->
      <img :src="getImageUrl('City_Mayor.png')" alt="City Mayor" class="mayor-image" />

      <!-- ✅ Mission, Vision, Get to Know Us Section -->
      <div class="info-cards">
        <!-- ✅ Mission Card -->
        <div class="info-card mission" @mouseover="expandCard('mission')" @mouseleave="resetCard">
          <img :src="getImageUrl('our-mission.png')" alt="Mission Image" class="info-image" />
          <div class="overlay"></div>
          <div class="info-text">
            <h2>OUR MISSION</h2>
            <p>Our mission is to provide the residents of Las Piñas City with a seamless, efficient, and user-friendly online appointment scheduling system. We aim to bridge the gap between the community and essential services by enabling hassle-free bookings, reducing wait times, and promoting digital accessibility for government offices, healthcare providers, and businesses.</p>
          </div>
        </div>

        <!-- ✅ Vision Card -->
        <div class="info-card vision" @mouseover="expandCard('vision')" @mouseleave="resetCard">
          <img :src="getImageUrl('our-vision.png')" alt="Vision Image" class="info-image" />
          <div class="overlay"></div>
          <div class="info-text">
            <h2>OUR VISION</h2>
            <p>Our vision is to make Las Piñas City more inclusive by ensuring PWDs and all residents can easily access essential services through a seamless online appointment system. We strive for a city where convenience, efficiency, and equal opportunities are available to everyone.</p>
          </div>
        </div>

        <!-- ✅ Get to Know Us Card -->
        <div class="info-card get-to-know" @mouseover="expandCard('get-to-know')" @mouseleave="resetCard">
          <img :src="getImageUrl('get-to-know-us.png')" alt="Get to Know Us Image" class="info-image" />
          <div class="overlay"></div>
          <div class="info-text">
            <h2>GET TO KNOW US</h2>
            <p>Key officials and contact information</p>
            <button class="view-button">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'; // ✅ Ensure the path is correct

export default {
  components: {
    Header, // ✅ Register the component
    
  },
  methods: {
    getImageUrl(fileName) {
      return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
    },
    expandCard(card) {
      document.querySelector(`.${card}`).classList.add('expanded');
    },
    resetCard() {
      document.querySelectorAll('.info-card').forEach(card => card.classList.remove('expanded'));
    }
  },
  mounted() {
    console.log("✅ Home_pg.vue has been loaded!");
  }
};
</script>

<style scoped>
/* ✅ Ensure the container fits properly */
.home-container {
  max-width: 100%;
  min-height: 100vh; 
  overflow: auto; /* ✅ Enables scrolling */
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100vh; /* ✅ Ensures it takes full height */
  align-items: center;
  position: relative; /* ✅ Ensures proper layering */
}

/* Style the Background Image */
.home-bg {
  position: absolute; /* ✅ Ensures it's behind other content */
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
 /* Ensures the image covers the entire area */
}

/* City Mayor Section */
.city_mayor-container {
  position: relative; /* ✅ Ensures proper layering */
  margin-top: 388px;
  display: flex;
  flex-wrap: wrap; 
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  background: linear-gradient(90deg, #ffffff, #00a642);
  margin-bottom: 10px;
}

/* ✅ City Mayor Image */
.mayor-image {
  width: 300px;
  height: auto;
  margin-right: 40px;
  position: absolute;
  padding-right: 1180px;
}

/* ✅ Info Cards Container */
.info-cards {
  display: flex;
  flex-wrap: wrap; /* ✅ Allows cards to stack on smaller screens */
  gap: 20px;
  justify-content: center;
  width: 100%;
  margin-left: 400px
}

/* ✅ Info Card Styling */
.info-card {
  position: relative;
  width: 250px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

/* ✅ Background Image for Each Card */
.info-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ✅ Dark Transparent Overlay */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
}

/* ✅ Text Overlay */
.info-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  width: 80%;
}

.info-text h2 {
  font-size: 22px;
  font-weight: bold;
}

.info-text p {
  font-size: 10px;
  margin-top: 10px;
  font-style: montserrat, sans serif;
  font-weight: 400;
}

/* ✅ View Button */
.view-button {
  margin-top: 15px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background 0.3s;
}

.view-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* ✅ Hover Effect to Enlarge the Card */
.info-card.expanded {
  transform: scale(1.9);
  z-index: 10;
}
</style>
