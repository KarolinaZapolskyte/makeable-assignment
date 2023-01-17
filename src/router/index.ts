import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/easy-questions",
      name: "easy questions",
      component: () => import("../views/EasyQuestionsView.vue"),
    },
    {
      path: "/medium-questions",
      name: "medium questions",
      component: () => import("../views/MediumQuestionsView.vue"),
    },
    {
      path: "/hard-questions",
      name: "hard questions",
      component: () => import("../views/HardQuestionsView.vue"),
    },
  ],
});

export default router;
