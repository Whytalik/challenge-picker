<template>
  <div class="challenge-page">
    <h1 class="page-title">Challenge Picker</h1>

    <section class="form-section">
      <form class="challenge-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="title">Challenge Title:</label>
          <input
            class="form-input"
            :class="{ 'input-error': titleError }"
            id="title"
            v-model="form.title"
            type="text"
            @blur="validateTitle"
            required
          />
          <p v-if="titleError" class="error-message">{{ titleError }}</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="description">Description:</label>
          <textarea
            class="form-textarea"
            id="description"
            v-model="form.description"
            required
          ></textarea>
        </div>

        <button
          class="submit-button"
          type="submit"
          :disabled="!isTitleValid || isLoading"
        >
          <Spinner v-if="isLoading">Loading...</Spinner>
          <span v-else>Create Challenge</span>
        </button>
      </form>
    </section>

    <section class="random-challenge">
      <button
        class="random-button"
        @click="getRandomChallenge"
        :disabled="isLoading"
      >
        <Spinner v-if="isLoading">Loading...</Spinner>
        <span v-else>Get Random Challenge</span>
      </button>

      <div v-if="store.randomChallenge" class="challenge-details">
        <h3 class="challenge-title">{{ store.randomChallenge.title }}</h3>
        <p class="challenge-description">
          {{ store.randomChallenge.description }}
        </p>
      </div>
    </section>

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
import { reactive, ref, computed } from "vue";
import { useChallengeStore } from "@/stores/useChallengeStore";
import Spinner from "@/components/Spinner.vue";
import Toast from "@/components/Toast.vue";

const store = useChallengeStore();
const isLoading = ref(false);
const showToast = ref(false);

const form = reactive({
  title: "",
  description: "",
});

const titleError = ref("");
const isTitleValid = computed(() => form.title.trim() !== "");

const validateTitle = () => {
  if (!form.title.trim()) {
    titleError.value = "Title cannot be empty";
    return false;
  }
  titleError.value = "";
  return true;
};

const handleSubmit = async () => {
  if (!validateTitle()) {
    return;
  }

  isLoading.value = true;
  try {
    await store.createChallenge({
      title: form.title,
      description: form.description,
    });

    form.title = "";
    form.description = "";
    titleError.value = "";

    showToast.value = true;
  } catch (error) {
    console.error("Error creating challenge:", error);
  } finally {
    isLoading.value = false;
  }
};

const getRandomChallenge = async () => {
  isLoading.value = true;
  try {
    await store.getRandomChallenge();
  } catch (error) {
    console.error("Error getting random challenge:", error);
  } finally {
    isLoading.value = false;
  }
};

const closeToast = () => {
  showToast.value = false;
};
</script>

<style scoped>
.challenge-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-primary-dark);
}

.form-section,
.random-challenge {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid var(--color-primary-light);
  border-radius: 8px;
  background-color: var(--color-tertiary);
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary-dark);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-primary-light);
  border-radius: 4px;
  background-color: var(--color-tertiary);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-button {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: var(--color-secondary-dark);
}

.random-button {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.random-button:hover {
  background-color: var(--color-secondary-dark);
}

.challenge-details {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-primary-light);
  color: var(--color-tertiary);
  border-radius: 4px;
}

.challenge-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.challenge-description {
  margin: 0;
}

.input-error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.submit-button:disabled {
  background-color: var(--color-primary-light);
  cursor: not-allowed;
}

.submit-button:disabled:hover {
  background-color: var(--color-primary-light);
}

.success-message {
  font-size: 1rem;
  color: var(--color-secondary);
  text-align: center;
  margin: 0;
}
</style>
