<template>
  <div class="challenge-item">
    <div class="challenge-content">
      <h3 class="challenge-item-title">{{ challenge.title }}</h3>
      <p class="challenge-item-description">{{ challenge.description }}</p>
    </div>
    <button @click="onEdit" class="edit-button" title="Edit Challenge">
      ✏️ Edit
    </button>
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

const emit = defineEmits(['edit']);

const onEdit = () => {
  emit('edit', props.challenge);
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
  align-items: center;
}

.challenge-item:last-child {
  margin-bottom: 0;
}

.challenge-content {
  flex: 1;
}

.challenge-item-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.challenge-item-description {
  margin: 0;
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
  margin-left: 1rem;
}

.edit-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
