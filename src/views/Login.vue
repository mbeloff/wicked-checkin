<template>
  <div class="relative mx-auto flex h-full flex-col justify-center">
    <loading-overlay v-if="loading" class="z-10"></loading-overlay>
    <div class="my-5 px-2">
      <p class="text-center text-primary-500">{{ error }}</p>
      <p class="text-center text-primary-500">{{ store.error }}</p>
    </div>
    <form for="resno" class="mx-auto flex max-w-sm flex-col text-left">
      <label class="group flex flex-grow flex-col" v-if="!resref">
        <div class="relative flex flex-row place-items-center">
          <input
            ref="inputresno"
            id="resno"
            v-model="resno"
            :class="{ 'input-error': missinginput && !resno.length }"
            class="login-input"
            type="tel"
            pattern="[0-9]*"
            novalidate
            name="resno"
            placeholder="Booking number"
          />
          <i class="form-i far fa-book fa-fw absolute -left-5 -ml-2 mr-2"></i>
        </div>
      </label>
      <label for="email" class="group mt-2 flex flex-grow flex-col">
        <div class="relative flex flex-row place-items-center">
          <input
            ref="inputemail"
            id="email"
            v-model="email"
            :class="{ 'input-error': missinginput && !email.length }"
            class="login-input"
            type="text"
            name="email"
            placeholder="Email Address"
          />
          <i class="form-i far fa-user fa-fw absolute -left-5 -ml-2 mr-2"></i>
        </div>
      </label>
      <button
        v-if="!resref"
        class="group mt-2 rounded-full bg-gradient-to-tr from-primary-500 to-primary-400 py-1 text-2xl font-bold text-white hover:from-primary-500 hover:to-primary-500 focus:outline-none"
        @click.prevent="findBooking(resno, email)"
      >
        <p class="text-center">
          find booking<i
            class="fas fa-arrow-right z-0 ml-2 transform align-middle transition duration-500 ease-out group-hover:translate-x-1"
          ></i>
        </p>
      </button>
      <button
        v-else
        class="group mt-2 rounded-full bg-gradient-to-tr from-primary-500 to-primary-400 py-1 text-2xl font-bold text-white hover:from-primary-500 hover:to-primary-500 focus:outline-none"
        @click.prevent="checkBooking()"
      >
        <p class="text-center">
          Check in<i
            class="fas fa-arrow-right z-0 ml-2 transform align-middle transition duration-500 ease-out group-hover:translate-x-1"
          ></i>
        </p>
      </button>
    </form>
    <button
      v-if="resref"
      class="mx-auto w-max pt-20 text-xs text-gray-400 underline"
      @click="resref = ''"
    >
      looking for a different booking?
    </button>
  </div>
</template>
<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { ref, computed, watch, onMounted, onBeforeMount, inject } from "vue";
import { useStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const router = useRouter();
const route = useRoute();
const store = useStore();
const resno = ref(route.query.res || "");
const email = ref(route.query.name || "");
const missinginput = ref(false);
const error = ref("");
const loading = ref(false);
const token = computed(() => store.token);
const rcm = inject("rcm");
const getToken = inject("getToken");
const resref = ref("");

watch(token, (val) => {
  if (val) {
    loading.value = false;
  }
});

onBeforeMount(() => {
  if (route.query.refID) {
    store.resref = "";
    cookies.remove("resref");
    resref.value = route.query.refID;
  }
  if (store.error) {
    error.value = store.error;
    store.error = "";
    store.resref = "";
  }
  if (store.resref) {
    router.push({ name: "Manage" });
  }
  if (!store.token) {
    loading.value = true;
    getToken();
  }
});

function checkBooking() {
  loading.value = true;
  let params = {
    method: "bookinginfo",
    reservationref: resref.value,
  };
  rcm(params)
    .then((response) => {
      if (response.status == "OK") {
        findBooking(response.results.bookinginfo[0].reservationno, email.value);
        return;
      }
      if (response.status == "ERR") {
        if (response.error.startsWith("No Bookings found")) {
          error.value =
            "Invalid reference. Please try entering your booking number and email.";
          resref.value = "";
        }
      }
      loading.value = false;
    })
    .catch((err) => {
      router.push({
        name: "Sign In",
      });
    });
}

const inputemail = ref();
const inputresno = ref();

onMounted(() => {
  if (route.query.validquote == "false") {
    error.value = "This quotation is no longer valid.";
  }
  if (route.query.validres == "false") {
    error.value = "Online checkin is no longer available for this reservation.";
  }
  window.scrollTo({ top: 0 });

  if (!resref.value) {
    inputresno.value.focus();
  } else {
    inputemail.value.focus();
  }
});

function findBooking(resno, email) {
  loading.value = true;
  error.value = "";
  let method = {
    method: "findbooking",
    reservationno: resno,
    email: email,
  };
  if (!resno || !email) {
    error.value = "Please enter reservation or quote number and your email.";
    missinginput.value = true;
    loading.value = false;
    return;
  }
  rcm(method)
    .then((res) => {
      if (res.status == "OK") {
        let resref = res.results[0].reservationref;
        store.resref = resref;
        cookies.set("resref", resref, 60 * 30);
        router.push({ name: "Manage" });
      } else if (res.status == "ERR") {
        error.value = res.error;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log("error: " + err);
    });
}
</script>

<style lang="postcss" scoped>
.input-error {
  @apply ring-2 ring-orange-400;
}
.login-input:focus + .form-i {
  @apply text-primary-600;
}

.login-input {
  @apply flex-1 rounded-full border bg-gray-200 py-2 pl-3 text-gray-700;
}
.login-input:focus {
  @apply bg-white outline-none ring-2 ring-primary-500;
}
</style>
