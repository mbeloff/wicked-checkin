<template>
  <div class="grid place-items-center bg-gray-800 px-2 text-sm text-gray-400">
    <div class="w-full max-w-screen-lg py-10">
      <div class="flex flex-col justify-between gap-2 text-left">
        <a href="https://allridey.com.au/contact"
          ><i class="fal fa-comment-alt fa-fw mr-2 text-blue-500"></i>Message
          Us</a
        >
        <a :href="`tel:${store.company.phone.replaceAll(' ', '')}`"
          ><i class="fal fa-phone fa-fw mr-2 text-blue-500"></i
          >{{ store.company.phone }}</a
        >
        <a :href="`mailto:${store.company.email}`"
          ><i class="fal fa-envelope fa-fw mr-2 text-blue-500"></i
          >{{ store.company.email }}</a
        >
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <a
          class="hover:underline"
          href="https://allridey.com.au/ALLRIDEY-vra.pdf"
          target="_blank"
          ><i class="fal fa-file-pdf fa-fw mr-2 text-blue-500"></i>Terms and
          Conditions</a
        >
        <a
          class="hover:underline"
          href="https://allridey.com.au/privacy"
          target="_blank"
          ><i class="fal fa-file-pdf fa-fw mr-2 text-blue-500"></i>Privacy
          Policy</a
        >
      </div>
    </div>
    <p class="mt-4 self-end pb-2 text-xs text-gray-500">
      © {{ store.company.name }} | {{ store.company.abn }}
    </p>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
const store = useStore();
const locations = store.locations;
</script>

<style lang="scss" scoped></style>
