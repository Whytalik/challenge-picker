<template>
  <div class="congrats-modal-overlay" @click.self="onClose">
    <div class="congrats-modal-container">
      <div class="confetti-container">
        <div
          v-for="i in 50"
          :key="i"
          class="confetti"
          :style="getConfettiStyle(i)"
        ></div>
      </div>

      <div class="modal-content">
        <div class="emoji-container">
          <span class="trophy">🏆</span>
          <span class="star">⭐</span>
          <span class="party">🎉</span>
        </div>

        <h2 class="congrats-title">Congratulations!</h2>
        <p class="congrats-message">{{ message }}</p>
        <p class="next-challenge-message">Come back tomorrow for a new challenge!</p>

        <button class="close-button" @click="onClose">Awesome!</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: "Challenge successfully completed!",
  }
});

const emit = defineEmits(["close"]);

const onClose = () => {
  emit("close");
};

const getConfettiStyle = (i: number) => {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  const randomLeft = Math.random() * 100;
  const randomAnimationDelay = Math.random() * 5;
  const randomSize = 5 + Math.random() * 10;
  const randomRotation = Math.random() * 360;

  return {
    backgroundColor: colors[i % colors.length],
    left: `${randomLeft}%`,
    width: `${randomSize}px`,
    height: `${randomSize}px`,
    animationDelay: `${randomAnimationDelay}s`,
    transform: `rotate(${randomRotation}deg)`,
  };
};
</script>

<style scoped>
.congrats-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.congrats-modal-container {
  position: relative;
  background-color: var(--color-tertiary);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: zoomIn 0.5s ease;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -10%;
  opacity: 0;
  animation: confettiFall 5s linear infinite;
  border-radius: 50%;
}

.modal-content {
  position: relative;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.emoji-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.trophy,
.star,
.party {
  font-size: 3.5rem;
  display: inline-block;
}

.trophy {
  animation: bounce 1.5s infinite alternate;
}

.star {
  animation: rotate 3s infinite linear;
  animation-delay: 0.3s;
}

.party {
  animation: shake 1s infinite;
  animation-delay: 0.5s;
}

.congrats-title {
  font-size: 2.5rem;
  color: var(--color-secondary);
  margin: 0 0 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.congrats-message {
  font-size: 1.25rem;
  color: var(--color-primary-dark);
  margin-bottom: 1rem;
}

.next-challenge-message {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  font-style: italic;
}

.close-button {
  background-color: var(--color-secondary);
  color: var(--color-tertiary);
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background-color: var(--color-secondary-dark);
  transform: translateY(-3px);
}

.close-button:active {
  transform: translateY(-1px);
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes confettiFall {
  0% {
    opacity: 1;
    top: -10%;
    transform: translateX(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    top: 100%;
    transform: translateX(100px) rotate(360deg);
  }
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-15px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
</style>
