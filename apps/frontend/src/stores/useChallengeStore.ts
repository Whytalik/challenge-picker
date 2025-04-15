import { defineStore } from "pinia";
import { api } from "@/api";

interface Challenge {
  id: string;
  title: string;
  description: string;
  complexity: string;
}

export const useChallengeStore = defineStore("challenge", {
  state: () => ({
    randomChallenge: null as Challenge | null,
  }),

  actions: {
    async createChallenge(payload: Omit<Challenge, "id">) {
      const { data } = await api.post("/challenge", payload);
      return data;
    },

    async getRandomChallenge() {
      const { data } = await api.get("/challenge/random");
      this.randomChallenge = data;
      return data;
    },
  },
});
