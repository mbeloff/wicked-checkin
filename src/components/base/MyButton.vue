<template>
  <button class="rounded py-2 px-2 text-sm text-white">
    <slot>Button</slot>
  </button>
</template>

<script>
export default {};
</script>

<style lang="postcss" scoped>
.btn-green {
  @apply bg-gradient-to-tr from-accent-500 to-accent-600;
}
.btn-green:hover {
  @apply from-accent-700 to-accent-800 text-accent-200;
}
.btn-red {
  @apply from-red-500 to-red-600 bg-gradient-to-tr;
}
.btn-red:hover {
  @apply from-red-700 to-red-800 text-red-200;
}
</style>
