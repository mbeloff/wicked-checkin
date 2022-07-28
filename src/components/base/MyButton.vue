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
  @apply bg-gradient-to-tr from-primary-500 to-primary-400;
}
.btn-red:hover {
  @apply from-primary-500 to-primary-500;
}
</style>
