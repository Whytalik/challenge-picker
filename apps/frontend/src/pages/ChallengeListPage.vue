<template>
  <div class="challenge-list-page page-container">
    <h1 class="page-title">All Challenges</h1>

    <section class="challenges-list-section card">
      <div v-if="store.loading && loadingType === 'list'" class="loading-state">
        <Spinner>Loading challenges...</Spinner>
      </div>

      <div v-else-if="store.challenges.length === 0" class="empty-state">
        <p>No challenges available. Create one!</p>
      </div>

      <ul v-else class="challenges-list">
        <li
          v-for="challenge in store.challenges"
          :key="challenge.id"
          class="challenge-item-container"
        >
          <ChallengeItem
            :challenge="challenge"
            @edit="openEditModal"
            @delete="openDeleteModal"
          />
        </li>
      </ul>
    </section>

    <!-- Edit Challenge Modal -->
    <ChallengeForm
      v-if="isEditModalVisible && selectedChallenge"
      :challenge="selectedChallenge"
      :is-loading="store.loading"
      :error="store.error"
      @submit="handleEditSubmit"
      @cancel="closeEditModal"
    />

    <!-- Delete Challenge Confirmation Modal -->
    <ConfirmModal
      v-if="isDeleteModalVisible"
      title="Delete confirmation"
      message="❗️Are you sure you want to delete this challenge? This action cannot be undone."
      type="danger"
      confirmText="✅ Delete"
      cancelText="❌ Cancel"
      loadingText="Deleting..."
      :is-loading="store.loading && loadingType === 'delete'"
      @confirm="handleDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :message="toastMessage"
      type="success"
      :duration="3000"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useChallengeStore } from "@/stores/useChallengeStore";
import Spinner from "@/components/Spinner.vue";
import ChallengeItem from "@/components/ChallengeItem.vue";
import ChallengeForm from "@/components/ChallengeForm.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import type { Challenge } from "@/stores/useChallengeStore";

const store = useChallengeStore();
const loadingType = ref<"list" | "edit" | "delete">("list");
const isEditModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const selectedChallenge = ref<Challenge | null>(null);
const showToast = ref(false);
const toastMessage = ref("Challenge successfully updated! 🎯");

const fetchAllChallenges = async () => {
  loadingType.value = "list";
  try {
    await store.getAllChallenges();
  } catch (error) {
    console.error("Error fetching challenges:", error);
  }
};

const openEditModal = (challenge: Challenge) => {
  selectedChallenge.value = challenge;
  isEditModalVisible.value = true;
};

const closeEditModal = () => {
  isEditModalVisible.value = false;
  selectedChallenge.value = null;
};

const openDeleteModal = (challenge: Challenge) => {
  selectedChallenge.value = challenge;
  isDeleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
  selectedChallenge.value = null;
};

const handleEditSubmit = async (updatedChallenge: Challenge) => {
  loadingType.value = "edit";
  try {
    await store.updateChallenge(updatedChallenge);
    closeEditModal();
    toastMessage.value = "Challenge successfully updated! 🎯";
    showToast.value = true;
  } catch (error) {
    console.error("Error updating challenge:", error);
  }
};

const handleDeleteConfirm = async () => {
  if (!selectedChallenge.value) return;

  loadingType.value = "delete";
  try {
    await store.deleteChallenge(selectedChallenge.value.id);
    closeDeleteModal();
    toastMessage.value = "Challenge successfully deleted! 🗑️";
    showToast.value = true;
  } catch (error) {
    console.error("Error deleting challenge:", error);
  }
};

const closeToast = () => {
  showToast.value = false;
};

onMounted(() => {
  fetchAllChallenges();
});
</script>

<style scoped>
.challenges-list-section {
  position: relative;
  min-height: 200px;
}

.challenges-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.challenge-item-container {
  transition: all 0.3s ease;
}

.no-challenges p {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.no-challenges p:before {
  content: "📋";
  font-size: 3rem;
  opacity: 0.7;
}

.challenge-list-enter-active, 
.challenge-list-leave-active {
  transition: all 0.5s ease;
}

.challenge-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.challenge-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.challenge-list-move {
  transition: transform 0.5s ease;
}
</style>
