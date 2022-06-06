<template>
  <div
    class="relative grid w-full grid-cols-1 gap-x-2 gap-y-2 rounded bg-white p-2 text-left md:grid-cols-3"
  >
    <p class="col-span-full my-3 text-xl font-bold text-green-500">
      {{ fullname }}
    </p>
    <loading-overlay v-if="loading"></loading-overlay>
    <div
      v-for="doc in doclist"
      :key="doc.customerid + '-' + doc.documentlinksetupid"
    >
      <input
        class="hidden"
        type="file"
        @change="uploadFile($event, doc)"
        :id="doc.customerid + '-' + doc.documentlinksetupid"
      />
      <label
        :class="{
          'border-green-500': doc.isuploaded,
          'border-orange-500': !doc.isuploaded,
        }"
        class="group relative mx-auto flex h-full w-full cursor-pointer flex-col rounded border bg-gray-200 hover:bg-gray-300"
        @click="handleDoc(doc)"
      >
        <div class="flex items-center justify-between pr-2">
          <p class="rounded-t px-2 py-1 font-bold">
            {{ docTitle(doc.title) }}
          </p>
          <div
            v-show="doc.isuploaded == 0"
            class="absolute top-1 right-1 rounded bg-white px-2 text-sm"
          >
            upload <i class="fas fa-camera"></i>
          </div>
          <div
            v-show="doc.isuploaded"
            class="absolute top-1 right-1 rounded border-green-500 bg-white px-2 text-sm group-hover:bg-red-500 group-hover:text-white"
          >
            <i class="fas fa-trash-can-xmark"></i>
          </div>
        </div>

        <div class="mb-1 flex flex-1 rounded text-left text-sm md:mb-0">
          <div class="flex flex-grow flex-col justify-between pb-5">
            <p class="px-2">{{ replaceDocText(doc.title) }}</p>

            <div
              v-if="doc.isuploaded"
              class="absolute -bottom-px -left-px flex w-max items-center gap-2 rounded-bl rounded-tr border border-green-500 bg-white px-1 text-xs text-green-500"
            >
              <span>uploaded</span>
              <i class="fas fa-check-circle"></i>
            </div>
            <div
              v-else
              class="absolute -bottom-px -left-px flex w-max items-center gap-2 rounded-bl rounded-tr border border-orange-500 bg-white px-1 text-xs text-orange-500"
            >
              <span>required</span>
              <i class="fas fa-warning"></i>
            </div>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { useStore } from "@/store";
import { ref, onBeforeMount, computed, inject, watch } from "vue";

const rcm = inject("rcm");
const store = useStore();
const props = defineProps({
  cid: Number,
  customer: Object,
});

const fullname = computed(() => {
  return props.customer.firstname + " " + props.customer.lastname;
});
const loading = ref(false);
const doclist = ref([]);
const missing = computed(() => {
  return doclist.value.filter((doc) => !doc.isuploaded).length;
});

watch(missing, (val) => {
  store.missing.customers[props.cid]["uploads"] = val;
});

function getDocumentList() {
  loading.value = true;
  let method = {
    method: "documentlist",
    workflowcode: "checkin",
    reservationref: store.resref,
  };
  rcm(method).then((res) => {
    let newdoclist = res.results.filter((el) => el.customerid == props.cid);

    doclist.value = newdoclist;
    loading.value = false;
  });
}

function deleteUpload(id) {
  loading.value = true;
  let method = {
    method: "editupload",
    reservationref: store.resref,
    documentlinkid: -id,
  };
  rcm(method).then((res) => {
    getDocumentList();
  });
}

function handleDoc(doc) {
  let el = document.getElementById(
    doc.customerid + "-" + doc.documentlinksetupid
  );
  if (doc.isuploaded == 0) {
    el.click();
    return;
  }
  if (confirm("You are about to delete this document. Are you sure?")) {
    deleteUpload(doc.documentlinkid);
    el.value = "";
  }
}

function uploadFile($event, doc) {
  loading.value = true;
  const file = $event.target.files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "kdmxe571");
  formData.append("folder", "test");

  fetch("https://api.cloudinary.com/v1_1/allridey/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((res) => {
      let data = JSON.parse(res);
      processUploadResult(doc, data);
    });
}

function processUploadResult(doc, res) {
  loading.value = true;
  let params = {
    method: "storeupload",
    documentlinksetupid: doc.documentlinksetupid,
    url: res.url,
    doctype: res.resource_type,
    source: "post-booking",
    reservationref: store.resref,
    vehicleid: doc.vehicleid,
    customerid: doc.customerid,
    storageprovider: "cloudinary",
    sequencenumber: doc.seqno,
  };
  rcm(params).then((res) => {
    getDocumentList();
    loading.value = false;
  });
}

onBeforeMount(() => {
  getDocumentList();
});
</script>

<script>
export default {
  methods: {
    replaceDocText(text) {
      if (text == "Take a photo of the front of your driving license") {
        return "Take a photo of the front of your driver's license";
      }
      if (text == "Take a Selfie") {
        return "Take a selfie while holding your driver's license";
      }
      if (text == "Take a photo of the back of your driving license") {
        return "Take a photo of the back of your driver's license";
      }
    },
    docTitle(text) {
      if (text == "Take a photo of the front of your driving license") {
        return "License Front";
      }
      if (text == "Take a Selfie") {
        return "Selfie";
      }
      if (text == "Take a photo of the back of your driving license") {
        return "License Back";
      }
    },
  },
};
</script>
<style lang="postcss"></style>
