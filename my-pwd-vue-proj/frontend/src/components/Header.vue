<template>
  <header class="bg-green px-8 py-3 flex items-center justify-between">
    <!-- Left Section (Icons & Title) -->
    <div class="flex items-center space-x-3">
      <img src="@/assets/icons/PWD-icon.png" alt="PWD Icon" class="header-icon" />
      <h1 class="text-header text-lg font-bold font-roboto">
        Las Piñas City official appointment scheduling for PWDs
      </h1>
    </div>

    <!-- Right Section (Search & Nav Links) -->
    <div class="flex items-center space-x-6">
      <!-- Search Bar -->
      <div class="relative flex items-center bg-white rounded-full px-4 py-2 shadow-md">
        <img src="@/assets/icons/search_black.png" alt="Search Icon" class="search-icon" />
        <input 
          type="text" 
          placeholder="Search..." 
          class="ml-2 text-default placeholder-gray focus:outline-none border-b border-gray focus:border-gray"
        />
      </div>

      <!-- Navigation Links -->
      <nav class="flex space-x-6">
        <a href="#" class="text-header font-bold font-roboto">Home</a>
        <a href="#" class="text-header font-bold font-roboto">Contact Us</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* ✅ Header Background */
.bg-green {
background-color: #3e7b27;
}

/* ✅ Text Styles */
.text-header {
color: #efe3c2;
}

.font-roboto {
font-family: 'Roboto', sans-serif;
}

/* ✅ Search Bar Placeholder */
.text-default {
color: #a4a4a4;
}

.placeholder-gray::placeholder {
color: #a4a4a4;
}

/* ✅ Adjust Image Sizes */
.header-icon {
width: 50px; /* Set a fixed width */
height: auto; /* Maintain aspect ratio */
}

.search-icon {
width: 20px; /* Adjust search icon size */
height: 20px;
}
</style>
