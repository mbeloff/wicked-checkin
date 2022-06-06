import { createApp } from "vue";
import "./tailwind.css";
import App from "./App.vue";
import { DatePicker } from "v-calendar";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import VueSignaturePad from "vue-signature-pad";
import { createPinia } from "pinia";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app
  .use(router)
  .use(createPinia())
  .use(VueSignaturePad)
  .component("DatePicker", DatePicker);
app.mount("#app");
