<template>
  <div id="app" class="max-w-screen grid min-h-screen">
    <the-navbar v-if="route.name != 'Check'"></the-navbar>
    <main class="-mt-14 min-h-screen pt-14">
      <router-view />
    </main>
    <the-footer v-if="route.name != 'Check'"></the-footer>
  </div>
</template>

<script setup>
import TheNavbar from "@/components/TheNavbar.vue";
import TheFooter from "@/components/TheFooter.vue";
import { provide } from "vue";
import { useStore } from "@/store";
import { useCookies } from "vue3-cookies";
import { onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
const { cookies } = useCookies();
const store = useStore();
const route = useRoute();
onMounted(() => {
  if (cookies.get("token")) {
    store.token = cookies.get("token").access_token;
    store.tokenexpires = cookies.get("token")[".expires"];
  }
  if (cookies.get("resref")) {
    store.resref = cookies.get("resref");
  }
});

onBeforeMount(() => {
  getToken();
});

const getToken = () => {
  var requestOptions = {
    method: "POST",
    redirect: "follow",
  };
  fetch("/.netlify/functions/getToken", requestOptions)
    .then((response) => response.text())
    .then((response) => {
      const res = JSON.parse(response);
      store.token = res.access_token;
      store.tokenexpires = res[".expires"];
      cookies.set("token", response);
    })
    .catch((error) => console.log("error", error));
};

const rcm = async (method) => {
  let expired = new Date(store.tokenexpires).getTime() < new Date().getTime();
  if (expired) {
    cookies.remove("token");
    store.token = "";
    store.tokenexpires = "";
    alert("Your session has expired. The page will now refresh.");
    window.location.reload();
    return;
  }
  var requestOptions = {
    headers: {
      Authorization: "Bearer " + store.token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(method),
  };
  return await fetch("https://api.rentalcarmanager.com/v32/api", requestOptions)
    .then((response) => response.text())
    .then((response) => {
      return JSON.parse(response);
    });
};

provide("rcm", rcm);
provide("getToken", getToken);
</script>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");
#app {
  font-family: "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.my-input {
  padding: 0.35rem;
  @apply flex-1 rounded border bg-gray-200 accent-accent-500;
}
.my-input:focus {
  @apply bg-white outline-none ring-2 ring-accent-500;
}
.my-label {
  @apply text-xs text-gray-500;
}
</style>
