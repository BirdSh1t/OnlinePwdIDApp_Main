<template>
  <div class="calendar-container">
    <!-- Dashboard Header -->
    <DashboardHeader title="Calendar" />

    <!-- Scheduled Appointments Section -->
    <div class="appointments-container">
      
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Type Of Disability</th>
              <th>Time and Date For Pick-up</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
              <td>{{ appointment.name }}</td>
              <td>{{ appointment.gender }}</td>
              <td>{{ appointment.age }}</td>
              <td>{{ appointment.disability }}</td>
              <td>{{ appointment.pickup }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader.vue';

export default {
  components: { DashboardHeader },
  data() {
    return {
      appointments: [
        { id: 1, name: "Kristell Uchinigga", gender: "Female", age: 15, disability: "Autism", pickup: "March 10, 2025 – 9:00 AM" },
        { id: 2, name: "Bernie Bernardo", gender: "Male", age: 17, disability: "Visual Impairment", pickup: "March 15, 2025 – 11:30 AM" },
        { id: 3, name: "Jayda McKinney", gender: "Female", age: 20, disability: "Mobility", pickup: "April 5, 2025 – 3:00 PM" },
        { id: 4, name: "Alexa Peters", gender: "Female", age: 16, disability: "Impairment", pickup: "April 7, 2025 – 12:00 PM" },
        { id: 5, name: "Kobe Fleming", gender: "Male", age: 22, disability: "Hearing Impairment", pickup: "May 11, 2025 – 9:30 AM" },
        { id: 6, name: "Reagan Xiong", gender: "Male", age: 24, disability: "Epilepsy", pickup: "May 20, 2025 – 9:30 AM" }
      ]
    };
  }
};
</script>

<style scoped>
/* Overall Page Container */
.calendar-container {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  padding-left: 50px;
  padding-right: 60px;
  height: 100vh;
  overflow: clip;
  display: flex;
  flex-direction: column;
  width: 95%;
}

/* Title */
.appointments-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Table Card */
.table-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-bottom: 30px;
  padding-bottom: 238px;
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  color: #000000;
  font-weight: bold;
}

td {
  color: black;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .appointments-title {
    font-size: 20px;
  }

  th, td {
    padding: 8px;
  }
}
</style>
