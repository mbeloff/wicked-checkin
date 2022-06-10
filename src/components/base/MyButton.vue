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
  @apply from-primary-500 to-primary-600 bg-gradient-to-tr;
}
.btn-red:hover {
  @apply from-primary-700 to-primary-800 text-primary-200;
}
</style>
