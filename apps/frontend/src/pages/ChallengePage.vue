<template>
  <div class="challenge-page">
    <div class="challenge-of-day-container">
      <div v-if="!store.randomChallenge && !store.loading" class="no-challenge">
        <div class="completed-message">
          <div class="completion-icon">✓</div>
          <p>Challenge completed for today!</p>
          <p class="comeback-text">Come back tomorrow for a new challenge.</p>
        </div>
      </div>

      <div
        v-else-if="store.loading && loadingType === 'random'"
        class="loading-state"
      >
        <Spinner>Loading challenge...</Spinner>
      </div>

      <div v-else-if="store.randomChallenge" class="challenge-day-content">
        <div
          class="challenge-expiry"
          :class="{ 'expiry-warning': isExpiringToday }"
        >
          <span v-if="isExpiringToday">⚠️ Challenge expires today!</span>
          <span v-else>Challenge for: {{ formattedChallengeDate }}</span>
        </div>

        <div class="challenge-icons">
          <span class="emoji-icon">💪</span>
          <span class="emoji-icon">🌟</span>
          <span class="emoji-icon">🎯</span>
        </div>

        <h2 class="challenge-day-title">{{ store.randomChallenge.title }}</h2>

        <p
          v-if="store.randomChallenge.description"
          class="challenge-day-description"
        >
          {{ store.randomChallenge.description }}
        </p>

        <div class="challenge-actions">
          <button
            v-if="canReplaceChallenge"
            @click="showReplaceConfirmation = true"
            class="replace-button"
          >
            🔁 Another One
          </button>

          <button @click="challengeCompleted" class="complete-button">
            ✅ Completed
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="showReplaceConfirmation"
      title="Change Challenge"
      message="Are you sure you want to replace the current challenge? This can only be done once."
      confirmText="✅ Replace"
      cancelText="❌ Cancel"
      @confirm="replaceChallenge"
      @cancel="showReplaceConfirmation = false"
    />

    <CongratulationsModal
      v-if="showCongratulations"
      :message="challengeMessage"
      @close="closeCongratulations"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useChallengeStore } from "@/stores/useChallengeStore";
import Spinner from "@/components/Spinner.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import CongratulationsModal from "@/components/CongratulationsModal.vue";

const store = useChallengeStore();
const loadingType = ref<"random">("random");
const canReplaceChallenge = ref(true);
const showReplaceConfirmation = ref(false);
const showCongratulations = ref(false);
const challengeDate = ref(new Date());
const completedChallengesCount = ref(0);

const challengeMessage = computed(() =>
  store.randomChallenge?.title
    ? `Challenge "${store.randomChallenge.title}" successfully completed!`
    : "Challenge completed!"
);

const formattedChallengeDate = computed(() => {
  const day = challengeDate.value.getDate().toString().padStart(2, "0");
  const month = (challengeDate.value.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const year = challengeDate.value.getFullYear();
  return `${day}.${month}.${year}`;
});

const isExpiringToday = computed(() => {
  const now = new Date();
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );
  const challengeEndDate = new Date(challengeDate.value);
  challengeEndDate.setHours(23, 59, 59);

  return (
    challengeEndDate.getDate() === todayEnd.getDate() &&
    challengeEndDate.getMonth() === todayEnd.getMonth() &&
    challengeEndDate.getFullYear() === todayEnd.getFullYear()
  );
});

const checkExpiredChallenge = () => {
  const savedChallengeDate = localStorage.getItem("challengeDate");
  const savedChallenge = localStorage.getItem("currentChallenge");

  if (savedChallenge && savedChallengeDate) {
    const parsedDate = new Date(savedChallengeDate);
    const today = new Date();

    if (
      parsedDate.getDate() !== today.getDate() ||
      parsedDate.getMonth() !== today.getMonth() ||
      parsedDate.getFullYear() !== today.getFullYear()
    ) {
      const nonCompletedChallenges = JSON.parse(
        localStorage.getItem("nonCompletedChallenges") || "[]"
      );

      const expiredChallenge = JSON.parse(savedChallenge);
      nonCompletedChallenges.push({
        ...expiredChallenge,
        nonCompletedAt: new Date().toISOString(),
        reason: "day_ended",
      });

      localStorage.setItem(
        "nonCompletedChallenges",
        JSON.stringify(nonCompletedChallenges)
      );

      return true;
    }
  }

  return false;
};

const getRandomChallenge = async () => {
  loadingType.value = "random";
  try {
    await store.getRandomChallenge();
    challengeDate.value = new Date();

    if (store.randomChallenge) {
      localStorage.setItem(
        "currentChallenge",
        JSON.stringify(store.randomChallenge)
      );
      localStorage.setItem("challengeDate", challengeDate.value.toISOString());
    }
  } catch (error) {
    console.error("Error getting random challenge:", error);
  }
};

const replaceChallenge = async () => {
  showReplaceConfirmation.value = false;
  await getRandomChallenge();
  canReplaceChallenge.value = false;
};

const challengeCompleted = () => {
  completedChallengesCount.value =
    parseInt(localStorage.getItem("completedChallengesCount") || "0") + 1;
  localStorage.setItem(
    "completedChallengesCount",
    completedChallengesCount.value.toString()
  );

  const completedChallenges = JSON.parse(
    localStorage.getItem("completedChallenges") || "[]"
  );
  if (store.randomChallenge) {
    completedChallenges.push({
      ...store.randomChallenge,
      completedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      "completedChallenges",
      JSON.stringify(completedChallenges)
    );

    localStorage.setItem("challengeCompletedToday", "true");
    localStorage.setItem("lastCompletionDate", new Date().toISOString());

    localStorage.removeItem("currentChallenge");
    localStorage.removeItem("challengeDate");
  }

  showCongratulations.value = true;
};

const closeCongratulations = () => {
  showCongratulations.value = false;
  store.randomChallenge = null;
};

const isChallengeDoneToday = () => {
  const lastCompletionDate = localStorage.getItem("lastCompletionDate");
  if (lastCompletionDate) {
    const completionDate = new Date(lastCompletionDate);
    const today = new Date();

    return (
      completionDate.getDate() === today.getDate() &&
      completionDate.getMonth() === today.getMonth() &&
      completionDate.getFullYear() === today.getFullYear()
    );
  }
  return false;
};

onMounted(() => {
  completedChallengesCount.value = parseInt(
    localStorage.getItem("completedChallengesCount") || "0"
  );

  if (isChallengeDoneToday()) {
    store.randomChallenge = null;
    return;
  }

  const hasExpiredChallenge = checkExpiredChallenge();

  if (hasExpiredChallenge) {
    getRandomChallenge();
  } else {
    const savedChallenge = localStorage.getItem("currentChallenge");
    const savedChallengeDate = localStorage.getItem("challengeDate");

    if (savedChallenge && savedChallengeDate) {
      store.randomChallenge = JSON.parse(savedChallenge);
      challengeDate.value = new Date(savedChallengeDate);
    } else {
      getRandomChallenge();
    }
  }
});
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

.challenge-of-day-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background-color: var(--color-tertiary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 300px;
}

.challenge-expiry {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--color-primary);
}

.expiry-warning {
  color: #ff9800;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

.no-challenge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
}

.completed-message {
  text-align: center;
}

.completion-icon {
  font-size: 2rem;
  color: #4caf50;
  margin-bottom: 0.5rem;
}

.comeback-text {
  font-size: 1rem;
  color: var(--color-primary);
}

.action-wrapper {
  text-align: center;
}

.get-challenge-button {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(138, 43, 226, 0.3);
}

.get-challenge-button:hover {
  background-color: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(138, 43, 226, 0.4);
}

.loading-state {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  animation: fadeIn 0.5s ease;
}

.challenge-icons {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.emoji-icon {
  font-size: 2rem;
  margin: 0 0.5rem;
  animation: bounce 1s infinite alternate;
}

.emoji-icon:nth-child(2) {
  animation-delay: 0.2s;
}

.emoji-icon:nth-child(3) {
  animation-delay: 0.4s;
}

.challenge-day-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: var(--color-primary-dark);
  line-height: 1.2;
}

.challenge-day-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
  max-width: 80%;
}

.challenge-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.replace-button,
.complete-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.replace-button {
  background-color: var(--color-primary-light);
  color: var(--color-tertiary);
}

.replace-button:hover {
  background-color: var(--color-primary);
}

.complete-button {
  background-color: #4caf50;
  color: white;
}

.complete-button:hover {
  background-color: #3e8e41;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
