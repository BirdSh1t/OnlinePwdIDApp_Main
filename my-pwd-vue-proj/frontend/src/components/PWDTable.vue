<template>
  <div class="table-card">
    <div class="table-header">
      <h2 class="table-title">PWD list</h2>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Address</th>
            <th>Sex</th>
            <th>Date Issued</th>
          </tr>
        </thead>
        <tbody>
          <!-- Show "No Match Found" if noMatch is returned -->
          <tr v-if="data.length === 1 && data[0].noMatch">
            <td colspan="4" style="text-align: center;">No Match Found</td>
          </tr>

          <!-- Otherwise display the rows -->
          <tr v-else v-for="(user, index) in data" :key="user.pwd_id">
            <td>{{ user.full_name }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.sex }}</td>
            <td>{{ formatDate(user.date_issued) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PWDTable", // ✅ match the filename
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    console.log("Filtered data received in PWDTable:", this.data); // ✅ correct reference to the prop
  },
  
};
</script>



  
  <style scoped>
  /* Table Card */
  .table-card {
    overflow: clip;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-width: 800px;
    display: flex;
    flex-direction: column;
    padding-bottom: 15px;
    height: calc(100vh - 230px); 
    min-height: 300px;
  }
  
  /* Table Header */
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .table-title {
    font-size: 28px;
    font-weight: bold;
    color: black;
  }
  
  /* Table Styling */
  .table-wrapper {
    flex-grow: 1; /* ✅ Allows table to expand naturally */
    overflow-y: auto; /* ✅ Enables scrolling only if needed */
    max-height: calc(100vh - 450px); /* ✅ Ensures it adapts dynamically */
  }
  
  table {
    width: 98%;
    font-size: 16px;
    border-collapse: collapse;
  }
  
  /* position: sticky; top: 0; z-index: 1; */
  th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: white;
    color: #707680;
    font-weight: bold;
    text-align: left;
    padding: 12px 15px; /* ✅ Controls space around metadata */
    border-bottom: 3px solid #ededed;
    width: auto; /* ✅ Ensures columns adapt dynamically */
    white-space: nowrap; /* ✅ Prevents text from wrapping */
  }
  
  td {
    color: #a6a6a6;
    padding: 12px 15px; /* ✅ Matches header padding to keep alignment */
    border-bottom: 1px solid #ededed;
  }

  /* Adjust column widths manually (Optional) */
th:nth-child(1), td:nth-child(1) { width: 30%; } /* Name Column */
th:nth-child(2), td:nth-child(2) { width: 40%; } /* Email Column */
th:nth-child(3), td:nth-child(3) { width: 12%; } /* Age Column */
th:nth-child(4), td:nth-child(4) { width: 5%; } /* Gender Column */


  </style>
  