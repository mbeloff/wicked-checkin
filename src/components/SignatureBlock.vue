<template>
  <div class="mb-2 flex flex-col gap-1">
    <div class="max-w-[400px]">
      <div class="relative" v-if="showSig">
        <loading-overlay v-if="loading"></loading-overlay>
        <VueSignaturePad
          class="aspect-[4/1] max-w-[400px] rounded border border-orange-500"
          :ref="sigid"
          :options="{ onBegin }"
          :scaleToDevicePixelRatio="false"
        />
        <div
          class="absolute bottom-0 flex w-max items-center gap-2 rounded-bl rounded-tr border border-orange-500 bg-white px-1 text-xs text-orange-500"
        >
          <span> signature required</span>
          <i class="fas fa-warning"></i>
        </div>
      </div>
      <div v-if="started && !saved" class="mt-2 grid grid-cols-2 gap-2">
        <my-button class="btn-green" @click="save">Submit</my-button>
        <my-button class="btn-red" @click="clear">Clear</my-button>
      </div>

      <div class="relative" v-if="signature.pngsig">
        <div
          :id="sigid"
          class="aspect-[4/1] max-w-[400px] rounded border border-green-500 bg-cover bg-no-repeat"
        ></div>
        <div
          class="absolute bottom-0 flex w-max items-center gap-2 rounded-bl rounded-tr border border-green-500 bg-white px-1 text-xs text-green-600"
        >
          <span> signed: {{ signature.signeddatetime }}</span>
          <i class="fas fa-check-circle"></i>
        </div>
      </div>
    </div>

    <div class="text-xs text-gray-600">
      <p v-if="signature.signaturetemplateid == 0">
        I, <span class="font-bold">{{ fullname }}</span
        >, hereby agree to the terms and conditions of
        <a class="text-blue-500" target="_blank" :href="agreement" download
          >the Vehicle Rental Agreement</a
        >
        and any other terms and conditions that are attached.
      </p>
      <p v-else v-html="signature.signaturetemplatetext"></p>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useStore } from "@/store";
import { inject } from "vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import MyButton from "@/components/base/MyButton.vue";
export default {
  setup() {
    const rcm = inject("rcm");
    return { rcm };
  },
  components: {
    LoadingOverlay,
    MyButton,
  },
  name: "SignatureBlock",
  emits: ["updateSignature"],
  props: {
    signature: {
      type: Object,
      required: true,
    },
    fullname: {
      type: String,
    },
    tabopen: {
      type: Boolean,
    },
  },
  data() {
    return {
      started: false,
      saved: false,
      loading: false,
    };
  },
  watch: {
    showSig: function (value) {
      this.$nextTick(function () {
        this.pad.resizeCanvas();
      });
    },
  },
  computed: {
    ...mapState(useStore, ["bookinginfo", "resref"]),
    sigid() {
      let str =
        "c" +
        this.signature.customerid +
        "s" +
        this.signature.signaturetemplateid;
      return str;
    },
    isExtraDriver() {
      return (
        this.bookinginfo.customerinfo[0].customerid != this.signature.customerid
      );
    },
    pad() {
      return this.$refs[this.sigid];
    },
    showSig() {
      return !this.signature.issigned && !this.saved;
    },
    agreement() {
      return this.bookinginfo.bookinginfo[0].agreementurl;
    },
  },
  mounted() {
    this.setPng();
  },
  updated() {
    this.setPng();
  },
  methods: {
    setPng() {
      if (this.signature.issigned && this.signature.pngsig) {
        document.getElementById(this.sigid).style.backgroundImage =
          "url(data:image/png;base64," + this.signature.pngsig + ")";
      }
    },
    onBegin() {
      this.pad.resizeCanvas();
      this.started = true;
    },
    clear() {
      this.pad.clearSignature();
    },
    async save() {
      const { isEmpty, data } = this.pad.saveSignature();
      if (isEmpty) {
        alert('No signature to save. Please sign before clicking "Submit".');
        return;
      }
      let resized = await this.resizedataURL(data, 200, 50);
      let split = resized.split(",");
      let base64 = split[1];
      let params = {
        method: "savesignature",
        reservationref: this.resref,
        signaturetemplateid: this.signature.signaturetemplateid,
        signaturepng: base64,
        extradriverid: this.isExtraDriver ? this.signature.customerid : "",
      };
      this.loading = true;
      if (!isEmpty) {
        this.rcm(params).then((res) => {
          if (res.status == "ERR") {
            alert("Error: " + res.error);
            clear();
          }
          if (res.results.savesignature == true) {
            this.$emit("updateSignature");
            this.saved = true;
          }
          this.loading = false;
        });
      }
    },
    resizedataURL(datas, wantedWidth, wantedHeight) {
      return new Promise(async function (resolve, reject) {
        var img = document.createElement("img");
        img.onload = function () {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = wantedWidth;
          canvas.height = wantedHeight;
          ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
          var dataURI = canvas.toDataURL();
          resolve(dataURI);
        };
        img.src = datas;
      });
    },
  },
};
</script>
