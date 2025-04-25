<template>
  <div class="footer">
    <div class="footer-icon">
      <img src="@/assets/icons/PWD-icon.png" alt="PWD Footer Icon" />
    </div>
    <div class="footer-text">
      <p>© Copyright 2025. All Rights Reserved.</p>
    </div>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #149656;
  color: white;
  font-family: 'barlow', sans-serif;
  padding: 1rem 2rem; /* Use rem for consistent spacing */
  gap: 20px;
}
.footer-icon img {
  width: 4vw;
  height: auto; /* Adjust the size as needed */
  margin-right: 10px;
  max-width: 100%;
}

.footer-text p {
  margin: 0;
  font-size: 14px;
  max-width: 100%;
}
</style>
