<template>
    <div class="table-card">
      <div class="table-header">
        <h2 class="table-title">Recent applicants</h2>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Disability Type</th>
            </tr>
          </thead>
          <tbody>
            <!-- Add applicant rows dynamically -->
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <style scoped>


  /* Table Card */
  .table-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 50%; /* ✅ Takes 50% of its parent container */
  max-width: 400px;
  min-width: 300px; 
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
  
  th {
    background: white;
    color: #707680;
    font-weight: bold;
    text-align: left;
    padding: 12px 15px; /* ✅ Adjusted spacing */
    border-bottom: 2px solid #ededed;
    width: auto;
    white-space: nowrap; /* ✅ Prevents text from wrapping */
  }
  
  td {
    color: #a6a6a6;
    padding: 12px 15px; /* ✅ Matches header padding */
    border-bottom: 1px solid #ededed;
    white-space: nowrap; /* ✅ Prevents breaking text */
    overflow: hidden; /* ✅ Ensures content stays inside */
    text-overflow: ellipsis; /* ✅ Truncates long text */
  }

    th:nth-child(1), td:nth-child(1) { width: 30%; } /* Name Column */
    th:nth-child(2), td:nth-child(2) { width: 40%; } /* Age Column */
    th:nth-child(3), td:nth-child(3) { width: 5%; } /* Disability Type Column */

  </style>
  