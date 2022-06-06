<template>
  <div class="relative gap-y-5 rounded border bg-white p-2 text-left">
    <p class="col-span-full my-3 text-xl font-bold text-green-500">
      {{ fullname }}
    </p>
    <p class="my-3 text-sm text-gray-500" v-if="store.allocated">
      Please read and sign each required section using your mouse, or finger/stylus
      if you are using a touch-screen device.
    </p>
    
    <p class="my-3 text-sm font-bold text-orange-500" v-if="!store.allocated">
      <i class="far fa-warning"></i> Please return here once your booking has
      been allocated.
    </p>

    <div
      v-for="signature in signatureList"
      :key="signature.signaturetemplateid"
    >
      <signature-block
        :fullname="fullname"
        @update-signature="getSignatures"
        :signature="signature"
      ></signature-block>
    </div>
  </div>
</template>

<script setup>
import SignatureBlock from "@/components/SignatureBlock.vue";
import { inject, onBeforeMount, ref, computed, watch } from "vue";
import { useStore } from "@/store";

const rcm = inject("rcm");
const store = useStore();
const props = defineProps({
  cid: Number,
});
const isPrimary = computed(() => {
  return store.bookinginfo.customerinfo[0].customerid == props.cid;
});
const fullname = computed(() => {
  if (isPrimary.value)
    return `${store.bookinginfo.customerinfo[0].firstname} ${store.bookinginfo.customerinfo[0].lastname}`;

  let customer = store.bookinginfo.extradrivers.find(
    (driver) => driver.customerid == props.cid
  );
  return `${customer.firstname} ${customer.lastname}`;
});
const signatureList = ref([]);
const missing = computed(() => {
  return signatureList.value.filter((sig) => !sig.issigned).length;
});
watch(missing, (val) => {
  store.missing.customers[props.cid]["signatures"] = val;
});

function getSignatures() {
  let params = {
    method: "signaturelist",
    reservationref: store.resref,
  };
  rcm(params)
    .then((res) => {
      signatureList.value = res.results.filter(
        (el) => el.customerid == props.cid
      );
    })
    .catch((err) => console.log(err));
}

onBeforeMount(() => {
  getSignatures();
});
</script>

<style lang="scss"></style>
