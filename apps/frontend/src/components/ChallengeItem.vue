<template>
  <div class="challenge-item">
    <div class="challenge-content">
      <h3 class="challenge-item-title">{{ challenge.title }}</h3>
      <p class="challenge-item-description">{{ challenge.description }}</p>
    </div>
    <div class="challenge-actions">
      <button @click="onEdit" class="edit-button" title="Edit Challenge">
        ✏️ Edit
      </button>
      <button @click="onDelete" class="delete-button" title="Delete Challenge">
        🗑️ Видалити
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Challenge {
  id: string;
  title: string;
  description: string;
}

const props = defineProps<{
  challenge: Challenge;
}>();

const emit = defineEmits(['edit', 'delete']);

const onEdit = () => {
  emit('edit', props.challenge);
};

const onDelete = () => {
  emit('delete', props.challenge);
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

.challenge-item-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  overflow-wrap: break-word;
}

.challenge-item-description {
  margin: 0;
  overflow-wrap: break-word;
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
