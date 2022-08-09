<template>
  <div class="relative z-10 h-14 w-full bg-white shadow-lg print:hidden">
    <div class="mx-auto flex h-full max-w-screen-lg justify-between px-2">
      <div class="left flex w-full content-center items-center py-2">
        <a href="/" class="">
          <img :src="logo" class="w-32" />
        </a>
        <div class="flex h-full w-full flex-grow items-center justify-end">
          <!-- <a
            :href="`tel:${store.company.phone.replaceAll(' ', '')}`"
            class="ml-auto min-w-max font-bold text-gray-300 hover:text-primary-600"
            >{{ store.company.phone }}</a
          > -->
          <a
            :href="store.company.website"
            class="shadow-inset ml-4 min-w-max max-w-max rounded bg-white bg-gradient-to-tr from-primary-500 to-primary-600 px-5 py-2 text-sm font-bold uppercase text-white shadow-lg hover:from-primary-600/60 hover:to-primary-700/60"
            >Exit <i class="fad fa-person-to-portal fa-fw ml-1"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/allridey_text_outline.svg";
import { useStore } from "@/store";

const store = useStore();
</script>

<style lang="postcss"></style>
