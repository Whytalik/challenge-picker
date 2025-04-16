<template>
  <div class="history-page">
    <h1 class="page-title">Challenge History</h1>
    
    <div class="calendar-container">
      <div class="calendar-navigation">
        <div class="calendar-controls">
          <button class="nav-button" @click="goToToday">Today</button>
          <div class="month-navigation">
            <button class="month-nav" @click="previousMonth">←</button>
            <button class="month-nav" @click="nextMonth">→</button>
          </div>
        </div>
        <h2 class="current-month">
          {{ currentDate.toLocaleString('en', { month: 'long', year: 'numeric' }) }}
        </h2>
      </div>

      <div class="calendar-grid">
        <div class="weekday" v-for="day in weekDays" :key="day">{{ day }}</div>
        <div
          v-for="{ date, isCurrentMonth, hasChallenge, challenge } in calendarDays"
          :key="date.toISOString()"
          class="calendar-day"
          :class="{
            'other-month': !isCurrentMonth,
            'has-challenge': hasChallenge,
            'is-today': isToday(date)
          }"
          @click="hasChallenge && showChallengeDetails(challenge)"
        >
          <span class="day-number">{{ date.getDate() }}</span>
          <div v-if="hasChallenge" class="challenge-indicator" :title="challenge.title"></div>
        </div>
      </div>
    </div>

    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-indicator"></div>
        <span>Completed Challenge</span>
      </div>
      <div class="legend-item">
        <div class="legend-indicator today"></div>
        <span>Today</span>
      </div>
    </div>

    <ChallengeDetailsModal
      v-if="selectedChallenge"
      :challenge="selectedChallenge"
      @close="selectedChallenge = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ChallengeDetailsModal from '@/components/ChallengeDetailsModal.vue';

const currentDate = ref(new Date());
const selectedChallenge = ref(null);
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const goToToday = () => {
  currentDate.value = new Date();
};

const getCompletedChallenges = () => {
  const challenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
  return challenges.map(challenge => ({
    ...challenge,
    completedAt: new Date(challenge.completedAt)
  }));
};

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const completedChallenges = getCompletedChallenges();
  const days = [];
  
  const prevMonth = new Date(year, month - 1);
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    days.push({
      date,
      isCurrentMonth: false,
      hasChallenge: false,
      challenge: null
    });
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const challenge = completedChallenges.find(c => 
      c.completedAt.getDate() === date.getDate() &&
      c.completedAt.getMonth() === date.getMonth() &&
      c.completedAt.getFullYear() === date.getFullYear()
    );
    
    days.push({
      date,
      isCurrentMonth: true,
      hasChallenge: !!challenge,
      challenge
    });
  }
  
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      isCurrentMonth: false,
      hasChallenge: false,
      challenge: null
    });
  }
  
  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1
  );
};

const showChallengeDetails = (challenge) => {
  selectedChallenge.value = challenge;
};
</script>

<style scoped>
.history-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-primary-dark);
}

.calendar-container {
  background-color: var(--color-tertiary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.calendar-navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-navigation {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  background-color: var(--color-secondary-light);
  color: var(--color-tertiary);
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: var(--color-secondary);
}

.month-nav {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary-light);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.month-nav:hover {
  background-color: var(--color-primary-light);
  color: var(--color-tertiary);
}

.current-month {
  font-size: 1.2rem;
  color: var(--color-primary-dark);
  margin: 0;
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--color-primary-light);
  border-radius: 8px;
  overflow: hidden;
}

.weekday {
  background-color: var(--color-secondary-light);
  color: var(--color-tertiary);
  padding: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.calendar-day {
  background-color: var(--color-tertiary);
  aspect-ratio: 1;
  padding: 0.5rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-day:hover {
  background-color: var(--color-primary-light);
}

.other-month {
  opacity: 0.4;
}

.day-number {
  font-size: 0.8rem;
  color: var(--color-primary);
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
}

.has-challenge {
  background-color: rgba(144, 238, 144, 0.3) !important;
  cursor: pointer;
}

.has-challenge:hover {
  background-color: rgba(144, 238, 144, 0.5) !important;
}

.challenge-indicator {
  display: none;
}

.is-today {
  border: 2px solid var(--color-secondary);
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--color-tertiary);
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-primary);
}

.legend-indicator {
  width: 24px;
  height: 24px;
  background-color: rgba(144, 238, 144, 0.3);
  border-radius: 4px;
}

.legend-indicator.today {
  background-color: transparent;
  border: 2px solid var(--color-secondary);
}

@media (max-width: 600px) {
  .calendar-container {
    padding: 1rem;
  }

  .calendar-day {
    padding: 0.3rem;
  }

  .day-number {
    font-size: 0.7rem;
  }
}
</style> 