<template>
  <div class="relative gap-y-5 rounded border bg-white p-2 text-left">
    <loading-overlay v-if="loading"></loading-overlay>
    <p class="my-3 text-sm text-gray-500" v-if="store.mode == 2">
      Add extra options on your booking. Please note you may not be able to
      downgrade or remove certain options you have previously selected. Please
      contact us if you wish to change these options.
    </p>
    <div v-if="availablefees" class="text-sm">
      <div class="flex flex-col gap-1" v-if="availablefees.optionalfees.length">
        <p class="my-3 text-xl font-bold text-green-500">Optional Extras</p>
        <div
          v-for="item in availablefees.optionalfees"
          :key="item.id"
          class="rounded bg-gray-200 px-2 py-2"
          :class="{
            'bg-transparent opacity-80': !selectedoptions.find(
              (el) => el.id == item.id
            ),
          }"
        >
          <label :for="'option' + item.id">
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
                class="flex min-w-[70px] items-center font-bold"
                :class="{
                  'text-gray-400': !selectedoptions.find(
                    (el) => el.id == item.id
                  ),
                }"
              >
                <i class="fal fa-plus-circle mr-2"></i
                >{{ currencysymbol + item.totalfeeamount }}
              </div>
            </div>
            <div
              v-html="item.feedescription1"
              class="border-t border-gray-900/20 pt-2"
            ></div>
          </label>
        </div>
      </div>
      <div v-if="availablefees.insuranceoptions.length">
        <p class="my-3 text-xl font-bold text-green-500">Damage Cover</p>
        <div
          v-for="item in availablefees.insuranceoptions"
          class="rounded bg-gray-200 px-2 py-2"
          :class="{ 'bg-transparent opacity-80': selecteddamage != item.id }"
        >
          <label :for="'km' + item.id">
            <div class="flex justify-between">
              <input
                hidden
                type="radio"
                :id="'km' + item.id"
                :name="'km' + item.id"
                v-model="selecteddamage"
                :value="item.id"
              />
              <div>{{ item.name }}</div>
              <div
                class="flex min-w-[70px] items-center font-bold"
                :class="{ 'text-gray-400': selecteddamage != item.id }"
              >
                <i class="fal fa-plus-circle mr-2"></i
                >{{ currencysymbol + item.totalinsuranceamount }}
              </div>
            </div>
            <div
              v-html="item.feedescription1"
              class="border-t border-gray-900/20 pt-2 text-gray-600"
            ></div>
          </label>
        </div>
      </div>
      <div v-if="availablefees.kmcharges.length">
        <p class="my-3 text-xl font-bold text-green-500">
          Daily Kilometre Options
        </p>
        <div
          v-for="item in availablefees.kmcharges"
          :key="item.id"
          class="rounded bg-gray-200 px-2 py-2"
          :class="{ 'bg-transparent opacity-80': selectedkm != item.id }"
        >
          <label
            v-if="
              !isDowngrade(
                item.totalamount,
                store.bookinginfo.bookinginfo[0].kmcharges_totalfordailyrate
              )
            "
            :for="'km' + item.id"
          >
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
                  <i class="fal fa-plus-circle mr-2"></i
                  >{{ currencysymbol + item.totalamount }}
                </div>
              </div>
            </div>

            <div
              v-if="item.notes"
              v-html="item.notes"
              class="border-t border-gray-900/20 pt-2 text-gray-600"
            ></div>
          </label>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-end">
      <my-button
      v-show="changes.length"
        class="btn-green mt-5 w-full sm:w-1/2"
        @click="editbooking()"
      >
        Save Changes <i class="far fa-cloud-upload"></i>
      </my-button>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/components/base/MyButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { useStore } from "@/store";
import { ref, inject, computed } from "vue";

const store = useStore();
const rcm = inject("rcm");
const loading = ref(false);
const currencysymbol = computed(
  () => store.bookinginfo.bookinginfo[0].currencysymbol
);
const availablefees = await rcm({
  method: "bookingoptions",
  reservationref: store.resref,
}).then((data) => {
  return data.results;
});

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

function getDifference(array1, array2) {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.id === object2.id;
    });
  });
}

const emit = defineEmits(["update"]);

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
        "Are you sure you want to change your extras? Some changes may be undoable"
      )
    ) {
      loading.value = false;
      return;
    }
  }
  rcm(params).then((data) => {
    console.log(data);
    loading.value = false;
    emit("update");
  });
}

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
</script>

<style lang="scss" scoped></style>
