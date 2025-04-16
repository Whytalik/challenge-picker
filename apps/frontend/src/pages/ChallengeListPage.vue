<template>
  <div class="challenge-list-page">
    <h1 class="page-title">All Challenges</h1>

    <section class="challenges-list-section">
      <div v-if="store.loading && loadingType === 'list'" class="loading-state">
        <Spinner>Loading challenges...</Spinner>
      </div>

      <div v-else-if="store.challenges.length === 0" class="no-challenges">
        <p>No challenges available. Create one!</p>
      </div>

      <ul v-else class="challenges-list">
        <li
          v-for="challenge in store.challenges"
          :key="challenge.id"
          class="challenge-item-container"
        >
          <ChallengeItem :challenge="challenge" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useChallengeStore } from "@/stores/useChallengeStore";
import Spinner from "@/components/Spinner.vue";
import ChallengeItem from "@/components/ChallengeItem.vue";

const store = useChallengeStore();
const loadingType = ref<"list">("list");

const fetchAllChallenges = async () => {
  loadingType.value = "list";
  try {
    await store.getAllChallenges();
  } catch (error) {
    console.error("Error fetching challenges:", error);
  }
};

// Fetch all challenges when component is mounted
onMounted(() => {
  fetchAllChallenges();
});
</script>

<style scoped>
.challenge-list-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-primary-dark);
}

.challenges-list-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid var(--color-primary-light);
  border-radius: 8px;
  background-color: var(--color-tertiary);
}

.challenges-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.challenge-item-container {
  margin-bottom: 1rem;
}

.challenge-item-container:last-child {
  margin-bottom: 0;
}

.loading-state,
.no-challenges {
  padding: 1rem;
  text-align: center;
  color: var(--color-primary);
}
</style>
