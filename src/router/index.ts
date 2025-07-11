import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ShowDetail from "../views/ShowDetail.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/show/:id", name: "ShowDetail", component: ShowDetail },
  // handle http://localhost:5173/show/nvjnv :  redirect to home page
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
