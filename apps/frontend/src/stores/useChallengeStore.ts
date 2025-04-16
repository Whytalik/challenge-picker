import { defineStore } from "pinia";
import { apiService } from "@/api";

export interface Challenge {
  id: string;
  title: string;
  description: string;
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
      this.loading = true;
      this.error = undefined;
      try {
        const { data } = await apiService.challenges.create(payload);
        this.challenges.push(data);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create challenge";
        this.error = errorMessage;
        console.error("Error creating challenge:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getRandomChallenge() {
      this.loading = true;
      this.error = undefined;
      try {
        const { data } = await apiService.challenges.getRandom();
        this.randomChallenge = data;
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get random challenge";
        this.error = errorMessage;
        console.error("Error getting random challenge:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getAllChallenges() {
      this.loading = true;
      this.error = undefined;
      try {
        const { data } = await apiService.challenges.getAll();
        this.challenges = data;
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get all challenges";
        this.error = errorMessage;
        console.error("Error fetching challenges:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
