<template>
  <div class="history-page page-container">
    <h1 class="page-title">Challenge History</h1>

    <div class="calendar-container card">
      <div class="calendar-navigation">
        <div class="calendar-controls">
          <button class="btn btn-primary nav-button" @click="goToToday">Today</button>
          <div class="month-navigation">
            <button class="month-nav" @click="previousMonth">←</button>
            <button class="month-nav" @click="nextMonth">→</button>
          </div>
        </div>
        <h2 class="current-month">
          {{
            currentDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })
          }}
        </h2>
      </div>

      <div class="calendar-grid">
        <div class="weekday" v-for="day in weekDays" :key="day">{{ day }}</div>
        <div
          v-for="{
            date,
            isCurrentMonth,
            hasChallenge,
            challenge,
          } in calendarDays"
          :key="date.toISOString()"
          class="calendar-day"
          :class="{
            'other-month': !isCurrentMonth,
            'has-challenge': hasChallenge,
            'is-today': isToday(date),
          }"
          @click="hasChallenge && challenge && showChallengeDetails(challenge)"
        >
          <span class="day-number">{{ date.getDate() }}</span>
          <div
            v-if="hasChallenge && challenge"
            class="challenge-info"
          >
            <div class="challenge-indicator"></div>
            <div class="challenge-title-preview">{{ truncateTitle(challenge.title) }}</div>
            <div v-if="challenge.tags && challenge.tags.length > 0" class="challenge-tags-preview">
              <span v-for="(tag, index) in challenge.tags.slice(0, 1)" :key="index">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="calendar-legend card">
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
import { ref, computed } from "vue";
import ChallengeDetailsModal from "@/components/ChallengeDetailsModal.vue";
import type { Challenge } from "@/stores/useChallengeStore";

interface CalendarChallenge extends Challenge {
  completedAt: Date;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasChallenge: boolean;
  challenge: CalendarChallenge | null;
}

const currentDate = ref(new Date());
const selectedChallenge = ref<CalendarChallenge | null>(null);
const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const goToToday = () => {
  currentDate.value = new Date();
};

const getCompletedChallenges = (): CalendarChallenge[] => {
  const challenges = JSON.parse(
    localStorage.getItem("completedChallenges") || "[]"
  );
  return challenges.map((challenge: any) => ({
    ...challenge,
    completedAt: new Date(challenge.completedAt),
  }));
};

const calendarDays = computed((): CalendarDay[] => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const completedChallenges = getCompletedChallenges();
  const days: CalendarDay[] = [];

  const prevMonth = new Date(year, month - 1);
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    days.push({
      date,
      isCurrentMonth: false,
      hasChallenge: false,
      challenge: null,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const challenge = completedChallenges.find(
      (c: CalendarChallenge) =>
        c.completedAt.getDate() === date.getDate() &&
        c.completedAt.getMonth() === date.getMonth() &&
        c.completedAt.getFullYear() === date.getFullYear()
    );

    days.push({
      date,
      isCurrentMonth: true,
      hasChallenge: !!challenge,
      challenge: challenge || null,
    });
  }

  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      isCurrentMonth: false,
      hasChallenge: false,
      challenge: null,
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

const showChallengeDetails = (challenge: CalendarChallenge) => {
  selectedChallenge.value = challenge;
};

const truncateTitle = (title: string) => {
  return title.length > 12 ? `${title.substring(0, 10)}...` : title;
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
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-navigation {
  display: flex;
  gap: var(--spacing-sm);
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
  border-radius: var(--radius-sm);
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
  border-radius: var(--radius-md);
  overflow: hidden;
}

.weekday {
  background-color: var(--color-secondary-light);
  color: var(--color-tertiary);
  padding: var(--spacing-sm);
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.calendar-day {
  background-color: var(--color-tertiary);
  aspect-ratio: 1;
  padding: var(--spacing-sm);
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 70px;
  overflow: hidden;
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
  position: relative;
}

.has-challenge:after {
  content: "";
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background-color: var(--color-secondary);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.has-challenge:hover {
  background-color: rgba(144, 238, 144, 0.5) !important;
  transform: translateY(-2px);
  transition: transform 0.2s;
  box-shadow: var(--shadow-sm);
}

.challenge-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1.2rem;
  cursor: pointer;
}

.challenge-indicator {
  width: 10px;
  height: 10px;
  background-color: var(--color-secondary);
  border-radius: 50%;
  margin-bottom: 0.3rem;
}

.challenge-title-preview {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  text-align: center;
  width: 100%;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem;
}

.challenge-tags-preview {
  margin-top: 0.2rem;
  font-size: 0.65rem;
  color: var(--color-secondary);
  background-color: rgba(138, 43, 226, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.is-today {
  border: 2px solid var(--color-secondary);
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: var(--spacing-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  color: var(--color-primary);
}

.legend-indicator {
  width: 24px;
  height: 24px;
  background-color: rgba(144, 238, 144, 0.3);
  border-radius: var(--radius-sm);
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
    min-height: 60px;
  }

  .day-number {
    font-size: 0.7rem;
  }
  
  .challenge-title-preview {
    font-size: 0.6rem;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(138, 43, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
  }
}
</style>
