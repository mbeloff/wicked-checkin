<template>
  <button class="rounded py-2 px-4 text-sm text-white">
    <slot>Button</slot>
  </button>
</template>

<script>
export default {};
</script>

<style lang="postcss" scoped>
.btn-green {
  @apply bg-gradient-to-tr from-green-500 to-green-600;
}
.btn-green:hover {
  @apply from-green-700 to-green-800 text-green-200;
}
.btn-red {
  @apply bg-gradient-to-tr from-red-500 to-red-600;
}
.btn-red:hover {
  @apply from-red-700 to-red-800 text-red-200;
}
</style>
