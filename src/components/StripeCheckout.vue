<template>
  <div id="form" class="relative w-full">
    <LoadingOverlay v-if="loading"></LoadingOverlay>
    <div class="py-4">
      <div class="relative mb-2">
        <label class="my-label" for="cardname">Cardholder name</label>
        <input
          class="w-full rounded border py-2 px-3 uppercase text-gray-600 outline-none ring-[#0573e157] placeholder:text-gray-500/80 focus:border-gray-400/90 focus:ring-[3px]"
          :class="{ 'ring-2 ring-[#dc1b40]': cardholdererror }"
          type="text"
          name="cardname"
          id="cardname"
          placeholder="John Doe"
          maxlentgh="25"
          v-model="cardholder"
        />
        <p class="text-[15px] text-[#dc1b40]" v-if="cardholdererror">
          {{ cardholdererror }}
        </p>
      </div>
      <label ref="cardEl" id="cardEl"></label>
    </div>
    <p id="error-message"></p>
    <div class="flex w-full justify-end">
      <button
        :disabled="loading"
        @click="submit"
        class="mt-5 w-full rounded bg-gradient-to-tr from-accent-400 to-accent-600 py-2 px-4 text-sm text-white sm:w-1/2"
        id="submit"
      >
        Pay
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeMount } from "vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { useStore } from "@/store.js";
const store = useStore();
const props = defineProps({
  paymentIntent: {
    type: Object,
  },
});
const stripe = ref(null);
const cardEl = ref(null);
const loading = ref(true);
onBeforeMount(() => {
  const PK =
    store.bookinginfo.bookinginfo[0].currencyname == "USD"
      ? import.meta.env.VITE_STRIPE_PK_USA
      : import.meta.env.VITE_STRIPE_PK;
  stripe.value = Stripe(PK);
});

const options = {
  clientSecret: props.paymentIntent.secret,
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Poppins",
    },
  ],
  appearance: {
    variables: {
      fontFamily: "Poppins, system-ui, sans-serif",
      // See all possible variables below
    },
    rules: {
      ".Label": {
        color: "#71717A",
        fontSize: "12px",
      },
    },
  },
};
const eloptions = {
  terms: { card: "never" },
};
const elements = ref(null);
onMounted(() => {
  elements.value = stripe.value.elements(options);
});

watch(elements, (val) => {
  const cardElement = val.create("payment", eloptions);
  cardElement.mount("#cardEl");
  loading.value = false;
});

const cardholder = ref("");
const cardholdererror = ref(null);

watch(cardholder, () => {
  if (cardholder.value.length > 0) {
    cardholdererror.value = null;
  }
});

const submit = async () => {
  cardholdererror.value = null;
  if (!cardholder.value) {
    cardholdererror.value = "Cardholder name is incomplete";
    return;
  }
  if (/^[a-zA-z'-][a-zA-z' -]{1,25}$/.test(cardholder.value)) {
    cardholdererror.value = null;
  } else {
    cardholdererror.value =
      "Cardholder name is an improper length, or contains invalid characters";
    return;
  }

  cardholdererror.value = null;
  loading.value = true;
  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url:
        import.meta.env.VITE_LOCALHOST ||
        store.company.baseurl +
          "/stripe?cardholder=" +
          encodeURIComponent(cardholder.value) +
          "&cid=" +
          props.paymentIntent.cid,
    },
  });

  if (error) {
    const messageContainer = document.querySelector("#error-message");
    messageContainer.textContent = error.message;
    loading.value = false;
  } else {
    loading.value = false;
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
};
</script>

<style lang="scss" scoped></style>
