<template>
  <div
    class="group mb-5 flex cursor-pointer rounded bg-gray-200 py-2 px-2 text-sm shadow-lg ring-2 ring-primary-500 hover:bg-gray-100"
  >
    <div class="flex flex-1 flex-col gap-2 text-left">
      <template v-if="store.mode == 2"
        ><p>
          <span class="font-bold">Welcome to Online Checkin:</span> Please
          review each section below and ensure all details are complete and
          correct prior to your pickup date.
        </p>
        <p>
          <i class="far fa-circle-exclamation text-red-500"></i> This symbol
          indicates a section that is incomplete.
        </p>
      </template>
      <template v-else>
        <p>
          <i class="far fa-check-circle text-accent-500"></i> To convert this
          quote into a booking, please add a payment method below.
        </p>
      </template>
    </div>
    <div class="grid h-6 w-6 place-items-center rounded bg-white border">
      <i class="far fa-times fa-fw group-hover:text-primary-500"></i>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
const store = useStore();
</script>

<style lang="scss" scoped></style>
