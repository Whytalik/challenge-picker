import { createRouter, createWebHistory } from "vue-router";
import ChallengePage from "@/pages/ChallengePage.vue";
import ChallengeListPage from "@/pages/ChallengeListPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Update document title based on route
router.beforeEach((to, _from, next) => {
  const pageTitle = to.meta.title as string;

  if (pageTitle) {
    document.title = `Challenge Picker | ${pageTitle}`;
  } else {
    document.title = "Challenge Picker";
  }

  next();
});

export default router;
