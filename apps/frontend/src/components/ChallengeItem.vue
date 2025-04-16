<template>
  <div class="challenge-item">
    <div class="challenge-content">
      <div class="challenge-header">
        <h3 class="challenge-item-title">{{ challenge.title }}</h3>
        <div class="difficulty-badge" :class="difficultyClass">
          {{ challenge.difficulty || "easy" }} {{ difficultyIcon }}
        </div>
      </div>

      <p v-if="challenge.description" class="challenge-item-description">
        {{ challenge.description }}
      </p>

      <div
        v-if="challenge.tags && challenge.tags.length > 0"
        class="challenge-tags"
      >
        <span
          v-for="(tag, index) in challenge.tags"
          :key="index"
          class="tag-badge"
        >
          {{ tag }}
        </span>
      </div>

      <div v-if="challenge.category" class="challenge-category">
        <span class="category-label">Category:</span> {{ challenge.category }}
      </div>
    </div>
    <div class="challenge-actions">
      <button @click="onEdit" class="btn btn-primary" title="Edit Challenge">
        ✏️ Edit
      </button>
      <button @click="onDelete" class="btn btn-danger" title="Delete Challenge">
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Challenge, Difficulty } from "@/stores/useChallengeStore";

const props = defineProps<{
  challenge: Challenge;
}>();

const emit = defineEmits(["edit", "delete"]);

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

const onEdit = () => {
  emit("edit", props.challenge);
};

const onDelete = () => {
  emit("delete", props.challenge);
};
</script>

<style scoped>
.challenge-item {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background-color: #f8f8f8;
  color: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.challenge-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.challenge-item:last-child {
  margin-bottom: 0;
}

.challenge-content {
  flex: 1;
  margin-right: var(--spacing-md);
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
}

.challenge-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.challenge-item-title {
  margin: 0;
  overflow-wrap: break-word;
  flex: 1;
  color: var(--color-primary-dark);
  font-size: 1.2rem;
}

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
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

.challenge-item-description {
  margin: 0 0 0.75rem 0;
  overflow-wrap: break-word;
  font-style: italic;
  color: var(--color-primary);
  line-height: 1.4;
}

.challenge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: 0.75rem;
}

.tag-badge {
  background-color: var(--color-secondary-light);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.challenge-category {
  font-size: 0.85rem;
  color: var(--color-primary);
  padding: var(--spacing-xs) 0;
}

.category-label {
  font-weight: 500;
  color: var(--color-secondary);
}

.challenge-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
  flex-direction: column;
}
</style>
