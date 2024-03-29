<template>
  <div class="flex w-full flex-col gap-1">
    <expand-section
      :toggle="tab == 'main'"
      :label="'Customer Details'"
      @toggle="toggle('main')"
      :actionRequired="missingDetails(false) && store.mode == 2"
    >
      <modify-driver
        :key="customer.customerid"
        :customer="customer"
        :is-primary="true"
        @update="emit('update')"
      ></modify-driver>
      <modify-trip @update="emit('update')"></modify-trip>
    </expand-section>

    <expand-section
      v-if="store.mode == 2"
      :toggle="tab == 'extras'"
      @toggle="toggle('extras')"
      :label="'Extra Drivers'"
      :actionRequired="missingDetails(true) && store.mode == 2"
    >
      <add-driver
        @update="emit('update')"
        v-if="extraDrivers.length < 4 && store.mode == 2"
      ></add-driver>
      <template v-for="(driver, i) in extraDrivers" :key="driver.customerid">
        <div class="rounded bg-gray-700 px-2 py-1 text-gray-400">
          Extra Driver #{{ i + 1 }}
        </div>
        <modify-driver
          :is-extra="true"
          :customer="driver"
          @update="emit('update')"
        ></modify-driver>
      </template>
    </expand-section>

    <expand-section
    v-if="store.bookinginfo.rateinfo.length"
      :toggle="tab == 'fees'"
      @toggle="toggle('fees')"
      :label="'Booking Options'"
      :actionRequired="null"
    >
      <suspense>
        <modify-fees @update="emit('update')"></modify-fees>
      </suspense>
    </expand-section>

    <expand-section
      v-if="store.mode == 2"
      :toggle="tab == 'uploads'"
      @toggle="toggle('uploads')"
      :label="'Uploads'"
      :actionRequired="hasMissing('uploads')"
    >
      <modify-uploads
        :customer="customer"
        :cid="customer.customerid"
      ></modify-uploads>
      <modify-uploads
        v-for="(driver, i) in extraDrivers"
        :customer="driver"
        :key="driver.customerid"
        :cid="driver.customerid"
      ></modify-uploads>
    </expand-section>

    <expand-section
      v-if="store.mode == 2"
      :toggle="tab == 'signatures'"
      @toggle="toggle('signatures')"
      :label="'E-signatures'"
      :actionRequired="hasMissing('signatures') || !store.allocated"
    >
      <div
        class="relative gap-y-5 rounded border bg-white p-2 text-left"
        v-if="!store.allocated"
      >
        <p class="text-sm">
          The rental agreement for this booking is not ready for e-signing. Please check back later.
        </p>
      </div>
      <modify-signatures
        v-if="store.mode == 2"
        :cid="customer.customerid"
        :tabopen="tab == 'main'"
      ></modify-signatures>
      <template v-for="driver in extraDrivers" :key="driver.customerid">
        <modify-signatures
          v-if="store.mode == 2"
          :cid="driver.customerid"
          :tabopen="tab == 'extras'"
        ></modify-signatures>
      </template>
    </expand-section>

    <expand-section
      :label="'Payment Method'"
      :toggle="tab == 'vault'"
      @toggle="toggle('vault')"
      :actionRequired="store.missing.vault"
    >
      <card-vault @update="emit('update')"></card-vault>
    </expand-section>
  </div>
</template>

<script setup>
import ModifyDriver from "@/components/ModifyDriver.vue";
import ModifyTrip from "@/components/ModifyTrip.vue";
import AddDriver from "@/components/AddDriver.vue";
import ExpandSection from "@/components/ExpandSection.vue";
import CardVault from "@/components/CardVault.vue";
import ModifyFees from "@/components/ModifyFees.vue";
import ModifyUploads from "@/components/ModifyUploads.vue";
import ModifySignatures from "./ModifySignatures.vue";
import { ref, computed } from "vue";
import { useStore } from "@/store";

const emit = defineEmits(["update"]);
const store = useStore();
const tab = ref("");

function toggle(clicked) {
  if (tab.value == clicked) {
    tab.value = "";
  } else {
    tab.value = clicked;
  }
}

function hasMissing(type) {
  return Object.values(store.missing.customers).some((val) => val[type] > 0);
}

function missingDetails(isExtra) {
  if (!isExtra && store.missing.customers[customer.value.customerid]) {
    return store.missing.customers[customer.value.customerid].details > 0;
  }
  if (isExtra) {
    return Object.values(store.missing.customers).some((val) => {
      return val.details > 0 && val.extra == true;
    });
  }
}

const customer = computed(() => {
  let customer = store.bookinginfo.customerinfo[0];
  delete customer.country;
  delete customer.fulladdress;
  return customer;
});

const extraDrivers = computed(() => store.bookinginfo.extradrivers);
</script>

<style lang="scss" scoped></style>
