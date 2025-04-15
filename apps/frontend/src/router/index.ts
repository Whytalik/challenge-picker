import { createRouter, createWebHistory } from "vue-router";
import ChallengePage from "@/pages/ChallengePage.vue";

const routes = [
  {
    path: "/challenge",
    name: "Challenge",
    component: ChallengePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
