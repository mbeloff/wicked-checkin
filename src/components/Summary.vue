<template>
  <div
    class="mx-auto mb-5 flex w-full flex-col justify-between rounded bg-gray-300 py-4 text-sm"
  >
    <p class="mb-5 font-bold">
      {{ bookinginfo.bookinginfo[0].reservationstatus }}:
      {{ bookinginfo.bookinginfo[0].reservationdocumentno }}
      <br />
      {{
        bookinginfo.customerinfo[0].firstname +
        " " +
        bookinginfo.customerinfo[0].lastname
      }}
    </p>
    <p class="mb-5">
      {{ trip.vehiclecategory }}
    </p>

    <div class="mb-5 flex items-center font-bold">
      <span class="flex-grow text-right"
        >{{ trip.pickuplocationname }}<br />{{
          new Date(trip.pickupdate).toDateString()
        }}
      </span>
      <i class="fas fa-route fa-fw mx-4 text-lg text-blue-600"></i>
      <span class="flex-grow text-left"
        >{{ trip.pickuplocationname }}<br />{{
          new Date(trip.dropoffdate).toDateString()
        }}</span
      >
    </div>

    <div>
      <p
        class="mb-5 cursor-pointer italic text-blue-700 underline hover:no-underline"
        @click="showMore = !showMore"
      >
        {{ showMore ? "hide details" : "show more details" }}
      </p>
    </div>
    <div
      class="mx-auto mb-5 w-full max-w-[400px] px-2 text-xs"
      v-show="showMore"
    >
      <div class="flex justify-between">
        <span>{{
          rate.numberofdays +
          " days @ " +
          trip.currencysymbol +
          rate.dailyrateafterdiscount.toFixed(2) +
          "/day"
        }}</span>
        <span>{{ trip.currencysymbol + rate.ratesubtotal.toFixed(2) }}</span>
      </div>
      <div
        class="flex justify-between"
        v-for="item in fees"
        :key="item.extrafeeid"
      >
        <span>{{ item.name }}</span
        ><span>{{ trip.currencysymbol + item.totalfeeamount.toFixed(2) }}</span>
      </div>
      <div class="mt-4 flex justify-between">
        <span>Total</span><span>{{ trip.totalcost.toFixed(2) }}</span>
      </div>
      <p class="mt-1 text-right">
        (includes GST of: {{ trip.currencysymbol + trip.gst }})
      </p>
    </div>
    <div v-if="store.mode == 2" class="bg-gray-200">
      <div
        class="mx-auto flex w-full max-w-[400px] justify-between py-5 px-2 font-bold"
      >
        <span>Balance Due:</span
        ><span
          >{{ trip.currencyname + trip.currencysymbol
          }}{{ trip.balancedue.toFixed(2) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store.js";
import { computed, ref } from "vue";
const props = defineProps({
  bookinginfo: {
    type: Object,
    default: null,
    required: true,
  },
});
const showMore = ref(false);
const store = useStore();
const trip = computed(() => props.bookinginfo.bookinginfo[0]);
const fees = computed(() => props.bookinginfo.extrafees);
const rate = computed(() => props.bookinginfo.rateinfo[0]);
</script>

<style lang="scss"></style>
