<template>
  <div
    class="w-max-screen-xl relative grid h-full w-full place-items-center py-4"
  >
    {{ message }}
    <LoadingOverlay v-if="loading" class="pb-4"></LoadingOverlay>
  </div>
</template>

<script setup>
import { useStore } from "@/store.js";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, onMounted, computed, onBeforeMount, inject } from "vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
const route = useRoute();
const router = useRouter();
const store = useStore();
const stripe = ref(null);
const loading = ref(true);
const card = ref(null);
const status = ref(null);
const payment = ref(null);
const bookingmode = ref(1);
const rcm = inject("rcm");
onBeforeMount(() => {
  stripe.value = Stripe(store.company.stripepublic);
  let params = {
    method: "bookinginfo",
    reservationref: store.resref,
  };
  rcm(params).then((res) => {
    // mode 2 = quote, 3 = post-booking
    bookingmode.value = res.results.bookinginfo[0].isquotation ? 2 : 3;
  });
});

const cardholder = computed(() => {
  if (decodeURIComponent(route.query.cardholder)) {
    return decodeURIComponent(route.query.cardholder);
  } else {
    return "";
  }
});

const clientSecret = new URLSearchParams(window.location.search).get(
  "payment_intent_client_secret"
);
const test = route.query.payment_intent_client_secret;
const paymentIntent = new URLSearchParams(window.location.search).get(
  "payment_intent"
);
const message = ref("");

onMounted(() => {
  stripe.value
    .retrievePaymentIntent(
      "pi_3LaS5HA5SpE5pm7w1MU5zQ8U_secret_uRS8Cioi4lhbONWmAdVD3Z8kq"
    )
    .then(({ paymentIntent }) => {
      payment.value = paymentIntent;
      loading.value = false;
      const success = "Success! Your payment method has been saved.";
      const processing = "Processing payment details.";
      const fail =
        "Failed to process payment details. Please check your payment details and try again.";
      status.value = paymentIntent.status;

      switch (paymentIntent.status) {
        case "succeeded": {
          message.value = success;
          getCard(paymentIntent.payment_method);
          break;
        }

        case "processing": {
          message.value = processing;
          // reload window after 5 seconds

          break;
        }

        case "requires_payment_method": {
          message.value = fail;
          // router.push({ name: "book-pay", query: { payment: "fail" } });
          // Redirect your user back to your payment page to attempt collecting
          // payment again

          break;
        }

        default:
          message.value = "Something went wrong.";
          break;
      }
    });
});

const getCard = (pm) => {
  fetch("/.netlify/functions/StripeCard", {
    method: "POST",
    body: JSON.stringify({ pm: pm }),
  })
    .then((res) => res.text())
    .then((res) => {
      card.value = JSON.parse(res);
      confirmPayment(card.value);
    })
    .catch((err) => {
      alert("an error occurred");
    });
};

const confirmPayment = async (card) => {
  let exp_month =
    card.card.exp_month <= 9
      ? "0" + card.card.exp_month.toString()
      : card.card.exp_month.toString();
  let exp_year = card.card.exp_year.toString().slice(2);
  let expiry = exp_month + "/" + exp_year;

  let params = {
    method: "confirmpayment",
    reservationref: store.resref,
    amount: payment.value.amount / 100,
    success: payment.value.status == "succeeded",
    paydate: new Date(payment.value.created * 1000).toLocaleDateString("en-AU"),
    paytype: card.card.brand,
    supplierid: 5,
    paysource: "Stripe Online Checkin",
    transactid: card.customer,
    transtype: "Payment",
    dpstxnref: payment.value.id,
    cardnumber: "############" + card.card.last4,
    cardexpiry: expiry,
    cardholder: cardholder.value,
    payscenario: bookingmode.value,
    emailoption: 1,
  };
  console.log("confirm payemnt********", params);
  rcm(params)
    .then((res) => {
      console.log(res);
      router.push({ name: "Manage" });
    })
    .catch((err) => {
      console.log("payment not confirmed");
      alert(
        "Something went wrong while recording your payment. Please contact us via email online@wickedcampers.com"
      );
      router.push({ name: "Manage" });
    });
};
</script>

<style lang="scss" scoped></style>
