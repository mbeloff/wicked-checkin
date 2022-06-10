<template>
  <div class="relative flex h-full flex-col justify-center">
    <loading-overlay v-if="loading" class="z-10"></loading-overlay>
    <!-- <div class="mb-5 h-full max-h-[30vh] w-full px-2">
      <div
        class="h-full w-full bg-contain bg-center bg-no-repeat"
        :style="{ 'background-image': 'url(' + adventure + ')' }"
      ></div>
    </div> -->
    <div class="my-2 h-12">
      <p class="text-center text-primary-500">{{ error }}</p>
    </div>
    <form for="resno" class="mx-auto flex max-w-sm flex-col text-left">
      <label class="group flex flex-grow flex-col">
        <div class="relative flex flex-row place-items-center">
          <input
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
          <i class="form-i fal fa-book fa-fw absolute -left-5 -ml-2 mr-2"></i>
        </div>
      </label>
      <label for="lastname" class="group mt-2 flex flex-grow flex-col">
        <div class="relative flex flex-row place-items-center">
          <input
            id="lastname"
            v-model="lastname"
            :class="{ 'input-error': missinginput && !lastname.length }"
            class="login-input"
            type="text"
            name="lastname"
            placeholder="Last name"
          />
          <i class="form-i fal fa-user fa-fw absolute -left-5 -ml-2 mr-2"></i>
        </div>
      </label>
      <button
        class="group w-56 text-2xl font-bold focus:outline-none"
        @click.prevent="findBooking(resno, lastname)"
      >
        <p class="mt-4 text-center">
          find booking<i
            class="fas fa-arrow-right z-0 ml-2 transform align-middle transition duration-500 ease-out group-hover:translate-x-1 group-hover:text-primary-600"
          ></i>
        </p>
      </button>
    </form>
  </div>
</template>
<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { ref, computed, watch, onMounted, onBeforeMount, inject } from "vue";
import { useStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import adventure from "@/assets/adventure.svg";

const router = useRouter();
const route = useRoute();
const store = useStore();
const resno = ref(route.query.res || "429232");
const lastname = ref(route.query.name || "test");
const missinginput = ref(false);
const error = ref("");
const loading = ref(false);
const token = computed(() => store.token);
const rcm = inject("rcm");
const getToken = inject("getToken");

watch(token, (val) => {
  if (val) {
    loading.value = false;
    if (route.query.refID) {
      store.resref = route.query.refID;
      router.push({ name: "Manage" });
    }
  }
});

onBeforeMount(() => {
  if (!store.token) {
    loading.value = true;
    getToken();
  }
});

onMounted(() => {
  if (route.query.validquote == "false") {
    error.value = "This quotation is no longer valid.";
  }
  if (route.query.validres == "false") {
    error.value = "Online checkin is no longer available for this reservation.";
  }
  window.scrollTo({ top: 0 });
});

function findBooking(resno, lastname) {
  loading.value = true;
  error.value = "";
  let method = {
    method: "findbooking",
    reservationno: resno,
    lastname: lastname,
  };
  if (!resno || !lastname) {
    error.value =
      "Please enter reservation or quote number and your last name.";
    missinginput.value = true;
    loading.value = false;
    return;
  }
  rcm(method)
    .then((res) => {
      if (res.status == "OK") {
        let resref = res.results[0].reservationref;
        store.resref = resref;
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
  @apply flex-1 rounded-full border bg-gray-200 py-2 pl-3 uppercase text-gray-700;
}
.login-input:focus {
  @apply bg-white outline-none ring-2 ring-primary-500;
}
</style>
