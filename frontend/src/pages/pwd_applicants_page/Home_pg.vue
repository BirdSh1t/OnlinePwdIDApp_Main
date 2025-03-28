<template>
  <div class="home-container">
    <Header />
    <h1>Welcome to PWD Applicants Home Page</h1>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'; // ✅ Ensure the path is correct

export default {
  components: {
    Header, // ✅ Register the component
  },
};
</script>

<style scoped>
/* ✅ Ensure the container doesn't stretch unexpectedly */
.home-container {
  max-width: 100%;
  overflow: hidden;
  text-align: center;
}



</style>
