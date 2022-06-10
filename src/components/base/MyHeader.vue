<template>
  <p class="text-primary-600 my-3 text-xl font-bold">
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
