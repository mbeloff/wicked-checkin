<template>
  <div class="relative grid h-full content-start gap-5 bg-gray-700 py-10 px-2 pb-40">
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="mx-auto w-full max-w-screen-lg">
      <the-summary
        @convert="convertQuote()"
        v-if="gotBooking"
        :bookinginfo="bookinginfo"
      >
      </the-summary>
      <checkin-steps @update="getBooking()" v-if="gotBooking"></checkin-steps>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, inject, watch } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import TheSummary from "@/components/Summary.vue";
import CheckinSteps from "@/components/CheckinSteps.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

const rcm = inject("rcm");
const router = useRouter();
const store = useStore();
const loading = ref(true);
const ready = ref(false);
const gotBooking = computed(() => {
  if (store.bookinginfo.bookinginfo) return true;
});

const bookinginfo = computed(() => store.bookinginfo);

function getCountries() {
  let method = {
    method: "countries",
  };
  rcm(method).then((results) => {
    store.countries = results.results;
  });
}

function checkStatus(trip) {
  if (trip.isquotation != trip.isvalidquotation) {
    router.push({ name: "Sign In", query: { validquote: false } });
  }
  let s = trip.reservationstatus;
  if (s != "Reservation" && s != "Quotation" && s != "Reservation Request") {
    router.push({ name: "Sign In", query: { validres: false } });
  }
  store.mode = s == "Quotation" ? 1 : 2;
  store.status = s;

  if (trip.vehicle_registrationnumber.length) {
    store.allocated = true;
  } else {
    store.allocated = false;
  }
}

function getBooking() {
  let resref = store.resref;
  loading.value = true;
  ready.value = false;
  let params = {
    method: "bookinginfo",
    reservationref: resref,
  };
  rcm(params)
    .then((response) => {
      if (response.status == "OK") {
        checkStatus(response.results.bookinginfo[0]);
        loading.value = false;
        store.bookinginfo = response.results;
        ready.value = true;
      } else if (response.status == "ERR") {
        console.log(response.error);
        router.push({
          name: "Sign In",
        });
      }
      if (response.Message) {
        console.log(response.Message);
        router.push({
          name: "Sign In",
        });
      }
      loading.value = false;
    })
    .catch((err) => {
      console.log("couldn't get booking info: " + err);
      router.push({
        name: "Sign In",
      });
    });
}

onBeforeMount(() => {
  // reset previous booking info in store
  store.bookinginfo = {};
  store.missing = {
    customers: {},
    vault: false,
  };
  getCountries();
  getBooking();
});
</script>

<style lang="postcss">
.active {
  @apply from-blue-800 to-blue-900 shadow-blue-800/30;
}
</style>
