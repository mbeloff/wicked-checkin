import Login from "./views/Login.vue";
import Manage from "./views/Manage.vue";
import NotFound from "./views/NotFound.vue";
import CheckPayment from "./views/CheckPayment.vue";

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
  { path: "/checkpayment", component: CheckPayment },
  { path: "/:path(.*)", component: NotFound },
];
