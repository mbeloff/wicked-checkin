<template>
  <div class="gap-y-5 rounded border bg-white p-2 text-left">
    <p class="my-3 text-sm text-gray-500" v-if="store.mode == 2">
      Safely store your credit card using the form below. Payment will only be
      taken once your vehicle has been confirmed.
    </p>
    <p class="my-3 text-sm text-gray-500" v-else>
      To convert this quote into a booking request, please provide a payment
      method using our secure form below. Payment will only be taken once your
      vehicle has been confirmed.
    </p>
    <div class="relative py-5 text-sm">
      <loading-overlay v-if="loading"></loading-overlay>
      <div v-if="vaultlist.length" class="grid grid-cols-4 border-b font-bold">
        <span>Type</span>
        <span>Name</span>
        <span>Card #</span>
        <span>Expiry</span>
      </div>
      <div
        class="grid grid-cols-4 odd:bg-gray-100"
        v-for="card in vaultlist"
        :key="card.dateadded"
      >
        <span class=""> {{ card.cardtype }}</span>
        <span class="truncate">{{ card.cardname }}</span>
        <span class="">{{ "**** " + card.lastfour }}</span>
        <span class="">{{ card.carddate }}</span>
      </div>
    </div>
    <div v-if="showVault">
      <vault-entry @update="getVaultList(), emit('update')"></vault-entry>
    </div>
    <div class="flex w-full justify-center">
      <my-button
        class="btn-green btn-green mt-5 w-full rounded py-2 px-4 text-sm text-white sm:w-1/2"
        @click="showVault = !showVault"
      >
        <span v-if="!showVault">
          <i class="far fa-plus-circle"></i> Add a Card
        </span>
        <span v-else><i class="far fa-minus-circle"></i> Cancel</span>
      </my-button>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/components/base/MyButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import VaultEntry from "@/components/VaultEntry.vue";
import { ref, onBeforeMount, inject, watch } from "vue";
import { useStore } from "@/store";

const store = useStore();
const rcm = inject("rcm");

const loading = ref(false);
const vaultlist = ref([]);
const showVault = ref(false);

const emit = defineEmits(["missing", "update"]);

watch(vaultlist, () => {
  store.missing.vault = vaultlist.value.length == 0;
});

onBeforeMount(() => {
  if (store.mode == 2) {
    getVaultList();
  } else vaultlist.value = [];
});

function getVaultList() {
  loading.value = true;
  showVault.value = false;
  const params = {
    method: "vaultlist",
    reservationref: store.resref,
  };
  rcm(params).then((res) => {
    loading.value = false;
    vaultlist.value = res.results;
    vaultlist.value.splice(1, res.results.length);
  });
}
</script>

<style lang="scss" scoped></style>
