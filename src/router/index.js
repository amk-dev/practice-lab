import Vue from "vue";
import VueRouter from "vue-router";
import Replay from "../views/Replay.vue";
import Sessions from '../views/Sessions.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/replay/:symbol/:resolution/:from/:to",
    name: "Home",
    component: Replay
  },
  {
    path: "/dashboard/sessions",
    name: "Sessions",
    component: Sessions
  },
  {
    path: "/sessions/:session",
    name: "SessionChart",
    component: Replay
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
