<template>
  <header class="header">
    <!-- Left Section (Icons & Title) -->
    <div class="header-left">
      <img src="@/assets/icons/PWD-icon.png" alt="PWD Icon" class="header-icon" />
      <h1 class="header-title">
        Las Piñas City official appointment scheduling for PWDs
      </h1>
    </div>

    <!-- Navigation Links -->
    <nav class="nav-links">
        <a href="#" class="nav-item">Home</a>
        <a href="#" class="nav-item">Contact Us</a>
      </nav>

    <!-- Right Section (Search Bar & Navigation Links) -->
    <div class="header-right">
      <!-- Search Bar -->
      <div class="search-bar">
        <img src="@/assets/icons/search_black.png" alt="Search Icon" class="search-icon" />
        <input type="text" placeholder="Search..." class="search-input" />
        <div class="search-underline"></div> <!-- ✅ Separate underline element -->
      </div>

      
    </div>
  </header>
</template>

<style scoped>
/* ✅ Header Container */
.header {
  background-color: #57c031;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 33px 20px;
  height: 30px;
}

/* ✅ Left Section: PWD Icon & Title */
.header-left {
  display: flex;
  align-items: center;
  gap: 20px; /* Provides spacing between icon & text */
}

.header-icon {
  width: 55px;
  height: 55px;
  margin-left: 40px;
}

.header-title {
  color: #efe3c2;
  font-family: 'montserrat', sans-serif;
  font-size: 20px;
  font-weight: 400;
}

/* ✅ Right Section: Search Bar & Nav Links */
.header-right {
  display: flex;
  align-items: center;
}

/* ✅ Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 30px;
  padding: 8px 5px;
  width: 200px;
  height: 20px;
  background-color: white;
  position: relative;
  margin-left: 0px; /* Space between search bar and nav links */
  margin-right: 40px; /* Space between search bar and nav links */
}

/* ✅ Customizable Search Underline */
.search-underline {
  position: absolute;
  bottom: 5px;
  left: 45px;
  width: 55%;
  height: 2px;
  background-color: #a6a6a6; /* ✅ Color */
}

.search-icon {
  width: 20px;
  height: 20px;
  padding-left: 7px; /* Adds space between icon & input field */
}

.search-input {
  border: none;
  outline: none;
  margin-left: 10px;
  font-size: 18px;
  font-family: 'barlow', sans-serif;
  font-weight: 400;
  color: #a4a4a4;
  background: transparent;
  flex-grow: 1;
}

/* ✅ Navigation Links */
.nav-links {
  display: flex;
  font-size: 20px;
}

.nav-item {
  color: #083f05;
  font-family: 'montserrat', sans-serif;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s, background-color 0.3s;
  padding-right: 50px;
}

.nav-item:hover {
  color: #1aff1a; /* Light green color on hover */
}
</style>
