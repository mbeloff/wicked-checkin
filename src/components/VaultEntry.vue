<template>
  <div class="grid h-full w-full place-items-center bg-gray-100">
    <div
      class="relative grid min-h-[250px] w-full min-w-[380px] place-items-center gap-2 rounded-lg bg-white py-5 text-left"
    >
      <loading-overlay v-if="!vaulturl"></loading-overlay>
      <iframe
        v-if="vaulturl"
        :src="vaulturl"
        frameborder="0"
        width="380"
        height="250"
      ></iframe>
      <div class="flex justify-start gap-2">
        <i class="fab fa-cc-visa fa-2x"></i>
        <i class="fab fa-cc-mastercard fa-2x"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { inject, onBeforeMount, onMounted, ref, onUnmounted } from "vue";
import { useStore } from "@/store";

const rcm = inject("rcm");
const store = useStore();
const vaulturl = ref("");
const note = ref("");

const emit = defineEmits(["update"]);

function getVaultUrl() {
  let params = {
    method: "getvaulturl",
    reservationref: store.resref,
  };
  rcm(params).then((res) => {
    vaulturl.value = atob(res.results.url);
    note.value = res.results.vaultnote;
  });
}

function convertQuote(vaultdata) {
  let params = {
    method: "convertquote",
    reservationref: store.resref,
    emailoption: 1,
    extrakmsid: store.bookinginfo.bookinginfo[0].kmcharges_id,
    insuranceid: store.bookinginfo.extrafees.find((el) => el.isinsurancefee)
      .extrafeeid,
    customer: { ...store.bookinginfo.customerinfo[0] },
    vaultdata: vaultdata,
  };
  rcm(params).then((data) => {
    if (data.status == "ERR")
      alert(
        "We were unable to convert this quote to a booking request.\nPlease try again and contact us if the problem persists."
      );
    if (data.status == "OK") {
      alert(
        "Thank you for requesting a reservation!\nWe will be in touch once your booking has been confirmed."
      );
      emit("update");
    }
  });
}

function vaultEntry(data) {
  let base64 = btoa(data);
  if (store.mode == 1) {
    convertQuote(base64);
    return;
  }
  let params = {
    method: "vaultentry",
    reservationref: store.resref,
    data: base64,
    payscenario: 2,
    emailoption: 0,
  };
  rcm(params).then((res) => {
    if (res.results.paymentsaved == true) {
      emit("update");
    } else {
      alert(
        "We were unable to save you payment details.\nPlease try again and contact us if the problem persists."
      );
      getVaultUrl();
    }
  });
}

onBeforeMount(() => {
  getVaultUrl();
});

let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
let eventer = window[eventMethod];
let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

onMounted(() => {
  eventer(messageEvent, listenFn), false;
});

function listenFn(e) {
  let key = e.message ? "message" : "data";
  let data = e[key];
  if (data) {
    let split = data.split(",");
    if (split[5] == "ADD") {
      // save payment with rcm api
      vaultEntry(data);
      window.removeEventListener(messageEvent, listenFn);
    }
  }
}

onUnmounted(() => {
  window.removeEventListener(messageEvent, listenFn);
});
</script>

<style lang="scss"></style>
