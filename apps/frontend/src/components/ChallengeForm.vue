<template>
  <div class="challenge-form-overlay" @click.self="onCancel">
    <div class="challenge-form-container">
      <div class="form-header">
        <h2 class="form-title">
          {{ isEditMode ? "Edit Challenge" : "Create New Challenge" }}
        </h2>
        <button class="close-button" @click="onCancel">&times;</button>
      </div>

      <form class="challenge-form" @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label class="form-label" for="title">Challenge Title:</label>
          <input
            class="form-input"
            :class="{ 'input-error': titleError }"
            id="title"
            v-model="form.title"
            type="text"
            @blur="validateTitle"
            required
          />
          <p v-if="titleError" class="error-message">{{ titleError }}</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="description"
            >Description (optional):</label
          >
          <textarea
            class="form-textarea"
            id="description"
            v-model="form.description"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="onCancel">
            Cancel
          </button>
          <button
            class="submit-button"
            type="submit"
            :disabled="!isTitleValid || isLoading"
          >
            <Spinner v-if="isLoading">Loading...</Spinner>
            <span v-else>{{
              isEditMode ? "Save Changes" : "Create Challenge"
            }}</span>
          </button>
        </div>

        <p v-if="error" class="error-message global-error">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import Spinner from "./Spinner.vue";
import type { Challenge } from "@/stores/useChallengeStore";

const props = defineProps({
  challenge: {
    type: Object as () => Challenge,
    required: false,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const isEditMode = computed(() => !!props.challenge);

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({
  title: "",
  description: "",
});

const titleError = ref("");
const descriptionError = ref("");
const isTitleValid = computed(() => form.title.trim() !== "");

const validateTitle = () => {
  if (!form.title.trim()) {
    titleError.value = "Title cannot be empty";
    return false;
  }
  titleError.value = "";
  return true;
};

const handleSubmit = () => {
  if (!validateTitle()) {
    return;
  }

  if (isEditMode.value && props.challenge) {
    emit("submit", {
      id: props.challenge.id,
      title: form.title,
      description: form.description,
    });
  } else {
    emit("submit", { ...form });
  }
};

const onCancel = () => {
  emit("cancel");
};

onMounted(() => {
  if (isEditMode.value && props.challenge) {
    form.title = props.challenge.title;
    form.description = props.challenge.description;
  }
});
</script>

<style scoped>
.challenge-form-overlay {
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

.challenge-form-container {
  background-color: var(--color-tertiary);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  animation: slideUp 0.3s ease;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-primary-light);
  background-color: var(--color-secondary);
  border-radius: 8px 8px 0 0;
  color: var(--color-tertiary);
}

.form-title {
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

.challenge-form {
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 1.25rem;
  width: 100%;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-primary-light);
  border-radius: 4px;
  background-color: var(--color-tertiary);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  max-width: 100%;
  min-height: 20px;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.2);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.input-error {
  border-color: var(--color-error);
}

.input-error:focus {
  box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.2);
}

.error-message {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 0.4rem;
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

.submit-button {
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

.submit-button:hover {
  background-color: var(--color-secondary-dark);
}

.submit-button:disabled {
  background-color: var(--color-primary-light);
  cursor: not-allowed;
}

.global-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(255, 140, 0, 0.1);
  border-left: 4px solid var(--color-error);
  border-radius: 4px;
  text-align: center;
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
