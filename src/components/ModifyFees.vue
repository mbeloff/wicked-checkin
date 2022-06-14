<template>
  <div class="relative gap-y-5 rounded border bg-white p-2 text-left">
    <loading-overlay v-if="loading"></loading-overlay>
    <p class="my-3 text-sm text-gray-500" v-if="store.mode == 2">
      Add extra options on your booking. Please note that extras can not be
      removed via this check-in platform. Please contact us if you wish to make
      other changes.
    </p>
    <div v-if="availablefees.insuranceoptions.length" class="text-sm">
      <my-header :title="'Damage Cover'"></my-header>
      <p class="mb-1 text-gray-500">
        Limits your liability in the case of an incident. Damage cover is
        mandatory for all hires.
      </p>
      <div
        v-for="item in availablefees.insuranceoptions"
        class="mb-1 rounded border border-primary-300 bg-gray-200 px-2 py-2"
        :class="{
          '!border-transparent opacity-80': selecteddamage != item.id,
        }"
      >
        <label :for="'dc' + item.id" class="divide-y divide-gray-300">
          <div class="flex justify-between">
            <input
              hidden
              type="radio"
              :id="'dc' + item.id"
              :name="'dc' + item.id"
              v-model="selecteddamage"
              :value="item.id"
            />
            <div>{{ item.name }}</div>
            <div
              class="flex min-w-[70px] items-center font-bold"
              :class="{ 'text-gray-400': selecteddamage != item.id }"
            >
              <i
                class="far fa-plus-circle mr-2"
                :class="{ 'text-primary-500': selecteddamage == item.id }"
              ></i
              >{{ currencysymbol + item.fees
              }}<span class="text-xs font-normal">/day</span>
            </div>
          </div>

          <div
            v-html="
              item.feedescription1
                .replaceAll('yes', check)
                .replaceAll('xy', '</br>')
                .replaceAll('yt', '')
            "
            class="pt-2 text-xs text-gray-600"
          ></div>
        </label>
      </div>
    </div>
    <div v-if="availablefees.kmcharges.length" class="text-sm">
      <my-header :title="'Daily Kilometre Options'"></my-header>
      <div v-for="item in availablefees.kmcharges" :key="item.id">
        <div
          class="mb-1 rounded border border-primary-300 bg-gray-200 px-2 py-2"
          :class="{
            '!border-transparent bg-opacity-50 opacity-80':
              selectedkm != item.id,
          }"
          v-if="
            !isDowngrade(
              item.totalamount,
              store.bookinginfo.bookinginfo[0].kmcharges_totalfordailyrate
            )
          "
        >
          <label :for="'km' + item.id" class="divide-y divide-gray-300">
            <div class="flex justify-between">
              <input
                hidden
                :disabled="
                  isDowngrade(
                    item.totalamount,
                    store.bookinginfo.bookinginfo[0].kmcharges_totalfordailyrate
                  )
                "
                type="radio"
                :id="'km' + item.id"
                :name="'km' + item.id"
                v-model="selectedkm"
                :value="item.id"
              />
              <div>{{ item.description }}</div>
              <div>
                <div
                  class="flex min-w-[70px] items-center font-bold"
                  :class="{ 'text-gray-400': selectedkm != item.id }"
                >
                  <i
                    class="far fa-plus-circle mr-2"
                    :class="{ 'text-primary-500': selectedkm == item.id }"
                  ></i
                  >{{ currencysymbol + item.dailyrate
                  }}<span class="text-xs font-normal">/day</span>
                </div>
              </div>
            </div>

            <div
              v-if="item.notes"
              v-html="item.notes"
              class="pt-2 text-xs"
            ></div>
          </label>
        </div>
      </div>
    </div>
    <div v-if="availablefees" class="text-sm">
      <div class="flex flex-col gap-1" v-if="availablefees.optionalfees.length">
        <my-header :title="'Optional Fees'"></my-header>
        <div
          v-for="item in availablefees.optionalfees"
          :key="item.id"
          class="rounded border border-primary-300 bg-gray-200 px-2 py-2"
          :class="{
            '!border-transparent bg-opacity-50 opacity-80': !checked(item.id),
          }"
        >
          <label :for="'option' + item.id" class="divide-y divide-gray-300">
            <div class="flex justify-between">
              <input
                hidden
                :disabled="isDisabled(item.id)"
                type="checkbox"
                :name="'option' + item.id"
                :id="'option' + item.id"
                v-model="selectedoptions"
                :value="{ id: item.id, qty: item.qty || 1 }"
              />
              <div>{{ item.name }}</div>
              <div
                class="flex items-center font-bold"
                :class="{
                  'text-gray-400': !selectedoptions.find(
                    (el) => el.id == item.id
                  ),
                }"
              >
                <i
                  class="far fa-plus-circle mr-2"
                  :class="{ 'text-primary-500': checked(item.id) }"
                ></i
                >{{ currencysymbol + item.fees
                }}<span v-if="item.type == 'Daily'" class="text-xs font-normal"
                  >/day</span
                >
              </div>
            </div>
            <div v-html="item.feedescription1" class="pt-2 text-xs"></div>
          </label>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-end"></div>
    <div class="relative mt-2 rounded bg-gray-200 p-2">
      <loading-overlay v-if="calculating"></loading-overlay>
      <div class="mx-auto w-full max-w-md">
        <totals-preview
          v-if="totals.length > 0"
          :totals="totals"
        ></totals-preview>
        <my-button
          v-show="changes.length"
          class="btn-green mt-5 w-full"
          @click="editbooking()"
        >
          Save Changes <i class="far fa-cloud-upload"></i>
        </my-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/components/base/MyButton.vue";
import MyHeader from "@/components/base/MyHeader.vue";
import TotalsPreview from "@/components/TotalsPreview.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { useStore } from "@/store";
import { ref, inject, computed, onMounted, watch } from "vue";
const emit = defineEmits(["update"]);
const store = useStore();
const rcm = inject("rcm");
const calculating = ref(false);
const loading = ref(false);
const check = "<i class='far fa-check-circle'></i>";
const currencysymbol = computed(
  () => store.bookinginfo.bookinginfo[0].currencysymbol
);
const availablefees = await rcm({
  method: "bookingoptions",
  reservationref: store.resref,
}).then((data) => {
  return data.results;
});
const totals = ref("");
const initialkm = computed(() => store.bookinginfo.bookinginfo[0].kmcharges_id);
const selectedkm = ref(initialkm.value);
const initialdamage = computed(
  () => store.bookinginfo.extrafees.find((el) => el.isinsurancefee).extrafeeid
);
const selecteddamage = ref(initialdamage.value);
const initialoptions = computed(() => {
  let arr = [];
  store.bookinginfo.extrafees.forEach((el) => {
    if (el.isoptionalfee && !el.isinsuranceoption) {
      arr.push({ id: el.extrafeeid, qty: el.qty });
    }
  });
  return arr;
});
const selectedoptions = ref(initialoptions.value);

function isDowngrade(price, booked) {
  if (store.mode == 2) return price < booked;
}
function isDisabled(id) {
  if (
    store.mode == 2 &&
    store.bookinginfo.extrafees.find((el) => el.extrafeeid == id)
  ) {
    return true;
  } else return false;
}

onMounted(() => {
  calcTotal();
});

const changes = computed(() => {
  let diffs = [];
  if (initialkm.value != selectedkm.value) diffs.push("km");
  if (initialdamage.value != selecteddamage.value) diffs.push("damage");
  if (initialoptions.value.length != selectedoptions.value.length)
    diffs.push("options");
  if (getDifference(initialoptions.value, selectedoptions.value).length)
    diffs.push("options");
  return diffs;
});

watch(changes, () => {
  calcTotal();
});

function getDifference(array1, array2) {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.id === object2.id;
    });
  });
}

function editbooking() {
  loading.value = true;
  let params = {
    method: "editbooking",
    reservationref: store.resref,
    bookingtype: store.mode,
    insuranceid: selecteddamage.value,
    extrakmsid: selectedkm.value,
    customer: store.bookinginfo.customerinfo[0],
    optionalfees: selectedoptions.value,
  };
  if (params.bookingtype == 2) {
    if (
      !confirm(
        "Are you sure you want to upgrade your extras? This change may not be undone."
      )
    ) {
      loading.value = false;
      return;
    }
  }
  rcm(params).then((data) => {
    loading.value = false;
    emit("update");
  });
}

function checked(id) {
  if (selectedoptions.value.find((el) => el.id == id)) {
    return true;
  }
}

function calcTotal() {
  calculating.value = true;
  let mandatoryfees = [];
  store.bookinginfo.extrafees.forEach((el) => {
    if (!el.isoptionalfee) {
      mandatoryfees.push({ id: el.extrafeeid, qty: el.qty });
    }
  });
  let params = {
    method: "calctotal",
    pickuplocationid: store.bookinginfo.bookinginfo[0].pickuplocationid,
    pickupdate: store.bookinginfo.bookinginfo[0].pickupdate,
    vehiclecategoryid: store.bookinginfo.bookinginfo[0].vehiclecategoryid,
    numberofdays: store.bookinginfo.bookinginfo[0].numberofdays,
    totalrateafterdiscount: store.bookinginfo.rateinfo[0].ratesubtotal,
    insuranceid: selecteddamage.value,
    extrakmsid: selectedkm.value,
    optionalfees: selectedoptions.value,
    mandatoryfees: mandatoryfees,
    reservationref: store.resref,
    freedaysamount: 0,
  };
  rcm(params).then((res) => {
    totals.value = res.results.totals;
    calculating.value = false;
  });
}
</script>

<style lang="scss" scoped></style>
