<template>
  <div
    class="rounded bg-gray-800 border border-gray-900"
    :class="{
      'ring-2 ring-orange-400/70': actionRequired,
    }"
  >
    <button
      class="flex h-16 w-full items-center justify-between rounded px-2 md:px-5"
      @click="emit('toggle')"
    >
      <p class="text-left text-xl text-blue-100/90">
        {{ label }}
        <span v-if="actionRequired" class="text-lg font-normal text-orange-400"
          ><i class="far fa-warning mr-2"></i></span
        >
        <span v-if="actionRequired == false"
          ><i class="far fa-check-circle text-green-500"></i
        ></span>
        <span v-if="actionRequired == null"
          ><i class="far fa-plus-circle text-green-500"></i
        ></span>
      </p>
      <i
        class="far fa-chevron-down text-white"
        :class="{ 'rotate-180': toggle }"
      ></i>
    </button>
    <div class="reflow">
        <div class="flex flex-col gap-1 px-2 pb-5 md:px-5" v-show="toggle">
          <slot></slot>
        </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs } from "vue";

const emit = defineEmits(["toggle"]);

const props = defineProps({
  toggle: Boolean,
  label: {
    type: String,
    default: null,
  },
  actionRequired: Boolean,
});

const { toggle, label, actionRequired } = toRefs(props);
</script>
<script>
import smoothReflow from "vue-smooth-reflow";

export default {
  mixins: [smoothReflow],
  mounted() {
    this.$smoothReflow({
      el: ".reflow",
    });
  },
};
</script>

<style lang="postcss" scoped>
</style>
