<template>
  <p class="my-3 text-xl font-bold text-red-500">
    {{ props.title }}
  </p>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: null,
  },
});
</script>

<style lang="scss" scoped></style>
