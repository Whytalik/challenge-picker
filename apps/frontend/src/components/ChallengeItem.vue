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
      <button @click="onEdit" class="edit-button" title="Edit Challenge">
        ✏️ Edit
      </button>
      <button @click="onDelete" class="delete-button" title="Delete Challenge">
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
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--color-primary-light);
  color: var(--color-tertiary);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.challenge-item:last-child {
  margin-bottom: 0;
}

.challenge-content {
  flex: 1;
  margin-right: 1rem;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
}

.challenge-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.challenge-item-title {
  margin: 0;
  overflow-wrap: break-word;
  flex: 1;
}

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty-easy {
  background-color: rgba(0, 200, 0, 0.2);
  color: rgb(0, 150, 0);
}

.difficulty-medium {
  background-color: rgba(255, 200, 0, 0.2);
  color: rgb(200, 150, 0);
}

.difficulty-hard {
  background-color: rgba(255, 0, 0, 0.2);
  color: rgb(200, 0, 0);
}

.challenge-item-description {
  margin: 0 0 0.75rem 0;
  overflow-wrap: break-word;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
}

.challenge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag-badge {
  background-color: var(--color-secondary-light);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.75rem;
}

.challenge-category {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.category-label {
  font-weight: 500;
}

.challenge-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-direction: column;
}

.edit-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  white-space: nowrap;
  min-width: 90px;
}

.edit-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.delete-button {
  background-color: rgba(255, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  white-space: nowrap;
  min-width: 90px;
}

.delete-button:hover {
  background-color: rgba(255, 0, 0, 0.8);
}
</style>
