<template>
  <div
    class="w-max-screen-xl relative grid h-full w-full place-items-center py-4"
  >
    <div class="max-w-screen-md">
      <i
        v-if="status == 'succeeded'"
        class="far fa-check-circle fa-3x fa-beat mb-5"
        style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 2"
      ></i>
      <i
        v-if="status == 'processing'"
        class="far fa-loader fa-3x fa-beat mb-5"
        style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 2"
      ></i>
      <i
        v-if="status == 'requires_payment_method'"
        class="far fa-face-confused fa-3x fa-beat mb-5"
        style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 2"
      ></i>
      <p>{{ message }}</p>
      <p class="mt-5 text-xs">{{ countdownmessage }}</p>
    </div>

    <LoadingOverlay v-if="loading" class="pb-4"></LoadingOverlay>
  </div>
</template>

<script setup>
import { useStore } from "@/store.js";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed, onBeforeMount, inject } from "vue";
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

onBeforeMount(async () => {
  const PK =
    route.query.cname == "USD"
      ? import.meta.env.VITE_STRIPE_PK_USA
      : import.meta.env.VITE_STRIPE_PK;
  stripe.value = Stripe(PK);
  let params = {
    method: "bookinginfo",
    reservationref: store.resref,
  };
  store.bookinginfo = await rcm(params).then((res) => {
    // mode 2 = quote, 3 = post-booking
    store.bookinginfo = res.results;
    bookingmode.value = store.bookinginfo.bookinginfo[0].isquotation ? 2 : 3;
    return res.results;
  });
});

const cardholder = computed(() => {
  if (decodeURIComponent(route.query.cardholder)) {
    return decodeURIComponent(route.query.cardholder);
  } else {
    return "";
  }
});

const clientSecret = route.query.payment_intent_client_secret;

const message = ref("");
const countdownmessage = ref("");
onMounted(() => {
  const checkPayment = stripe.value
    .retrievePaymentIntent(clientSecret)
    .then(({ paymentIntent }) => {
      payment.value = paymentIntent;
      loading.value = false;
      status.value = paymentIntent.status;

      switch (paymentIntent.status) {
        case "succeeded": {
          message.value = "Success! Your payment has been saved.";
          getCard(paymentIntent.payment_method);
          break;
        }

        case "processing": {
          let timer = 15;
          message.value = `Your payment seems to be taking longer than usual to process. Please wait a moment and we'll try again, or contact us via email so we can manually confirm your payment.`;
          const countdown = setInterval(() => {
            countdownmessage.value = `Checking again in ${timer}seconds.`;
            timer--;

            if (timer < 1) {
              clearInterval(countdown);
              window.location.reload();
            }
          }, 1000);
          break;
        }

        case "requires_payment_method": {
          let timer = 10;
          message.value = `Failed to process payment details. Please check your payment details and try again.`;
          const countdown = setInterval(() => {
            countdownmessage.value = `Redirecting in ${timer}seconds`;
            timer--;

            if (timer < 1) {
              clearInterval(countdown);
              router.push({ name: "Manage" });
            }
          }, 1000);
          break;
        }

        default:
          message.value = "Something went wrong.";
          break;
      }
    });
  checkPayment;
});

const getCard = (pm) => {
  fetch("/.netlify/functions/StripeCard", {
    method: "POST",
    body: JSON.stringify({
      pm: pm,
      currency: store.bookinginfo.bookinginfo[0].currencyname,
    }),
  })
    .then((res) => res.text())
    .then((res) => {
      card.value = JSON.parse(res);
      confirmPayment(card.value);
    })
    .catch((err) => {
      alert("an error occurred. please contact online@wickedcampers.com.");
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

  rcm(params)
    .then((res) => {
      if (bookingmode.value == 2) {
        convertQuote();
        return;
      }
      router.push({ name: "Manage" });
    })
    .catch((err) => {
      console.log("payment not confirmed");
      alert(
        "Something went wrong while recording your payment. Please contact us via email online@wickedcampers.com so we can resolve this."
      );
      router.push({ name: "Manage" });
    });
};

function convertQuote() {
  let opts = store.bookinginfo.extrafees
    .filter((el) => el.isoptionalfee && !el.isinsurancefee)
    .map((el) => {
      return { id: el.extrafeeid, qty: el.qty };
    });
  let params = {
    method: "convertquote",
    reservationref: store.resref,
    emailoption: 1,
    extrakmsid: store.bookinginfo.bookinginfo[0].kmcharges_id,
    insuranceid: store.bookinginfo.extrafees.find((el) => el.isinsurancefee)
      .extrafeeid,
    customer: { ...store.bookinginfo.customerinfo[0] },
    optionalfees: opts,
  };
  rcm(params).then((data) => {
    if (data.status == "ERR") console.log("error converting quote");
    if (data.status == "OK") console.log("quote converted");
    router.push({ name: "Manage" });
  });
}
</script>

<style lang="scss" scoped></style>
