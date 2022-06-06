<template>
  <div class="relative gap-y-5 rounded border bg-white p-2 text-left">
    <loading-overlay v-if="savingChanges"></loading-overlay>
    <p class="my-3 text-sm text-gray-500">
      You may add up to 4 additional drivers to your booking. All drivers will
      need to sign the rental agreement and provide a copy of their driver's
      license.
    </p>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div class="group flex flex-grow flex-col">
        <label :for="'fName' + cid" class="my-label">First Name</label>
        <input
          :id="'fName' + cid"
          v-model="data.firstname"
          maxlength="30"
          required
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500': v.data.firstname.$error }"
          placeholder="required"
        />
      </div>
      <div class="group flex flex-grow flex-col">
        <label :for="'lName' + cid" class="my-label">Last Name</label>
        <input
          :id="'lName' + cid"
          v-model="data.lastname"
          maxlength="40"
          required
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500': v.data.lastname.$error }"
          placeholder="required"
        />
      </div>
      <div class="group relative mb-2 flex flex-grow flex-col sm:mb-0">
        <label :for="'email' + cid" class="my-label">Email</label>
        <input
          :id="'email' + cid"
          v-model="data.email"
          maxlength="50"
          required
          type="email"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500': v.data.email.$error }"
          placeholder="required"
        />
        <span
          class="absolute -bottom-5 text-xs text-red-500"
          v-if="v.data.email.email.$invalid"
          >Please enter a valid email address</span
        >
      </div>
      <div class="group flex flex-grow flex-col">
        <label :for="'phone' + cid" class="my-label">Phone</label>
        <input
          :id="'phone' + cid"
          v-model="data.mobile"
          maxlength="25"
          required
          type="tel"
          class="my-input"
        />
      </div>
      <my-button
        class="btn-green btn-green mt-5 rounded py-2 px-4 text-sm text-white sm:col-start-2"
        @click="addExtraDriver(data.customerid)"
      >
        Add a Driver
        <i class="far fa-cloud-upload"></i
      ></my-button>
    </div>
  </div>
</template>

<script setup>
import MyButton from "@/components/base/MyButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import "v-calendar/dist/style.css";
import { ref, inject } from "vue";
import { useStore } from "@/store";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const rcm = inject("rcm");
const store = useStore();
const cid = 0;
const savingChanges = ref(false);
const data = ref({
  customerid: 0,
  firstname: "",
  lastname: "",
  dateofbirth: "",
  email: "",
  phone: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  postcode: "",
  countryid: 7,
  country: "Australia",
  licenseno: "",
  licenseexpires: "",
  licenseissued: "Australia",
});

const rules = {
  data: {
    firstname: { required },
    lastname: { required },
    email: { required, email },
  },
};

const v = useVuelidate(rules, { data }, { $autoDirty: true });

const emit = defineEmits(["update"]);

function addExtraDriver(id) {
  savingChanges.value = true;
  let params = {
    method: "extradriver",
    reservationref: store.resref,
    customerid: id,
    customer: {
      ...data.value,
    },
  };

  v.value.$touch();

  if (v.value.$errors.length) {
    alert("Please fill all required fields.");
    savingChanges.value = false;
    return;
  }

  rcm(params)
    .then((res) => {
      emit("update");
      (data.value.firstname = ""),
        (data.value.lastname = ""),
        (data.value.email = ""),
        (data.value.mobile = "");
      v.value.$reset();
      alert("Extra driver successfully added.");
      savingChanges.value = false;
    })
    .catch((err) => console.log(err));
}
</script>

<style lang="postcss" scoped></style>
