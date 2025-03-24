<template>
    <div class="table-card">
      <div class="table-header">
        <h2 class="table-title">PWD list</h2>
        <button class="see-all-btn">See all ➤</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kristell Uchiniga</td>
              <td>KristellNigeru@gmail.com</td>
              <td>15</td>
              <td>Female</td>
            </tr>
            <tr>
              <td>Kristell Uchiniga</td>
              <td>KristellNigeru@gmail.com</td>
              <td>15</td>
              <td>Female</td>
            </tr>
            <tr>
              <td>Kristell Uchiniga</td>
              <td>KristellNigeru@gmail.com</td>
              <td>15</td>
              <td>Female</td>
            </tr>
            <tr>
              <td>Kristell Uchiniga</td>
              <td>KristellNigeru@gmail.com</td>
              <td>15</td>
              <td>Female</td>
            </tr>
            <tr>
              <td>Kristell Uchiniga</td>
              <td>KristellNigeru@gmail.com</td>
              <td>15</td>
              <td>Female</td>
            </tr>
            <tr>
              <td>Kristell Uchiniga</td>
              <td>KristellNigeru@gmail.com</td>
              <td>15</td>
              <td>Female</td>
            </tr>
            <!-- Add more rows dynamically -->
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  /* Table Card */
  .table-card {
    overflow: clip;
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    height: 100%; /* ✅ Ensures table-card fills available height */
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
  
  /* See All Button */
  .see-all-btn {
    background: #5271ff;
    color: white;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
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
  
  th {
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
th:nth-child(3), td:nth-child(3) { width: 15%; } /* Age Column */
th:nth-child(4), td:nth-child(4) { width: 5%; } /* Gender Column */


  </style>
  