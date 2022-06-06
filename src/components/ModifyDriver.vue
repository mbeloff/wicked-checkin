<template>
  <div class="relative gap-y-5 rounded border bg-white p-2 text-left">
    <loading-overlay v-if="savingChanges"></loading-overlay>
    <p class="my-3 text-xl font-bold text-green-500">{{data.firstname + ' ' + data.lastname}}</p>
    <div class="grid grid-cols-1 gap-y-1 gap-x-4 sm:grid-cols-2 pt-3">
      <div class="group flex flex-grow flex-col">
        <label :for="'fName' + cid" class="my-label">First Name</label>
        <input
          :id="'fName' + cid"
          v-model="data.firstname"
          maxlength="30"
          required
          type="text"
          class="my-input"
          :disabled="isPrimary"
          :class="{ 'text-gray-400': isPrimary },{ 'ring-2 ring-orange-500' : v.data.firstname.$error }"
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
          :disabled="isPrimary"
          :class="{ 'text-gray-400': isPrimary },{ 'ring-2 ring-orange-500' : v.data.lastname.$error }"
          placeholder="required"
        />
      </div>
      <div class="group flex flex-grow flex-col">
        <label :for="'email' + cid" class="my-label">Email</label>
        <input
          :id="'email' + cid"
          v-model="data.email"
          maxlength="50"
          required
          type="email"
          class="my-input"
          :disabled="isPrimary"
          :class="{ 'text-gray-400': isPrimary },{ 'ring-2 ring-orange-500' : v.data.email.$error }"
          placeholder="required"
        />
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
          :class="{ 'ring-2 ring-orange-500' : v.data.mobile.$error }"
        />
      </div>

      <date-picker
        v-model="dateofbirth"
        :max-date="new Date()"
        :update-on-input="false"
        class="group flex flex-grow flex-col"
      >
        <template #default="{ inputValue, inputEvents }">
          <label :for="'dob' + cid" class="my-label">Date of Birth</label>
          <div class="flex flex-row place-items-center">
            <!-- <i class="fal fa-calendar fa-fw mr-2"></i> -->
            <input
              :id="'dob' + cid"
              class="my-input w-8"
              :value="inputValue"
              v-on="inputEvents"
            />
          </div>
        </template>
      </date-picker>

      <div class="group flex flex-grow flex-col">
        <label :for="'licenseno' + cid" class="my-label">License Number</label>
        <input
          :id="'licenseno' + cid"
          v-model="data.licenseno"
          maxlength="70"
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500' : v.data.licenseno.$error }"
        />
      </div>
<div class="grid grid-cols-2 gap-2">
   <date-picker
        v-model="licenseexpires"
        :min-date="new Date()"
        :update-on-input="false"
        class="group flex flex-grow flex-col"
      >
        <template #default="{ inputValue, inputEvents }">
          <label :for="'licexp' + cid" class="my-label">License Expiry</label>
          <div class="flex flex-row place-items-center">
            <input
              :id="'licexp' + cid"
              class="my-input w-8"
              :value="inputValue"
              v-on="inputEvents"
            />
          </div>
        </template>
      </date-picker>
      <div class="group flex flex-grow flex-col">
        <label :for="'licenseissued' + cid" class="my-label"
          >License Issued In</label
        >
        <select
          :id="'licenseissued' + cid"
          v-model="data.licenseissued"
          class="my-input"
        >
          <option
            v-for="country in countries"
            :key="country.id"
            :value="country.country"
          >
            {{ country.country }}
          </option>
        </select>
      </div>
</div>
     

      <div class="group flex flex-grow flex-col">
        <label :for="'address' + cid" class="my-label">Street Address</label>
        <input
          :id="'address' + cid"
          v-model="data.address"
          maxlength="80"
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500' : v.data.address.$error }"
        />
      </div>
      <div class="group flex flex-grow flex-col">
        <label :for="'city' + cid" class="my-label">City</label>
        <input
          :id="'city' + cid"
          v-model="data.city"
          maxlength="50"
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500' : v.data.city.$error }"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="group flex flex-col">
        <label :for="'state' + cid" class="my-label">State</label>
        <input
          :id="'state' + cid"
          v-model="data.state"
          maxlength="30"
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500' : v.data.state.$error }"
        />
      </div>
      <div class="group flex flex-col">
        <label :for="'country' + cid" class="my-label">Country</label>
        <select :id="'country' + cid" v-model="data.countryid" class="my-input">
          <option
            v-for="country in countries"
            :key="country.id"
            :value="country.id"
          >
            {{ country.country }}
          </option>
        </select>
      </div>
      </div>
      
      <div class="group flex flex-grow flex-col md:mb-0">
        <label :for="'postcode' + cid" class="my-label">Postcode</label>
        <input
          :id="'postcode' + cid"
          v-model="data.postcode"
          maxlength="10"
          type="text"
          class="my-input"
          :class="{ 'ring-2 ring-orange-500' : v.data.postcode.$error }"
        />
      </div>

      <div class="mt-auto grid h-9 grid-cols-2 gap-3"  v-if="isExtra">

        <my-button

          class="btn-red"
          @click="deleteExtraDriver(-data.customerid)"
        >
          Delete Driver <i class="fas fa-trash-can-xmark"></i>
        </my-button>
        <my-button

          class="btn-green col-start-2"
          @click="addExtraDriver(data.customerid)"
        >
          Update Driver
          <i class="far fa-cloud-upload"></i>
        </my-button>     
      </div>
      <my-button
          v-if="isPrimary"
          class="btn-green sm:col-start-2 mt-5"
          @click="editBooking()"
        >
          Save Changes <i class="far fa-cloud-upload"></i>
        </my-button>
    </div>
  </div>
</template>

<script setup>
import MyButton from '@/components/base/MyButton.vue'
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import "v-calendar/dist/style.css";
import { ref, computed, inject, watch, onMounted } from "vue";
import { useStore } from "@/store";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

const rcm = inject("rcm");
const store = useStore();
const cid = computed(() => props.customer.customerid);
const countries = computed(() => store.countries);
const savingChanges = ref(false);
const data = ref(props.customer);
const dateofbirth = ref(new Date());
const licenseexpires = ref(new Date());
const defaultDriver = {
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
};

const rules = {
  data: {
    firstname: { required },
    lastname: { required },
    email: { required, email },
    licenseno: { required },
    licenseexpires: { required },
    dateofbirth: {required},
    address: {required, minLength: minLength(2)},
    mobile: {required, minLength: minLength(6)},
    city: {required},
    state: {required},
    postcode: {required},
  },
};

const v = useVuelidate(rules, {data},{$autoDirty: true})



onMounted(() => {
  setDates();
  addToStore();
  v.value.$touch()
})

const invalid = computed(() => {
  return v.value.$errors.length;
}); 

watch(invalid, (val) => {
  store.missing.customers[cid.value].details = val
});

const emit = defineEmits(["update"]);

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  isExtra: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Object,
    default() {
      return {
        customerid: 0,
        firstname: "",
        lastname: "",
        dateofbirth: "1/JAN/2000",
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
      };
    },
  },
});

function setDates() {
  dateofbirth.value = new Date(props.customer.dateofbirth);
  if (props.customer.licenseexpires == "") {
    licenseexpires.value = new Date();
  } else licenseexpires.value = new Date(props.customer.licenseexpires);
}



function addToStore() {
  if (props.customer.customerid == 0) return;
  store.missing.customers[props.customer.customerid] = {
    signatures: 0,
    uploads: 0,
    details: 0,
    extra: props.isExtra,
  };
}

function resetCustomer() {
  data.value = defaultDriver;
  setDates();
}

watch(dateofbirth, (val) => {
  data.value.dateofbirth = new Date(val)
    .toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replaceAll(" ", "/");
});
watch(licenseexpires, (val) => {
  data.value.licenseexpires = new Date(val)
    .toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replaceAll(" ", "/");
});

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
  if (!data.value.firstname || !data.value.lastname || !data.value.email) {
    v.value.$touch()
    alert("please fill all required fields");
    savingChanges.value = false;
    return;
  }
  rcm(params)
    .then((res) => {
      emit("update");
      if (props.isNew) {
        resetCustomer();
      }
      savingChanges.value = false;
    })
    .catch((err) => console.log(err));
}

function deleteExtraDriver(id) {
  savingChanges.value = true;
  let params = {
    method: "extradriver",
    reservationref: store.resref,
    customerid: id,
  };
  rcm(params)
    .then((res) => {
      emit("update");
      delete store.missing.customers[cid.value];
    })
    .catch((err) => console.log(err));
}

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
    customer: {
      ...data.value,
    },
  };
  rcm(params).then((res) => {
    emit("update");
    savingChanges.value = false;
  });
}
</script>

<style lang="postcss" >

</style>
