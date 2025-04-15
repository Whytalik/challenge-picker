<template>
  <div class="loading-container">
    <span class="spinner"></span>
    <span><slot>Loading...</slot></span>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(138, 43, 226, 0.2);
  border-top: 2px solid var(--color-secondary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
