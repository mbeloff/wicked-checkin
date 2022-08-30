<template>
  <div class="grid h-full w-full place-items-center bg-white">
    <p class="text-xs" v-if="timer <= 300">
      session will time out in: {{ timer }}s
    </p>
    <div
      class="relative grid min-h-[250px] w-full place-items-center gap-2 rounded-lg bg-white text-left sm:w-1/2"
    >
      <StripeCheckout
        v-if="paymentIntent"
        :paymentIntent="paymentIntent"
      ></StripeCheckout>

    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, onUnmounted, onMounted } from "vue";
import StripeCheckout from "@/components/StripeCheckout.vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const route = useRoute();
const rcm = inject("rcm");
const store = useStore();
const emit = defineEmits(["update"]);
const timer = ref();
const customer = computed(() => {
  let cus = store.bookinginfo.customerinfo[0];
  return {
    email: cus.email,
    phone: cus.phone,
    name: cus.firstname + " " + cus.lastname,
  };
});

var requestOptions = {
  method: "POST",
  body: JSON.stringify({
    customer: customer.value,
    amount: store.bookinginfo.bookinginfo[0].balancedue * 100,
    currency: store.bookinginfo.bookinginfo[0].currencyname,
  }),
  redirect: "follow",
};
onMounted(() => {
  timer.value = (new Date(store.tokenexpires) - new Date()) / 1000 - 120;
  timerInterval;
});
const timerInterval = setInterval(() => {
  timer.value = (timer.value - 1).toFixed(0);
  if (timer.value < 1) {
    alert("Your session has timed out. The page will now refresh.");
    clearInterval(timerInterval);
    store.resref = "";
    cookies.remove("resref");
    store.token = "";
    cookies.remove("token");
    window.location.reload();
  }
}, 1000);
onUnmounted(() => {
  clearInterval(timerInterval);
});

const paymentIntent = await fetch(
  "/.netlify/functions/StripePayment",
  requestOptions
)
  .then((res) => res.text())
  .then((res) => {
    return JSON.parse(res);
  });
</script>

<style lang="postcss"></style>
