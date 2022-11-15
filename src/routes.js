import Login from "./views/Login.vue";
import Manage from "./views/Manage.vue";
import NotFound from "./views/NotFound.vue";
import CheckStripe from "./views/CheckStripe.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    path: "/:?",
    name: "Sign In",
    component: Login,
    meta: { title: "Sign In" },
    props: true,
  },
  {
    path: "/manage",
    name: "Manage",
    component: Manage,
    meta: { title: "Manage" },
  },
  { name: "Check", path: "/checkpayment", component: CheckStripe },
  { path: "/:path(.*)", component: NotFound },
];
