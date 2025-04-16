<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">
        <router-link to="/" class="app-link">Challenge Picker</router-link>
        <span class="emoji">🎯</span>
      </h1>
      <nav class="app-nav">
        <router-link
          class="nav-link"
          to="/"
          exact-active-class="nav-link-active"
          >Home</router-link
        >
        <router-link
          class="nav-link"
          to="/challenges"
          active-class="nav-link-active"
          >📋 All Challenges</router-link
        >
        <button @click="toggleFormVisibility" class="action-button">
          + Add Challenge
        </button>
      </nav>
    </header>

    <main class="app-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p class="footer-text">© 2025 Challenge Picker</p>
    </footer>

    <!-- Challenge Form Modal -->
    <ChallengeForm
      v-if="isFormVisible"
      :is-loading="store.loading"
      :error="store.error"
      @submit="handleSubmit"
      @cancel="hideForm"
    />

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      message="Challenge successfully created! 🎉"
      type="success"
      :duration="3000"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import ChallengeForm from "@/components/ChallengeForm.vue";
import { useChallengeStore, type Challenge } from "@/stores/useChallengeStore";
import Toast from "@/components/Toast.vue";

const isFormVisible = ref(false);
const showToast = ref(false);
const store = useChallengeStore();

const toggleFormVisibility = () => {
  isFormVisible.value = !isFormVisible.value;
};

const hideForm = () => {
  isFormVisible.value = false;
};

const handleSubmit = async (formData: Omit<Challenge, "id">) => {
  try {
    await store.createChallenge({
      title: formData.title,
      description: formData.description,
    });

    isFormVisible.value = false;
    showToast.value = true;
  } catch (error) {
    console.error("Error creating challenge:", error);
  }
};

const closeToast = () => {
  showToast.value = false;
};
</script>

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

.app-link {
  font-size: 1.8rem;
  color: var(--color-primary-dark);
  text-decoration: none;
}

.nav-link {
  text-decoration: none;
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: var(--color-secondary-light);
  color: var(--color-tertiary);
}

.nav-link-active {
  background-color: var(--color-secondary-light);
  color: var(--color-tertiary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
  cursor: default;
}

.action-button {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: var(--color-secondary-dark);
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
