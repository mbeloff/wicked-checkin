<template>
  <div class="grid h-full w-full place-items-center bg-gray-100">
    <div
      class="relative grid min-h-[250px] w-full min-w-[380px] place-items-center gap-2 rounded-lg bg-white py-5 text-left"
    >
      <loading-overlay v-if="!payurl"></loading-overlay>
      <div ref="payForm" v-if="payurl">
        <iframe
          ref="wcframe"
          :src="payurl"
          width="400"
          height="700"
          scrolling="no"
        ></iframe>
      </div>
      <p class="text-xs" v-if="timer <= 300">
        session will time out in: {{ timer }}s
      </p>
      <!-- <div class="flex justify-start gap-2">
        <i class="fab fa-cc-visa fa-2x"></i>
        <i class="fab fa-cc-mastercard fa-2x"></i>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { inject, ref, onMounted, watch, onUnmounted } from "vue";
import { useStore } from "@/store";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const rcm = inject("rcm");
const store = useStore();
const payurl = ref("");
const emit = defineEmits(["update"]);
const paymentResponse = ref({});
const timer = ref();

onMounted(() => {
  requestWindcaveTransaction();
  timer.value = (new Date(store.tokenexpires) - new Date()) / 1000 - 120;
  timerInterval;
});

onUnmounted(() => {
  window.removeEventListener("message", listenFn);
  clearInterval(timerInterval);
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

function listenFn(event) {
  if (event.data.TxnType) {
    paymentResponse.value = event.data;
    payurl.value = "";
    window.removeEventListener("message", listenFn);
  }
}

function requestWindcaveTransaction() {
  window.addEventListener("message", listenFn, false);
  let baseurl = import.meta.env.VITE_LOCALHOST || store.company.baseurl;
  let currency = store.bookinginfo.bookinginfo[0].currencyname;
  let amount = store.bookinginfo.bookinginfo[0].balancedue.toFixed(2);
  let resref = store.resref;
  var body = JSON.stringify({
    currency: currency,
    resref: resref,
    amount: amount,
    baseurl: baseurl,
  });
  var requestOptions = {
    method: "POST",
    body: body,
    redirect: "follow",
  };
  fetch("/.netlify/functions/reqtrans", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      let res = JSON.parse(result).Request.URI._text;
      payurl.value = res;
    })
    .catch((error) => {
      console.log("request transaction failed: ", error);
    });
}

watch(paymentResponse, (val) => {
  if (paymentResponse.value.Success._text == 1) {
    // rebilling token
    let params = {
      method: "confirmpayment",
      reservationref: store.resref,
      amount: val.AmountSettlement._text,
      success: val.Success._text,
      paytype: val.CardName._text,
      paydate:
        val.DateSettlement._text.slice(6, 8) +
        "/" +
        val.DateSettlement._text.slice(4, 6) +
        "/" +
        val.DateSettlement._text.slice(0, 4),
      supplierid: store.company.supplierid,
      transactid: val.DpsBillingId._text,
      dpstxnref: val.DpsTxnRef._text,
      cardholder: val.CardHolderName._text,
      paysource: "Online Checkin Windcave",
      cardnumber: val.CardNumber._text,
      cardexpiry:
        val.DateExpiry._text.slice(0, 2) + "/" + val.DateExpiry._text.slice(2),
      transtype: "Payment",
      payscenario: store.mode == 1 ? 2 : 3,
    };

    rcm(params)
      .then((res) => {
        if (store.mode == 1) {
          convertQuote();
        }
        emit("update");
      })
      .catch((err) => console.log(err));
  } else if (paymentResponse.value.Success._text == 0) {
    // no need for a message for allridey as, windcave has a follow up page before redirecting
    requestWindcaveTransaction();
  }
});

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
    if (data.status == "OK") {
      alert(
        "Thank you for your booking.\nKeep an eye on your email for a booking confirmation."
      );
      emit("update");
    }
  });
}
</script>

<style lang="scss"></style>
