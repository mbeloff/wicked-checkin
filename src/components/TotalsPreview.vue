<template>
  <div class="pt-4 text-xs">
    <p class="text-xs font-bold">Selected Options</p>
    <div
      v-for="el in props.totals.filter((el) => el.type == 'optional')"
      class="flex justify-between"
    >
      <span>{{ el.name }}</span
      ><span>{{ symbol + el.total.toFixed(2) }}</span>
    </div>
    <p class="text-xs font-bold">Mandatory Fees</p>
    <div
      v-for="el in props.totals.filter((el) => el.type == 'mandatory')"
      class="flex justify-between"
    >
      <span>{{ el.name }}</span
      ><span>{{ symbol + el.total.toFixed(2) }}</span>
    </div>
    <div
      v-for="el in props.totals.filter((el) => el.type == 'insurance')"
      class="flex justify-between"
    >
      <span>{{ el.name }}</span
      ><span>{{ symbol + el.total.toFixed(2) }}</span>
    </div>
    <div class="mt-2 flex justify-between">
      <span
        >Daily Rate @
        {{
          symbol +
          store.bookinginfo.rateinfo[0].dailyrateafterdiscount.toFixed(2)
        }}</span
      ><span>{{
        symbol +
        props.totals.find((el) => el.type == "total rate").total.toFixed(2)
      }}</span>
    </div>
    <div class="mt-2 flex justify-between text-sm">
      <span>Total</span
      ><span>{{
        symbol + props.totals.find((el) => el.type == "total").total.toFixed(2)
      }}</span>
    </div>
    <template
      v-for="tax in props.totals.filter(
        (el) => el.type == 'country tax' || el.type == 'state tax'
      )"
    >
      <p v-if="tax.total" class="text-right">
        (includes
        {{ tax.name }} of: {{ symbol + tax.total.toFixed(2) }})
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "@/store";
const store = useStore();
const props = defineProps({
  totals: {
    type: Array,
    default: null,
  },
});
const currency = computed(() => store.bookinginfo.bookinginfo[0].currencyname);
const symbol = computed(() => store.bookinginfo.bookinginfo[0].currencysymbol);
</script>

<style lang="scss" scoped></style>
