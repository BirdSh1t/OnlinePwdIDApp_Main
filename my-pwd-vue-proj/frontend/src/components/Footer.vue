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
   padding: 0.9vh 1.0vw;
  height: 15vh;
  gap: 20px;
}

.footer-icon img {
  width: 4vw;
  height: auto; /* Adjust the size as needed */
  margin-right: 10px;
}

.footer-text p {
  margin: 0;
  font-size: 14px;
}
</style>
