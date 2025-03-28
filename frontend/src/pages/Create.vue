<template>
    <div class="page-container">
      
      <DashboardHeader title="Create" />



    </div>
  </template>

<script>
  import DashboardHeader from '@/components/DashboardHeader.vue';

export default {
  components: { DashboardHeader }
};


</script>


  
  <style scoped>
  .page-container {
    overflow: clip;
    display: flex;
    font-family: 'Cooper Hewitt', sans-serif;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 24px;
    font-weight: bold;
    color: #000000;
  }
  </style>
  