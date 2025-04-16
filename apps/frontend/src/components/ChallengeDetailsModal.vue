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

          <div class="challenge-meta">
            <div v-if="challenge.difficulty" class="meta-item">
              <span class="meta-label">Difficulty:</span>
              <span class="difficulty-badge" :class="difficultyClass">
                {{ challenge.difficulty }} {{ difficultyIcon }}
              </span>
            </div>
            
            <div v-if="challenge.category" class="meta-item">
              <span class="meta-label">Category:</span>
              <span>{{ challenge.category }}</span>
            </div>
            
            <div class="meta-item">
              <span class="meta-label">Completed:</span>
              <span>{{ formatDate(challenge.completedAt) }}</span>
            </div>
          </div>

          <div v-if="challenge.tags && challenge.tags.length > 0" class="tags-container">
            <span 
              v-for="(tag, index) in challenge.tags" 
              :key="index"
              class="tag-badge"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

const difficultyIcon = computed(() => {
  switch (props.challenge.difficulty) {
    case "easy":
      return "🟢";
    case "medium":
      return "🟡";
    case "hard":
      return "🔴";
    default:
      return "🟢";
  }
});

const difficultyClass = computed(() => {
  return `difficulty-${props.challenge.difficulty || "easy"}`;
});

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 450px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-primary-light);
  background-color: var(--color-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  color: var(--color-tertiary);
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
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
  padding: var(--spacing-lg);
}

.challenge-title {
  color: var(--color-primary-dark);
  margin: 0 0 var(--spacing-md) 0;
  font-size: 1.3rem;
}

.challenge-description {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
  background-color: #f8f8f8;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
}

.challenge-meta {
  margin-bottom: var(--spacing-lg);
}

.meta-item {
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
}

.meta-label {
  font-weight: 600;
  color: var(--color-secondary);
  min-width: 90px;
}

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.difficulty-easy {
  background-color: rgba(0, 200, 0, 0.15);
  color: rgb(0, 130, 0);
}

.difficulty-medium {
  background-color: rgba(255, 180, 0, 0.15);
  color: rgb(180, 130, 0);
}

.difficulty-hard {
  background-color: rgba(255, 0, 0, 0.15);
  color: rgb(180, 0, 0);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-badge {
  background-color: var(--color-secondary-light);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.75rem;
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
