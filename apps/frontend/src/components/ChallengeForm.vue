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
          <div class="label-with-counter">
            <label class="form-label" for="title">Challenge Title:</label>
            <span
              class="character-count"
              :class="{ 'limit-reached': form.title.length >= 100 }"
            >
              {{ form.title.length }}/100
            </span>
          </div>
          <input
            class="form-input"
            :class="{ 'input-error': v$.title.$error }"
            id="title"
            v-model="form.title"
            type="text"
            @blur="v$.title.$touch()"
            maxlength="100"
            required
          />
          <div v-if="v$.title.$error" class="error-message">
            <p v-if="v$.title.required.$invalid">
              Назва челенджу є обов'язковою
            </p>
            <p v-else-if="v$.title.maxLength.$invalid">
              Назва не може перевищувати 100 символів
            </p>
          </div>
        </div>

        <div class="form-group">
          <div class="label-with-counter">
            <label class="form-label" for="description">Description:</label>
            <span
              class="character-count"
              :class="{ 'limit-reached': form.description.length >= 300 }"
            >
              {{ form.description.length }}/300
            </span>
          </div>
          <textarea
            class="form-textarea"
            :class="{ 'input-error': v$.description.$error }"
            id="description"
            v-model="form.description"
            @blur="v$.description.$touch()"
            maxlength="300"
            rows="4"
          ></textarea>
          <div v-if="v$.description.$error" class="error-message">
            <p v-if="v$.description.maxLength.$invalid">
              Опис не може перевищувати 300 символів
            </p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="difficulty">Difficulty:</label>
          <select
            class="form-select"
            :class="{ 'input-error': v$.difficulty.$error }"
            id="difficulty"
            v-model="form.difficulty"
            @blur="v$.difficulty.$touch()"
          >
            <option value="easy">Easy 🟢</option>
            <option value="medium">Medium 🟡</option>
            <option value="hard">Hard 🔴</option>
          </select>
          <div v-if="v$.difficulty.$error" class="error-message">
            <p v-if="v$.difficulty.required.$invalid">
              Складність челенджу є обов'язковою
            </p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="tags">Tags:</label>
          <div class="tags-input-container">
            <div class="tags-display">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="tag-badge"
              >
                {{ tag }}
                <button
                  type="button"
                  class="tag-remove"
                  @click="removeTag(index)"
                >
                  &times;
                </button>
              </span>
            </div>
            <input
              class="tags-input"
              :class="{ 'input-error': v$.tags.$error }"
              id="tagInput"
              v-model="tagInput"
              type="text"
              placeholder="Add tags (press Enter to add)"
              @keyup.enter="addTag"
              @blur="v$.tags.$touch()"
            />
          </div>
          <div v-if="v$.tags.$error" class="error-message">
            <p v-if="v$.tags.isArray.$invalid">Теги повинні бути масивом</p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="category">Category (optional):</label>
          <input
            class="form-input"
            :class="{ 'input-error': v$.category.$error }"
            id="category"
            v-model="form.category"
            type="text"
            @blur="v$.category.$touch()"
          />
          <div v-if="v$.category.$error" class="error-message">
            <p v-if="v$.category.maxLength.$invalid">
              Категорія не може перевищувати 50 символів
            </p>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="onCancel">
            Cancel
          </button>
          <button
            class="submit-button"
            type="submit"
            :disabled="v$.$invalid || isLoading"
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
import { reactive, computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, helpers } from "@vuelidate/validators";
import Spinner from "./Spinner.vue";
import type { Challenge, Difficulty } from "@/stores/useChallengeStore";

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

const tagInput = ref("");

const form = reactive({
  title: "",
  description: "",
  difficulty: "easy" as Difficulty,
  tags: [] as string[],
  category: "",
});

const rules = {
  title: {
    required,
    maxLength: maxLength(100),
  },
  description: {
    maxLength: maxLength(300),
  },
  difficulty: {
    required,
  },
  tags: {
    isArray: helpers.withMessage("Tags must be an array", () => true),
  },
  category: {
    maxLength: maxLength(50),
  },
};

const v$ = useVuelidate(rules, form);

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag);
  }
  tagInput.value = "";
};

const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

const handleSubmit = async () => {
  const isFormValid = await v$.value.$validate();

  if (!isFormValid) {
    return;
  }

  if (isEditMode.value && props.challenge) {
    emit("submit", {
      id: props.challenge.id,
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags,
      category: form.category,
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
    form.description = props.challenge.description || "";
    form.difficulty = props.challenge.difficulty || "easy";
    form.tags = props.challenge.tags || [];
    form.category = props.challenge.category || "";
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

.label-with-counter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.form-label {
  color: var(--color-primary-dark);
  font-weight: 500;
  margin: 0;
  margin-bottom: 0.5rem;
  display: block;
}

.character-count {
  font-size: 0.8rem;
  color: var(--color-primary);
}

.limit-reached {
  color: var(--color-error);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-primary-light);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.2);
}

.input-error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.global-error {
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: rgba(var(--color-error-rgb), 0.1);
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-tertiary-dark);
  color: var(--color-primary-dark);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: var(--color-primary-dark);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button:hover {
  background-color: var(--color-tertiary-darker);
}

.tags-input-container {
  border: 1px solid var(--color-primary-light);
  border-radius: 4px;
  padding: 0.5rem;
  background-color: white;
  min-height: 50px;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-secondary-light);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.tag-remove {
  border: none;
  background: transparent;
  color: white;
  margin-left: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.tag-remove:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.tags-input {
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
  padding: 0.25rem 0;
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
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
