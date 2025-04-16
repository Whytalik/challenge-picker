<template>
  <div class="confirm-modal-overlay" @click.self="onCancel">
    <div class="confirm-modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <button class="close-button" @click="onCancel">&times;</button>
      </div>

      <div class="modal-content">
        <p class="modal-message">{{ message }}</p>
      </div>

      <div class="modal-actions">
        <button class="cancel-button" @click="onCancel">Cancel</button>
        <button class="confirm-button" @click="onConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Confirmation",
  },
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.confirm-modal-overlay {
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
  animation: fadeIn 0.3s ease;
}

.confirm-modal-container {
  background-color: var(--color-tertiary);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-primary-light);
  background-color: var(--color-secondary);
  border-radius: 8px 8px 0 0;
  color: var(--color-tertiary);
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.8rem;
  line-height: 1;
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

.modal-message {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-primary-dark);
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-primary-light);
}

.cancel-button {
  background-color: var(--color-primary-light);
  color: var(--color-tertiary);
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: var(--color-primary);
}

.confirm-button {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: var(--color-secondary-dark);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
