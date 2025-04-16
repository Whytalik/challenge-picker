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
        <router-link
          class="nav-link"
          to="/history"
          active-class="nav-link-active"
          >📅 History</router-link
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

    <ChallengeForm
      v-if="isFormVisible"
      :is-loading="store.loading"
      :error="store.error"
      @submit="handleSubmit"
      @cancel="hideForm"
    />

    <Toast
      :show="showToast"
      :message="toastMessage"
      :type="toastType"
      :duration="3000"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import ChallengeForm from "@/components/ChallengeForm.vue";
import { useChallengeStore, type Challenge } from "@/stores/useChallengeStore";
import Toast from "@/components/Toast.vue";
import { apiErrorEvents } from "@/api";

const isFormVisible = ref(false);
const showToast = ref(false);
const toastMessage = ref("Challenge successfully created! 🎉");
const toastType = ref("success");
const store = useChallengeStore();

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = apiErrorEvents.subscribe((message, type) => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

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
    toastMessage.value = "Challenge successfully created! 🎉";
    toastType.value = "success";
    showToast.value = true;
  } catch (error: any) {
    if (!error.friendlyMessage) {
      toastMessage.value = "Error creating challenge. Please try again.";
      toastType.value = "error";
      showToast.value = true;
    }
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

.app-nav {
  display: flex;
  align-items: center;
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
