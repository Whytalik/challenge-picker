<template>
  <Teleport to="body">
    <transition name="toast">
      <div v-if="show" class="toast-container" :class="type">
        <div class="toast-icon">
          <svg
            v-if="type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
            />
          </svg>
          <svg
            v-else-if="type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ message }}</p>
        </div>
        <button class="toast-close" @click="close">×</button>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
    validator: (value: string) => ["success", "error", "info"].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

let timer: number | null = null;

const setupAutoClose = () => {
  if (props.autoClose && props.show) {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      close();
    }, props.duration);
  }
};

onMounted(setupAutoClose);

watch(
  () => props.show,
  (newVal) => {
    if (newVal) setupAutoClose();
  }
);
</script>

<style scoped>
.toast-container {
  position: fixed;
  display: flex;
  align-items: center;
  bottom: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: bounce 0.5s;
  background: var(--color-tertiary);
  border-left: 4px solid;
}

.toast-container.success {
  border-left-color: var(--color-secondary);
  background-color: rgba(138, 43, 226, 0.1);
}

.toast-container.error {
  border-left-color: var(--color-error);
  background-color: rgba(255, 140, 0, 0.1);
}

.toast-container.info {
  border-left-color: var(--color-primary);
  background-color: rgba(85, 85, 85, 0.1);
}

.toast-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success .toast-icon {
  color: var(--color-secondary);
}

.error .toast-icon {
  color: var(--color-error);
}

.info .toast-icon {
  color: var(--color-primary);
}

.toast-content {
  flex-grow: 1;
}

.toast-message {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-primary-dark);
}

.toast-close {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-primary-light);
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: var(--color-primary-dark);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>
