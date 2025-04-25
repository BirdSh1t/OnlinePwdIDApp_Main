<template>
  <div class="requirements-container">
    <!-- Wrapped Image Behind Text -->
    <img :src="getImageUrl('pwd-requirements.png')" class="background-illustration" />

    <h1 class="requirements-header">REQUIREMENTS FOR PWD ID</h1>
    <p class="warning-text">
      ***<span class="highlight">INCOMPLETE REQUIREMENTS</span> for any <span class="highlight">APPLICATION</span> will <span class="highlight">NOT</span> be processed***
    </p>
    <ul class="requirements-list">
      <li>
        <img :src="getIconUrl('check.png')" class="check-icon" />
        LAS PIÑAS BRY. CERTIFICATE for PWD ID application
      </li>
      <li>
        <img :src="getIconUrl('check.png')" class="check-icon" />
        ORIGINAL AND PHOTOCOPY of MEDICAL CERTIFICATE<br />
        from a licensed specialized doctor stating the disability within six (6) months from date of application
      </li>
      <li><img :src="getIconUrl('check.png')" class="check-icon" /> PHOTOCOPY of MARRIAGE CERTIFICATE</li>
      <li><img :src="getIconUrl('check.png')" class="check-icon" /> PHOTOCOPY of BIRTH CERTIFICATE</li>
      <li><img :src="getIconUrl('check.png')" class="check-icon" /> PHOTOCOPY of 2 GOVERNMENT ISSUED IDs with LAS PIÑAS ADDRESS</li>
      <li><img :src="getIconUrl('check.png')" class="check-icon" /> 3 PCS - 1X1 and 2 PCS - 2X2 PHOTO (LATEST/WHITE BACKGROUND)</li>
      <li><img :src="getIconUrl('check.png')" class="check-icon" /> BLOOD TYPE (optional)</li>
      <li><img :src="getIconUrl('check.png')" class="check-icon" /> DULY ACCOMPLISHED FORM</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    getImageUrl(fileName) {
      return new URL(`/src/assets/images/${fileName}`, import.meta.url).href;
    },
    getIconUrl(fileName) {
      return new URL(`/src/assets/icons/${fileName}`, import.meta.url).href;
    },
  },
};
</script>

<style scoped>
.requirements-container {
  font-family: 'Segoe UI', sans-serif;
  padding: 5vw;
  max-width: 120vw;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* Background image that wraps behind text */
.background-illustration {
  position: absolute;
  top: 66%;
  left: 80%;
  transform: translateX(-50%);
  width: 50%;
  z-index: 0;
  pointer-events: none; /* Allow clicks to pass through */
}

.requirements-header,
.warning-text,
.requirements-list {
  position: relative;
  z-index: 1; /* Brings text in front of image */
}

.requirements-header {
  font-size: 2.5vw;
  font-weight: bold;
  margin-bottom: 1.5vh;
  text-align: left;
}

.warning-text {
  font-weight: bold;
  color: #ff3131;
  text-align: left;
  margin-bottom: 3vh;
  font-size: 1.5vw;
}

.warning-text .highlight {
  color: #ff3131;
}

.requirements-list {
  list-style: none;
  padding: 0;
  font-size: 1.4vw;
}

.requirements-list li {
  margin-bottom: 2vh;
  text-align: left;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.check-icon {
  width: 1.5vw;
  height: auto;
  margin-right: 1vw;
  margin-top: 0.4vh;
  flex-shrink: 0;
}
</style>
