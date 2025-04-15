<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Challenge Picker</h1>
      <nav class="app-nav">
        <router-link class="nav-link" to="/">Home</router-link>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p class="footer-text">© 2025 Challenge Picker</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-primary-light);
}

.app-title {
  font-size: 1.8rem;
  color: var(--color-primary-dark);
  margin: 0;
}

.app-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: var(--color-secondary-light);
  color: var(--color-tertiary);
}

.app-content {
  min-height: 70vh;
}

.app-footer {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-primary-light);
  text-align: center;
  color: var(--color-primary);
}
</style>
