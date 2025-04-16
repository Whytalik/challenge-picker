<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Challenge Details</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-content">
        <div class="challenge-details">
          <h3 class="challenge-title">{{ challenge.title }}</h3>

          <p v-if="challenge.description" class="challenge-description">
            {{ challenge.description }}
          </p>

          <div class="completion-details">
            <p class="completion-date">
              Completed on: {{ formatDate(challenge.completedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  background-color: var(--color-tertiary);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-primary-light);
  background-color: var(--color-secondary);
  border-radius: 12px 12px 0 0;
  color: var(--color-tertiary);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: var(--color-tertiary);
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

.modal-content {
  padding: 1.5rem;
}

.challenge-title {
  color: var(--color-primary-dark);
  margin: 0 0 1rem;
  font-size: 1.3rem;
}

.challenge-description {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.completion-details {
  padding-top: 1rem;
  border-top: 1px solid var(--color-primary-light);
}

.completion-date {
  color: var(--color-primary);
  font-style: italic;
  margin: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
