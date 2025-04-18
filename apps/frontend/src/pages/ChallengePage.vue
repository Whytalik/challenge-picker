<template>
  <div class="challenge-page page-container">
    <h1 class="page-title">Today's Challenge</h1>

    <div class="challenge-container card">
      <div v-if="store.loading" class="loading-state">
        <Spinner>Loading challenge...</Spinner>
      </div>

      <div
        v-else-if="isChallengeDone || !store.randomChallenge"
        class="challenge-done"
      >
        <div class="completed-message">
          <div class="completion-icon">✅</div>
          <h3>Challenge completed for today!</h3>
          <p class="comeback-text">Come back tomorrow for a new challenge.</p>
        </div>
      </div>

      <div v-else-if="store.randomChallenge" class="challenge-day-content">
        <div class="challenge-icons">
          <span class="emoji-icon">🎯</span>
          <span class="emoji-icon">💪</span>
          <span class="emoji-icon">✨</span>
        </div>

        <h2 class="challenge-day-title">{{ store.randomChallenge.title }}</h2>

        <p
          v-if="store.randomChallenge.description"
          class="challenge-day-description"
        >
          {{ store.randomChallenge.description }}
        </p>

        <div
          v-if="expiryTime"
          class="challenge-expiry"
          :class="{ 'expiry-warning': isExpiringSoon }"
        >
          Expires in: {{ formatRemainingTime(expiryTime) }}
        </div>

        <div class="challenge-actions">
          <button
            @click="handleReplaceChallenge"
            class="btn btn-secondary replace-button"
            :class="{ 'disabled': hasReplacedChallenge }"
            :disabled="hasReplacedChallenge"
            :title="hasReplacedChallenge ? 'You can only replace a challenge once per day' : 'Get a different challenge'"
          >
            🔄 Different Challenge
          </button>
          <button
            @click="handleCompleteChallenge"
            class="btn btn-success complete-button"
          >
            ✅ Complete Challenge
          </button>
        </div>
      </div>
    </div>

    <!-- Congratulations Modal -->
    <CongratulationsModal
      v-if="showCongratulations"
      :message="challengeMessage"
      @close="closeCongratulations"
    />

    <!-- Toast Notification (for non-completion messages) -->
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
import { ref, onMounted, computed } from "vue";
import { useChallengeStore } from "@/stores/useChallengeStore";
import Spinner from "@/components/Spinner.vue";
import CongratulationsModal from "@/components/CongratulationsModal.vue";
import Toast from "@/components/Toast.vue";

const store = useChallengeStore();
const loadingType = ref<"random">("random");
const showCongratulations = ref(false);
const challengeDate = ref(new Date());
const completedChallengesCount = ref(0);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const hasReplacedChallenge = ref(false);

const challengeMessage = computed(
  () =>
    "✅\nChallenge completed for today!\nCome back tomorrow for a new challenge."
);

const expiryTime = computed(() => {
  if (!store.randomChallenge) return null;

  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  return endOfDay.getTime() - now.getTime();
});

const isExpiringSoon = computed(() => {
  if (!expiryTime.value) return false;
  return expiryTime.value < 3 * 60 * 60 * 1000;
});

const isChallengeDone = computed(() => {
  return isChallengeDoneToday();
});

const formatRemainingTime = (ms: number) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

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
    showToastMessage("Failed to get challenge. Please try again.", "error");
  }
};

const replaceChallenge = async () => {
  if (hasReplacedChallenge.value) {
    showToastMessage("You can only replace a challenge once per day.", "warning");
    return;
  }
  
  try {
    await getRandomChallenge();
    showToastMessage("Challenge replaced successfully!", "success");
    hasReplacedChallenge.value = true;
    
    // Save to localStorage that the challenge has been replaced
    localStorage.setItem("hasReplacedChallenge", "true");
  } catch (error) {
    showToastMessage("Failed to replace challenge.", "error");
  }
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

const handleReplaceChallenge = async () => {
  await replaceChallenge();
};

const handleCompleteChallenge = () => {
  challengeCompleted();
};

const showToastMessage = (message: string, type: string = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
};

const closeToast = () => {
  showToast.value = false;
};

onMounted(() => {
  completedChallengesCount.value = parseInt(
    localStorage.getItem("completedChallengesCount") || "0"
  );

  // Check if challenge has been replaced today
  const savedReplacementStatus = localStorage.getItem("hasReplacedChallenge");
  if (savedReplacementStatus === "true") {
    hasReplacedChallenge.value = true;
  }

  if (isChallengeDoneToday()) {
    store.randomChallenge = null;
    return;
  }

  const hasExpiredChallenge = checkExpiredChallenge();

  if (hasExpiredChallenge) {
    getRandomChallenge();
    // Reset replacement status for a new day
    hasReplacedChallenge.value = false;
    localStorage.removeItem("hasReplacedChallenge");
  } else {
    const savedChallenge = localStorage.getItem("currentChallenge");
    const savedChallengeDate = localStorage.getItem("challengeDate");

    if (savedChallenge && savedChallengeDate) {
      store.randomChallenge = JSON.parse(savedChallenge);
      challengeDate.value = new Date(savedChallengeDate);
    } else {
      getRandomChallenge();
      // Reset replacement status for a new challenge
      hasReplacedChallenge.value = false;
      localStorage.removeItem("hasReplacedChallenge");
    }
  }
});
</script>

<style scoped>
.challenge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.challenge-expiry {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--color-primary);
}

.expiry-warning {
  color: #ff9800;
  font-weight: bold;
  animation: pulse 2s infinite;
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
  margin-bottom: var(--spacing-sm);
}

.comeback-text {
  font-size: 1rem;
  color: var(--color-primary);
}

.get-challenge-button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.2rem;
  font-weight: bold;
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
  margin-bottom: var(--spacing-lg);
}

.emoji-icon {
  font-size: 2rem;
  margin: 0 var(--spacing-sm);
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
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary-dark);
  line-height: 1.2;
}

.challenge-day-description {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  color: var(--color-primary);
  max-width: 80%;
}

.challenge-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
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

.replace-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-primary-light);
}

.replace-button.disabled:hover {
  background-color: var(--color-primary-light);
  transform: none;
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
