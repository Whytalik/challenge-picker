import { defineStore } from "pinia";
import { apiService } from "@/api";
import type { AxiosError } from "axios";

export type Difficulty = "easy" | "medium" | "hard";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  category?: string;
}

function handleError(error: unknown): string {
  if (error && typeof error === "object" && "friendlyMessage" in error) {
    return error.friendlyMessage as string;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

async function executeApiRequest<T>(
  requestFn: () => Promise<T>,
  errorMessage: string,
  store: { loading: boolean; error?: string }
): Promise<T> {
  store.loading = true;
  store.error = undefined;

  try {
    return await requestFn();
  } catch (error) {
    store.error = handleError(error) || errorMessage;
    console.error(`API Error: ${errorMessage}`, error);
    throw error;
  } finally {
    store.loading = false;
  }
}

export const useChallengeStore = defineStore("challenge", {
  state: () => ({
    randomChallenge: null as Challenge | null,
    challenges: [] as Challenge[],
    loading: false,
    error: undefined as string | undefined,
  }),

  actions: {
    async createChallenge(payload: Omit<Challenge, "id">) {
      return executeApiRequest(
        async () => {
          const { data } = await apiService.challenges.create(payload);
          this.challenges.push(data);
          return data;
        },
        "Failed to create challenge",
        this
      );
    },

    async getRandomChallenge() {
      return executeApiRequest(
        async () => {
          const { data } = await apiService.challenges.getRandom();
          this.randomChallenge = data;
          return data;
        },
        "Failed to get random challenge",
        this
      );
    },

    async getAllChallenges() {
      return executeApiRequest(
        async () => {
          const { data } = await apiService.challenges.getAll();
          this.challenges = data;
          return data;
        },
        "Failed to get all challenges",
        this
      );
    },

    async updateChallenge(challenge: Challenge) {
      return executeApiRequest(
        async () => {
          const updatePayload: Partial<Challenge> = {};
          if (challenge.title) updatePayload.title = challenge.title;
          if (challenge.description !== undefined)
            updatePayload.description = challenge.description;
          if (challenge.difficulty)
            updatePayload.difficulty = challenge.difficulty;
          if (challenge.tags) updatePayload.tags = challenge.tags;
          if (challenge.category !== undefined)
            updatePayload.category = challenge.category;

          const { data } = await apiService.challenges.update(
            challenge.id,
            updatePayload
          );

          const index = this.challenges.findIndex((c) => c.id === challenge.id);
          if (index !== -1) {
            this.challenges.splice(index, 1, data);
          }

          if (
            this.randomChallenge &&
            this.randomChallenge.id === challenge.id
          ) {
            this.randomChallenge = data;
          }

          return data;
        },
        "Failed to update challenge",
        this
      );
    },

    async deleteChallenge(id: string) {
      return executeApiRequest(
        async () => {
          await apiService.challenges.delete(id);

          this.challenges = this.challenges.filter((c) => c.id !== id);

          if (this.randomChallenge && this.randomChallenge.id === id) {
            this.randomChallenge = null;
          }

          return true;
        },
        "Failed to delete challenge",
        this
      );
    },
  },
});
