<template>
  <p v-if="loading">please wait...</p>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const paymentInfo = ref({});
const loading = ref(true);

onMounted(() => {
  processPayResult();
});

function processPayResult() {
  var myHeaders = new Headers();
  var body = JSON.stringify({
    transresponse: route.query.result,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: body,
    redirect: "follow",
  };
  fetch("/.netlify/functions/processtrans", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      let res = JSON.parse(result).Response;
      paymentInfo.value = res;
      loading.value = false;
      window.parent.postMessage(res);
    })
    .catch((error) => {
      console.log("process result failed: ", error);
    });
}
</script>

<style></style>
