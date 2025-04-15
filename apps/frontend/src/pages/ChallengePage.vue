<template>
  <div class="challenge-page">
    <h1 class="page-title">Challenge Picker</h1>

    <section class="form-section">
      <form class="challenge-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="title">Challenge Title:</label>
          <input
            class="form-input"
            id="title"
            v-model="form.title"
            type="text"
            required
          />
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

        <button class="submit-button" type="submit">Create Challenge</button>
      </form>
    </section>

    <section class="random-challenge">
      <button class="random-button" @click="getRandomChallenge">
        Get Random Challenge
      </button>

      <div v-if="store.randomChallenge" class="challenge-details">
        <h3 class="challenge-title">{{ store.randomChallenge.title }}</h3>
        <p class="challenge-description">
          {{ store.randomChallenge.description }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useChallengeStore } from "@/stores/useChallengeStore";

const store = useChallengeStore();

const form = reactive({
  title: "",
  description: "",
});

const handleSubmit = async () => {
  try {
    await store.createChallenge({
      title: form.title,
      description: form.description,
    });

    form.title = "";
    form.description = "";
  } catch (error) {
    console.error("Error creating challenge:", error);
  }
};

const getRandomChallenge = async () => {
  try {
    await store.getRandomChallenge();
  } catch (error) {
    console.error("Error getting random challenge:", error);
  }
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
}

.form-section,
.random-challenge {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.random-button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.random-button:hover {
  background-color: #45a049;
}

.challenge-details {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.challenge-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.challenge-description {
  margin: 0;
}
</style>
