<template>
  <div
    class="gap-y-5 rounded border bg-white p-2 text-center"
    v-if="store.bookinginfo.bookinginfo[0].balancedue <= 0"
  >
    <p class="text-2xl font-bold text-accent-500">PAID</p>
  </div>
  
  <div class="gap-y-5 rounded border bg-white p-2 text-left relative" v-else>
    <p class="font-bold sm:w-1/2 mx-auto mt-4">
        Balance Due:
        <span class="font-light">{{
          store.bookinginfo.bookinginfo[0].currencyname
        }}</span
        ><span>{{
          store.bookinginfo.bookinginfo[0].currencysymbol +
          store.bookinginfo.bookinginfo[0].balancedue.toFixed(2)
        }}</span>
      </p>
    <div v-if="showVault">
      <Windcave
        v-if="store.company.gateway == 'windcave'"
        @update="getVaultList(), emit('update')"
      ></Windcave>
      <suspense>
        <Stripe
          v-if="store.company.gateway == 'stripe'"
          @update="getVaultList(), emit('update')"
        ></Stripe>
        <template #fallback>
          <div class="min-h-[250px] w-full">
            <LoadingOverlay />
          </div>
        </template>
      </suspense>
    </div>
    <div class="grid place-items-center mt-2">      
      <my-button
        v-if="store.bookinginfo.bookinginfo[0].balancedue > 0"
        class=" mt-5 w-full rounded py-2 px-4 text-sm text-white sm:w-1/2"
        :class="{
          '!bg-gradient-none !bg-white !text-sm !text-red-500': showVault,
        }, {'bg-gradient-to-tr from-accent-500 to-accent-600 text-white':!showVault}"
        @click="showVault = !showVault"
      >
        <span v-if="!showVault"> Pay Now </span>
        <span v-else><i class="far fa-minus-circle"></i> Cancel Payment</span>
      </my-button>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/components/base/MyButton.vue";
import Windcave from "@/components/Windcave.vue";
import Stripe from "@/components/Stripe.vue";
import { ref, onBeforeMount, inject, watch } from "vue";
import { useStore } from "@/store";
import LoadingOverlay from '@/components/LoadingOverlay.vue'

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
    supplierid: store.company.supplierid
  };
  rcm(params).then((res) => {
    loading.value = false;
    vaultlist.value = res.results;
    vaultlist.value.splice(1, res.results.length);
  });
}
</script>

<style lang="scss" scoped></style>
