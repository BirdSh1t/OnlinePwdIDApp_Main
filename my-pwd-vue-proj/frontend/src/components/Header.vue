<template>
  <header class="header">
    <!-- Left Section (Icons & Title) -->
    <div class="header-left">
      <img src="@/assets/icons/PWD-icon.png" alt="PWD Icon" class="header-icon" />
      <h1 class="header-title">
        Las Piñas City official appointment scheduling for PWDs
      </h1>
    </div>

    <!-- Right Section (Search Bar & Navigation Links) -->
    <div class="header-right">
      <!-- Search Bar -->
      <div class="search-bar">
        <img src="@/assets/icons/search_black.png" alt="Search Icon" class="search-icon" />
        <input type="text" placeholder="Search..." class="search-input" />
        <div class="search-underline"></div> <!-- ✅ Separate underline element -->
      </div>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <a href="#" class="nav-item">Home</a>
        <a href="#" class="nav-item">Contact Us</a>
      </nav>
    </div>
  </header>
</template>


<style scoped>
/* ✅ Header Container */
.header {
  background-color: #3e7b27;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 33px 20px;
  height: 50px;
}

/* ✅ Left Section: PWD Icon & Title */
.header-left {
  display: flex;
  align-items: center;
  gap: 20px; /* Provides spacing between icon & text */
}

.header-icon {
  width: 65px;
  height: 65px;
}

.header-title {
  color: #efe3c2;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: bold;
}

/* ✅ Right Section: Search Bar & Nav Links */
.header-right {
  display: flex;
  align-items: center;
  gap: 50px; /* Creates space between search bar & nav links */
}

/* ✅ Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding: 8px 5px;
  width: 250px;
  background-color: white;
  padding-right: 10px; /* Ensures space for the search icon */
  position: relative;
}

/* ✅ Customizable Search Underline */
.search-underline {
  position: absolute;
  bottom: 10px; 
  left: 54px;
  width: 55%; 
  height: 2px; 
  background-color: #a6a6a6; /* ✅ Color */
}

.search-icon {
  width: 30px;
  height: 30px;
  padding-left: 7px; /* Adds space between icon & input field */
}

.search-input {
  border: none;
  outline: none;
  margin-left: 10px;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  color: #a4a4a4;
  background: transparent;
  flex-grow: 1;
}

/* ✅ Navigation Links */
.nav-links {
  display: flex;
  gap: 10px; /* Adds space between Home & Contact Us */
  font-size: 20px;
}

.nav-item {
  color: #efe3c2;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  text-decoration: none;
  transition: opacity 0.3s;
  padding-right: 50px
}

.nav-item:hover {
  opacity: 0.70;
}
</style>
