<template>
  <div class="grid place-items-center bg-gray-800 px-2 text-sm text-gray-400">
    <div class="grid w-full max-w-screen-lg py-8">
      <div class="mx-auto flex w-max flex-col sm:flex-row">
        <img class="mx-auto w-56" :src="logo" alt="" />
        <div
          class="mx-auto flex w-max flex-col justify-between gap-2 py-2 text-left"
        >
          <a
            class="hover:underline"
            :href="store.company.website"
            target="_blank"
            ><i class="fal fa-globe fa-fw mr-2 text-primary-500"></i
            >{{ store.company.website.replace("https://", "") }}</a
          ><a :href="`tel:${store.company.phone.replaceAll(' ', '')}`"
            ><i class="fal fa-phone fa-fw mr-2 text-primary-500"></i
            >{{ store.company.phone }}</a
          >
          <a :href="`mailto:${store.company.email}`"
            ><i class="fal fa-envelope fa-fw mr-2 text-primary-500"></i
            >{{ store.company.email }}</a
          >
        </div>
      </div>
    </div>

    <p
      class="flex flex-wrap justify-center gap-2 self-end pb-2 text-xs tracking-tighter text-gray-500"
    >
      <span>© 2022 {{ store.company.name }}</span>
      <span v-if="store.company.tag">{{ store.company.tag }}</span>
      <span v-if="store.company.abn">{{ store.company.abn }}</span>
    </p>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import logo from "@/assets/wicked-basic.png";
const store = useStore();
</script>

<style lang="scss" scoped></style>
