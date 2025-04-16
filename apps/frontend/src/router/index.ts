import { createRouter, createWebHistory } from "vue-router";
import ChallengePage from "@/pages/ChallengePage.vue";
import ChallengeListPage from "@/pages/ChallengeListPage.vue";
import ChallengeHistoryPage from "@/pages/ChallengeHistoryPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ChallengePage,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/challenge",
    name: "Challenge",
    component: ChallengePage,
    meta: {
      title: "Challenge",
    },
  },
  {
    path: "/challenges",
    name: "ChallengeList",
    component: ChallengeListPage,
    meta: {
      title: "All Challenges",
    },
  },
  {
    path: "/history",
    name: "History",
    component: ChallengeHistoryPage,
    meta: {
      title: "Challenge History",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Update document title based on route
router.beforeEach((to, _from, next) => {
  const pageTitle = to.meta.title as string;
  document.title = pageTitle ? `Challenge Picker | ${pageTitle}` : "Challenge Picker";
  next();
});

export default router;
