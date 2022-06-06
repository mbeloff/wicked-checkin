<template>
  <div class="relative gap-y-5 rounded border bg-white p-2 text-left">
    <loading-overlay v-if="savingChanges"></loading-overlay>
    <p class="my-3 text-xl font-bold text-green-500">Trip Details</p>
    <div class="grid grid-cols-1 gap-y-1 gap-x-4 pt-3 sm:grid-cols-2">
      <template v-if="shuttle">
        <div class="grid grid-cols-2 gap-x-4">
          <div class="flex flex-col">
            <label :for="'flightin'" class="my-label">Arrival Flight</label>
            <input
              :id="'flightin'"
              v-model="flightin"
              maxlength="50"
              type="text"
              class="my-input"
            />
          </div>
          <div class="flex flex-col">
            <label :for="'flightout'" class="my-label">Departure Flight</label>
            <input
              :id="'flightout'"
              v-model="flightout"
              maxlength="50"
              type="text"
              class="my-input"
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label :for="'arrivalpoint'" class="my-label">Pickup Point</label>
          <input
            :id="'arrivalpoint'"
            v-model="arrivalpoint"
            maxlength="80"
            type="text"
            class="my-input"
          />
        </div>

        <div class="flex flex-col">
          <label :for="'departurepoint'" class="my-label">Drop off Point</label>
          <input
            :id="'departurepoint'"
            v-model="departurepoint"
            maxlength="80"
            type="text"
            class="my-input"
          />
        </div>
      </template>

      <div class="flex flex-col self-start">
        <label :for="'numbertravelling'" class="my-label"
          >Number of People Traveling</label
        >
        <select
          :id="'numbertravelling'"
          v-model.number="numbertravelling"
          class="my-input"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6+</option>
        </select>
      </div>

      <div class="flex flex-col">
        <label :for="'remark'" class="my-label">Comments/Requests</label>
        <textarea
          id="remark"
          maxlength="250"
          v-model="remark"
          rows="3"
          class="my-input !flex-initial"
        ></textarea>
      </div>
    </div>
    <div class="flex w-full justify-end">
      <my-button class="btn-green mt-5 w-full sm:w-1/2" @click="editBooking()">
        Save Changes <i class="far fa-cloud-upload"></i>
      </my-button>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/components/base/MyButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { ref, inject, computed } from "vue";
import { useStore } from "@/store";

const rcm = inject("rcm");
const store = useStore();
const savingChanges = ref(false);

const flightin = ref(store.bookinginfo.bookinginfo[0].flightin);
const arrivalpoint = ref(store.bookinginfo.bookinginfo[0].arrivalpoint);
const flightout = ref(store.bookinginfo.bookinginfo[0].flightout);
const departurepoint = ref(store.bookinginfo.bookinginfo[0].departurepoint);
const numbertravelling = ref(store.bookinginfo.bookinginfo[0].numbertravelling);
const remark = ref(store.bookinginfo.bookinginfo[0].customerremark);

const shuttle = computed(() => {
  return store.bookinginfo.extrafees.find((el) =>
    el.name.toLowerCase().includes("shuttle")
  );
});

const emit = defineEmits(["update"]);

function editBooking() {
  savingChanges.value = true;
  let ins = store.bookinginfo.extrafees.find(
    (el) => el.isinsurancefee == true
  ).extrafeeid;

  let params = {
    method: "editbooking",
    reservationref: store.resref,
    bookingtype: store.mode,
    insuranceid: ins,
    extrakmsid: store.bookinginfo.bookinginfo[0].kmcharges_id,
    numbertravelling: store.bookinginfo.bookinginfo[0].numbertravelling,
    flightin: flightin.value,
    arrivalpoint: arrivalpoint.value,
    flightout: flightout.value,
    departurepoint: departurepoint.value,
    numbertravelling: numbertravelling.value,
    remark: remark.value,
    customer: {
      ...store.bookinginfo.customerinfo[0],
    },
  };
  rcm(params).then((res) => {
    emit("update");
    savingChanges.value = false;
  });
}
</script>

<style lang="postcss"></style>
